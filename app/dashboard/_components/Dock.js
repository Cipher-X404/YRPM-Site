"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
const MotionLink = motion.create(Link);
import {
  BookOpen,
  Globe,
  LayoutGrid,
  Library,
  Settings,
  Sparkles,
} from "lucide-react";
import { useMediaQuery, useMotionOK } from "./primitives";
import styles from "../studio.module.css";

export const DOCK_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "divine", label: "Divine", icon: Sparkles },
  { id: "sabbath", label: "Sabbath", icon: BookOpen },
  { id: "library", label: "Library", icon: Library },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Dock({ tab, onChange, badges = {} }) {
  const motionOK = useMotionOK();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hovered, setHovered] = useState(null);
  const [scales, setScales] = useState(() =>
    Array.from({ length: DOCK_ITEMS.length + 1 }, () => 1),
  );
  const itemRefs = useRef([]);
  const frame = useRef(0);

  const magnify = (event) => {
    if (!motionOK || !canHover) return;
    const x = event.clientX;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setScales(
        Array.from({ length: DOCK_ITEMS.length + 1 }, (_, index) => {
          const node = itemRefs.current[index];
          if (!node) return 1;
          const rect = node.getBoundingClientRect();
          const distance = Math.abs(x - (rect.left + rect.width / 2));
          const influence = Math.max(0, 1 - distance / 150);
          return 1 + influence * 0.26;
        }),
      );
    });
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    setHovered(null);
    setScales(Array.from({ length: DOCK_ITEMS.length + 1 }, () => 1));
  };

  return (
    <div className={styles.dockWrap}>
      <nav
        className={styles.dock}
        aria-label="Studio sections"
        onPointerMove={magnify}
        onPointerLeave={reset}
      >
        {DOCK_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = tab === item.id;
          const scale = motionOK && canHover ? scales[index] : 1;
          const badge = badges[item.id];
          return (
            <motion.button
              key={item.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              className={styles.dockItem}
              data-active={active}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              onClick={() => onChange(item.id)}
              onPointerEnter={() => canHover && setHovered(item.id)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              animate={motionOK ? { scale, y: (scale - 1) * -16 } : { scale: 1 }}
              whileTap={motionOK ? { scale: 0.91 } : undefined}
              transition={{ type: "spring", stiffness: 430, damping: 26 }}
              style={{ transformOrigin: "bottom center" }}
            >
              <span className={styles.dockIcon}>
                {active && (
                  <motion.span
                    layoutId="studio-dock-active"
                    className={styles.dockActive}
                    transition={{ type: "spring", stiffness: 430, damping: 34 }}
                  />
                )}
                <Icon
                  size={21}
                  strokeWidth={active ? 2.2 : 1.9}
                  aria-hidden="true"
                  style={{ position: "relative" }}
                />
                {Number(badge) > 0 && (
                  <span className={styles.dockDot}>{badge}</span>
                )}
              </span>
              <span className={styles.dockLabel}>{item.label}</span>
              <AnimatePresence>
                {hovered === item.id && canHover && (
                  <motion.span
                    className={styles.dockTooltip}
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 5, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
        <span className={styles.dockDivider} aria-hidden="true" />
        <MotionLink
          href="/"
          ref={(node) => {
            itemRefs.current[DOCK_ITEMS.length] = node;
          }}
          className={styles.dockItem}
          aria-label="Open the public site"
          onPointerEnter={() => canHover && setHovered("site")}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered("site")}
          onBlur={() => setHovered(null)}
          animate={
            motionOK
              ? {
                  scale: canHover ? scales[DOCK_ITEMS.length] : 1,
                  y: canHover ? (scales[DOCK_ITEMS.length] - 1) * -16 : 0,
                }
              : { scale: 1, y: 0 }
          }
          whileTap={motionOK ? { scale: 0.91 } : undefined}
          transition={{ type: "spring", stiffness: 430, damping: 26 }}
          style={{ transformOrigin: "bottom center" }}
        >
            <span className={styles.dockIcon}>
              <Globe size={21} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <span className={styles.dockLabel}>Site</span>
            <AnimatePresence>
              {hovered === "site" && canHover && (
                <motion.span
                  className={styles.dockTooltip}
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 5, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                >
                  Open the public site
                </motion.span>
              )}
            </AnimatePresence>
        </MotionLink>
      </nav>
    </div>
  );
}
