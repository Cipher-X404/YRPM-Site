"use client";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { animate, AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import styles from "../studio.module.css";

const MotionLink = motion.create(Link);
const MotionContext = createContext(true);

export function StudioMotionProvider({ value, children }) {
  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

/** Studio preference AND the operating-system setting both have to allow motion. */
export function useMotionOK() {
  const studioAllows = useContext(MotionContext);
  const systemReduced = useReducedMotion();
  return Boolean(studioAllows) && !systemReduced;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [active]);
}

/** Focus is moved into the surface, cycled inside it, and returned to the opener. */
export function useFocusTrap(ref, onClose, active = true) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const items = () =>
      [
        ...node.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => items()[0]?.focus());
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = items();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const index = focusable.indexOf(document.activeElement);
      if (index === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && index === 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && index === focusable.length - 1) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      if (previous?.isConnected)
        requestAnimationFrame(() => previous.focus());
    };
  }, [active, ref]);
}

const spring = { type: "spring", stiffness: 460, damping: 32, mass: 0.7 };

export function Pressable({
  href,
  children,
  className = "",
  variant = "default",
  size = "default",
  icon = false,
  onClick,
  disabled = false,
  type = "button",
  label,
  target,
  ...rest
}) {
  const motionOK = useMotionOK();
  const classes = [
    styles.btn,
    variant === "primary" && styles.btnPrimary,
    variant === "danger" && styles.btnDanger,
    size === "small" && styles.btnSmall,
    icon && styles.btnIcon,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sheen = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mx",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--my",
      `${event.clientY - rect.top}px`,
    );
  }, []);

  const animation = motionOK
    ? { whileHover: { scale: 1.028 }, whileTap: { scale: 0.955 } }
    : { whileTap: { scale: 1 } };

  const content = (
    <>
      <span className={styles.sheen} aria-hidden="true" />
      {children}
    </>
  );

  if (href) {
    return (
      <MotionLink
        href={href}
        className={classes}
        onPointerMove={sheen}
        aria-label={label}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        {...animation}
        transition={spring}
        {...rest}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      onPointerMove={sheen}
      {...animation}
      transition={spring}
      {...rest}
    >
      {content}
    </motion.button>
  );
}

/** Pointer-reactive glass card: a small tilt plus a light that follows the cursor. */
export function TiltCard({
  children,
  className = "",
  as: Tag = motion.div,
  intensity = 4,
  ...rest
}) {
  const motionOK = useMotionOK();
  const card = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const move = (event) => {
    if (!motionOK || event.pointerType !== "mouse" || !card.current) return;
    const rect = card.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * intensity, y: px * intensity });
    card.current.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    card.current.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const leave = () => setTilt({ x: 0, y: 0 });

  return (
    <Tag
      ref={card}
      className={`${styles.card} ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      animate={
        motionOK
          ? { rotateX: tilt.x, rotateY: tilt.y }
          : { rotateX: 0, rotateY: 0 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.6 }}
      style={{ transformPerspective: 900 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Segmented({ value, options, onChange, layoutId, label }) {
  const motionOK = useMotionOK();
  return (
    <div
      className={styles.segmented}
      role="group"
      aria-label={label || "Filter"}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={styles.segment}
            data-active={active}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className={styles.segmentPill}
                transition={
                  motionOK
                    ? { type: "spring", stiffness: 430, damping: 34 }
                    : { duration: 0 }
                }
              />
            )}
            <span style={{ position: "relative" }}>{option.label}</span>
            {Number.isFinite(option.badge) && (
              <span className={styles.segmentBadge}>{option.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({ checked, onChange, label }) {
  const motionOK = useMotionOK();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={styles.switch}
      data-on={checked}
      onClick={() => onChange(!checked)}
    >
      <motion.span
        className={styles.switchKnob}
        layout
        transition={
          motionOK
            ? { type: "spring", stiffness: 500, damping: 32 }
            : { duration: 0 }
        }
      />
    </button>
  );
}

export function AnimatedNumber({ value, className = "" }) {
  const motionOK = useMotionOK();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!motionOK) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [value, motionOK]);
  return (
    <span className={className} aria-label={String(value)}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

export function EmptyState({ icon: Icon = AlertTriangle, title, children, action }) {
  return (
    <div className={styles.emptyState}>
      <Icon size={26} aria-hidden="true" />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Toast({ message }) {
  const motionOK = useMotionOK();
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message.id}
          className={styles.toast}
          role="status"
          aria-live="polite"
          initial={motionOK ? { opacity: 0, y: 14, scale: 0.94 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={motionOK ? { opacity: 0, y: 10, scale: 0.96 } : { opacity: 0 }}
          transition={
            motionOK
              ? { type: "spring", stiffness: 420, damping: 30 }
              : { duration: 0 }
          }
        >
          <span className={styles.toastIcon}>
            <Check size={15} aria-hidden="true" />
          </span>
          {message.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  const panel = useRef(null);
  const motionOK = useMotionOK();
  useBodyLock(open);
  useFocusTrap(panel, onCancel, open);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.confirmBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onCancel();
          }}
        >
          <motion.div
            ref={panel}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="studio-confirm-title"
            aria-describedby="studio-confirm-text"
            className={styles.confirmCard}
            initial={motionOK ? { opacity: 0, scale: 0.9, y: 12 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              motionOK ? { opacity: 0, scale: 0.94, y: 8 } : { opacity: 0 }
            }
            transition={
              motionOK
                ? { type: "spring", stiffness: 420, damping: 30 }
                : { duration: 0 }
            }
          >
            <h2 className={styles.confirmTitle} id="studio-confirm-title">
              {title}
            </h2>
            <p className={styles.confirmText} id="studio-confirm-text">
              {text}
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmCancel}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmDelete}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function relativeTime(timestamp) {
  if (!timestamp) return "Not edited yet";
  const diff = Date.now() - timestamp;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(timestamp),
  );
}
