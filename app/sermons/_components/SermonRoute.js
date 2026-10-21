"use client";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import useStudio from "../_data/useStudio";
import DivineSermon from "./DivineSermon";
import SabbathSchoolSermon from "./SabbathSchoolSermon";
import styles from "../sermon-pages.module.css";

/**
 * The studio can add messages that were never part of the build, so this route
 * resolves the live catalogue in the browser before choosing a template.
 */
export default function SermonRoute({ type, slug }) {
  const { sermons, ready } = useStudio();
  const sermon = sermons.find(
    (item) => item.type === type && item.slug === slug,
  );

  if (!sermon) {
    return (
      <section className={`${styles.sermonContainer} ${styles.missingPage}`}>
        <meta name="robots" content="noindex" />
        {ready ? (
          <>
            <span className={styles.missingMark} aria-hidden="true">
              ✳
            </span>
            <span className={styles.sectionLabel}>THE WORD / NOT FOUND</span>
            <h1>This message is not in the library.</h1>
            <p>
              It may have been moved, unpublished or removed in the content
              studio.
            </p>
            <Link href="/sermons" className={styles.missingLink}>
              <ArrowLeft size={16} /> Back to all messages
            </Link>
          </>
        ) : (
          <p className={styles.missingLoading} role="status">
            Opening the message…
          </p>
        )}
      </section>
    );
  }

  return (
    <>
      {sermon.status === "draft" && (
        <>
          <meta name="robots" content="noindex" />
          <p className={styles.draftRibbon} role="status">
            <Sparkles size={14} aria-hidden="true" /> Draft preview · only
            visible in this browser
          </p>
        </>
      )}
      {sermon.type === "Sabbath School" ? (
        <SabbathSchoolSermon sermon={sermon} />
      ) : (
        <DivineSermon sermon={sermon} />
      )}
    </>
  );
}
