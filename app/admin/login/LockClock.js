"use client";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import styles from "./login.module.css";

/**
 * iOS lock-screen clock. Renders a stable placeholder on the server and fills in
 * after hydration so the page never produces a hydration mismatch.
 */
export default function LockClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 15000);
    return () => clearInterval(timer);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--";
  const date = now
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now)
    : "Yashua Resurrection Power Ministry";

  return (
    <div className={styles.clockWrap}>
      <p className={styles.date}>{date}</p>
      <p className={styles.clock} aria-live="off" aria-label={now ? `Time ${time}` : undefined}>
        {time}
      </p>
      <span className={styles.lockBadge} aria-hidden="true">
        <Lock size={22} strokeWidth={1.8} />
      </span>
    </div>
  );
}
