"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LogOut, Sparkles } from "lucide-react";
import useStudio from "../../sermons/_data/useStudio";
import {
  createSermon,
  deleteSermon,
  duplicateSermon,
  exportJSON,
  importJSON,
  resetStudio,
  saveSermon,
  studioIssues,
  studioStats,
} from "../../sermons/_data/studio";
import Dock from "./Dock";
import Overview from "./Overview";
import SermonBoard from "./SermonBoard";
import LibraryPanel from "./LibraryPanel";
import SettingsPanel from "./SettingsPanel";
import SermonEditor from "./SermonEditor";
import {
  ConfirmDialog,
  StudioMotionProvider,
  Toast,
  useMotionOK,
} from "./primitives";
import styles from "../studio.module.css";

const MOTION_KEY = "yrpm:studio:motion";

const tabLabels = {
  overview: "Overview",
  divine: "Divine Service",
  sabbath: "Sabbath School",
  library: "Library",
  settings: "Settings",
};

function downloadJSON(text, name) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function StudioSurface({ reduceMotion, onToggleMotion, adminEmail }) {
  const studio = useStudio();
  const state = useMemo(
    () => ({ sermons: studio.sermons, updatedAt: studio.updatedAt }),
    [studio.sermons, studio.updatedAt],
  );
  const [tab, setTab] = useState("overview");
  const [editor, setEditor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const motionValue = useMotionOK();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  const stats = useMemo(() => studioStats(state), [state]);
  const issues = useMemo(() => studioIssues(state), [state]);
  const badges = useMemo(
    () => ({
      divine: studio.sermons.filter(
        (sermon) =>
          sermon.type === "Divine Service" && sermon.status === "draft",
      ).length,
      sabbath: studio.sermons.filter(
        (sermon) =>
          sermon.type === "Sabbath School" && sermon.status === "draft",
      ).length,
    }),
    [studio.sermons],
  );

  const notify = (text) => setToast({ id: Date.now(), text });

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        credentials: "same-origin",
        cache: "no-store",
      });
    } catch {
      /* The cookie is cleared server-side on the next request regardless. */
    }
    // Full reload so no studio state or RSC payload survives the session.
    window.location.assign("/admin/login");
  };

  const openNew = (type) => {
    const sermon = createSermon(type);
    setEditor({ mode: "create", sermon, key: sermon.id });
  };

  const openEdit = (sermon) => {
    setEditor({ mode: "edit", sermon, key: sermon.id });
  };

  const handleSave = (values) => {
    const saved = saveSermon(values);
    setEditor(null);
    notify(`Saved “${saved.title}”.`);
    return saved;
  };

  const askDelete = (sermon) => {
    setEditor(null);
    setConfirm({ kind: "delete", sermon });
  };

  const toggleStatus = (sermon) => {
    const next = sermon.status === "draft" ? "published" : "draft";
    saveSermon({ ...sermon, status: next });
    notify(
      next === "published"
        ? `“${sermon.title}” is now live.`
        : `“${sermon.title}” moved to drafts.`,
    );
  };

  const handleDuplicate = (sermon) => {
    const copy = duplicateSermon(sermon.id);
    if (copy) notify(`Duplicated as “${copy.title}”.`);
  };

  const handleImport = (text) => {
    const result = importJSON(text);
    if (result.ok) notify(`Imported ${result.count} messages.`);
    else notify(result.error);
  };

  const panel = (
    <motion.div
      key={tab}
      initial={motionValue ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={motionValue ? { opacity: 0, y: -8 } : { opacity: 0 }}
      transition={{ duration: motionValue ? 0.26 : 0 }}
      className={styles.panel}
    >
      {tab === "overview" && (
        <Overview
          state={state}
          stats={stats}
          issues={issues}
          onNew={openNew}
          onTab={setTab}
          onEdit={openEdit}
        />
      )}
      {tab === "divine" && (
        <SermonBoard
          type="Divine Service"
          state={state}
          onEdit={openEdit}
          onNew={openNew}
          onDelete={askDelete}
          onDuplicate={handleDuplicate}
          onToggleStatus={toggleStatus}
        />
      )}
      {tab === "sabbath" && (
        <SermonBoard
          type="Sabbath School"
          state={state}
          onEdit={openEdit}
          onNew={openNew}
          onDelete={askDelete}
          onDuplicate={handleDuplicate}
          onToggleStatus={toggleStatus}
        />
      )}
      {tab === "library" && (
        <LibraryPanel
          state={state}
          onEdit={openEdit}
          onDelete={askDelete}
          onDuplicate={handleDuplicate}
          onToggleStatus={toggleStatus}
          onNew={openNew}
          onExport={() => {
            downloadJSON(
              exportJSON(state),
              `yrpm-studio-${new Date().toISOString().slice(0, 10)}.json`,
            );
            notify("Catalogue exported.");
          }}
        />
      )}
      {tab === "settings" && (
        <SettingsPanel
          state={state}
          reduceMotion={reduceMotion}
          onToggleMotion={onToggleMotion}
          onToast={notify}
          onImport={handleImport}
          onReset={() => {
            resetStudio();
            notify("Studio reset to the original catalogue.");
          }}
        />
      )}
    </motion.div>
  );

  return (
    <div
      className={styles.studioRoot}
      data-motion={reduceMotion ? "reduced" : "full"}
    >
      <span className={`${styles.aura} ${styles.auraOne}`} aria-hidden="true" />
      <span className={`${styles.aura} ${styles.auraTwo}`} aria-hidden="true" />
      <span
        className={`${styles.aura} ${styles.auraThree}`}
        aria-hidden="true"
      />
      <span className={styles.grain} aria-hidden="true" />

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>
              <Sparkles size={22} aria-hidden="true" />
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>Content Studio</span>
              <span className={styles.brandMeta}>
                Yashua Resurrection Power · {studio.sermons.length} messages
              </span>
            </span>
          </div>
          <div className={styles.topbarActions}>
            <span className={styles.statusChip} title={adminEmail}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>{adminEmail}</span>
            </span>
            <Link
              href="/"
              className={styles.iconLink}
              aria-label="Open the public site"
            >
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className={styles.iconLink}
              onClick={signOut}
              disabled={signingOut}
              aria-label="Sign out of the studio"
              title="Sign out"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="studio-main" className={styles.main}>
        <p className={styles.srOnly} aria-live="polite">
          {tabLabels[tab]} panel
        </p>
        <AnimatePresence mode="wait" initial={false}>
          {panel}
        </AnimatePresence>
      </main>

      <Dock tab={tab} onChange={setTab} badges={badges} />
      <Toast message={toast} />

      <AnimatePresence>
        {editor && (
          <SermonEditor
            key={editor.key}
            initial={editor.sermon}
            mode={editor.mode}
            onClose={() => setEditor(null)}
            onSave={handleSave}
            onDelete={askDelete}
            onToast={notify}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm?.kind === "delete"
            ? "Delete this message?"
            : "Are you sure?"
        }
        text={
          confirm?.sermon
            ? `“${confirm.sermon.title}” will be removed from this browser. Export a backup first if you may need it again.`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.sermon) {
            deleteSermon(confirm.sermon.id);
            notify(`“${confirm.sermon.title}” deleted.`);
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}

export default function StudioApp({ adminEmail = "" }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(MOTION_KEY) === "reduced")
        setReduceMotion(true);
    } catch {
      /* storage may be blocked */
    }
  }, []);

  const toggleMotion = (next) => {
    setReduceMotion(next);
    try {
      window.localStorage.setItem(MOTION_KEY, next ? "reduced" : "full");
    } catch {
      /* ignore */
    }
  };

  return (
    <StudioMotionProvider value={!reduceMotion}>
      <StudioSurface
        reduceMotion={reduceMotion}
        onToggleMotion={toggleMotion}
        adminEmail={adminEmail}
      />
    </StudioMotionProvider>
  );
}
