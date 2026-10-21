"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { formatDate } from "../_data/studio";
import useAudioSource from "./useAudioSource";
import styles from "../sermon-pages.module.css";

// Stable visual rhythm per message. These bars represent an interface, not decoded audio.
export function waveformFor(slug, count = 64) {
  let seed = 2166136261;
  for (const char of slug)
    seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  return Array.from({ length: count }, (_, i) => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const envelope = 0.7 + 0.3 * Math.sin((i / count) * Math.PI);
    return Math.round((22 + ((seed >>> 0) % 65)) * envelope);
  });
}
const positionKey = (slug) => `yrpm:audio-position:${slug}`;
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const n = Math.floor(seconds);
  const mins = Math.floor(n / 60);
  return `${mins >= 60 ? `${Math.floor(mins / 60)}:` : ""}${mins >= 60 ? String(mins % 60).padStart(2, "0") : mins}:${String(n % 60).padStart(2, "0")}`;
}

export default function DivineAudioPlayer({ sermon }) {
  const hasAudio = Boolean(sermon.audioUrl);
  const {
    source,
    isLocal,
    loading: sourceLoading,
  } = useAudioSource(sermon.audioUrl);
  const audio = useRef(null);
  const stage = useRef(null);
  const lastSave = useRef(0);
  // A stored position belongs to the listener. Opening the page must never erase it.
  const hasPlayed = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [compact, setCompact] = useState(false);
  const [error, setError] = useState("");
  const bars = useMemo(() => waveformFor(sermon.slug), [sermon.slug]);
  const position = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
  const label = formatDate(sermon.date) || "Date not supplied";

  useEffect(() => {
    if (!hasAudio) return;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const writeup = document.getElementById("sermon-writeup");
        if (stage.current && writeup)
          setCompact(
            stage.current.getBoundingClientRect().bottom < 95 &&
              writeup.getBoundingClientRect().bottom > 110,
          );
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [hasAudio]);

  useEffect(() => {
    if (!source || !audio.current) return;
    const player = audio.current;
    const key = positionKey(sermon.slug);
    hasPlayed.current = false;
    const restore = () => {
      try {
        const previous = Number(localStorage.getItem(key));
        if (
          Number.isFinite(previous) &&
          previous > 0 &&
          previous < player.duration - 5
        ) {
          player.currentTime = previous;
          setCurrent(previous);
        }
      } catch {
        /* Storage may be unavailable */
      }
    };
    const save = () => {
      if (!hasPlayed.current) return;
      try {
        if (player.currentTime <= 1) localStorage.removeItem(key);
        else if (
          Number.isFinite(player.duration) &&
          player.currentTime >= player.duration - 2
        )
          localStorage.removeItem(key);
        else localStorage.setItem(key, String(player.currentTime));
      } catch {
        /* Storage may be unavailable */
      }
    };
    const onTime = () => {
      setCurrent(player.currentTime);
      if (Math.abs(player.currentTime - lastSave.current) >= 5) {
        lastSave.current = player.currentTime;
        save();
      }
    };
    const onDuration = () =>
      setDuration(Number.isFinite(player.duration) ? player.duration : 0);
    const onPlay = () => {
      hasPlayed.current = true;
      setPlaying(true);
      setError("");
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "playing";
    };
    const onPause = () => {
      setPlaying(false);
      save();
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "paused";
    };
    const onEnded = () => {
      setPlaying(false);
      setCurrent(0);
      hasPlayed.current = false;
      try {
        localStorage.removeItem(key);
      } catch {
        /* Storage may be unavailable */
      }
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "none";
    };
    const onError = () => {
      setPlaying(false);
      setError("This recording could not be loaded. Please try again later.");
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "none";
    };
    player.addEventListener("loadedmetadata", restore);
    player.addEventListener("durationchange", onDuration);
    player.addEventListener("timeupdate", onTime);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    player.addEventListener("error", onError);
    window.addEventListener("pagehide", save);
    if (player.readyState >= 1) {
      onDuration();
      restore();
    }
    return () => {
      save();
      window.removeEventListener("pagehide", save);
      player.removeEventListener("loadedmetadata", restore);
      player.removeEventListener("durationchange", onDuration);
      player.removeEventListener("timeupdate", onTime);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("error", onError);
    };
  }, [source, sermon.slug]);

  useEffect(() => {
    if (!source || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    if (typeof MediaMetadata !== "undefined")
      session.metadata = new MediaMetadata({
        title: sermon.title,
        artist: "Yashua Resurrection Power Ministry",
        album: "Divine Service",
        artwork: [{ src: `/images/${sermon.image}` }],
      });
    const actions = {
      play: () =>
        audio.current
          ?.play()
          .catch(() => setError("Playback could not start.")),
      pause: () => audio.current?.pause(),
      seekbackward: (details) => seekBy(-(details?.seekOffset ?? 15)),
      seekforward: (details) => seekBy(details?.seekOffset ?? 15),
      seekto: (details) => {
        if (audio.current && Number.isFinite(details?.seekTime)) {
          audio.current.currentTime = details.seekTime;
          setCurrent(details.seekTime);
          hasPlayed.current = true;
        }
      },
    };
    Object.entries(actions).forEach(([action, handler]) => {
      try {
        session.setActionHandler(action, handler);
      } catch {
        /* Browser does not support action */
      }
    });
    return () => {
      Object.keys(actions).forEach((action) => {
        try {
          session.setActionHandler(action, null);
        } catch {
          /* Unsupported */
        }
      });
      session.metadata = null;
    };
    // Actions read the audio element, not React time state.
  }, [source, sermon.title, sermon.image]);

  function seekBy(seconds) {
    if (!audio.current || !Number.isFinite(audio.current.duration)) return;
    hasPlayed.current = true;
    audio.current.currentTime = Math.max(
      0,
      Math.min(audio.current.duration, audio.current.currentTime + seconds),
    );
    setCurrent(audio.current.currentTime);
  }
  function togglePlay() {
    if (!audio.current) return;
    if (audio.current.paused)
      audio.current
        .play()
        .catch(() =>
          setError(
            "Playback could not start. Check the recording or your connection.",
          ),
        );
    else audio.current.pause();
  }
  function changeSpeed() {
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1;
    if (audio.current) audio.current.playbackRate = next;
    setSpeed(next);
  }
  function seek(event) {
    if (!duration || !audio.current) return;
    hasPlayed.current = true;
    audio.current.currentTime = (Number(event.target.value) / 100) * duration;
    setCurrent(audio.current.currentTime);
  }

  return (
    <section
      ref={stage}
      className={styles.listeningStage}
      aria-label="Divine Service listening space"
    >
      <div className={styles.listeningTop}>
        <span>THE LISTENING ROOM / DIVINE SERVICE</span>
        <span>YRPM · THE WORD</span>
      </div>
      <div className={styles.listeningBody}>
        <span className={styles.listenMark} aria-hidden="true">
          ✳
        </span>
        <div className={styles.listeningInfo}>
          <p className={styles.smallCaps}>A MOMENT IN THE WORD</p>
          <h2>{sermon.title}</h2>
          <p>
            {label} <span aria-hidden="true">/</span> Divine Service
          </p>
        </div>
      </div>
      {!hasAudio ? (
        <p className={styles.recordingPending} role="status">
          This message has not been published as an audio recording yet. Its
          study notes are available below.
        </p>
      ) : !source ? (
        <p className={styles.recordingPending} role="status">
          {sourceLoading
            ? "Preparing the recording saved in this browser…"
            : "This browser-local recording is no longer available. Add a hosted audio link in the studio."}
        </p>
      ) : (
        <>
          <audio
            ref={audio}
            src={source}
            preload="metadata"
            className={styles.hiddenAudio}
          />
          <div className={styles.playerControls}>
            <div className={styles.waveformWrap}>
              <div className={styles.waveform} aria-hidden="true">
                {bars.map((height, i) => (
                  <span
                    key={i}
                    className={
                      i / bars.length <= position / 100 ? styles.wavePlayed : ""
                    }
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={position}
                onChange={seek}
                disabled={!duration}
                aria-label="Seek in sermon audio"
                aria-valuetext={`${formatTime(current)} elapsed of ${formatTime(duration)}`}
                className={styles.waveSeek}
              />
            </div>
            <div className={styles.audioTimes}>
              <span>{formatTime(current)} elapsed</span>
              <span>
                {duration
                  ? `${formatTime(Math.max(0, duration - current))} remaining`
                  : "Loading duration…"}
              </span>
            </div>
            <div className={styles.audioActions}>
              <div className={styles.transport}>
                <button
                  type="button"
                  onClick={() => seekBy(-15)}
                  aria-label="Skip back 15 seconds"
                >
                  <RotateCcw size={20} />
                  <span>15</span>
                </button>
                <button
                  type="button"
                  className={styles.bigPlay}
                  onClick={togglePlay}
                  aria-label={playing ? "Pause sermon" : "Play sermon"}
                >
                  {playing ? (
                    <Pause fill="currentColor" size={24} />
                  ) : (
                    <Play fill="currentColor" size={24} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => seekBy(15)}
                  aria-label="Skip forward 15 seconds"
                >
                  <RotateCw size={20} />
                  <span>15</span>
                </button>
              </div>
              <div className={styles.audioExtras}>
                <button
                  type="button"
                  onClick={changeSpeed}
                  aria-label={`Playback speed ${speed} times; change speed`}
                >
                  {speed}×
                </button>
                <a
                  href={source}
                  download
                  aria-label={`Download ${sermon.title} audio`}
                >
                  <ArrowDownToLine size={18} />
                  <span>Download</span>
                </a>
              </div>
            </div>
            {error && (
              <p role="alert" className={styles.audioError}>
                {error}
              </p>
            )}
          </div>
          {compact && (
            <div
              className={styles.compactPlayer}
              role="region"
              aria-label="Compact sermon player"
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause sermon" : "Play sermon"}
              >
                {playing ? (
                  <Pause fill="currentColor" size={18} />
                ) : (
                  <Play fill="currentColor" size={18} />
                )}
              </button>
              <div>
                <strong>{sermon.title}</strong>
                <span>
                  {formatTime(current)} / {formatTime(duration)}
                </span>
                <div className={styles.compactProgress} aria-hidden="true">
                  <span style={{ width: `${position}%` }} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => seekBy(15)}
                aria-label="Skip forward 15 seconds"
              >
                <RotateCw size={19} />
              </button>
            </div>
          )}
        </>
      )}
      {isLocal && source && (
        <p className={styles.localAudioNote}>
          Browser-local preview · this recording is stored on this device only.
        </p>
      )}
    </section>
  );
}
