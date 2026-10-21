import Link from "next/link";
import { ArrowUpRight, BookMarked } from "lucide-react";
import Reveal from "./ui/Reveal";

const passages = [
  {
    no: "Promise of Healing",
    theme: "Restoration",
    quote: "“He heals the brokenhearted and binds up their wounds.”",
    ref: "Psalm 147:3",
    note: "Prayed over families at Thursday Faith Clinic",
  },
  {
    no: "Promise of New Life",
    theme: "Regeneration",
    quote:
      "“Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.”",
    ref: "2 Corinthians 5:17",
    note: "The covenant hope of resurrection life",
  },
  {
    no: "Promise of Freedom",
    theme: "Liberty",
    quote:
      "“Now the Lord is the Spirit; and where the Spirit of the Lord is, there is liberty.”",
    ref: "2 Corinthians 3:17",
    note: "Deliverance through the living Word",
  },
];

export default function TestimonialWall() {
  return (
    <Reveal className="testimony section-space">
      <div className="container-wide">
        <div className="magazine-meta-rail" data-reveal data-motion="fade">
          <span className="folio-tag">Promises of Holy Scripture</span>
          <span className="folio-line arch-rule-draw" aria-hidden="true" />
          <span className="folio-count">The Living Witness</span>
        </div>

        <div className="testimony-header-grid">
          <div>
            <span className="eyebrow" data-reveal>
              Hope for every story
            </span>
            <h2 className="display" data-reveal>
              What God <em>can do.</em>
            </h2>
          </div>
          <p className="testimony-intro" data-reveal data-motion="slide">
            We believe in healing, deliverance, and lives made new. Rather than
            invent stories or put words in anyone’s mouth, we let the enduring
            promises of Scripture stand here as our witness.
          </p>
        </div>

        <div className="testimony-grid">
          {passages.map((item, i) => (
            <article
              key={item.ref}
              className={`testimony-card arch-scripture-card ${i === 1 ? "featured" : ""}`}
              data-reveal
              data-motion="up"
            >
              <div className="arch-scripture-card-top">
                <span className="arch-witness-no">{item.no}</span>
                <span className="arch-witness-theme">{item.theme}</span>
              </div>
              <div className="arch-scripture-card-quote">
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                <p>{item.quote}</p>
              </div>
              <div className="arch-scripture-card-foot">
                <div>
                  <small>{item.ref}</small>
                  <span className="arch-witness-note">{item.note}</span>
                </div>
                <BookMarked size={16} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>

        <Link className="text-link" href="/about#beliefs">
          <span>Explore what we believe</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </Reveal>
  );
}
