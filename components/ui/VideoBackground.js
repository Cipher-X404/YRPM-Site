"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const DEFAULT_SLIDES = [
  "/images/worship-congregation-hands.jpg",
  "/images/pastor-sermon.jpg",
  "/images/divine-service.jpg",
  "/images/open-bible-cross.jpg",
  "/images/covenant-prayer.jpg",
];

/**
 * VideoBackground
 * Plays a real H.264 <video> background (e.g. /videos/sanctuary-hero.mp4)
 * layered over a live 60fps <canvas> cinema stream so motion begins at
 * frame zero and never freezes on a static poster.
 */
export default function VideoBackground({
  src = "/videos/sanctuary-hero.mp4",
  poster = "/images/worship-congregation-hands.jpg",
  slides = DEFAULT_SLIDES,
  alt = "Sanctuary worship and proclamation in motion",
  className = "",
  overlayClassName = "",
  showControls = true,
  caption = "Sanctuary Motion",
  playing: controlledPlaying,
  onPlayingChange,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [internalPlaying, setInternalPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const isControlled = typeof controlledPlaying === "boolean";
  const isPlaying = isControlled ? controlledPlaying : internalPlaying;

  const setPlaying = (next) => {
    const resolved = typeof next === "function" ? next(isPlaying) : next;
    if (!isControlled) setInternalPlaying(resolved);
    if (onPlayingChange) onPlayingChange(resolved);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        setInternalPlaying(false);
        if (onPlayingChange) onPlayingChange(false);
      }
    };
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Control real HTML5 <video> element playback
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    if (isPlaying && !reducedMotion) {
      const p = v.play?.();
      if (p && typeof p.catch === "function") {
        p.catch(() => setVideoReady(false));
      }
    } else {
      v.pause?.();
      setVideoReady(false);
    }
  }, [isPlaying, reducedMotion, src]);

  // Live 60fps warm sanctuary canvas (runs continuously so motion is visible immediately)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageList = Array.from(new Set([poster, ...(slides || [])])).filter(
      Boolean,
    );
    const loadedImages = [];
    let isCancelled = false;

    imageList.forEach((url) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = url;
      img.onload = () => {
        if (!isCancelled) loadedImages.push(img);
      };
    });

    const motes = Array.from({ length: 26 }, (_, idx) => ({
      x: ((idx * 41) % 100) / 100,
      y: ((idx * 67) % 100) / 100,
      r: 1.4 + (idx % 4) * 0.9,
      vx: (idx % 2 === 0 ? 1 : -1) * (0.00011 + (idx % 5) * 0.00003),
      vy: -0.0002 - (idx % 4) * 0.00005,
      alpha: 0.16 + (idx % 5) * 0.05,
    }));

    let rafId = null;
    let startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(320, Math.floor((rect.width || 1280) * dpr));
      canvas.height = Math.max(200, Math.floor((rect.height || 720) * dpr));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const drawCoverImage = (img, zoom, panX, panY, alpha) => {
      if (!img || !img.width || !img.height) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.width, ch / img.height) * zoom;
      const sw = img.width * scale;
      const sh = img.height * scale;
      const dx = (cw - sw) * 0.5 + panX * cw;
      const dy = (ch - sh) * 0.5 + panY * ch;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, sw, sh);
      ctx.restore();
    };

    const render = (now) => {
      if (isCancelled) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const elapsed = (now - startTime) / 1000;

      ctx.fillStyle = "#121316";
      ctx.fillRect(0, 0, cw, ch);

      if (loadedImages.length > 0) {
        const cycleDuration = 5.5;
        const fadeDuration = 1.6;
        const totalIndex = elapsed / cycleDuration;
        const currentIdx = Math.floor(totalIndex) % loadedImages.length;
        const nextIdx = (currentIdx + 1) % loadedImages.length;
        const progress = totalIndex - Math.floor(totalIndex);

        const zoomA = 1.04 + progress * 0.1;
        const panAX =
          Math.sin(elapsed * 0.3 + currentIdx) * 0.03 * (progress - 0.5);
        const panAY =
          Math.cos(elapsed * 0.24 + currentIdx) * 0.02 * (progress - 0.5);
        drawCoverImage(loadedImages[currentIdx], zoomA, panAX, panAY, 1);

        const fadeStart = (cycleDuration - fadeDuration) / cycleDuration;
        if (progress > fadeStart && loadedImages.length > 1) {
          const fadeAlpha = (progress - fadeStart) / (1 - fadeStart);
          const smoothAlpha = fadeAlpha * fadeAlpha * (3 - 2 * fadeAlpha);
          const zoomB = 1.04 + (progress - fadeStart) * 0.05;
          drawCoverImage(loadedImages[nextIdx], zoomB, 0, 0, smoothAlpha);
        }
      }

      const rayX = cw * (0.64 + Math.sin(elapsed * 0.25) * 0.14);
      const rayY = ch * (0.24 + Math.cos(elapsed * 0.2) * 0.08);
      const rayGrad = ctx.createRadialGradient(
        rayX,
        rayY,
        cw * 0.02,
        rayX,
        rayY,
        cw * 0.65,
      );
      rayGrad.addColorStop(0, "rgba(224, 122, 95, 0.24)");
      rayGrad.addColorStop(0.48, "rgba(108, 148, 122, 0.10)");
      rayGrad.addColorStop(1, "rgba(18, 19, 22, 0)");
      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, cw, ch);

      motes.forEach((m) => {
        m.x = (m.x + m.vx + 1) % 1;
        m.y = (m.y + m.vy + 1) % 1;
        const px = m.x * cw;
        const py = m.y * ch;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 240, 225, ${m.alpha})`;
        ctx.fill();
      });

      if (isPlaying && !reducedMotion) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    if (isPlaying && !reducedMotion) {
      rafId = window.requestAnimationFrame(render);
    } else {
      render(performance.now());
    }

    return () => {
      isCancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [poster, slides, isPlaying, reducedMotion]);

  const togglePlay = () => setPlaying((prev) => !prev);

  return (
    <div
      className={`video-bg background-media ${isPlaying ? "is-playing" : "is-static"} ${className}`}
      aria-label={alt}
    >
      {/* Live 60fps Sanctuary Canvas Stream */}
      <canvas
        ref={canvasRef}
        className="video-bg-canvas"
        aria-hidden="true"
      />

      {/* Real HTML5 Background Video (fades in only when actively playing frames, no static poster blocking canvas) */}
      {src ? (
        <video
          ref={videoRef}
          className={`video-bg-media ${videoReady && isPlaying ? "is-ready" : ""}`}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setVideoReady(true)}
          onPause={() => setVideoReady(false)}
          onError={() => setVideoReady(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Static fallback image when paused or reduced-motion */}
      <img
        src={poster}
        alt={alt}
        className="video-bg-fallback"
        loading="eager"
      />

      {/* Sanctuary Warm Vignette Overlay */}
      <div
        className={`video-bg-vignette ${overlayClassName}`}
        aria-hidden="true"
      />

      {showControls && !reducedMotion && (
        <div className="video-bg-controls">
          <span className="video-bg-badge">
            <span
              className={`video-bg-dot ${isPlaying ? "live" : ""}`}
              aria-hidden="true"
            />
            <span>{caption}</span>
          </span>
          <button
            type="button"
            className="video-bg-toggle"
            onClick={togglePlay}
            aria-pressed={!isPlaying}
            aria-label={
              isPlaying
                ? "Pause sanctuary background video"
                : "Play sanctuary background video"
            }
          >
            {isPlaying ? (
              <>
                <Pause size={12} aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={12} aria-hidden="true" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
