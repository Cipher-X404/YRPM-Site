import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import FloatingBible from "./FloatingBible";
import ScriptureText from "./ScriptureText";
import { formatDate } from "../_data/studio";
import styles from "../sermon-pages.module.css";

export default function SabbathSchoolSermon({ sermon }) {
  return (
    <article className={styles.schoolPage}>
      <header className={`${styles.sermonContainer} ${styles.schoolHero}`}>
        <div className={styles.schoolIntro}>
          <Link href="/sermons" className={styles.backLink}>
            <ArrowLeft size={16} /> All messages
          </Link>
          <span className={styles.schoolKicker}>
            <BookOpen size={16} /> SABBATH SCHOOL / STUDY NOTES
          </span>
          <h1>{sermon.title}</h1>
          <p>
            {sermon.sub}. A reading-first guide to exploring the scriptures
            together, question by question.
          </p>
          {formatDate(sermon.date) && (
            <span className={styles.schoolDate}>{formatDate(sermon.date)}</span>
          )}
          <span className={styles.schoolNote}>
            READ SLOWLY <span aria-hidden="true">·</span> QUESTION FREELY{" "}
            <span aria-hidden="true">·</span> GROW TOGETHER
          </span>
        </div>
        <div className={styles.schoolImage}>
          <Image
            src={`/images/${sermon.image}`}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 42vw"
            alt={`${sermon.title} — Sabbath School study notes`}
          />
        </div>
      </header>
      <div className={`${styles.sermonContainer} ${styles.schoolBody}`}>
        <aside className={styles.studyIndex}>
          <span className={styles.sectionLabel}>YOUR STUDY PATH</span>
          <nav aria-label="Lesson sections">
            {sermon.sections.map((section, i) => (
              <a href={`#study-${i + 1}`} key={section.heading}>
                <span>0{i + 1}</span> {section.heading}
              </a>
            ))}
          </nav>
          <div className={styles.studyReferences}>
            <span className={styles.sectionLabel}>PASSAGES TO EXPLORE</span>
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
        <div id="sermon-writeup" className={styles.studyReading}>
          <div className={styles.readingLead}>
            <span className={styles.sectionLabel}>BEFORE YOU BEGIN</span>
            <p>
              Bring your Bible and your questions. These notes are a starting
              point for conversation, not a complete account of the class
              discussion.
            </p>
          </div>
          {sermon.sections.map((section, i) => (
            <section
              className={styles.studySection}
              id={`study-${i + 1}`}
              key={section.heading}
            >
              <span className={styles.studyNumber}>LESSON NOTE / 0{i + 1}</span>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, j) => (
                <p key={j}>
                  <ScriptureText>{paragraph}</ScriptureText>
                </p>
              ))}
              <div className={styles.studyPrompt}>
                <span>FOR REFLECTION</span>
                <p>
                  {section.prompt ||
                    "What does this passage say? What questions would you bring to the study table?"}
                </p>
              </div>
            </section>
          ))}
          <div className={styles.studyEnding}>
            <BookOpen aria-hidden="true" />
            <p>
              The next step is a conversation. Join us for Sabbath School and
              keep studying in community.
            </p>
            <Link href="/events">
              See gathering times <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <FloatingBible />
    </article>
  );
}
