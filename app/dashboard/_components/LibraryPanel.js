"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock3,
  Copy,
  Library,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  EmptyState,
  Pressable,
  Segmented,
  relativeTime,
} from "./primitives";
import { formatDate } from "../../sermons/_data/studio";
import styles from "../studio.module.css";

const sorters = {
  recent: (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
  title: (a, b) => a.title.localeCompare(b.title),
  type: (a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title),
  status: (a, b) =>
    (a.status === "draft" ? 0 : 1) - (b.status === "draft" ? 0 : 1),
};

export default function LibraryPanel({
  state,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onExport,
  onNew,
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [scope, setScope] = useState("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return state.sermons
      .filter((sermon) => {
        if (scope === "divine" && sermon.type !== "Divine Service") return false;
        if (scope === "sabbath" && sermon.type !== "Sabbath School")
          return false;
        if (!needle) return true;
        return (
          sermon.title.toLowerCase().includes(needle) ||
          sermon.sub.toLowerCase().includes(needle) ||
          sermon.slug.includes(needle)
        );
      })
      .sort((a, b) => (sorters[sort] || sorters.recent)(a, b));
  }, [state.sermons, query, sort, scope]);

  return (
    <div>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelKicker}>
            <Library size={13} aria-hidden="true" /> Everything
          </span>
          <h1 className={styles.panelTitle}>The whole library.</h1>
          <p className={styles.panelLead}>
            Every message and study note in one list. Change status, duplicate a
            structure, or export the catalogue for the site.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Pressable onClick={onExport}>
            <ArrowDownToLine size={16} aria-hidden="true" /> Export
          </Pressable>
          <Pressable variant="primary" onClick={() => onNew("Divine Service")}>
            <Plus size={17} aria-hidden="true" /> New
          </Pressable>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Segmented
          value={scope}
          options={[
            { value: "all", label: "All", badge: state.sermons.length },
            {
              value: "divine",
              label: "Divine",
              badge: state.sermons.filter((s) => s.type === "Divine Service")
                .length,
            },
            {
              value: "sabbath",
              label: "Sabbath",
              badge: state.sermons.filter((s) => s.type === "Sabbath School")
                .length,
            },
          ]}
          onChange={setScope}
          layoutId="library-scope"
          label="Filter the library by collection"
        />
        <label className={styles.searchField}>
          <Search size={15} aria-hidden="true" />
          <span className={styles.srOnly}>Search the library</span>
          <input
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search everything…"
          />
        </label>
        <label className={styles.searchField} style={{ flex: "0 0 160px" }}>
          <Clock3 size={15} aria-hidden="true" />
          <span className={styles.srOnly}>Sort the library</span>
          <select
            className={styles.searchInput}
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort messages"
          >
            <option value="recent">Recently edited</option>
            <option value="title">Title A–Z</option>
            <option value="type">Collection</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>

      {rows.length ? (
        <div className={`${styles.card} ${styles.libraryCard}`}>
          <div className={styles.tableHead} aria-hidden="true">
            <span>Message</span>
            <span>Collection</span>
            <span>Status</span>
            <span>Date</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>
          <div role="list" aria-label="All studio content">
            {rows.map((sermon) => {
              const isDraft = sermon.status === "draft";
              return (
                <div className={styles.tableRow} role="listitem" key={sermon.id}>
                  <div className={styles.tableTitle}>
                    <Image
                      src={`/images/${sermon.image}`}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <div className={styles.tableTitleText}>
                      <strong>{sermon.title}</strong>
                      <span>{sermon.sub || sermon.slug}</span>
                    </div>
                  </div>
                  <span className={styles.cell}>
                    {sermon.type === "Divine Service" ? "Divine" : "Sabbath"}
                  </span>
                  <span className={styles.cell}>
                    <button
                      type="button"
                      className={styles.statusToggle}
                      data-live={!isDraft}
                      onClick={() => onToggleStatus(sermon)}
                    >
                      {isDraft ? (
                        <Clock3 size={11} aria-hidden="true" />
                      ) : (
                        <CheckCircle2 size={11} aria-hidden="true" />
                      )}
                      {isDraft ? "Draft" : "Live"}
                    </button>
                  </span>
                  <span className={styles.cell}>
                    {formatDate(sermon.date) || "No date"}
                  </span>
                  <div className={styles.rowActions}>
                    <Pressable
                      size="small"
                      icon
                      onClick={() => onEdit(sermon)}
                      label={`Edit ${sermon.title}`}
                    >
                      <Pencil size={14} aria-hidden="true" />
                    </Pressable>
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
                  <div className={styles.mobileMeta}>
                    <span>
                      {sermon.type === "Divine Service"
                        ? "Divine Service"
                        : "Sabbath School"}
                    </span>
                    <span>·</span>
                    <span>{formatDate(sermon.date) || "No date"}</span>
                    <span>·</span>
                    <span>{relativeTime(sermon.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="The library is empty here."
          action={
            <Pressable variant="primary" onClick={() => onNew("Divine Service")}>
              <Plus size={16} aria-hidden="true" /> Create a message
            </Pressable>
          }
        >
          Nothing matches this search or collection. Try another view.
        </EmptyState>
      )}
    </div>
  );
}
