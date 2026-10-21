"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Compass,
  Globe,
  Sparkles,
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const WORDMARK_LEFT = "YASHUA".split("");
const WORDMARK_RIGHT = "POWER".split("");

export default function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const letters = root.querySelectorAll(".wm-char-inner");
      const seal = root.querySelector(".wm-center-seal");
      const cols = root.querySelectorAll(".footer-col");

      gsap.fromTo(
        cols,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        letters,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.0,
          stagger: 0.035,
          ease: "expo.out",
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );

      if (seal) {
        gsap.fromTo(
          seal,
          { scale: 0.65, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: wordmarkRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const onCharEnter = (e) => {
    const target = e.currentTarget.querySelector(".wm-char-inner");
    if (!target) return;
    gsap.to(target, {
      yPercent: -12,
      scale: 1.04,
      duration: 0.28,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const onCharLeave = (e) => {
    const target = e.currentTarget.querySelector(".wm-char-inner");
    if (!target) return;
    gsap.to(target, {
      yPercent: 0,
      scale: 1,
      duration: 0.55,
      ease: "elastic.out(1, 0.5)",
      overwrite: true,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="footer">
      {/* Warm Sanctuary Blessing Bar */}
      <div className="footer-top">
        <div className="container-wide footer-top-inner">
          <div className="footer-top-brand">
            <span className="footer-seal-icon" aria-hidden="true">
              <Sparkles size={15} />
            </span>
            <div>
              <span className="footer-top-kicker">
                A House for His Presence
              </span>
              <strong>Yashua Resurrection Power Ministry INC</strong>
            </div>
          </div>

          <p className="footer-top-verse">
            “For other foundation can no man lay than that is laid, which is
            Yeshua the Messiah.” <span>— 1 Corinthians 3:11</span>
          </p>

          <button
            type="button"
            className="footer-backtop-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to the top of the page"
          >
            <span>Back to Top</span>
            <span className="footer-backtop-icon" aria-hidden="true">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>

      {/* Main 4-Column Sanctuary Directory */}
      <div className="footer-body">
        <div className="container-wide">
          <div className="footer-grid">
            <div className="footer-col">
              <span className="footer-label">Our Sanctuary</span>
              <ul className="footer-nav-list">
                <li>
                  <Link href="/">
                    <span>Home</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span>Our Story &amp; Shepherds</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/sermons">
                    <span>Sermons &amp; Bible Studies</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/ministries">
                    <span>Ministries &amp; Fellowships</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/events">
                    <span>Sacred Gatherings</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/give">
                    <span>Stewardship &amp; Giving</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <span className="footer-label">Featured Teachings</span>
              <ul className="footer-nav-list">
                <li>
                  <Link href="/sermons/divine-service/the-unshakable-foundation">
                    <span>The Unshakable Foundation</span>
                    <small>Sermon</small>
                  </Link>
                </li>
                <li>
                  <Link href="/sermons/divine-service/tarrying-for-the-latter-rain">
                    <span>Tarrying for the Latter Rain</span>
                    <small>Sermon</small>
                  </Link>
                </li>
                <li>
                  <Link href="/sermons/sabbath-school/the-fourth-commandment">
                    <span>The Fourth Commandment</span>
                    <small>Study</small>
                  </Link>
                </li>
                <li>
                  <Link href="/sermons/sabbath-school/rooted-in-the-word">
                    <span>Rooted in the Word</span>
                    <small>Study</small>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <span className="footer-label">Weekly Gatherings</span>
              <ul className="footer-schedule-list">
                <li>
                  <strong>Sabbath School</strong>
                  <span>Saturday · 8:00 AM – 9:00 AM</span>
                </li>
                <li>
                  <strong>Divine Service</strong>
                  <span>Saturday · 9:00 AM</span>
                </li>
                <li>
                  <strong>Faith Clinic</strong>
                  <span>Thursday · 9:00 AM – 12:00 PM</span>
                </li>
                <li>
                  <strong>Bible Study</strong>
                  <span>Tuesday · 4:00 PM – 6:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="footer-col footer-col-cta">
              <span className="footer-label">Worship With Us</span>
              <p className="footer-message">
                A table prepared
                <br />
                <em>in the living Word.</em>
              </p>
              <p className="footer-subcopy">
                A Seventh-Day Sabbath-keeping church family rooted in Scripture,
                prayer, and the resurrection power of Yeshua.
              </p>
              <Link className="round-link light" href="/#visit">
                <span className="btn-curtain" aria-hidden="true" />
                <span className="btn-inner">
                  <span className="btn-text">Plan Your Visit</span>
                  <span className="btn-arrow-box" aria-hidden="true">
                    <ArrowUpRight className="btn-arrow-primary" size={15} />
                    <ArrowUpRight className="btn-arrow-secondary" size={15} />
                  </span>
                </span>
              </Link>
              <div className="footer-socials" aria-label="Quick sanctuary links">
                <Link
                  href="/sermons"
                  aria-label="Explore messages"
                  title="Messages & Teaching"
                >
                  <BookOpen size={16} />
                </Link>
                <Link
                  href="/events"
                  aria-label="Explore gatherings"
                  title="Gatherings & Calendar"
                >
                  <CalendarDays size={16} />
                </Link>
                <Link
                  href="/about"
                  aria-label="Learn about us"
                  title="Our Story"
                >
                  <Globe size={16} />
                </Link>
                <Link
                  href="/#visit"
                  aria-label="First Sabbath guide"
                  title="Plan a Visit"
                >
                  <Compass size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sanctuary Wordmark Monument — maintains "YASHUA POWER" with a sacred arched cross emblem */}
          <div
            ref={wordmarkRef}
            className="footer-wordmark-monument"
            aria-label="Yashua Resurrection Power Ministry wordmark"
          >
            <div className="wm-ruler" aria-hidden="true">
              <span>Founded in Faith · 2000</span>
              <span className="wm-ruler-ticks" />
              <span>Seventh-Day Sabbath Sanctuary</span>
            </div>

            <div className="footer-wordmark" aria-hidden="true">
              <span className="wm-word wm-word-solid">
                {WORDMARK_LEFT.map((ch, idx) => (
                  <span
                    key={`l-${idx}`}
                    className="wm-char"
                    onMouseEnter={onCharEnter}
                    onMouseLeave={onCharLeave}
                  >
                    <span className="wm-char-inner" data-char={ch}>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>

              <span className="wm-center-seal">
                <svg viewBox="0 0 56 60" fill="none">
                  <path
                    d="M8 54V28C8 15.8497 16.9543 6 28 6C39.0457 6 48 15.8497 48 28V54H8Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M28 16V44M18 26H38"
                    stroke="var(--obsidian-accent)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="wm-word wm-word-outline">
                {WORDMARK_RIGHT.map((ch, idx) => (
                  <span
                    key={`r-${idx}`}
                    className="wm-char"
                    onMouseEnter={onCharEnter}
                    onMouseLeave={onCharLeave}
                  >
                    <span className="wm-char-inner" data-char={ch}>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            </div>

            <div className="wm-subbanner" aria-hidden="true">
              <span>Yashua Resurrection Power Ministry INC</span>
              <span>·</span>
              <span>Apostolic · Spirit-Filled · Sabbath-Keeping</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Yashua Resurrection Power Ministry
              INC. All rights reserved.
            </span>
            <span>Yeshua Hamashiach · The eternal head of this house</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
