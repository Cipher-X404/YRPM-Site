"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Play, Pause, Sparkles, Headphones } from "lucide-react";
import VideoBackground from "./ui/VideoBackground";
gsap.registerPlugin(ScrollTrigger);

const REEL_CHAPTERS = [
  {
    no: "01",
    label: "Sabbath School",
    time: "Saturday · 8:00 AM",
    subtitle: "Interactive Scripture Study",
    poster: "/images/sabbath-school.jpg",
  },
  {
    no: "02",
    label: "Divine Service",
    time: "Saturday · 9:00 AM",
    subtitle: "Sacred Convocation & Word",
    poster: "/images/worship-congregation-hands.jpg",
  },
  {
    no: "03",
    label: "Faith Clinic",
    time: "Thursday · 9:00 AM",
    subtitle: "Intercession & Healing Prayer",
    poster: "/images/faith-clinic.jpg",
  },
  {
    no: "04",
    label: "Bible Study",
    time: "Tuesday · 4:00 PM",
    subtitle: "Line-Upon-Line Teaching",
    poster: "/images/bible-study.jpg",
  },
];

export default function HeroSection() {
  const hero = useRef(null);
  const bg = useRef(null);
  const [motionPlaying, setMotionPlaying] = useState(true);
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    if (!motionPlaying) return;
    const id = window.setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % REEL_CHAPTERS.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [motionPlaying]);

  useEffect(() => {
    if (!hero.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal-item",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.08,
        },
      );

      gsap.to(bg.current, {
        yPercent: 10,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: hero.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, hero);
    return () => ctx.revert();
  }, []);

  const currentChapter = REEL_CHAPTERS[activeChapter] || REEL_CHAPTERS[0];

  return (
    <section ref={hero} className="hero grain">
      {/* Full-Stage Cinema Video Background */}
      <div ref={bg} className="hero-bg">
        <VideoBackground
          src="/videos/sanctuary-hero.mp4"
          poster={currentChapter.poster}
          slides={[
            "/images/worship-congregation-hands.jpg",
            "/images/pastor-sermon.jpg",
            "/images/divine-service.jpg",
            "/images/open-bible-cross.jpg",
            "/images/covenant-prayer.jpg",
          ]}
          alt="Yashua Resurrection Power Ministry congregation worshipping in the sanctuary"
          caption={`Sanctuary Reel · ${currentChapter.label}`}
          playing={motionPlaying}
          onPlayingChange={setMotionPlaying}
          showControls={false}
        />
      </div>

      {/* Warm Ambient Sanctuary Glow */}
      <div className="hero-ambient-orb" aria-hidden="true" />

      {/* Centered Monumental Sanctuary Stage */}
      <div className="container-wide hero-stage-center">
        <div className="hero-covenant-pill hero-reveal-item">
          <span className="hero-live-dot" aria-hidden="true" />
          <span>Seventh-Day Sabbath Sanctuary · Saturdays 8:00 AM &amp; 9:00 AM</span>
        </div>

        <h1 className="display hero-display-title hero-reveal-item">
          <span className="hero-title-line">Where the Word Is Alive</span>
          <span className="hero-title-line">
            <em>&amp; the Spirit Restores.</em>
          </span>
        </h1>

        <p className="hero-sub hero-reveal-item">
          Welcome to Yashua Resurrection Power Ministry INC — an Apostolic,
          Spirit-filled, Seventh-Day Sabbath-keeping church family anchored in
          unadulterated Scripture, fervent prayer, and the resurrection power of
          Yeshua Hamashiach.
        </p>

        <div className="hero-actions hero-reveal-item">
          <Link className="round-link light" href="/#visit">
            <span className="btn-curtain" aria-hidden="true" />
            <span className="btn-inner">
              <span className="btn-text">Plan Your Sabbath Visit</span>
              <span className="btn-arrow-box" aria-hidden="true">
                <ArrowUpRight className="btn-arrow-primary" size={16} />
                <ArrowUpRight className="btn-arrow-secondary" size={16} />
              </span>
            </span>
          </Link>

          <Link className="round-link outline" href="/sermons">
            <Play size={14} aria-hidden="true" />
            <span>Explore Sermons &amp; Studies</span>
          </Link>
        </div>

        {/* Inline Featured Sermon Ribbon */}
        <div className="hero-sermon-ribbon hero-reveal-item">
          <span className="hero-ribbon-badge">
            <Headphones size={13} aria-hidden="true" />
            <span>Latest Proclamation</span>
          </span>
          <span className="hero-ribbon-title">
            The Unshakable Foundation (1 Corinthians 3:11)
          </span>
          <Link
            href="/sermons/divine-service/the-unshakable-foundation"
            className="hero-ribbon-cta"
          >
            <span>Listen &amp; Read</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Bottom Cinema Dock: 4 Interactive Sanctuary Gatherings + Video/Still Switch */}
      <div className="hero-bar">
        <div className="container-wide hero-dock-wrap">
          <div className="hero-bar-inner" role="group" aria-label="Sanctuary weekly gatherings">
            {REEL_CHAPTERS.map((item, idx) => {
              const isCurrent = idx === activeChapter;
              return (
                <button
                  key={item.no}
                  type="button"
                  className={`hero-meta-item ${isCurrent ? "is-active" : ""}`}
                  onClick={() => setActiveChapter(idx)}
                  aria-pressed={isCurrent}
                >
                  <div className="hero-meta-top">
                    <span className="hero-meta-no">{item.no}</span>
                    <small>{item.label}</small>
                  </div>
                  <strong>{item.time}</strong>
                  <span className="hero-meta-sub">{item.subtitle}</span>
                  <span className="hero-meta-progress" aria-hidden="true">
                    <span
                      className={`hero-meta-progress-fill ${
                        isCurrent && motionPlaying ? "is-running" : ""
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hero-dock-controls">
            <span className="hero-dock-caption">
              <Sparkles size={12} aria-hidden="true" />
              <span>Now Showing: {currentChapter.label}</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={motionPlaying}
              className="hero-mode-pill"
              onClick={() => setMotionPlaying((p) => !p)}
              aria-label={
                motionPlaying
                  ? "Switch hero background to still sanctuary photo"
                  : "Switch hero background to living sanctuary video"
              }
            >
              {motionPlaying ? (
                <>
                  <Pause size={11} aria-hidden="true" />
                  <span>Video Reel</span>
                </>
              ) : (
                <>
                  <Play size={11} aria-hidden="true" />
                  <span>Still Frame</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
