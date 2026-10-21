"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function ParallaxImage({
  src,
  alt,
  className = "",
  priority = false,
}) {
  const wrap = useRef(null),
    image = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(
      () =>
        gsap.fromTo(
          image.current,
          { yPercent: -5, scale: 1.1 },
          {
            yPercent: 5,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        ),
      wrap,
    );
    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={wrap}
      className={`parallax-media-wrap ${className}`.trim()}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    >
      <div
        ref={image}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "inherit",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          style={{ objectFit: "cover", borderRadius: "inherit" }}
        />
      </div>
    </div>
  );
}
