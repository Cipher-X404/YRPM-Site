import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import ParallaxImage from "./ui/ParallaxImage";

export default function LeadershipSpread() {
  return (
    <Reveal className="leadership section-space">
      <div className="container-wide">
        <div className="magazine-meta-rail" data-reveal data-motion="fade">
          <span className="folio-tag">Pastoral Care &amp; Shepherding</span>
          <span className="folio-line arch-rule-draw" aria-hidden="true" />
          <span className="folio-count">Serving the Sanctuary</span>
        </div>

        <div className="lead-grid">
          <div className="lead-copy" data-reveal data-motion="skew">
            <span className="eyebrow">The altar &amp; the word</span>
            <h2 className="display">
              An altar owned by Yeshua. <em>Held with care.</em>
            </h2>
            <p className="magazine-dropcap">
              What began as a ministry in 2000 took root as an established
              church in 2003. In 2015, the community embraced Seventh-Day
              Sabbath observance. Through every season, the calling remains the
              same: proclaim the Word, make room for the Spirit, and point
              people to Yeshua Hamashiach.
            </p>
            <div className="lead-facts">
              <div className="arch-fact-card">
                <span className="arch-fact-tag">Our Beginning</span>
                <b>2000</b>
                <span>The ministry began in prayer and proclamation</span>
              </div>
              <div className="arch-fact-card">
                <span className="arch-fact-tag">Sabbath Covenant</span>
                <b>2015</b>
                <span>A return to Seventh-Day Sabbath observance</span>
              </div>
            </div>
            <Link href="/about" className="round-link">
              <span className="btn-curtain" aria-hidden="true" />
              <span className="btn-inner">
                <span className="btn-text">Read Our Story</span>
                <span className="btn-arrow-box" aria-hidden="true">
                  <ArrowUpRight className="btn-arrow-primary" size={15} />
                  <ArrowUpRight className="btn-arrow-secondary" size={15} />
                </span>
              </span>
            </Link>
          </div>

          <div className="lead-photo arch-photo-monolith sanctuary-arch-frame" data-reveal data-motion="mask">
            <ParallaxImage
              src="/images/apostle-and-evangelist.jpg"
              alt="Apostle Polycarp Ukwudiri Samuel and Evangelist Comfort Amarachi Samuel"
              className="h-full w-full"
            />
            <div className="lead-caption">
              <small>Shepherds of the House</small>
              <h3>
                Apostle Polycarp &amp;
                <br />
                Evangelist Comfort Samuel
              </h3>
              <span className="lead-caption-note">
                Serving under Yeshua Hamashiach, the eternal head of this house
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
