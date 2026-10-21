"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import {
  ChevronDown,
  X,
  ArrowUpRight,
  Sun,
  Moon,
  Sparkles,
  Calendar,
  BookOpen,
} from "lucide-react";

const YASHUA_LETTERS = "YASHUA".split("");

const PRIMARY_LINKS = [
  { href: "/about", label: "Our Story", note: "Heritage, Beliefs & Shepherds" },
  { href: "/sermons", label: "Sermons", note: "Sabbath Messages & Studies" },
  {
    href: "/ministries",
    label: "Ministries",
    note: "Youth, Women, Children & Outreach",
    hasDropdown: true,
  },
  { href: "/events", label: "Gatherings", note: "Sabbath & Midweek Schedule" },
  { href: "/give", label: "Giving", note: "Cheerful Stewardship" },
];

const MINISTRY_FELLOWSHIPS = [
  { href: "/ministries#youth", label: "Youth Ministry" },
  { href: "/ministries#women", label: "Women's Ministry" },
  { href: "/ministries#children", label: "Children's Ministry" },
  { href: "/ministries#outreach", label: "Evangelism & Outreach" },
];

function applyDocumentTheme(nextTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;
  if (document.body) {
    document.body.dataset.theme = nextTheme;
  }
  try {
    window.localStorage.setItem("yrpm:theme", nextTheme);
  } catch {}
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const brandRef = useRef(null);
  const dropRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    let initial = root.dataset.theme;
    try {
      const saved = window.localStorage.getItem("yrpm:theme");
      if (saved === "dark" || saved === "light") {
        initial = saved;
      } else if (!initial) {
        initial = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
          ? "dark"
          : "light";
      }
    } catch {
      initial = initial || "light";
    }
    if (initial !== "dark" && initial !== "light") initial = "light";
    setTheme(initial);
    applyDocumentTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyDocumentTheme(next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setDropOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDocDown = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    if (drawerOpen && drawerRef.current) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reduced) {
        gsap.fromTo(
          drawerRef.current.querySelectorAll(".drawer-stagger-item"),
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.04,
            ease: "power3.out",
            overwrite: true,
          },
        );
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Bespoke GSAP Architectural Sanctuary Brandmark Animation (NO shimmer)
  useEffect(() => {
    if (!brandRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const seal = brandRef.current.querySelector(".brand-monogram-seal");
      const chars = brandRef.current.querySelectorAll(".brand-char");
      const meta = brandRef.current.querySelector(".brand-wordmark-right");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (seal) {
        tl.fromTo(
          seal,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7 },
          0,
        );
      }
      if (chars.length) {
        tl.fromTo(
          chars,
          { yPercent: 85, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.035,
          },
          0.08,
        );
      }
      if (meta) {
        tl.fromTo(
          meta,
          { x: -8, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6 },
          0.22,
        );
      }
    }, brandRef);

    return () => ctx.revert();
  }, []);

  const handleBrandEnter = () => {
    if (!brandRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = brandRef.current.querySelectorAll(".brand-char");
    const crownDot = brandRef.current.querySelector(".brand-crown-dot");

    gsap.to(chars, {
      yPercent: -8,
      duration: 0.2,
      stagger: { each: 0.024, yoyo: true, repeat: 1 },
      ease: "sine.inOut",
      overwrite: true,
    });
    if (crownDot) {
      gsap.to(crownDot, {
        scale: 1.35,
        transformOrigin: "50% 50%",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        overwrite: true,
      });
    }
  };

  const isDark = theme === "dark";

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container-wide nav-inner">
          {/* Architectural Sanctuary Crest & Church Name Brandmark */}
          <Link
            ref={brandRef}
            href="/"
            className="brand brand-wordmark-logo"
            aria-label="Yashua Resurrection Power Ministry INC — Home"
            onMouseEnter={handleBrandEnter}
          >
            <span className="brand-monogram-seal" aria-hidden="true">
              <svg viewBox="0 0 44 46" fill="none" className="brand-seal-svg">
                {/* Outer Cathedral Arch */}
                <path
                  className="brand-arch-frame"
                  d="M7 40V22C7 13.1634 13.7157 6 22 6C30.2843 6 37 13.1634 37 22V40H7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {/* Inner Sanctuary Arch */}
                <path
                  className="brand-inner-arch"
                  d="M12.5 36.5V22.5C12.5 16.701 16.7533 12 22 12C27.2467 12 31.5 16.701 31.5 22.5V36.5"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                />
                {/* Sanctuary Cross of Yeshua */}
                <path
                  className="brand-cross-stem"
                  d="M22 15.5V34.5M15.5 22.5H28.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                {/* Keystone Star */}
                <circle
                  className="brand-crown-dot"
                  cx="22"
                  cy="3"
                  r="1.8"
                />
              </svg>
            </span>

            <span className="brand-wordmark-lockup">
              <span className="brand-yashua-chars" aria-label="Yashua">
                {YASHUA_LETTERS.map((ch, idx) => (
                  <span key={idx} className="brand-char-mask">
                    <span
                      className={`brand-char ${idx === 0 ? "brand-char-initial" : ""}`}
                    >
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              <span className="brand-lockup-divider" aria-hidden="true" />
              <span className="brand-wordmark-right">
                <span className="brand-sub-primary">Resurrection Power</span>
                <span className="brand-sub-secondary">
                  Ministry INC · Sabbath
                </span>
              </span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="nav-links" aria-label="Primary navigation">
            {PRIMARY_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.href}
                    ref={dropRef}
                    className="nav-drop"
                    onMouseEnter={() => setDropOpen(true)}
                    onMouseLeave={() => setDropOpen(false)}
                  >
                    <button
                      type="button"
                      className={`nav-arch-link nav-drop-trigger ${isActive ? "active" : ""}`}
                      aria-expanded={dropOpen}
                      aria-haspopup="true"
                      aria-controls="ministries-menu"
                      onClick={() => setDropOpen((o) => !o)}
                    >
                      <span className="nav-arch-label">{item.label}</span>
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`nav-drop-chevron ${dropOpen ? "rotate" : ""}`}
                      />
                    </button>

                    {dropOpen && (
                      <div className="nav-drop-bridge">
                        <div
                          id="ministries-menu"
                          role="menu"
                          className="nav-drop-panel open"
                        >
                          <div className="nav-drop-header">
                            <span>Fellowship &amp; Service</span>
                          </div>
                          {MINISTRY_FELLOWSHIPS.map((m) => (
                            <Link
                              key={m.href}
                              href={m.href}
                              role="menuitem"
                              onClick={() => setDropOpen(false)}
                            >
                              <span>{m.label}</span>
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </Link>
                          ))}
                          <Link
                            href="/ministries"
                            role="menuitem"
                            className="nav-drop-all"
                            onClick={() => setDropOpen(false)}
                          >
                            <span>View All Ministries</span>
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-arch-link ${isActive ? "active" : ""}`}
                >
                  <span className="nav-arch-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Theme Switch, Plan Visit CTA, and Menu Drawer Trigger */}
          <div className="nav-actions">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              className={`theme-switch-btn ${isDark ? "is-dark" : "is-light"}`}
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? "Switch to Warm Linen light mode"
                  : "Switch to Midnight Obsidian dark mode"
              }
              title={
                isDark
                  ? "Switch to Warm Linen (Light Mode)"
                  : "Switch to Midnight Obsidian (Dark Mode)"
              }
            >
              <span className="switch-track" aria-hidden="true">
                <span className="switch-track-icon switch-icon-sun">
                  <Sun size={12} />
                </span>
                <span className="switch-track-icon switch-icon-moon">
                  <Moon size={12} />
                </span>
                <span className="switch-thumb" />
              </span>
              <span className="theme-switch-label">
                {isDark ? "Night" : "Light"}
              </span>
            </button>

            <Link href="/#visit" className="round-link light nav-cta">
              <span className="btn-curtain" aria-hidden="true" />
              <span className="btn-inner">
                <span className="btn-text">Plan a Visit</span>
                <span className="btn-arrow-box" aria-hidden="true">
                  <ArrowUpRight className="btn-arrow-primary" size={14} />
                  <ArrowUpRight className="btn-arrow-secondary" size={14} />
                </span>
              </span>
            </Link>

            <button
              type="button"
              className={`nav-menu-trigger ${drawerOpen ? "is-open" : ""}`}
              aria-label={
                drawerOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={drawerOpen}
              aria-controls="architectural-nav-drawer"
              onClick={() => setDrawerOpen((o) => !o)}
            >
              <span className="menu-bars-icon" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="menu-trigger-label">
                {drawerOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Scrim & Sanctuary Navigation Drawer */}
      {drawerOpen && (
        <>
          <div
            className="nav-drawer-scrim open"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
          />

          <aside
            id="architectural-nav-drawer"
            ref={drawerRef}
            className="mobile-drawer open"
            aria-label="Sanctuary navigation drawer"
          >
            <div className="drawer-top-bar">
              <div className="drawer-kicker">
                <Sparkles size={14} aria-hidden="true" />
                <span>Welcome to the Sanctuary</span>
              </div>

              <div className="drawer-top-actions">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDark}
                  className={`theme-switch-btn drawer-theme-btn ${isDark ? "is-dark" : "is-light"}`}
                  onClick={toggleTheme}
                >
                  <span className="switch-track" aria-hidden="true">
                    <span className="switch-track-icon switch-icon-sun">
                      <Sun size={12} />
                    </span>
                    <span className="switch-track-icon switch-icon-moon">
                      <Moon size={12} />
                    </span>
                    <span className="switch-thumb" />
                  </span>
                  <span>{isDark ? "Night Mode" : "Warm Light"}</span>
                </button>

                <button
                  type="button"
                  className="mobile-close"
                  aria-label="Close navigation menu"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X size={20} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            <div className="drawer-grid">
              <nav
                className="drawer-primary-links"
                aria-label="Full site directory"
              >
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className={`drawer-link-row drawer-stagger-item ${pathname === "/" ? "active" : ""}`}
                >
                  <span className="drawer-link-title">Sanctuary Home</span>
                  <span className="drawer-link-sub">
                    Welcome, Sabbath Rhythm &amp; Featured Word
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>

                {PRIMARY_LINKS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`drawer-link-row drawer-stagger-item ${isActive ? "active" : ""}`}
                    >
                      <span className="drawer-link-title">{item.label}</span>
                      <span className="drawer-link-sub">{item.note}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>

              <div className="drawer-fellowships-box drawer-stagger-item">
                <span className="drawer-box-label">Fellowship Ministries</span>
                <div className="drawer-fellowship-pills">
                  {MINISTRY_FELLOWSHIPS.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer-bar drawer-stagger-item">
              <div className="drawer-sabbath-meta">
                <strong>
                  <Calendar
                    size={13}
                    aria-hidden="true"
                    style={{ display: "inline", marginRight: 6 }}
                  />
                  Seventh-Day Sabbath Gatherings
                </strong>
                <span>
                  Saturday · Sabbath School 8:00 AM · Divine Service 9:00 AM
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href="/#visit"
                  onClick={() => setDrawerOpen(false)}
                  className="round-link light"
                >
                  <span className="btn-curtain" aria-hidden="true" />
                  <span className="btn-inner">
                    <span className="btn-text">Plan Your Visit</span>
                    <span className="btn-arrow-box" aria-hidden="true">
                      <ArrowUpRight className="btn-arrow-primary" size={14} />
                      <ArrowUpRight className="btn-arrow-secondary" size={14} />
                    </span>
                  </span>
                </Link>
                <Link
                  href="/sermons"
                  onClick={() => setDrawerOpen(false)}
                  className="round-link outline"
                  style={{
                    color: "var(--text-primary)",
                    borderColor: "var(--line-strong)",
                  }}
                >
                  <BookOpen size={15} aria-hidden="true" />
                  <span>Messages</span>
                </Link>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
