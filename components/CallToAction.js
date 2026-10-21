"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Reveal from "./ui/Reveal";
import SplitTextReveal from "./ui/SplitTextReveal";
gsap.registerPlugin(
  ScrollTrigger,
  MorphSVGPlugin,
  MotionPathPlugin,
  DrawSVGPlugin,
  Draggable,
  InertiaPlugin,
);

export default function CallToAction() {
  const blob = useRef(null);
  const orbit = useRef(null);
  const spark = useRef(null);
  const draggableLight = useRef(null);
  const art = useRef(null);

  useEffect(() => {
    const section = blob.current?.closest(".final-cta");
    if (!section) return;
    const ctx = gsap.context(() => {
      const loop = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
      loop
        .to(blob.current, {
          morphSVG:
            "M50 8 C83 2 104 32 91 61 C83 92 49 107 22 83 C-4 60 17 17 50 8Z",
          duration: 3.4,
          ease: "sine.inOut",
        })
        .to(blob.current, { fill: "#3B5848", duration: 3.4 }, 0)
        .to(section, { backgroundPosition: "100% 50%", duration: 3.4 }, 0)
        .to(
          draggableLight.current,
          {
            borderRadius: "36% 64% 58% 42%",
            boxShadow: "0 0 45px #C85A32aa",
            duration: 3.4,
          },
          0,
        );
      const orbitMotion = gsap.to(spark.current, {
        motionPath: {
          path: orbit.current,
          align: orbit.current,
          alignOrigin: [0.5, 0.5],
        },
        duration: 12,
        ease: "none",
        repeat: -1,
        paused: true,
      });
      const draw = gsap.fromTo(
        orbit.current,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 2,
          ease: "power2.inOut",
          paused: true,
          onComplete: () => orbitMotion.play(),
        },
      );
      ScrollTrigger.create({
        trigger: section,
        start: "top 82%",
        end: "bottom top",
        onEnter: () => {
          loop.play();
          draw.play();
        },
        onEnterBack: () => {
          loop.play();
          if (draw.progress() < 1) draw.play();
          else orbitMotion.play();
        },
        onLeave: () => {
          loop.pause();
          orbitMotion.pause();
          draw.pause();
        },
        onLeaveBack: () => {
          loop.pause();
          orbitMotion.pause();
          draw.pause();
        },
      });
      const drag = Draggable.create(draggableLight.current, {
        type: "x,y",
        bounds: art.current,
        inertia: true,
        edgeResistance: 0.82,
        onDragEnd() {
          if (this.isThrowing) return;
          gsap.to(this.target, {
            x: 0,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,.4)",
          });
        },
        onThrowComplete() {
          gsap.to(this.target, {
            x: 0,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,.4)",
          });
        },
      });
      return () => {
        drag.forEach((d) => d.kill());
        loop.kill();
        draw.kill();
        orbitMotion.kill();
      };
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <Reveal className="final-cta">
      <svg className="cta-blob" viewBox="0 0 100 100" aria-hidden="true">
        <path
          ref={blob}
          d="M50 12 C73 4 95 21 93 49 C92 77 73 96 47 91 C21 87 6 70 11 43 C16 20 28 17 50 12Z"
          fill="#C85A32"
        />
      </svg>
      <div ref={art} className="cta-interactive" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="cta-orbit-art">
          <path
            ref={orbit}
            d="M50 5 A45 45 0 1 1 49.99 5"
            fill="none"
            stroke="#E07A5F"
            strokeWidth="0.5"
          />
          <circle ref={spark} r="2.5" fill="#E07A5F" />
        </svg>
        <span
          ref={draggableLight}
          className="cta-drag-light"
          onPointerEnter={() => {
            if (!draggableLight.current) return;
            gsap.fromTo(
              draggableLight.current,
              { rotation: -7 },
              {
                rotation: 7,
                duration: 0.12,
                yoyo: true,
                repeat: 3,
                overwrite: "auto",
                onComplete: () =>
                  gsap.to(draggableLight.current, {
                    rotation: 0,
                    duration: 0.2,
                  }),
              },
            );
          }}
        />
      </div>
      <div className="container-wide">
        <span
          className="eyebrow cta-eyebrow"
          data-reveal
          data-motion="fade"
        >
          The doors of the sanctuary are open
        </span>
        <SplitTextReveal as="h2" mode="chars" className="display">
          Come unto Me, all ye that <em>labour.</em>
        </SplitTextReveal>
        <p data-reveal data-motion="fade">
          Whatever your season, there is room at the table of the Word to meet
          the living God. Join us this Saturday for Sabbath School and Divine
          Service, or study the messages wherever you are.
        </p>
        <div className="buttons" data-reveal data-motion="scale">
          <Link className="round-link light" href="/#visit">
            <span className="btn-curtain" aria-hidden="true" />
            <span className="btn-inner">
              <span className="btn-text">Plan Your Sabbath Visit</span>
              <span className="btn-arrow-box" aria-hidden="true">
                <ArrowUpRight className="btn-arrow-primary" size={15} />
                <ArrowUpRight className="btn-arrow-secondary" size={15} />
              </span>
            </span>
          </Link>
          <Link className="round-link outline" href="/sermons">
            <span>Explore Messages</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
