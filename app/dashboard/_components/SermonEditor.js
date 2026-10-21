"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  ArrowUpRight,
  AudioLines,
  Check,
  FileText,
  Image as ImageIcon,
  Music,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  Pressable,
  Segmented,
  Switch,
  useBodyLock,
  useFocusTrap,
  useMediaQuery,
  useMotionOK,
} from "./primitives";
import {
  IMAGE_OPTIONS,
  formatDate,
  sermonHref,
} from "../../sermons/_data/studio";
import { saveAudioFile, isLocalAudio } from "../../sermons/_data/studioAudio";
import useAudioSource from "../../sermons/_components/useAudioSource";
import styles from "../studio.module.css";

const blankParagraph = "";

export default function SermonEditor({
  initial,
  mode,
  onClose,
  onSave,
  onDelete,
  onToast,
}) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(initial)));
  const [tab, setTab] = useState("content");
  const [error, setError] = useState("");
  const [passageInput, setPassageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingLabel, setUploadingLabel] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const sheet = useRef(null);
  const fileInput = useRef(null);
  const dragControls = useDragControls();
  const mobile = useMediaQuery("(max-width: 760px)");
  const motionOK = useMotionOK();
  const { source: audioSource, loading: audioLoading } = useAudioSource(
    draft.audioUrl,
  );

  const isDivine = draft.type === "Divine Service";
  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial],
  );
  const words = useMemo(() => {
    const text = [
      draft.title,
      draft.sub,
      ...draft.sections.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
      ]),
    ].join(" ");
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [draft]);

  useBodyLock(true);
  useFocusTrap(sheet, () => requestClose(), true);

  function requestClose() {
    if (dirty) {
      setConfirmDiscard(true);
      return;
    }
    onClose();
  }

  const update = (patch) => {
    setError("");
    setDraft((current) => ({ ...current, ...patch }));
  };

  const updateSection = (index, patch) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    }));
  };

  const updateParagraph = (sectionIndex, paragraphIndex, value) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              paragraphs: section.paragraphs.map((paragraph, j) =>
                j === paragraphIndex ? value : paragraph,
              ),
            }
          : section,
      ),
    }));
  };

  const addParagraph = (sectionIndex) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, i) =>
        i === sectionIndex
          ? { ...section, paragraphs: [...section.paragraphs, blankParagraph] }
          : section,
      ),
    }));
  };

  const removeParagraph = (sectionIndex, paragraphIndex) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              paragraphs:
                section.paragraphs.length > 1
                  ? section.paragraphs.filter((_, j) => j !== paragraphIndex)
                  : [""],
            }
          : section,
      ),
    }));
  };

  const moveSection = (index, direction) => {
    setDraft((current) => {
      const next = [...current.sections];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, sections: next };
    });
  };

  const addPassage = () => {
    const value = passageInput.trim().replace(/\s+/g, " ");
    if (!value) return;
    if (draft.passages.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setPassageInput("");
      return;
    }
    update({ passages: [...draft.passages, value] });
    setPassageInput("");
  };

  const save = ({ stay = false } = {}) => {
    if (!draft.title.trim()) {
      setError("Give this message a title before saving.");
      setTab("content");
      return;
    }
    try {
      onSave({ ...draft, title: draft.title.trim() });
      if (stay) setSavedTick(true);
    } catch (caught) {
      setError(caught?.message || "The message could not be saved.");
    }
  };

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        save();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!savedTick) return;
    const timer = setTimeout(() => setSavedTick(false), 1800);
    return () => clearTimeout(timer);
  }, [savedTick]);

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadingLabel(file.name);
    setError("");
    try {
      const meta = await saveAudioFile(file);
      update({ audioUrl: meta.url });
      onToast?.(`${file.name} saved in this browser.`);
    } catch (caught) {
      setError(caught?.message || "That recording could not be saved.");
    } finally {
      setUploading(false);
      setUploadingLabel("");
    }
  };

  const sheetAnimation = mobile
    ? {
        initial: motionOK ? { y: "100%" } : { opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: motionOK ? { y: "100%" } : { opacity: 0 },
      }
    : {
        initial: motionOK ? { x: 60, opacity: 0 } : { opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: motionOK ? { x: 48, opacity: 0 } : { opacity: 0 },
      };

  return (
    <>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={requestClose}
      />
      <motion.div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-editor-title"
        className={styles.sheet}
        {...sheetAnimation}
        transition={
          motionOK
            ? { type: "spring", stiffness: 320, damping: 34, mass: 0.8 }
            : { duration: 0.18 }
        }
        drag={mobile && motionOK ? "y" : false}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.45 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 130 || info.velocity.y > 780) requestClose();
        }}
      >
        {mobile && (
          <div
            className={styles.sheetHandle}
            onPointerDown={(event) => {
              if (motionOK) dragControls.start(event);
            }}
            aria-hidden="true"
          />
        )}
        <div className={styles.sheetHeader}>
          <div className={styles.sheetTitleWrap}>
            <span className={styles.sheetKicker}>
              {mode === "create" ? "New" : "Editing"} ·{" "}
              {isDivine ? "Divine Service" : "Sabbath School"}
            </span>
            <h2 className={styles.sheetTitle} id="studio-editor-title">
              {draft.title || "Untitled message"}
            </h2>
          </div>
          {mode === "edit" && (
            <Pressable
              icon
              size="small"
              href={sermonHref(initial)}
              target="_blank"
              label="Preview on the site"
            >
              <ArrowUpRight size={15} aria-hidden="true" />
            </Pressable>
          )}
          <Pressable
            icon
            size="small"
            onClick={requestClose}
            label="Close the editor"
          >
            <X size={16} aria-hidden="true" />
          </Pressable>
        </div>

        <div className={styles.sheetTabs}>
          <Segmented
            value={tab}
            onChange={setTab}
            layoutId="studio-editor-tab"
            label="Editor sections"
            options={[
              { value: "content", label: "Content" },
              { value: "scripture", label: "Scripture" },
              ...(isDivine ? [{ value: "audio", label: "Audio" }] : []),
            ]}
          />
        </div>

        <div className={styles.sheetBody}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={motionOK ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={motionOK ? { opacity: 0, y: -6 } : { opacity: 0 }}
              transition={{ duration: motionOK ? 0.2 : 0 }}
              className={styles.fieldGrid}
            >
              {tab === "content" && (
                <>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Title</span>
                    <input
                      className={styles.input}
                      value={draft.title}
                      maxLength={110}
                      onChange={(event) => update({ title: event.target.value })}
                      placeholder="The Unshakable Foundation"
                      autoComplete="off"
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Subtitle / theme</span>
                    <input
                      className={styles.input}
                      value={draft.sub}
                      maxLength={180}
                      onChange={(event) => update({ sub: event.target.value })}
                      placeholder="Standing when nations tremble"
                      autoComplete="off"
                    />
                  </label>

                  <div className={styles.fieldRow}>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Date</span>
                      <input
                        className={styles.input}
                        type="date"
                        value={draft.date || ""}
                        onChange={(event) =>
                          update({ date: event.target.value || null })
                        }
                      />
                      <span className={styles.fieldHint}>
                        {formatDate(draft.date) || "No date shown on the site."}
                      </span>
                    </label>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Collection</span>
                      <select
                        className={styles.select}
                        value={draft.type}
                        onChange={(event) =>
                          update({
                            type: event.target.value,
                            ...(event.target.value === "Divine Service"
                              ? {}
                              : { audioUrl: null }),
                          })
                        }
                      >
                        <option value="Divine Service">Divine Service</option>
                        <option value="Sabbath School">Sabbath School</option>
                      </select>
                      <span className={styles.fieldHint}>
                        Sabbath studies never show audio.
                      </span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      Visible on the site
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <Switch
                        checked={draft.status !== "draft"}
                        onChange={(on) =>
                          update({ status: on ? "published" : "draft" })
                        }
                        label="Publish this message"
                      />
                      <span className={styles.fieldHint}>
                        {draft.status === "draft"
                          ? "Draft — only visible in this browser."
                          : "Published — appears in the public library."}
                      </span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      <ImageIcon
                        size={12}
                        aria-hidden="true"
                        style={{ verticalAlign: "-2px", marginRight: 5 }}
                      />
                      Cover image
                    </span>
                    <div className={styles.imagePicker}>
                      {IMAGE_OPTIONS.map((image) => (
                        <button
                          key={image}
                          type="button"
                          className={styles.imageOption}
                          data-selected={draft.image === image}
                          onClick={() => update({ image })}
                          aria-label={`Use ${image.replace(/[-_]/g, " ").replace(".jpg", "")}`}
                          aria-pressed={draft.image === image}
                        >
                          <Image
                            src={`/images/${image}`}
                            alt=""
                            width={120}
                            height={120}
                            style={{ objectFit: "cover" }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className={styles.infoText}>
                    <FileText
                      size={12}
                      aria-hidden="true"
                      style={{ verticalAlign: "-2px", marginRight: 5 }}
                    />
                    {words} words · about {Math.max(1, Math.round(words / 200))}{" "}
                    min read.{" "}
                    <span className={styles.kbd}>{draft.slug}</span>
                  </p>
                </>
              )}

              {tab === "scripture" && (
                <>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Passages</span>
                    <div className={styles.chipRow}>
                      {draft.passages.map((passage) => (
                        <span className={styles.chip} key={passage}>
                          {passage}
                          <button
                            type="button"
                            aria-label={`Remove ${passage}`}
                            onClick={() =>
                              update({
                                passages: draft.passages.filter(
                                  (item) => item !== passage,
                                ),
                              })
                            }
                          >
                            <X size={11} aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                      {!draft.passages.length && (
                        <span className={styles.fieldHint}>
                          Add the scriptures this message opens.
                        </span>
                      )}
                    </div>
                    <div className={styles.chipInputRow}>
                      <input
                        className={styles.input}
                        value={passageInput}
                        onChange={(event) => setPassageInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            addPassage();
                          }
                        }}
                        placeholder="Hebrews 12"
                        aria-label="Add a scripture passage"
                        autoComplete="off"
                      />
                      <Pressable size="small" onClick={addPassage}>
                        <Plus size={14} aria-hidden="true" /> Add
                      </Pressable>
                    </div>
                    <span className={styles.fieldHint}>
                      Every reference becomes a tappable link in the write-up.
                    </span>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      Write-up sections
                    </span>
                    {draft.sections.map((section, sectionIndex) => (
                      <div
                        className={styles.sectionEditor}
                        key={sectionIndex}
                      >
                        <div className={styles.sectionHead}>
                          <span className={styles.sectionIndex}>
                            {String(sectionIndex + 1).padStart(2, "0")}
                          </span>
                          <input
                            className={styles.input}
                            value={section.heading}
                            onChange={(event) =>
                              updateSection(sectionIndex, {
                                heading: event.target.value,
                              })
                            }
                            placeholder="Section heading"
                            aria-label={`Section ${sectionIndex + 1} heading`}
                          />
                          <div className={styles.sectionTools}>
                            <Pressable
                              size="small"
                              icon
                              onClick={() => moveSection(sectionIndex, -1)}
                              disabled={sectionIndex === 0}
                              label="Move section up"
                            >
                              <ArrowUp size={13} aria-hidden="true" />
                            </Pressable>
                            <Pressable
                              size="small"
                              icon
                              onClick={() => moveSection(sectionIndex, 1)}
                              disabled={
                                sectionIndex === draft.sections.length - 1
                              }
                              label="Move section down"
                            >
                              <ArrowDown size={13} aria-hidden="true" />
                            </Pressable>
                          </div>
                        </div>
                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                          <div
                            className={styles.paragraphRow}
                            key={paragraphIndex}
                          >
                            <textarea
                              className={styles.textarea}
                              value={paragraph}
                              onChange={(event) =>
                                updateParagraph(
                                  sectionIndex,
                                  paragraphIndex,
                                  event.target.value,
                                )
                              }
                              placeholder="Write the study note…"
                              aria-label={`Section ${sectionIndex + 1}, paragraph ${paragraphIndex + 1}`}
                            />
                            <Pressable
                              size="small"
                              icon
                              variant="danger"
                              onClick={() =>
                                removeParagraph(sectionIndex, paragraphIndex)
                              }
                              label="Remove paragraph"
                            >
                              <X size={13} aria-hidden="true" />
                            </Pressable>
                          </div>
                        ))}
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <Pressable
                            size="small"
                            onClick={() => addParagraph(sectionIndex)}
                          >
                            <Plus size={13} aria-hidden="true" /> Paragraph
                          </Pressable>
                          <Pressable
                            size="small"
                            variant="danger"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                sections: current.sections.filter(
                                  (_, i) => i !== sectionIndex,
                                ),
                              }))
                            }
                            disabled={draft.sections.length === 1}
                          >
                            <Trash2 size={13} aria-hidden="true" /> Section
                          </Pressable>
                        </div>
                        {!isDivine && (
                          <label className={styles.field}>
                            <span className={styles.fieldLabel}>
                              Reflection prompt
                            </span>
                            <textarea
                              className={styles.textarea}
                              value={section.prompt || ""}
                              onChange={(event) =>
                                updateSection(sectionIndex, {
                                  prompt: event.target.value,
                                })
                              }
                              placeholder="What does this passage say? What questions would you bring to the study table?"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                    <Pressable
                      size="small"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          sections: [
                            ...current.sections,
                            { heading: "", paragraphs: [""] },
                          ],
                        }))
                      }
                    >
                      <Plus size={14} aria-hidden="true" /> Add section
                    </Pressable>
                  </div>
                </>
              )}

              {tab === "audio" && isDivine && (
                <>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      <Music size={12} aria-hidden="true" /> Hosted audio URL
                    </span>
                    <input
                      className={styles.input}
                      value={draft.audioUrl?.startsWith("local:") ? "" : draft.audioUrl || ""}
                      onChange={(event) =>
                        update({ audioUrl: event.target.value.trim() || null })
                      }
                      placeholder="https://…/message.mp3"
                      inputMode="url"
                      autoComplete="off"
                    />
                    <span className={styles.fieldHint}>
                      Use a link that will still work when the site is deployed.
                      Hosted links appear on every device.
                    </span>
                  </div>

                  <div className={styles.audioPreview}>
                    <AudioLines size={18} aria-hidden="true" />
                    {draft.audioUrl ? (
                      <>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          {isLocalAudio(draft.audioUrl)
                            ? "Browser-local recording"
                            : draft.audioUrl}
                          {isLocalAudio(draft.audioUrl) && (
                            <span className={styles.savedNote}>
                              {" "}
                              · <Check size={11} aria-hidden="true" /> stored
                              here
                            </span>
                          )}
                        </span>
                        <Pressable
                          size="small"
                          variant="danger"
                          onClick={() => update({ audioUrl: null })}
                        >
                          <Trash2 size={13} aria-hidden="true" /> Remove
                        </Pressable>
                      </>
                    ) : (
                      <span style={{ flex: 1 }}>No recording attached.</span>
                    )}
                  </div>

                  {draft.audioUrl &&
                    (audioSource ? (
                      <div className={styles.audioPreview}>
                        <audio src={audioSource} controls preload="metadata" />
                      </div>
                    ) : (
                      <p className={styles.infoText}>
                        {audioLoading
                          ? "Preparing the saved recording…"
                          : "This recording could not be read from this browser."}
                      </p>
                    ))}

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      Upload from this device
                    </span>
                    <label className={styles.dropzone}>
                      <Upload size={20} aria-hidden="true" />
                      <span>
                        {uploading
                          ? `Saving ${uploadingLabel}…`
                          : "Choose an audio file"}
                      </span>
                      <span className={styles.fieldHint}>
                        MP3, M4A or WAV · up to 80 MB · kept in this browser only
                      </span>
                      <input
                        ref={fileInput}
                        type="file"
                        accept="audio/*"
                        onChange={onUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  <p className={styles.infoText}>
                    <ArrowLeftRight
                      size={12}
                      aria-hidden="true"
                      style={{ verticalAlign: "-2px", marginRight: 5 }}
                    />
                    A local upload is a preview for this device. Replace it with
                    a hosted URL before publishing.
                  </p>
                </>
              )}

              {error && (
                <p className={styles.errorText} role="alert">
                  {error}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.sheetFooter}>
          {mode === "edit" ? (
            <Pressable
              size="small"
              variant="danger"
              onClick={() => onDelete(initial)}
              label="Delete this message"
            >
              <Trash2 size={14} aria-hidden="true" />
            </Pressable>
          ) : null}
          <span className={styles.dirtyDot}>
            {savedTick ? (
              <>
                <Check size={12} aria-hidden="true" /> Saved
              </>
            ) : dirty ? (
              <>
                <i aria-hidden="true" /> Unsaved changes
              </>
            ) : (
              "All changes saved"
            )}
          </span>
          <span className={styles.grow} />
          <Pressable size="small" onClick={requestClose}>
            Cancel
          </Pressable>
          <Pressable
            size="small"
            variant="primary"
            onClick={() => save()}
            disabled={uploading}
          >
            <Save size={14} aria-hidden="true" /> Save
          </Pressable>
        </div>

        <AnimatePresence>
          {confirmDiscard && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "grid",
                placeItems: "center",
                padding: 18,
                background: "rgba(6,6,9,.72)",
                backdropFilter: "blur(14px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.confirmCard}>
                <h3 className={styles.confirmTitle}>Discard changes?</h3>
                <p className={styles.confirmText}>
                  This message has edits that have not been saved.
                </p>
                <div className={styles.confirmActions}>
                  <button
                    type="button"
                    className={styles.confirmCancel}
                    onClick={() => setConfirmDiscard(false)}
                  >
                    Keep editing
                  </button>
                  <button
                    type="button"
                    className={styles.confirmDelete}
                    onClick={onClose}
                  >
                    Discard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
