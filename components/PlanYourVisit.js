import Link from "next/link";
import { ArrowUpRight, Compass, Users, Heart, MapPin } from "lucide-react";
import Reveal from "./ui/Reveal";
import VisitorFAQ from "./VisitorFAQ";

const steps = [
  [
    "01",
    "Saturday Morning",
    Compass,
    "Arrive & settle in",
    "Arrive a little early before Sabbath School begins. There is unhurried time to find your seat and prepare your heart before we open the Word.",
  ],
  [
    "02",
    "Every Generation",
    Users,
    "Bring the whole family",
    "Children, youth, and families are welcomed to learn, worship, and grow alongside a warm, multi-generational church family.",
  ],
  [
    "03",
    "Fellowship Together",
    Heart,
    "Stay a little longer",
    "After Divine Service concludes, take time to connect, ask questions about the teaching, and meet the shepherds and members of this house.",
  ],
];

export default function PlanYourVisit() {
  return (
    <Reveal className="visit section-space" id="visit">
      <div className="container-wide">
        <div className="magazine-meta-rail" data-reveal data-motion="fade">
          <span className="folio-tag">Warm Sanctuary Hospitality</span>
          <span className="folio-line arch-rule-draw" aria-hidden="true" />
          <span className="folio-count">Your First Sabbath</span>
        </div>

        <span className="eyebrow" data-reveal>
          Your first Sabbath with us
        </span>
        <h2 className="display section-heading" data-reveal>
          There’s a place for you <em>here.</em>
        </h2>

        <div className="visit-steps">
          {steps.map(([no, code, Icon, title, desc]) => (
            <article className="visit-step arch-step-card" key={no} data-reveal>
              <div className="arch-step-top">
                <span className="number">{no}</span>
                <span className="arch-step-code">{code}</span>
              </div>
              <div className="arch-step-body">
                <span className="arch-step-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="visit-location arch-location-banner" data-reveal data-motion="scale">
          <div className="visit-location-copy">
            <span className="visit-location-badge">
              <MapPin size={15} aria-hidden="true" /> Gather With Us on the Sabbath
            </span>
            <strong>Find your way to the Sabbath gathering</strong>
            <span>
              Yashua Resurrection Power Ministry · Sabbath School 8:00 AM &amp;
              Divine Service 9:00 AM on Saturdays. Please confirm the exact
              location and current service times with the ministry before
              travelling.
            </span>
          </div>
          <Link href="/events" className="round-link light">
            <span className="btn-curtain" aria-hidden="true" />
            <span className="btn-inner">
              <span className="btn-text">View All Gatherings</span>
              <span className="btn-arrow-box" aria-hidden="true">
                <ArrowUpRight className="btn-arrow-primary" size={15} />
                <ArrowUpRight className="btn-arrow-secondary" size={15} />
              </span>
            </span>
          </Link>
        </div>

        <VisitorFAQ />
      </div>
    </Reveal>
  );
}
