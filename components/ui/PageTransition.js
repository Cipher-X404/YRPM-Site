"use client";
import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

/** Route entry without an SSR opacity:0 wrapper or transforms that break pinned content. */
export default function PageTransition({ children }) {
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) {
      controls.set({ opacity: 1 });
      return;
    }
    controls.set({ opacity: 0.72 });
    controls.start({
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    });
    return () => controls.stop();
  }, [controls, reduceMotion]);
  return (
    <motion.div initial={false} animate={controls}>
      {children}
    </motion.div>
  );
}
