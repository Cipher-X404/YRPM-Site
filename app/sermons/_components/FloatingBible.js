"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Search, X } from "lucide-react";
import { chaptersByBook, parseReference } from "../_data/references";
import styles from "../sermon-pages.module.css";

const cache = new Map();
const LAST_REFERENCE = "yrpm:bible:reference";
const LAST_TRANSLATION = "yrpm:bible:translation";
const cacheKey = (ref, translation) => `yrpm:bible:${translation}:${ref}`;
function readStorage(kind, key) {
  try {
    return window[kind].getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(kind, key, value) {
  try {
    window[kind].setItem(key, value);
  } catch {
    /* private mode / full storage */
  }
}

export default function FloatingBible({ reservePlayerSpace = false }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("John 3:16");
  const [reference, setReference] = useState("John 3:16");
  const [translation, setTranslation] = useState("kjv");
  const [retry, setRetry] = useState(0);
  const [invalidQuery, setInvalidQuery] = useState(false);
  const [state, setState] = useState({ kind: "idle" });
  const trigger = useRef(null);
  const searchInput = useRef(null);
  const panel = useRef(null);
  const reading = useRef(null);
  const readingHeading = useRef(null);
  const alertMessage = useRef(null);
  const close = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    const saved = parseReference(readStorage("localStorage", LAST_REFERENCE));
    const savedTranslation = readStorage("localStorage", LAST_TRANSLATION);
    if (saved) {
      setReference(saved.normalized);
      setQuery(saved.normalized);
    }
    if (savedTranslation === "kjv" || savedTranslation === "web")
      setTranslation(savedTranslation);
    setReady(true);
  }, []);

  useEffect(() => {
    const handleReference = (event) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("[data-ref]");
      if (!element) return;
      const raw = element.getAttribute("data-ref");
      event.preventDefault();
      opener.current =
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
          ? document.activeElement
          : trigger.current;
      setOpen(true);
      setQuery(raw || "");
      const parsed = parseReference(raw);
      if (parsed) {
        setInvalidQuery(false);
        setReference(parsed.normalized);
        setRetry((n) => n + 1);
      } else {
        setInvalidQuery(true);
        setState({
          kind: "invalid",
          message:
            "That scripture reference is not recognised. Try John 3:16 or Psalm 23.",
        });
      }
    };
    const handleKeyboard = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("[data-ref]");
      if (!element || element.matches("button, a, input")) return; // native activation already fires click
      event.preventDefault();
      element.click();
    };
    document.addEventListener("click", handleReference);
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("click", handleReference);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => close.current?.focus());
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const nodes = [
        ...panel.current.querySelectorAll(
          "button:not([disabled]), input:not([disabled]), a[href]",
        ),
      ];
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      const index = nodes.indexOf(document.activeElement);
      // Also catches focus on the programmatically focused passage heading.
      if (index === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && index === 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && index === nodes.length - 1) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      requestAnimationFrame(() => {
        const target = opener.current?.isConnected
          ? opener.current
          : trigger.current;
        target?.focus();
      });
    };
  }, [open]);

  useEffect(() => {
    if (state.kind === "idle" || state.kind === "loading") return;
    // New passages open at the top, even if the previous chapter was scrolled.
    if (reading.current) reading.current.scrollTop = 0;
    // A retry button disappears while loading; keep keyboard users in the panel.
    const active = document.activeElement;
    if (
      panel.current &&
      !(active instanceof Node && panel.current.contains(active))
    ) {
      const target =
        state.kind === "success" ? readingHeading : alertMessage;
      target.current?.focus({ preventScroll: true });
    }
  }, [state]);

  useEffect(() => {
    if (!ready || !open || invalidQuery) return;
    const parsed = parseReference(reference);
    if (!parsed) return;
    const key = cacheKey(parsed.normalized, translation);
    const controller = new AbortController();
    let cancelled = false;
    const show = (data) => {
      if (cancelled) return;
      setState({ kind: "success", data });
      writeStorage("localStorage", LAST_REFERENCE, parsed.normalized);
    };
    async function load() {
      const inMemory = cache.get(key);
      if (inMemory) {
        show(inMemory);
        return;
      }
      const saved = readStorage("sessionStorage", key);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (Array.isArray(data.verses) && data.verses.length) {
            cache.set(key, data);
            show(data);
            return;
          }
        } catch {
          /* Ignore corrupted session cache */
        }
      }
      if (!navigator.onLine) {
        setState({
          kind: "offline",
          message:
            "You appear to be offline. Reconnect to load this passage, or try a previously opened reference.",
        });
        return;
      }
      setState({ kind: "loading" });
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(
          `https://bible-api.com/${encodeURIComponent(parsed.normalized)}?translation=${translation}`,
          { signal: controller.signal },
        );
        if (cancelled) return;
        if (!response.ok) {
          setState(
            response.status === 429
              ? {
                  kind: "rate",
                  message:
                    "The Bible service is receiving too many requests. Please wait a moment and try again.",
                }
              : response.status === 404 || response.status === 400
                ? {
                    kind: "invalid",
                    message:
                      "This passage was not found. Check the book, chapter and verse, then try again.",
                  }
                : {
                    kind: "error",
                    message:
                      "The Bible service could not load this passage. Please try again.",
                  },
          );
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data.verses) || data.verses.length === 0)
          throw new Error("Empty passage");
        cache.set(key, data);
        writeStorage("sessionStorage", key, JSON.stringify(data));
        show(data);
      } catch (error) {
        if (cancelled) return;
        setState(
          !navigator.onLine
            ? {
                kind: "offline",
                message:
                  "You are offline. Reconnect or try a passage you opened earlier in this tab.",
              }
            : {
                kind: "error",
                message:
                  error.name === "AbortError"
                    ? "The request timed out. Please try again."
                    : "We could not reach the Bible service. Check your connection and try again.",
              },
        );
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [ready, open, invalidQuery, reference, translation, retry]);

  const parsed = parseReference(reference);
  const search = (event) => {
    event.preventDefault();
    const next = parseReference(query);
    if (!next) {
      setInvalidQuery(true);
      setState({
        kind: "invalid",
        message:
          "Use a book and chapter, optionally with a verse: John 3:16 or Psalm 23.",
      });
      return;
    }
    setInvalidQuery(false);
    setReference(next.normalized);
    setQuery(next.normalized);
    setRetry((n) => n + 1);
  };
  const chapter = (difference) => {
    if (!parsed) return;
    const next = `${parsed.book} ${parsed.chapter + difference}`;
    setInvalidQuery(false);
    setReference(next);
    setQuery(next);
  };
  const chooseTranslation = (value) => {
    setTranslation(value);
    writeStorage("localStorage", LAST_TRANSLATION, value);
  };
  const openFromTrigger = () => {
    opener.current = trigger.current;
    setInvalidQuery(false);
    setOpen(true);
  };

  return (
    <>
      {!open && (
        <button
          ref={trigger}
          type="button"
          className={`${styles.bibleTrigger} ${reservePlayerSpace ? styles.bibleClearPlayer : ""}`}
          onClick={openFromTrigger}
          aria-label="Open the floating Bible"
          aria-haspopup="dialog"
          aria-controls="floating-bible-panel"
        >
          <BookOpen size={21} aria-hidden="true" />
          <span>Open Bible</span>
        </button>
      )}
      {open && (
        <aside
          ref={panel}
          id="floating-bible-panel"
          className={styles.biblePanel}
          role="dialog"
          aria-modal="false"
          aria-labelledby="bible-panel-title"
        >
          <div className={styles.bibleHeader}>
            <div>
              <span className={styles.bibleKicker}>
                The Word, beside the message
              </span>
              <h2 id="bible-panel-title">Open Bible</h2>
            </div>
            <button
              ref={close}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the floating Bible"
              className={styles.iconButton}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <form className={styles.bibleSearch} onSubmit={search} role="search">
            <label htmlFor="bible-reference">Passage or chapter</label>
            <div>
              <input
                ref={searchInput}
                id="bible-reference"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="John 3:16 or Psalm 23"
                autoComplete="off"
              />
              <button type="submit" aria-label="Search the Bible">
                <Search size={19} />
              </button>
            </div>
          </form>
          <fieldset className={styles.translation}>
            <legend>Translation</legend>
            <label>
              <input
                type="radio"
                name="bible-translation"
                value="kjv"
                checked={translation === "kjv"}
                onChange={() => chooseTranslation("kjv")}
              />
              KJV
            </label>
            <label>
              <input
                type="radio"
                name="bible-translation"
                value="web"
                checked={translation === "web"}
                onChange={() => chooseTranslation("web")}
              />
              WEB
            </label>
          </fieldset>
          <div className={styles.chapterControls}>
            <button
              type="button"
              disabled={invalidQuery || !parsed || parsed.chapter <= 1}
              onClick={() => chapter(-1)}
              aria-label="Previous chapter"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <span aria-live="polite">
              {parsed ? `${parsed.book} ${parsed.chapter}` : "Search a passage"}
            </span>
            <button
              type="button"
              disabled={
                invalidQuery ||
                !parsed ||
                parsed.chapter >= chaptersByBook[parsed.book]
              }
              onClick={() => chapter(1)}
              aria-label="Next chapter"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
          <div
            ref={reading}
            className={styles.bibleReading}
            aria-busy={state.kind === "loading"}
          >
            <span className="sr-only" role="status">
              {state.kind === "success"
                ? `Loaded ${state.data.reference || reference} in ${translation.toUpperCase()}.`
                : ""}
            </span>
            {state.kind === "loading" && (
              <p role="status" className={styles.bibleMessage}>
                Opening the passage…
              </p>
            )}
            {["invalid", "rate", "offline", "error"].includes(state.kind) && (
              <div
                ref={alertMessage}
                role="alert"
                tabIndex={-1}
                className={styles.bibleMessage}
              >
                <p>{state.message}</p>
                <button
                  type="button"
                  onClick={() =>
                    state.kind === "invalid"
                      ? searchInput.current?.focus()
                      : setRetry((n) => n + 1)
                  }
                >
                  {state.kind === "invalid" ? "Edit reference" : "Try again"}
                </button>
              </div>
            )}
            {state.kind === "success" && (
              <>
                <h3 ref={readingHeading} tabIndex={-1}>
                  {state.data.reference || reference}
                </h3>
                <ol className={styles.verses}>
                  {state.data.verses.map((verse) => (
                    <li
                      key={`${verse.book_id || verse.book_name}-${verse.chapter}-${verse.verse}`}
                    >
                      <sup aria-label={`Verse ${verse.verse}`}>
                        {verse.verse}
                      </sup>
                      <span>{verse.text.trim()}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
          <p className={styles.bibleAttribution}>
            Scripture provided by bible-api.com · {translation.toUpperCase()}
          </p>
        </aside>
      )}
    </>
  );
}
