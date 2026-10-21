"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/** The real value is present in HTML and for screen readers; counting is visual only. */
export default function CountUp({ value }) {
  const number = useRef(null);
  useEffect(() => {
    if (!number.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = { current: 0 };
    const tween = gsap.to(state, {
      current: value,
      duration: 1.25,
      ease: "power2.out",
      scrollTrigger: { trigger: number.current, start: "top 90%", once: true },
      onStart: () => {
        if (number.current) number.current.textContent = "0";
      },
      onUpdate: () => {
        if (number.current)
          number.current.textContent = String(Math.round(state.current));
      },
      onComplete: () => {
        if (number.current) number.current.textContent = String(value);
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return (
    <span aria-label={String(value)}>
      <span ref={number} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
