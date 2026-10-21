"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CountUp from "./ui/CountUp";
import VideoBackground from "./ui/VideoBackground";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const gatherings = [
  {
    day: "Thursday",
    title: "Faith Clinic",
    time: "9:00 AM – 12:00 PM",
    desc: "A dedicated sanctuary hour for fervent prayer, healing, and the restoration of hope through the power of Yeshua.",
    img: "faith-clinic.jpg",
    weekday: 4,
    id: "faith-clinic",
  },
  {
    day: "Tuesday",
    title: "Bible Study",
    time: "4:00 PM – 6:00 PM",
    desc: "Go deeper into the Scriptures together, precept upon precept and question by question.",
    img: "bible-study.jpg",
    weekday: 2,
    id: "bible-study",
  },
  {
    day: "Saturday",
    title: "Sabbath School",
    time: "8:00 AM – 9:00 AM",
    desc: "Open the Word and study the commandments, prophets, and apostolic writings together before worship.",
    img: "sabbath-school.jpg",
    weekday: 6,
    id: "sabbath-school",
  },
  {
    day: "Saturday",
    title: "Divine Service",
    time: "9:00 AM – As the Spirit leads",
    desc: "A holy convocation for worship, expository proclamation, prayer, and warm fellowship.",
    img: "divine-service.jpg",
    weekday: 6,
    id: "divine-service",
  },
  {
    day: "Monthly",
    title: "Covenant Prayer",
    time: "Last day, 1st & 2nd of the month",
    desc: "Begin each new month in consecration, watchfulness, and intercession as one spiritual family.",
    img: "covenant-prayer.jpg",
    id: "covenant-prayer",
  },
  {
    day: "Annual · February",
    title: "Thanksgiving",
    time: "February",
    desc: "Remember the faithfulness of God and offer gratitude together as one house.",
    img: "thanksgiving.jpg",
    id: "thanksgiving",
  },
  {
    day: "Annual · April",
    title: "Passover",
    time: "April 14 – 20",
    desc: "A sacred appointed season to remember redemption and the sacrifice of the Lamb.",
    img: "passover.jpg",
    id: "passover",
  },
];

export default function WeeklyRhythm() {
  const section = useRef(null);
  const stage = useRef(null);
  const [active, setActive] = useState(0);
  const [reelMode, setReelMode] = useState(true);
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(new Date().getDay());
    const mq = gsap.matchMedia();
    mq.add("(min-width: 901px)", () => {
      if (!section.current || !stage.current) return () => {};
      const list = section.current.querySelector(".rhythm-list");
      if (!list) return () => {};
      const pin = ScrollTrigger.create({
        trigger: stage.current,
        start: "top top+=100",
        end: () =>
          `+=${Math.max(1, list.offsetHeight - stage.current.offsetHeight)}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      return () => pin.kill();
    });
    return () => mq.revert();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 280);
    return () => clearTimeout(t);
  }, [active]);

  const currentGathering = gatherings[active] || gatherings[0];

  return (
    <section ref={section} className="rhythm section-space" id="rhythms">
      <div className="container-wide">
        <div className="magazine-meta-rail">
          <span className="folio-tag">Sacred Calendar &amp; Weekly Fellowship</span>
          <span className="folio-line arch-rule-draw" aria-hidden="true" />
          <span className="folio-count">Seven Gatherings of the House</span>
        </div>

        <div className="rhythm-head">
          <div>
            <span className="eyebrow">
              Sacred calendar · seasons of encounter
            </span>
            <h2 className="display">
              Rhythms of
              <br />
              <em>the Spirit.</em>
            </h2>
          </div>
          <p className="magazine-lead-sm">
            Every gathering is an open door into Scripture, prayer, and
            fellowship. Select any gathering below to see its time and purpose.
          </p>
        </div>
      </div>

      <div className="container-wide rhythm-layout">
        <div ref={stage} className="rhythm-stage sanctuary-arch-frame">
          <div className="rhythm-stage-topbar">
            <span className="rhythm-stage-tag">
              {currentGathering.day}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={reelMode}
              className={`hero-mode-pill ${reelMode ? "is-active" : ""}`}
              onClick={() => setReelMode((r) => !r)}
            >
              <span className="mini-switch-dot" aria-hidden="true" />
              <span>{reelMode ? "Living Motion" : "Still Photo"}</span>
            </button>
          </div>

          {reelMode ? (
            <VideoBackground
              src="/videos/sanctuary-rhythm.mp4"
              poster={`/images/${currentGathering.img}`}
              slides={gatherings.map((g) => `/images/${g.img}`)}
              alt={`${currentGathering.title} gathering`}
              caption={currentGathering.title}
              showControls={false}
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentGathering.img}
                className="rhythm-stage-photo"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={`/images/${currentGathering.img}`}
                  alt={`${currentGathering.title} gathering`}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </AnimatePresence>
          )}

          <div className="rhythm-stage-caption" aria-hidden="true">
            <div>
              <span>In the Life of This House</span>
              <p className="rhythm-stage-sub">
                {currentGathering.title} · {currentGathering.time}
              </p>
            </div>
            <strong>
              {String(active + 1).padStart(2, "0")} <i>/</i> 07
            </strong>
          </div>
        </div>

        <div>
          <div className="rhythm-list" role="list">
            {gatherings.map((g, i) => {
              const isOpen = i === active;
              return (
                <article
                  key={g.title}
                  role="listitem"
                  className={`rhythm-entry ${isOpen ? "is-open" : ""}`}
                >
                  <h3>
                    <button
                      id={`rhythm-trigger-${i}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`rhythm-panel-${i}`}
                      onClick={() => setActive(i)}
                    >
                      <span className="rhythm-entry-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="rhythm-entry-name">
                        {g.title}
                        <small>
                          {g.day} · {g.time}
                          {today !== null && g.weekday === today && (
                            <b> · Today</b>
                          )}
                        </small>
                      </span>
                      <span className="rhythm-entry-icon" aria-hidden="true">
                        <Plus className="rhythm-entry-plus" size={18} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`rhythm-panel-${i}`}
                    role="region"
                    aria-labelledby={`rhythm-trigger-${i}`}
                    aria-hidden={!isOpen}
                    className="rhythm-detail"
                  >
                    <div className="rhythm-detail-inner">
                      <p>
                        <strong>{g.time}.</strong> {g.desc}
                      </p>
                      <Link className="text-link" href={`/events#${g.id}`}>
                        <span>Join this gathering</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rhythm-foot">
            <p>
              <strong>
                <CountUp value={7} /> appointed gatherings
              </strong>{" "}
              across the week and the sacred year.
            </p>
            <Link className="round-link" href="/events">
              <span className="btn-curtain" aria-hidden="true" />
              <span className="btn-inner">
                <span className="btn-text">View All Gatherings</span>
                <span className="btn-arrow-box" aria-hidden="true">
                  <ArrowUpRight className="btn-arrow-primary" size={15} />
                  <ArrowUpRight className="btn-arrow-secondary" size={15} />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
