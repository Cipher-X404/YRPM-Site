"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import VideoBackground from "./ui/VideoBackground";

export default function AboutPreview() {
  const cursor = useRef(null);
  const area = useRef(null);

  useEffect(() => {
    const section = area.current?.closest(".about-preview");
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(".background-media"),
        { yPercent: -6, scale: 1.1 },
        {
          yPercent: 6,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.fromTo(
        ".about-aside .rule",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-aside", start: "top 85%" },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const move = (e) => {
    if (e.pointerType !== "mouse" || !cursor.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(cursor.current, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      autoAlpha: 1,
      duration: 0.22,
      overwrite: true,
    });
  };
  const leave = () => {
    if (cursor.current)
      gsap.to(cursor.current, { autoAlpha: 0, duration: 0.25 });
  };

  return (
    <Reveal
      className="about-preview grain"
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div ref={cursor} className="about-cursor" aria-hidden="true">
        Our Story ↗
      </div>

      <VideoBackground
        poster="/images/worship-banner.jpg"
        slides={[
          "/images/worship-banner.jpg",
          "/images/covenant-prayer.jpg",
          "/images/open-bible-cross.jpg",
        ]}
        alt="Worship gathering at Yashua Resurrection Power Ministry"
        caption="Sanctuary Worship"
        showControls={true}
      />

      <div ref={area} className="container-wide about-content">
        <div className="about-folio-rail" data-reveal data-motion="fade">
          <span>Our Heritage &amp; Calling</span>
          <span>Established in Faith Since 2000 · Seventh-Day Sabbath</span>
        </div>

        <div>
          <span className="eyebrow about-eyebrow" data-reveal>
            Who we are
          </span>
          <h2 className="display about-title" data-reveal data-motion="mask">
            <span>Yashua.</span>
            <span className="outline-text">Resurrection.</span>
            <span>Power.</span>
            <span className="about-title-accent">Ministry.</span>
          </h2>
        </div>

        <div className="about-aside" data-reveal data-motion="up">
          <div className="rule" />
          <p className="magazine-lead">
            A community rooted in the resurrection power of Yeshua — gathering
            every Seventh-Day Sabbath to encounter the living God, be shaped by
            unadulterated Scripture, and carry His compassion into the world.
          </p>
          <div className="about-stat-strip">
            <div>
              <strong>2000</strong>
              <span>The Ministry Began</span>
            </div>
            <div>
              <strong>2003</strong>
              <span>Established as a Church</span>
            </div>
            <div>
              <strong>2015</strong>
              <span>Sabbath Observance</span>
            </div>
          </div>
          <Link className="round-link light" href="/about">
            <span className="btn-curtain" aria-hidden="true" />
            <span className="btn-inner">
              <span className="btn-text">Discover Our Story</span>
              <span className="btn-arrow-box" aria-hidden="true">
                <ArrowUpRight className="btn-arrow-primary" size={15} />
                <ArrowUpRight className="btn-arrow-secondary" size={15} />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
