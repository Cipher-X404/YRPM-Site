"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

export default function MagneticButton({
  href,
  children,
  className = "round-link",
  onClick,
}) {
  const ref = useRef(null);
  const labelRef = useRef(null);
  const tween = useRef(null);
  const labelTween = useRef(null);

  const move = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);

    tween.current?.kill();
    tween.current = gsap.to(ref.current, {
      x: dx * 0.22,
      y: dy * 0.26,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
    if (labelRef.current) {
      labelTween.current?.kill();
      labelTween.current = gsap.to(labelRef.current, {
        x: dx * 0.08,
        y: dy * 0.1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const reset = () => {
    if (!ref.current) return;
    tween.current?.kill();
    tween.current = gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: true,
    });
    if (labelRef.current) {
      labelTween.current?.kill();
      labelTween.current = gsap.to(labelRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        overwrite: true,
      });
    }
  };

  useEffect(
    () => () => {
      tween.current?.kill();
      labelTween.current?.kill();
    },
    [],
  );

  return (
    <Link
      href={href}
      ref={ref}
      className={`${className} magnetic-btn`}
      onPointerMove={move}
      onPointerLeave={reset}
      onClick={onClick}
    >
      <span className="btn-curtain" aria-hidden="true" />
      <span ref={labelRef} className="btn-inner">
        <span className="btn-text">{children}</span>
        <span className="btn-arrow-box" aria-hidden="true">
          <ArrowUpRight className="btn-arrow-primary" size={15} />
          <ArrowUpRight className="btn-arrow-secondary" size={15} />
        </span>
      </span>
    </Link>
  );
}
