"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven editorial reveal wrapper.
 * Animates `[data-reveal]` elements with staggered GSAP ScrollTrigger transitions.
 */
export default function Reveal({
  children,
  className = "",
  id,
  as: Tag = "section",
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray("[data-reveal]", root);
      elements.forEach((el, idx) => {
        const effect = el.dataset.motion || "up";
        const fromVars = {
          up: { opacity: 0, y: 48, rotateX: 6 },
          slide: { opacity: 0, x: -56 },
          "slide-right": { opacity: 0, x: 56 },
          scale: { opacity: 0, scale: 0.9, y: 28 },
          rotate: { opacity: 0, y: 40, rotation: -2.5 },
          skew: { opacity: 0, y: 42, skewY: 2.5 },
          mask: {
            clipPath: "inset(0 0 100% 0)",
            opacity: 0,
            y: 26,
          },
          fade: { opacity: 0, y: 20 },
        }[effect] || { opacity: 0, y: 48 };

        // Stagger siblings that share the same parent grid/list
        const parent = el.parentElement;
        const siblings = parent
          ? [...parent.children].filter((child) =>
              child.hasAttribute("data-reveal"),
            )
          : [];
        const siblingIndex = Math.max(0, siblings.indexOf(el));
        const staggerDelay =
          siblings.length > 1 ? Math.min(siblingIndex * 0.11, 0.45) : 0;

        gsap.fromTo(el, fromVars, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          rotateX: 0,
          skewY: 0,
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: effect === "mask" ? 1.05 : 0.9,
          delay: staggerDelay,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: el,
            start: "top 91%",
            end: "bottom 8%",
            toggleActions: "play none none reverse",
          },
        });
        void idx;
      });

      const rules = gsap.utils.toArray(".arch-rule-draw", root);
      rules.forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: rule,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, root);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 220);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} {...props}>
      {children}
    </Tag>
  );
}
