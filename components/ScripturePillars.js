"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X, BookOpen } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "The Lord of the Sabbath",
    summary:
      "The Sabbath was made for humanity. We receive the Seventh-Day Sabbath as a covenant gift of worship and rest.",
    verse: "Mark 2:27–28",
    detail:
      "Every Saturday is set apart to cease from ordinary striving, open the Scriptures in Sabbath School, and gather in Divine Service around Yeshua, the Lord of the Sabbath.",
  },
  {
    title: "Resurrection Power",
    summary:
      "To know Yeshua and the living power of His resurrection is at the centre of our proclamation.",
    verse: "Philippians 3:10",
    detail:
      "The resurrection is not merely a historical doctrine; its transforming power shapes our teaching, our prayers for the sick, and the renewal of everyday life.",
  },
  {
    title: "The Whole Counsel of Scripture",
    summary:
      "We study the Torah, Prophets, and Apostolic writings as one unified, living witness.",
    verse: "2 Timothy 3:16",
    detail:
      "Line upon line and precept upon precept, we make room to examine the text carefully and listen for the harmony of all Scripture pointing to Yeshua.",
  },
  {
    title: "Deliverance & Liberty",
    summary:
      "We believe true spiritual freedom, healing, and new life are found in Yeshua Hamashiach.",
    verse: "2 Corinthians 3:17",
    detail:
      "Through intercession, Faith Clinic, and pastoral care, we stand with those seeking freedom and restoration in the name of Yeshua.",
  },
];

export default function ScripturePillars() {
  const root = useRef(null);
  const closeButton = useRef(null);
  const opener = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pillar-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.09,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "Tab") {
        const focusable = [
          ...document.querySelectorAll(
            ".pillar-dialog button, .pillar-dialog a",
          ),
        ];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      opener.current?.focus();
    };
  }, [selected]);

  const open = (index, button) => {
    opener.current = button;
    setSelected(index);
  };

  const transition = { type: "spring", stiffness: 280, damping: 28 };

  return (
    <section ref={root} className="pillars section-space">
      <div className="container-wide">
        <div className="magazine-meta-rail">
          <span className="folio-tag">Our Scriptural Foundations</span>
          <span className="folio-line arch-rule-draw" aria-hidden="true" />
          <span className="folio-count">Four Pillars of Belief</span>
        </div>

        <span className="eyebrow pillars-eyebrow">
          Anchored in the Word
        </span>
        <h2 className="display">
          What we <em>stand on.</em>
        </h2>
        <p className="hint">
          Four scriptural pillars of this house. Select any pillar below to read
          more.
        </p>

        <div className="pillars-grid">
          {pillars.map((pillar, i) => (
            <div className="pillar-reveal" key={pillar.title}>
              <motion.button
                type="button"
                layoutId={`pillar-${i}`}
                className="pillar-card arch-pillar-card"
                onClick={(e) => open(i, e.currentTarget)}
                aria-label={`Read foundation ${i + 1}: ${pillar.title}`}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.985 }}
                transition={transition}
              >
                <span className="ordinal">
                  <BookOpen size={13} aria-hidden="true" />
                  <span>Pillar 0{i + 1}</span>
                </span>
                <span className="pillar-card-copy">
                  <strong>{pillar.title}</strong>
                  <span>{pillar.summary}</span>
                </span>
                <span className="pillar-card-bottom">
                  <span>{pillar.verse}</span>
                  <span className="pillar-card-action">
                    Read more <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </span>
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="pillar-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <motion.div
              layoutId={`pillar-${selected}`}
              className="pillar-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pillar-modal-title"
              transition={transition}
            >
              <button
                ref={closeButton}
                type="button"
                className="pillar-close"
                aria-label="Close belief detail"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
              <span className="ordinal">Pillar 0{selected + 1} · Our Foundation</span>
              <h3 id="pillar-modal-title">{pillars[selected].title}</h3>
              <p>{pillars[selected].summary}</p>
              <p>{pillars[selected].detail}</p>
              <span className="pillar-verse">{pillars[selected].verse}</span>
              <Link
                href="/about#beliefs"
                onClick={() => setSelected(null)}
                className="text-link light-link"
              >
                <span>Read our full story</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
