"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  Headphones,
  ScrollText,
  Sparkles,
} from "lucide-react";
import Reveal from "./ui/Reveal";
import { formatDate, publicSermons, sermonHref } from "../app/sermons/_data/studio";
import useStudio from "../app/sermons/_data/useStudio";

const FILTERS = ["All", "Divine Service", "Sabbath School"];

export default function SermonShowcase() {
  const { sermons } = useStudio();
  const [filter, setFilter] = useState("All");
  const catalogue = publicSermons({ sermons });
  if (!catalogue.length) return null;

  const feature = catalogue[0];
  const filtered =
    filter === "All"
      ? catalogue
      : catalogue.filter((s) => s.type === filter);

  return (
    <Reveal className="sermons-showcase section-space" id="messages">
      <div className="container-wide">
        <div className="magazine-section-header" data-reveal data-motion="up">
          <div className="magazine-meta-rail">
            <span className="folio-tag">Ministry of the Word</span>
            <span className="folio-line arch-rule-draw" aria-hidden="true" />
            <span className="folio-count">
              Sabbath Sermons &amp; Scriptural Studies
            </span>
          </div>

          <div className="section-title-row">
            <div>
              <span className="eyebrow">
                Spoken word &amp; expository teaching
              </span>
              <h2 className="display section-heading">
                Hear the proclamation.
                <br />
                <em>Enter the scripture.</em>
              </h2>
            </div>

            <div className="showcase-controls">
              <div
                className="showcase-filter-pills"
                role="tablist"
                aria-label="Filter homepage sermons"
              >
                {FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={filter === item}
                    className={`arch-filter-pill ${filter === item ? "active" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item === "All" ? "All Teachings" : item}
                  </button>
                ))}
              </div>
              <Link className="text-link" href="/sermons">
                <span>View full library</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Sabbath Message */}
        <article className="feature-sermon arch-card-featured" data-reveal data-motion="scale">
          <div className="feature-sermon-visual">
            <Image
              src={`/images/${feature.image}`}
              alt={`${feature.title} — ${feature.type}`}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              style={{ objectFit: "cover" }}
            />
            <span className="feature-folio-badge">
              <Sparkles size={12} aria-hidden="true" /> Featured Message
            </span>
          </div>
          <div className="feature-sermon-content">
            <div className="arch-card-topline">
              <span className="arch-badge-type">{feature.type}</span>
              {formatDate(feature.date) && (
                <span className="arch-card-date">{formatDate(feature.date)}</span>
              )}
            </div>
            <h3>{feature.title}</h3>
            <p className="feature-sermon-sub">
              {feature.sub}. Open the full scriptural outline, key passages, and
              teaching notes shared with the congregation.
            </p>
            {Array.isArray(feature.passages) && feature.passages.length > 0 && (
              <div className="arch-passage-chips" aria-label="Key scripture passages">
                {feature.passages.slice(0, 4).map((ref) => (
                  <span className="arch-passage-chip" key={ref}>
                    {ref}
                  </span>
                ))}
              </div>
            )}
            <div className="feature-sermon-actions">
              <Link className="round-link light" href={sermonHref(feature)}>
                <span className="btn-curtain" aria-hidden="true" />
                <span className="btn-inner">
                  <span className="btn-text">Read This Message</span>
                  <span className="btn-arrow-box" aria-hidden="true">
                    <ArrowUpRight className="btn-arrow-primary" size={15} />
                    <ArrowUpRight className="btn-arrow-secondary" size={15} />
                  </span>
                </span>
              </Link>
              <Link className="text-link light-link" href="/sermons">
                <span>Browse all {catalogue.length} teachings</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>

        {/* Warm Sanctuary Sermon Cards Grid on the Index Page */}
        <div className="home-sermon-cards-grid">
          {filtered.map((sermon) => {
            const isDivine = sermon.type === "Divine Service";
            const sectionCount = Array.isArray(sermon.sections)
              ? sermon.sections.length
              : 0;
            return (
              <article
                className="arch-sermon-card"
                key={sermon.id}
                data-reveal
                data-motion="up"
              >
                <div className="arch-sermon-card-head">
                  <span className="arch-catalog-no">
                    {isDivine ? "Sabbath Proclamation" : "Interactive Bible Study"}
                  </span>
                  <span
                    className={`arch-type-pill ${isDivine ? "is-divine" : "is-sabbath"}`}
                  >
                    {isDivine ? (
                      <Headphones size={12} aria-hidden="true" />
                    ) : (
                      <ScrollText size={12} aria-hidden="true" />
                    )}
                    <span>{sermon.type}</span>
                  </span>
                </div>

                <Link
                  href={sermonHref(sermon)}
                  className="arch-sermon-card-media"
                  aria-label={`Read ${sermon.title}`}
                >
                  <Image
                    src={`/images/${sermon.image}`}
                    alt={`${sermon.title} — ${sermon.type}`}
                    width={540}
                    height={340}
                  />
                  <span className="arch-media-overlay">
                    <span>Open Teaching ↗</span>
                  </span>
                </Link>

                <div className="arch-sermon-card-body">
                  {formatDate(sermon.date) && (
                    <time className="arch-sermon-date" dateTime={sermon.date}>
                      {formatDate(sermon.date)}
                    </time>
                  )}
                  <h3>
                    <Link href={sermonHref(sermon)}>{sermon.title}</Link>
                  </h3>
                  <p>{sermon.sub}</p>

                  {Array.isArray(sermon.passages) && sermon.passages.length > 0 && (
                    <div className="arch-card-scriptures">
                      {sermon.passages.slice(0, 3).map((passage) => (
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
                        ? `${sectionCount} study sections`
                        : "Scriptural study"}
                    </span>
                  </span>
                  <Link href={sermonHref(sermon)} className="arch-card-cta">
                    <span>Read &amp; Study</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
