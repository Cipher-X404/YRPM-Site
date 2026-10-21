"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import VideoBackground from "./ui/VideoBackground";
import MarqueeStrip from "./ui/MarqueeStrip";

export default function LiveStreamBanner() {
  const content = useRef(null);

  useEffect(() => {
    const section = content.current?.closest(".live-banner");
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
            scrub: 1.2,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <Reveal className="live-banner grain">
      <VideoBackground
        poster="/images/worship-congregation-hands.jpg"
        slides={[
          "/images/worship-congregation-hands.jpg",
          "/images/divine-service.jpg",
          "/images/sabbath-school.jpg",
        ]}
        alt="Congregation worshipping together"
        caption="Sanctuary Fellowship"
        showControls={true}
      />
      <div ref={content} className="content" data-reveal data-motion="mask">
        <span className="eyebrow live-eyebrow">
          Gather with us, wherever you are
        </span>
        <h2 className="display">
          Can’t make it in person?
          <br />
          <em>Stay in the Word.</em>
        </h2>
        <p>
          Study the expository messages, Sabbath School outlines, and scriptural
          teachings that anchor our community week by week.
        </p>
        <div className="buttons">
          <Link className="round-link light" href="/sermons">
            <span className="btn-curtain" aria-hidden="true" />
            <span className="btn-inner">
              <span className="btn-text">Explore Messages</span>
              <span className="btn-arrow-box" aria-hidden="true">
                <ArrowUpRight className="btn-arrow-primary" size={15} />
                <ArrowUpRight className="btn-arrow-secondary" size={15} />
              </span>
            </span>
          </Link>
          <Link className="round-link outline" href="/events">
            <span>See Gathering Times</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <MarqueeStrip />
    </Reveal>
  );
}
