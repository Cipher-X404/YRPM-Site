"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(SplitText, ScrollTrigger);

export default function SplitTextReveal({
  children,
  className = "",
  as: Tag = "h1",
  mode = "words",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof SplitText?.create === "function") {
      const split = SplitText.create(el, {
        type: mode,
        wordsClass: "split-word",
        charsClass: "split-character",
      });
      const characters = mode === "chars";
      const targets = characters ? split.chars : split.words;
      const tween = gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: characters ? 28 : 44,
          rotateX: -28,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: characters ? 0.022 : 0.065,
          duration: characters ? 0.72 : 0.92,
          ease: "expo.out",
          delay: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 89%",
            toggleActions: "play none none reverse",
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    }

    const fallback = gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 89%",
          toggleActions: "play none none reverse",
        },
      },
    );
    return () => {
      fallback.scrollTrigger?.kill();
      fallback.kill();
    };
  }, [mode]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
