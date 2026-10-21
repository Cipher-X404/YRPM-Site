"use client";
import { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Headphones, ScrollText } from "lucide-react";
import { sermonPath } from "../app/sermons/_data/sermons";
import { formatDate, publicSermons } from "../app/sermons/_data/studio";
import useStudio from "../app/sermons/_data/useStudio";

export default function SermonLibrary() {
  const [filter, setFilter] = useState("All");
  const { sermons: allSermons } = useStudio();
  const catalogue = publicSermons({ sermons: allSermons });
  const grid = useRef(null);
  const previous = useRef(null);

  useLayoutEffect(() => {
    if (previous.current) {
      const tween = Flip.from(previous.current, {
        duration: 0.5,
        ease: "power2.out",
        fade: true,
        stagger: 0.03,
      });
      previous.current = null;
      return () => tween.kill();
    }
    previous.current = null;
  }, [filter]);

  const choose = (f) => {
    if (grid.current) previous.current = Flip.getState(grid.current.children);
    setFilter(f);
  };

  const shown =
    filter === "All"
      ? catalogue
      : catalogue.filter((s) => s.type === filter);

  return (
    <div className="container-wide">
      <div className="magazine-meta-rail">
        <span className="folio-tag">Sabbath Sermons &amp; Bible Studies</span>
        <span className="folio-line arch-rule-draw" aria-hidden="true" />
        <span className="folio-count">
          {shown.length} Published Teachings
        </span>
      </div>

      <span className="eyebrow">Teaching themes</span>
      <h2 className="display section-heading" style={{ margin: "18px 0 35px" }}>
        Explore the <em>scriptures.</em>
      </h2>

      <div
        className="filter-row"
        role="group"
        aria-label="Filter teaching themes"
      >
        {["All", "Divine Service", "Sabbath School"].map((f) => (
          <button
            key={f}
            type="button"
            className={filter === f ? "active" : ""}
            aria-pressed={filter === f}
            onClick={() => choose(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="listing-grid home-sermon-cards-grid" ref={grid}>
        {shown.length === 0 && (
          <p className="listing-empty" role="status">
            No published messages in this collection yet. Drafts stay private
            until they are published in the content studio.
          </p>
        )}
        {shown.map((s) => {
          const isDivine = s.type === "Divine Service";
          const sectionCount = Array.isArray(s.sections) ? s.sections.length : 0;
          return (
            <article className="listing-card arch-sermon-card" key={s.slug}>
              <div className="arch-sermon-card-head">
                <span className="arch-catalog-no">
                  {isDivine ? "Sabbath Proclamation" : "Interactive Study"}
                </span>
                <small
                  className={`arch-type-pill ${isDivine ? "is-divine" : "is-sabbath"}`}
                >
                  {isDivine ? (
                    <Headphones size={12} aria-hidden="true" />
                  ) : (
                    <ScrollText size={12} aria-hidden="true" />
                  )}
                  <span>{s.type}</span>
                </small>
              </div>

              <Link href={sermonPath(s)} className="arch-sermon-card-media">
                <Image
                  src={`/images/${s.image}`}
                  alt={`${s.type} teaching`}
                  width={520}
                  height={300}
                  style={{ objectFit: "cover", width: "100%", height: 230 }}
                />
                <span className="arch-media-overlay">
                  <span>
                    {isDivine ? "Read the message ↗" : "Explore the study ↗"}
                  </span>
                </span>
              </Link>

              <div className="body arch-sermon-card-body">
                {formatDate(s.date) && (
                  <time className="arch-sermon-date" dateTime={s.date}>
                    {formatDate(s.date)}
                  </time>
                )}
                <h3>
                  <Link href={sermonPath(s)}>{s.title}</Link>
                </h3>
                <p>{s.sub}</p>
                {Array.isArray(s.passages) && s.passages.length > 0 && (
                  <div className="arch-card-scriptures">
                    {s.passages.slice(0, 3).map((passage) => (
                      <span key={passage} className="arch-scripture-tag">
                        {passage}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="arch-sermon-card-foot">
                <span className="arch-foot-meta">
                  <BookOpen size={14} aria-hidden="true" />
                  <span>
                    {sectionCount
                      ? `${sectionCount} sections`
                      : "Scriptural study"}
                  </span>
                </span>
                <Link href={sermonPath(s)} className="text-link arch-card-cta">
                  <span>
                    {isDivine ? "Read the message" : "Explore the study"}
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="giving-note" style={{ marginTop: 48 }}>
        Interested in studying with us? Join a Sabbath School or Divine Service
        gathering.{" "}
        <Link className="text-link" href="/events" style={{ marginLeft: 10 }}>
          <span>See gathering times</span> <ArrowUpRight />
        </Link>
      </div>
    </div>
  );
}
