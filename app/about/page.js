import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CallToAction from "../../components/CallToAction";
import Reveal from "../../components/ui/Reveal";
import VideoBackground from "../../components/ui/VideoBackground";
import CountUp from "../../components/ui/CountUp";

export const metadata = {
  title: "About",
  description:
    "Learn the history, covenant identity, and leadership of Yashua Resurrection Power Ministry INC — founded in 2000, established in 2003, and walking in Seventh-Day Sabbath observance since 2015.",
};

const timeline = [
  ["2000", "Ministry Founded", "A call answered in prayer, fasting, and the proclamation of the living Word."],
  ["2003", "Church Established", "A local body of believers gathered to worship in Spirit and in truth."],
  ["2015", "Sabbath Observance", "The congregation embraced Seventh-Day Sabbath worship in obedience to Scripture."],
  ["Today", "Growing in the Word", "Continuing in Sabbath School, Divine Service, Faith Clinic, and discipleship."],
];

const beliefs = [
  ["01", "The Unadulterated Word", "We hold the Scriptures as our sure foundation — teaching line upon line and precept upon precept."],
  ["02", "Yeshua Hamashiach", "Yeshua is the crucified and risen Messiah, our Saviour, Healer, and the true Head of the Church."],
  ["03", "Seventh-Day Sabbath", "Remembering the seventh day to keep it holy — a weekly covenant appointment for rest, study, and worship."],
  ["04", "The Holy Spirit & Prayer", "We make room for the ministry of the Holy Spirit, fervent intercession, healing, and spiritual renewal."],
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="page-hero">
          <VideoBackground
            poster="/images/about-hero.jpg"
            slides={[
              "/images/about-hero.jpg",
              "/images/apostle-and-evangelist.jpg",
              "/images/worship-congregation-hands.jpg",
            ]}
            alt="Warm light inside the sanctuary"
            caption="Our Sanctuary Story"
            showControls={true}
          />
          <div className="container-wide">
            <span className="eyebrow">Who We Are</span>
            <h1 className="display">
              Rooted in truth. <em>Alive in Spirit.</em>
            </h1>
            <p>
              Yashua Resurrection Power Ministry INC is an Apostolic,
              Spirit-filled, Seventh-Day Sabbath-keeping church committed to the
              unadulterated Word of God and the resurrecting power of Yeshua
              Hamashiach.
            </p>
          </div>
        </section>

        <Reveal className="section-space">
          <div className="container-wide">
            <div className="magazine-meta-rail" data-reveal data-motion="fade">
              <span className="folio-tag">Our Journey of Faith</span>
              <span className="folio-line arch-rule-draw" aria-hidden="true" />
              <span className="folio-count">Founded in 2000</span>
            </div>
            <span className="eyebrow" data-reveal>
              Our Heritage
            </span>
            <h2 className="display section-heading" data-reveal>
              From a calling to a <em>covenant house.</em>
            </h2>
            <div className="timeline">
              {timeline.map(([year, title, text]) => (
                <div className="timeline-item" key={year} data-reveal>
                  <span className="year">
                    {/^\d+$/.test(year) ? (
                      <CountUp value={Number(year)} />
                    ) : (
                      year
                    )}
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="leadership section-space">
          <div className="container-wide lead-grid">
            <div className="lead-photo sanctuary-arch-frame" data-reveal>
              <Image
                src="/images/apostle-and-evangelist.jpg"
                alt="Apostle Polycarp Ukwudiri Samuel and Evangelist Comfort Amarachi Samuel"
                width={900}
                height={1100}
              />
              <div className="lead-caption">
                <small>Shepherds of the House</small>
                <h3>
                  Apostle Polycarp Ukwudiri Samuel &amp; Evangelist Comfort
                  Amarachi Samuel
                </h3>
              </div>
            </div>
            <div className="lead-copy" data-reveal>
              <span className="eyebrow">Leadership &amp; Covering</span>
              <h2 className="display">
                Under the headship of <em>Yeshua.</em>
              </h2>
              <p>
                Apostle Polycarp Ukwudiri Samuel and Evangelist Comfort Amarachi
                Samuel serve this congregation with a shared conviction: this
                house belongs to Yeshua. Leadership is stewardship — feeding the
                flock with sound doctrine, praying with the hurting, and raising
                believers who know the Word for themselves.
              </p>
              <Link href="/sermons" className="round-link">
                <span className="btn-curtain" aria-hidden="true" />
                <span className="btn-inner">
                  <span className="btn-text">Explore Teachings</span>
                  <span className="btn-arrow-box" aria-hidden="true">
                    <ArrowUpRight className="btn-arrow-primary" size={15} />
                    <ArrowUpRight className="btn-arrow-secondary" size={15} />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="section-space" id="beliefs">
          <div className="container-wide">
            <div className="magazine-meta-rail" data-reveal data-motion="fade">
              <span className="folio-tag">Core Doctrines</span>
              <span className="folio-line arch-rule-draw" aria-hidden="true" />
              <span className="folio-count">What We Hold Fast</span>
            </div>
            <span className="eyebrow" data-reveal>
              What We Believe
            </span>
            <h2 className="display section-heading" data-reveal>
              Anchored in <em>Scripture.</em>
            </h2>
            <div className="belief-grid">
              {beliefs.map(([n, title, text]) => (
                <div className="belief-card" key={n} data-reveal>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
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
