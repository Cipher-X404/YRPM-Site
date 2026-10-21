import Link from "next/link";
import { ArrowUpRight, HeartHandshake, BookOpen, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/ui/Reveal";
import VideoBackground from "../../components/ui/VideoBackground";

export const metadata = {
  title: "Giving",
  description:
    "Cheerful, transparent stewardship at Yashua Resurrection Power Ministry INC — supporting the Word, outreach, and the care of the sanctuary.",
};

const principles = [
  [
    HeartHandshake,
    "Cheerful & Voluntary",
    "“So let each one give as he purposes in his heart, not grudgingly or of necessity; for God loves a cheerful giver.” — 2 Corinthians 9:7",
  ],
  [
    BookOpen,
    "For the Work of the Ministry",
    "Offerings support the teaching of the Word, care for the sanctuary, and practical outreach to families and neighbours.",
  ],
  [
    ShieldCheck,
    "Direct & Verified Only",
    "We never publish unverified account numbers online. Giving is received in person during gatherings or through verified channels shared directly by church leadership.",
  ],
];

export default function GivePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="page-hero">
          <VideoBackground
            poster="/images/giving-hands.jpg"
            slides={[
              "/images/giving-hands.jpg",
              "/images/worship-congregation-hands.jpg",
            ]}
            alt="Warm light and open hands"
            caption="Faithful Stewardship"
            showControls={true}
          />
          <div className="container-wide">
            <span className="eyebrow">Stewardship &amp; Giving</span>
            <h1 className="display">
              Honouring the Lord with <em>gladness.</em>
            </h1>
            <p>
              Giving at Yashua Resurrection Power Ministry is an act of worship,
              gratitude, and partnership in the proclamation of the gospel.
            </p>
          </div>
        </section>

        <Reveal className="section-space">
          <div className="container-wide">
            <div className="magazine-meta-rail" data-reveal data-motion="fade">
              <span className="folio-tag">Covenant Stewardship</span>
              <span className="folio-line arch-rule-draw" aria-hidden="true" />
              <span className="folio-count">2 Corinthians 9:7</span>
            </div>
            <span className="eyebrow" data-reveal>
              Our Approach to Stewardship
            </span>
            <h2 className="display section-heading" data-reveal>
              Simple, scriptural, <em>and honest.</em>
            </h2>

            <div className="ministry-grid">
              {principles.map(([Icon, title, text]) => (
                <article className="ministry-card" key={title} data-reveal>
                  <div className="ministry-card-icon">
                    <Icon />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>

            <div className="giving-note" data-reveal>
              To give a tithe, offering, or seed, please join us at a Sabbath or
              midweek gathering, or speak directly with the ministry stewards at
              the sanctuary so you receive verified details in person.{" "}
              <Link
                className="text-link"
                href="/events"
                style={{ marginLeft: 8 }}
              >
                <span>See gathering times</span> <ArrowUpRight />
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
