import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CallToAction from "../../components/CallToAction";
import Reveal from "../../components/ui/Reveal";
import VideoBackground from "../../components/ui/VideoBackground";

export const metadata = {
  title: "Ministries",
  description:
    "Explore Youth, Women's, Children's, and Evangelism & Outreach ministries at Yashua Resurrection Power Ministry INC.",
};

const items = [
  [
    "youth",
    "Next Generation",
    "Youth Ministry",
    "Raising young men and women who are unashamed of the Word, grounded in identity, and bold in prayer.",
    "youth-ministry.jpg",
  ],
  [
    "women",
    "Daughters of Zion",
    "Women's Ministry",
    "A sisterhood of prayer, wisdom, encouragement, and practical care for homes and communities.",
    "womens-ministry.jpg",
  ],
  [
    "children",
    "Little Lamps",
    "Children's Ministry",
    "Teaching children the stories, commandments, and love of Yeshua in a safe, joyful environment.",
    "childrens-ministry.jpg",
  ],
  [
    "outreach",
    "Compassion in Action",
    "Evangelism & Outreach",
    "Taking the gospel beyond the sanctuary walls through witness, prayer, and acts of service.",
    "community-outreach.jpg",
  ],
];

export default function MinistriesPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="page-hero">
          <VideoBackground
            poster="/images/community-outreach.jpg"
            slides={[
              "/images/community-outreach.jpg",
              "/images/youth-ministry.jpg",
              "/images/womens-ministry.jpg",
            ]}
            alt="Community serving together"
            caption="Fellowship & Service"
            showControls={true}
          />
          <div className="container-wide">
            <span className="eyebrow">Ministries &amp; Fellowships</span>
            <h1 className="display">
              Every generation has a <em>part to play.</em>
            </h1>
            <p>
              From children learning Scripture to adults serving in prayer and
              outreach, find where your gifts can grow.
            </p>
          </div>
        </section>

        <Reveal className="section-space">
          <div className="container-wide">
            <div className="magazine-meta-rail" data-reveal data-motion="fade">
              <span className="folio-tag">Fellowship Arms</span>
              <span className="folio-line arch-rule-draw" aria-hidden="true" />
              <span className="folio-count">Four Ministry Fellowships</span>
            </div>
            <div className="listing-grid">
              {items.map(([id, tag, title, desc, img]) => (
                <article
                  className="listing-card"
                  id={id}
                  key={id}
                  data-reveal
                >
                  <Image
                    src={`/images/${img}`}
                    alt={title}
                    width={800}
                    height={520}
                  />
                  <div className="body">
                    <small>{tag}</small>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <Link
                      className="text-link"
                      href="/events"
                      style={{ marginTop: 18 }}
                    >
                      <span>Join a gathering</span> <ArrowUpRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
