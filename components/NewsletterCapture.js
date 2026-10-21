"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
export default function NewsletterCapture() {
  const [message, setMessage] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    if (!email) return;
    try {
      localStorage.setItem("yrpm-newsletter-interest", email);
      setMessage(
        "Saved on this device only. This is not a subscription yet; email updates are not available at this time.",
      );
      e.currentTarget.reset();
    } catch {
      setMessage(
        "Email updates are not available at this time. Please try again later.",
      );
    }
  };
  return (
    <Reveal className="newsletter">
      <div className="container-wide newsletter-inner">
        <div data-reveal data-motion="fade">
          <span className="eyebrow">Stay in the loop</span>
          <h2>Stay close to the altar.</h2>
          <p>
            Weekly reflections, messages and gatherings — when email updates
            become available.
          </p>
        </div>
        <div data-reveal data-motion="fade">
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Your email address"
            />
            <button type="submit" aria-label="Save interest in updates">
              Save interest{" "}
              <ArrowUpRight size={15} style={{ display: "inline" }} />
            </button>
          </form>
          <p className="newsletter-message" role="status">
            {message ||
              "Not a live subscription yet. Your address is saved on your device only."}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
