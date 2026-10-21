import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CallToAction from "../../components/CallToAction";
import Reveal from "../../components/ui/Reveal";
import VideoBackground from "../../components/ui/VideoBackground";

export const metadata = {
  title: "Gatherings",
  description:
    "Weekly Sabbath School, Divine Service, Faith Clinic, and Bible Study times at Yashua Resurrection Power Ministry INC.",
};

const schedule = [
  [
    "sabbath-school",
    "Saturday · 8:00 AM – 9:00 AM",
    "Sabbath School",
    "Interactive, chapter-by-chapter study of the Scriptures before Divine Service.",
    "sabbath-school.jpg",
  ],
  [
    "divine-service",
    "Saturday · 9:00 AM",
    "Divine Service",
    "Our sacred Seventh-Day Sabbath convocation of worship, prayer, and the preached Word.",
    "divine-service.jpg",
  ],
  [
    "faith-clinic",
    "Thursday · 9:00 AM – 12:00 PM",
    "Faith Clinic",
    "A focused morning of intercession, spiritual warfare, healing prayer, and counsel.",
    "faith-clinic.jpg",
  ],
  [
    "bible-study",
    "Tuesday · 4:00 PM – 6:00 PM",
    "Bible Study",
    "Midweek teaching where questions are welcomed and believers grow together in truth.",
    "bible-study.jpg",
  ],
];

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="page-hero">
          <VideoBackground
            poster="/images/divine-service.jpg"
            slides={[
              "/images/divine-service.jpg",
              "/images/sabbath-school.jpg",
              "/images/faith-clinic.jpg",
            ]}
            alt="Congregation gathered for worship"
            caption="Sacred Gatherings"
            showControls={true}
          />
          <div className="container-wide">
            <span className="eyebrow">Gatherings &amp; Calendar</span>
            <h1 className="display">
              Set-apart times to <em>seek the Lord.</em>
            </h1>
            <p>
              Our week is anchored by the Seventh-Day Sabbath and strengthened
              through midweek Bible study and Thursday morning prayer.
            </p>
          </div>
        </section>

        <Reveal className="section-space">
          <div className="container-wide">
            <div className="magazine-meta-rail" data-reveal data-motion="fade">
              <span className="folio-tag">Weekly Sanctuary Schedule</span>
              <span className="folio-line arch-rule-draw" aria-hidden="true" />
              <span className="folio-count">Four Appointed Gatherings</span>
            </div>
            <span className="eyebrow" data-reveal>
              Weekly Schedule
            </span>
            <h2 className="display section-heading" data-reveal>
              Join us in the <em>sanctuary.</em>
            </h2>
            <div className="listing-grid">
              {schedule.map(([id, time, title, desc, img]) => (
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
                    <small>{time}</small>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <Link
                      className="text-link"
                      href="/#visit"
                      style={{ marginTop: 18 }}
                    >
                      <span>Plan to attend</span> <ArrowUpRight />
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
