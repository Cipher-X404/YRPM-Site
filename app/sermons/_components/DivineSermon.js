import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import FloatingBible from "./FloatingBible";
import DivineAudioPlayer from "./DivineAudioPlayer";
import ScriptureText from "./ScriptureText";
import { formatDate } from "../_data/studio";
import styles from "../sermon-pages.module.css";

export default function DivineSermon({ sermon }) {
  return (
    <article className={styles.divinePage}>
      <header className={styles.divineHero}>
        <Image
          src={`/images/${sermon.image}`}
          alt={`${sermon.title} — Divine Service`}
          fill
          priority
          sizes="100vw"
          className={styles.divineHeroImage}
        />
        <div className={styles.sermonContainer}>
          <Link href="/sermons" className={styles.backLink}>
            <ArrowLeft size={16} /> All messages
          </Link>
          <span className={styles.heroKicker}>THE WORD / DIVINE SERVICE</span>
          <h1>{sermon.title}</h1>
          <p>
            {sermon.sub}. An invitation to return to scripture and stand
            together in faith.
          </p>
          {formatDate(sermon.date) && (
            <span className={styles.heroDate}>
              {formatDate(sermon.date)} <span aria-hidden="true">·</span>{" "}
              Divine Service
            </span>
          )}
          <span className={styles.heroBottom}>
            APOSTOLIC PROCLAMATION <span aria-hidden="true">✳</span> YASHUA
            RESURRECTION POWER MINISTRY
          </span>
        </div>
      </header>
      <div className={`${styles.sermonContainer} ${styles.divinePlayerWrap}`}>
        <DivineAudioPlayer sermon={sermon} />
      </div>
      <div
        id="sermon-writeup"
        className={`${styles.sermonContainer} ${styles.divineWriteup}`}
      >
        <aside className={styles.divineSide}>
          <span className={styles.sectionLabel}>IN THIS MESSAGE</span>
          <ol>
            {sermon.sections.map((section, i) => (
              <li key={section.heading}>
                <a href={`#part-${i + 1}`}>
                  <span>0{i + 1}</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
          <span className={styles.sectionLabel}>OPEN THE SCRIPTURES</span>
          <div className={styles.referenceList}>
            {sermon.passages.map((ref) => (
              <button
                key={ref}
                type="button"
                data-ref={ref}
                aria-label={`Read ${ref} in the Bible`}
              >
                {ref} <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
        </aside>
        <div className={styles.divineArticle}>
          <div className={styles.articlePrelude}>
            <span className={styles.sectionLabel}>THE WRITE-UP</span>
            <p>
              {sermon.sub}. These notes are a companion for personal reflection
              and study. They are not a transcript.
            </p>
          </div>
          {sermon.sections.map((section, i) => (
            <section
              key={section.heading}
              id={`part-${i + 1}`}
              className={styles.divineSection}
            >
              <span className={styles.sectionNumber}>0{i + 1} / THE WORD</span>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, j) => (
                <p key={j}>
                  <ScriptureText>{paragraph}</ScriptureText>
                </p>
              ))}
            </section>
          ))}
          <div className={styles.divineClosing}>
            <span aria-hidden="true">✳</span>
            <p>
              Read the passage. Make space for prayer. Continue the conversation
              with the community.
            </p>
            <Link href="/events">
              Join a gathering <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <FloatingBible reservePlayerSpace={Boolean(sermon.audioUrl)} />
    </article>
  );
}
