"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CircleAlert,
  Clock3,
  Home,
  Info,
  Mic,
  Pencil,
  Plus,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import {
  AnimatedNumber,
  Pressable,
  TiltCard,
  relativeTime,
} from "./primitives";
import styles from "../studio.module.css";

const siteLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "Our story", icon: Info },
  { href: "/sermons", label: "Messages", icon: BookOpen },
  { href: "/events", label: "Gatherings", icon: CalendarDays },
  { href: "/ministries", label: "Ministries", icon: HeartHandshake },
  { href: "/give", label: "Giving", icon: Sparkles },
];

function greetingFor(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Overview({ state, stats, issues, onNew, onTab, onEdit }) {
  const [greeting, setGreeting] = useState("Welcome back");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    setGreeting(greetingFor(now.getHours()));
    setToday(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now),
    );
  }, []);

  const coverage = stats.divine
    ? Math.round((stats.withAudio / stats.divine) * 100)
    : 0;
  const recent = [...state.sermons]
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 4);
  const review = issues.slice(0, 5);

  return (
    <div>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelKicker}>
            <Sparkles size={13} aria-hidden="true" /> Content studio
          </span>
          <h1 className={styles.panelTitle}>
            {greeting}, <em style={{ fontStyle: "normal", color: "#fba92c" }}>steward.</em>
          </h1>
          <p className={styles.panelLead}>
            {today ? `${today} · ` : ""}Every message, study note and
            recording in one quiet place. Drafts stay in this browser until you
            export them.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Pressable variant="primary" onClick={() => onNew("Divine Service")}>
            <Plus size={17} aria-hidden="true" /> Divine message
          </Pressable>
          <Pressable onClick={() => onNew("Sabbath School")}>
            <BookOpen size={16} aria-hidden="true" /> Sabbath study
          </Pressable>
        </div>
      </div>

      <TiltCard className={styles.heroCard} intensity={2.4}>
        <div className={styles.heroCopy}>
          <span className={styles.pill}>
            <Mic size={11} aria-hidden="true" /> The Word, held with care
          </span>
          <h2 className={styles.heroTitle}>
            Prepare the message. <em>Keep the room warm.</em>
          </h2>
          <p className={styles.heroLead}>
            Write the notes, attach the recording, and publish to the site. The
            studio works offline and keeps every draft in this browser.
          </p>
          <div className={styles.heroActions}>
            <Pressable variant="primary" onClick={() => onTab("divine")}>
              Open the library <ArrowUpRight size={16} aria-hidden="true" />
            </Pressable>
            <Pressable onClick={() => onTab("settings")}>
              Export &amp; publish
            </Pressable>
          </div>
        </div>
        <div className={styles.heroAside}>
          <div className={styles.ring} style={{ "--p": coverage }}>
            <span className={styles.ringInner}>
              <span className={styles.ringValue}>{coverage}%</span>
              <span className={styles.ringLabel}>Audio ready</span>
            </span>
          </div>
        </div>
      </TiltCard>

      <div className={styles.statGrid}>
        <TiltCard className={`${styles.stat}`} intensity={6}>
          <span className={styles.statLabel}>
            <BookOpen size={13} aria-hidden="true" /> Messages
          </span>
          <AnimatedNumber value={stats.total} className={styles.statValue} />
          <span className={styles.statFoot}>
            {stats.published} published · {stats.drafts} draft
          </span>
          <div className={styles.statBar} aria-hidden="true">
            <span
              style={{
                width: `${stats.total ? (stats.published / stats.total) * 100 : 0}%`,
              }}
            />
          </div>
        </TiltCard>
        <TiltCard className={`${styles.stat}`} intensity={6}>
          <span className={styles.statLabel}>
            <Sparkles size={13} aria-hidden="true" /> Divine Service
          </span>
          <AnimatedNumber value={stats.divine} className={styles.statValue} />
          <span className={styles.statFoot}>{stats.withAudio} with audio</span>
          <div className={styles.statBar} aria-hidden="true">
            <span
              style={{
                width: `${stats.divine ? (stats.withAudio / stats.divine) * 100 : 0}%`,
              }}
            />
          </div>
        </TiltCard>
        <TiltCard className={`${styles.stat}`} intensity={6}>
          <span className={styles.statLabel}>
            <BookOpen size={13} aria-hidden="true" /> Sabbath School
          </span>
          <AnimatedNumber value={stats.sabbath} className={styles.statValue} />
          <span className={styles.statFoot}>Reading-first studies</span>
          <div className={styles.statBar} aria-hidden="true">
            <span
              style={{
                width: `${stats.total ? (stats.sabbath / stats.total) * 100 : 0}%`,
              }}
            />
          </div>
        </TiltCard>
        <TiltCard className={`${styles.stat}`} intensity={6}>
          <span className={styles.statLabel}>
            <Clock3 size={13} aria-hidden="true" /> Needs attention
          </span>
          <AnimatedNumber value={issues.length} className={styles.statValue} />
          <span className={styles.statFoot}>Content review items</span>
          <div className={styles.statBar} aria-hidden="true">
            <span
              style={{
                width: `${Math.min(100, issues.length * 8)}%`,
                background: "linear-gradient(90deg,#ff9f0a,#ffd27a)",
              }}
            />
          </div>
        </TiltCard>
      </div>

      <div className={styles.gridTwo}>
        <TiltCard className={styles.listCard} intensity={1.6}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Continue where you left off</h2>
            <span className={styles.listHint}>{recent.length} recent</span>
          </div>
          <div className={styles.activityList}>
            {recent.map((sermon) => (
              <button
                type="button"
                key={sermon.id}
                className={styles.activityItem}
                onClick={() => onEdit(sermon)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.activityThumb}
                  src={`/images/${sermon.image}`}
                  alt=""
                />
                <span className={styles.activityMeta}>
                  <strong>{sermon.title}</strong>
                  <span>
                    {sermon.type} ·{" "}
                    {sermon.status === "draft" ? "Draft" : "Published"}
                  </span>
                </span>
                <span className={styles.activityTime}>
                  {relativeTime(sermon.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        </TiltCard>

        <TiltCard className={styles.listCard} intensity={1.6}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Content review</h2>
            <span className={styles.reviewCount}>{issues.length}</span>
          </div>
          {review.length ? (
            <div>
              {review.map((issue) => (
                <button
                  type="button"
                  className={styles.reviewRow}
                  key={issue.id}
                  onClick={() => {
                    const sermon = state.sermons.find(
                      (item) => item.id === issue.sermonId,
                    );
                    if (sermon) onEdit(sermon);
                  }}
                >
                  <span className={styles.reviewIcon}>
                    {issue.severity === "warn" ? (
                      <CircleAlert size={14} aria-hidden="true" />
                    ) : (
                      <AlertTriangle size={14} aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles.reviewText}>
                    <strong>{issue.label}</strong>
                    <span>{issue.detail}</span>
                  </span>
                  <Pencil size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.emptyRow}>
              Everything is dated, sourced and ready. Nothing to review.
            </p>
          )}
        </TiltCard>
      </div>

      <TiltCard
        className={styles.listCard}
        intensity={1.2}
        style={{ marginTop: 16 }}
      >
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>The public house</h2>
          <span className={styles.listHint}>Open any page</span>
        </div>
        <div className={styles.siteGrid}>
          {siteLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={styles.siteLink}>
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
              <ArrowUpRight size={13} aria-hidden="true" style={{ marginLeft: "auto" }} />
            </Link>
          ))}
        </div>
      </TiltCard>
    </div>
  );
}
