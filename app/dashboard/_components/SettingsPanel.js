"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Clipboard,
  Database,
  FileJson,
  HardDrive,
  RotateCcw,
  Settings,
  Trash2,
  Upload,
  Volume2,
  Wand2,
} from "lucide-react";
import {
  ConfirmDialog,
  Pressable,
  Switch,
} from "./primitives";
import {
  clearLocalAudio,
  deleteLocalAudio,
  formatBytes,
  listLocalAudio,
} from "../../sermons/_data/studioAudio";
import { exportJSON, exportSource } from "../../sermons/_data/studio";
import styles from "../studio.module.css";

export default function SettingsPanel({
  state,
  reduceMotion,
  onToggleMotion,
  onToast,
  onImport,
  onReset,
}) {
  const [clips, setClips] = useState([]);
  const [audioState, setAudioState] = useState("loading");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInput = useRef(null);

  const refresh = useCallback(() => {
    listLocalAudio()
      .then((items) => {
        setClips(items.sort((a, b) => b.savedAt - a.savedAt));
        setAudioState("ready");
      })
      .catch(() => setAudioState("unavailable"));
  }, []);

  useEffect(refresh, [refresh]);

  const download = (text, name) => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleSource = async () => {
    const text = exportSource(state);
    try {
      await navigator.clipboard.writeText(text);
      onToast("sermons.js copied. Paste it into app/sermons/_data/sermons.js.");
    } catch {
      download(text, "sermons.js");
      onToast("Downloaded sermons.js — replace the array in the data file.");
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const text = await file.text();
    onImport(text);
  };

  return (
    <div>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelKicker}>
            <Settings size={13} aria-hidden="true" /> Workspace
          </span>
          <h1 className={styles.panelTitle}>Tune the studio.</h1>
          <p className={styles.panelLead}>
            Export what you have written, bring content in from another
            browser, and manage the recordings saved on this device.
          </p>
        </div>
      </div>

      <div className={styles.settingsStack}>
        <section className={`${styles.card} ${styles.settingsCard}`}>
          <div className={styles.settingsRow} style={{ paddingBottom: 10 }}>
            <div className={styles.settingsText}>
              <h2 className={styles.settingsTitle}>Publishing</h2>
              <p className={styles.settingsDesc}>
                The studio is local-first: drafts live in this browser. Export
                the catalogue to commit it to the site.
              </p>
            </div>
          </div>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h3 className={styles.settingsTitle}>
                <FileJson
                  size={14}
                  aria-hidden="true"
                  style={{ verticalAlign: "-2px", marginRight: 6 }}
                />
                Download a catalogue backup
              </h3>
              <p className={styles.settingsDesc}>
                JSON with every message, study note and hosted audio link.
                Browser-local recordings are intentionally excluded.
              </p>
            </div>
            <div className={styles.settingsActions}>
              <Pressable
                size="small"
                onClick={() => {
                  download(
                    exportJSON(state),
                    `yrpm-studio-${new Date().toISOString().slice(0, 10)}.json`,
                  );
                  onToast("Studio backup downloaded.");
                }}
              >
                <ArrowDownToLine size={14} aria-hidden="true" /> Download JSON
              </Pressable>
            </div>
          </div>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h3 className={styles.settingsTitle}>Commit to the site</h3>
              <p className={styles.settingsDesc}>
                Copy a ready-to-paste <code>sermons.js</code> array. Replace the
                array in{" "}
                <code>app/sermons/_data/sermons.js</code>, then deploy.
              </p>
            </div>
            <div className={styles.settingsActions}>
              <Pressable size="small" onClick={handleSource}>
                <Clipboard size={14} aria-hidden="true" /> Copy sermons.js
              </Pressable>
            </div>
          </div>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h3 className={styles.settingsTitle}>Import a catalogue</h3>
              <p className={styles.settingsDesc}>
                Load a JSON export. This replaces the studio copy in this
                browser; it never touches the live site by itself.
              </p>
            </div>
            <div className={styles.settingsActions}>
              <Pressable size="small" onClick={() => fileInput.current?.click()}>
                <Upload size={14} aria-hidden="true" /> Choose JSON
              </Pressable>
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
                style={{ display: "none" }}
                aria-label="Import a studio JSON export"
              />
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.settingsCard}`}>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h2 className={styles.settingsTitle}>Motion</h2>
              <p className={styles.settingsDesc}>
                The studio follows your system setting automatically. You can
                calm it further here without changing the public site.
              </p>
            </div>
            <div className={styles.settingsActions}>
              <span className={styles.listHint}>
                {reduceMotion ? "Reduced" : "Full"}
              </span>
              <Switch
                checked={reduceMotion}
                onChange={onToggleMotion}
                label="Reduce studio motion"
              />
            </div>
          </div>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h2 className={styles.settingsTitle}>Keyboard</h2>
              <p className={styles.settingsDesc}>
                <span className={styles.kbd}>⌘</span> /{" "}
                <span className={styles.kbd}>Ctrl</span> +{" "}
                <span className={styles.kbd}>S</span> saves the open editor.{" "}
                <span className={styles.kbd}>Esc</span> closes it. The dock is
                fully keyboard reachable.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.settingsCard}`}>
          <div className={styles.settingsRow} style={{ paddingBottom: 14 }}>
            <div className={styles.settingsText}>
              <h2 className={styles.settingsTitle}>
                <Volume2
                  size={14}
                  aria-hidden="true"
                  style={{ verticalAlign: "-2px", marginRight: 6 }}
                />
                Browser-local audio
              </h2>
              <p className={styles.settingsDesc}>
                Recordings uploaded here are stored in IndexedDB on this device
                only. Use a hosted URL before publishing for everyone.
              </p>
            </div>
            <div className={styles.settingsActions}>
              {clips.length > 0 && (
                <Pressable
                  size="small"
                  variant="danger"
                  onClick={() => setConfirmClear(true)}
                >
                  <Trash2 size={13} aria-hidden="true" /> Clear all
                </Pressable>
              )}
            </div>
          </div>
          <div className={styles.audioList}>
            {audioState === "loading" && (
              <p className={styles.infoText}>Reading this browser’s storage…</p>
            )}
            {audioState === "unavailable" && (
              <p className={styles.infoText}>
                Audio storage is unavailable in this browser. Hosted audio URLs
                still work.
              </p>
            )}
            {audioState === "ready" && clips.length === 0 && (
              <p className={styles.infoText}>
                No browser-local recordings yet. Add one from a Divine Service
                message.
              </p>
            )}
            {clips.map((clip) => (
              <div className={styles.audioRow} key={clip.id}>
                <HardDrive size={14} aria-hidden="true" />
                <span title={clip.name}>{clip.name}</span>
                <small>{formatBytes(clip.size)}</small>
                <Pressable
                  size="small"
                  icon
                  variant="danger"
                  label={`Delete ${clip.name}`}
                  onClick={async () => {
                    try {
                      await deleteLocalAudio(clip.url);
                      refresh();
                      onToast("Recording removed from this browser.");
                    } catch {
                      onToast("That recording could not be removed.");
                    }
                  }}
                >
                  <Trash2 size={13} aria-hidden="true" />
                </Pressable>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.card} ${styles.settingsCard}`}>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h2 className={styles.settingsTitle}>
                <Database
                  size={14}
                  aria-hidden="true"
                  style={{ verticalAlign: "-2px", marginRight: 6 }}
                />
                Storage
              </h2>
              <p className={styles.settingsDesc}>
                {state.sermons.length} messages and study notes in this
                workspace. Text uses localStorage; audio uses IndexedDB. Clearing
                site data removes both.
              </p>
            </div>
            <div className={styles.settingsActions}>
              <span className={styles.listHint}>
                {state.updatedAt ? "Saved locally" : "Seed content"}
              </span>
            </div>
          </div>
          <div className={styles.settingsRow}>
            <div className={styles.settingsText}>
              <h2 className={styles.settingsTitle}>
                <Wand2
                  size={14}
                  aria-hidden="true"
                  style={{ verticalAlign: "-2px", marginRight: 6 }}
                />
                Start again
              </h2>
              <p className={styles.settingsDesc}>
                Restore the six messages that shipped with the site. Anything
                you created in this browser will be removed.
              </p>
            </div>
            <div className={styles.settingsActions}>
              <Pressable
                size="small"
                variant="danger"
                onClick={() => setConfirmReset(true)}
              >
                <RotateCcw size={13} aria-hidden="true" /> Reset studio
              </Pressable>
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset the studio?"
        text="Every local edit and draft will be replaced by the original six messages. Export a backup first if you want to keep them."
        confirmLabel="Reset studio"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          onReset();
          setConfirmReset(false);
        }}
      />
      <ConfirmDialog
        open={confirmClear}
        title="Clear local recordings?"
        text="The audio files saved in this browser will be removed. Messages that point to them will fall back to their unavailable state."
        confirmLabel="Clear recordings"
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => {
          try {
            await clearLocalAudio();
            refresh();
            onToast("Local recordings cleared.");
          } catch {
            onToast("Local recordings could not be cleared.");
          }
          setConfirmClear(false);
        }}
      />
    </div>
  );
}
