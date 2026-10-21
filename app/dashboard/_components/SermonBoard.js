"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Pencil,
  Plus,
  Search,
  Trash2,
  Volume2,
} from "lucide-react";
import {
  EmptyState,
  Pressable,
  Segmented,
  TiltCard,
  relativeTime,
} from "./primitives";
import { formatDate, sermonHref } from "../../sermons/_data/studio";
import styles from "../studio.module.css";

const copy = {
  "Divine Service": {
    kicker: "Divine Service",
    title: "Proclaim the Word.",
    lead: "Worship-forward messages. Write the notes, attach a recording, and keep the listening room current.",
    action: "New divine message",
    empty: "No divine messages here yet.",
    singular: "message",
  },
  "Sabbath School": {
    kicker: "Sabbath School",
    title: "Study together.",
    lead: "Reading-first lessons with reflection prompts. Sabbath studies never show an audio player.",
    action: "New study note",
    empty: "No Sabbath studies here yet.",
    singular: "study",
  },
};

export default function SermonBoard({
  type,
  state,
  onEdit,
  onNew,
  onDelete,
  onDuplicate,
  onToggleStatus,
}) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const divine = type === "Divine Service";
  const meta = copy[type];

  const sermons = useMemo(
    () => state.sermons.filter((sermon) => sermon.type === type),
    [state.sermons, type],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sermons.filter((sermon) => {
      if (filter === "published" && sermon.status === "draft") return false;
      if (filter === "draft" && sermon.status !== "draft") return false;
      if (divine && filter === "audio" && !sermon.audioUrl) return false;
      if (!needle) return true;
      return (
        sermon.title.toLowerCase().includes(needle) ||
        sermon.sub.toLowerCase().includes(needle) ||
        sermon.passages.join(" ").toLowerCase().includes(needle)
      );
    });
  }, [sermons, filter, query, divine]);

  const options = [
    { value: "all", label: "All", badge: sermons.length },
    {
      value: "published",
      label: "Published",
      badge: sermons.filter((s) => s.status !== "draft").length,
    },
    {
      value: "draft",
      label: "Drafts",
      badge: sermons.filter((s) => s.status === "draft").length,
    },
    ...(divine
      ? [
          {
            value: "audio",
            label: "With audio",
            badge: sermons.filter((s) => s.audioUrl).length,
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelKicker}>
            <BookOpen size={13} aria-hidden="true" /> {meta.kicker}
          </span>
          <h1 className={styles.panelTitle}>{meta.title}</h1>
          <p className={styles.panelLead}>{meta.lead}</p>
        </div>
        <div className={styles.headerActions}>
          <Pressable variant="primary" onClick={() => onNew(type)}>
            <Plus size={17} aria-hidden="true" /> {meta.action}
          </Pressable>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Segmented
          value={filter}
          options={options}
          onChange={setFilter}
          layoutId={`${type}-filter`}
          label={`Filter ${meta.kicker}`}
        />
        <label className={styles.searchField}>
          <Search size={15} aria-hidden="true" />
          <span className={styles.srOnly}>Search {meta.kicker}</span>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, passages…"
            type="search"
          />
        </label>
      </div>

      {filtered.length ? (
        <div className={styles.sermonGrid}>
          {filtered.map((sermon) => {
            const isDraft = sermon.status === "draft";
            return (
              <TiltCard
                key={sermon.id}
                className={styles.sermonCard}
                intensity={5}
              >
                <div className={styles.cardMedia}>
                  <Image
                    src={`/images/${sermon.image}`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                    style={{ objectFit: "cover" }}
                  />
                  <span className={styles.cardMediaScrim} aria-hidden="true" />
                  <div className={styles.cardTopRow}>
                    <button
                      type="button"
                      className={`${styles.pill} ${isDraft ? styles.pillDraft : styles.pillLive}`}
                      onClick={() => onToggleStatus(sermon)}
                      aria-label={
                        isDraft
                          ? `Publish ${sermon.title}`
                          : `Unpublish ${sermon.title}`
                      }
                    >
                      {isDraft ? (
                        <Clock3 size={11} aria-hidden="true" />
                      ) : (
                        <CheckCircle2 size={11} aria-hidden="true" />
                      )}
                      {isDraft ? "Draft" : "Published"}
                    </button>
                    {divine && sermon.audioUrl && (
                      <span className={`${styles.pill} ${styles.pillAudio}`}>
                        <Volume2 size={11} aria-hidden="true" /> Audio
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardType}>
                    {divine ? "Divine Service" : "Sabbath School"}
                  </span>
                  <h3 className={styles.cardTitle}>{sermon.title}</h3>
                  <p className={styles.cardSub}>
                    {sermon.sub || "No subtitle yet."}
                  </p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <CalendarDays size={12} aria-hidden="true" />
                      {formatDate(sermon.date) || "No date"}
                    </span>
                    <span className={styles.metaItem}>
                      <BookOpen size={12} aria-hidden="true" />
                      {sermon.passages.length} passages
                    </span>
                    <span className={styles.metaItem}>
                      <Clock3 size={12} aria-hidden="true" />
                      {relativeTime(sermon.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Pressable size="small" onClick={() => onEdit(sermon)}>
                    <Pencil size={13} aria-hidden="true" /> Edit
                  </Pressable>
                  <Pressable
                    size="small"
                    icon
                    href={sermonHref(sermon)}
                    target="_blank"
                    label={`Preview ${sermon.title}`}
                  >
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Pressable>
                  <span className={styles.grow} />
                  <Pressable
                    size="small"
                    icon
                    onClick={() => onDuplicate(sermon)}
                    label={`Duplicate ${sermon.title}`}
                  >
                    <Copy size={14} aria-hidden="true" />
                  </Pressable>
                  <Pressable
                    size="small"
                    icon
                    variant="danger"
                    onClick={() => onDelete(sermon)}
                    label={`Delete ${sermon.title}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </Pressable>
                </div>
              </TiltCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={
            sermons.length
              ? "Nothing matches that view."
              : meta.empty
          }
          action={
            <Pressable variant="primary" onClick={() => onNew(type)}>
              <Plus size={16} aria-hidden="true" /> {meta.action}
            </Pressable>
          }
        >
          {sermons.length
            ? "Try another filter or clear the search."
            : `Start the first ${meta.singular}. It saves privately until you publish.`}
        </EmptyState>
      )}
    </div>
  );
}
