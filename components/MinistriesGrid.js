import Link from "next/link";
import Image from "next/image";
import { BookOpen, Flame, HeartHandshake, ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";

const movements = [
  {
    Icon: BookOpen,
    no: "The Word",
    label: "Discipleship & Study",
    title: "Immerse in the Word",
    desc: "Rooted in unadulterated Scripture — growing together through Saturday Sabbath School and Tuesday Bible Study.",
    img: "sabbath-school.jpg",
    href: "/sermons",
  },
  {
    Icon: Flame,
    no: "The Altar",
    label: "Prayer & Healing",
    title: "Resurrection Fire",
    desc: "Making dedicated space for fervent prayer, spiritual renewal, healing, and the transforming presence of God.",
    img: "faith-clinic.jpg",
    href: "/events#faith-clinic",
  },
  {
    Icon: HeartHandshake,
    no: "The Mission",
    label: "Fellowship & Outreach",
    title: "Scatter in Compassion",
    desc: "Carrying the love of Yeshua across generations — children, youth, women, and evangelistic outreach.",
    img: "community-outreach.jpg",
    href: "/ministries",
  },
];

export default function MinistriesGrid() {
  return (
    <Reveal className="ministries-preview section-space">
      <div className="container-wide">
        <div className="magazine-meta-rail" data-reveal data-motion="fade">
          <span className="folio-tag">Fellowship &amp; Service</span>
          <span className="folio-line arch-rule-draw" aria-hidden="true" />
          <span className="folio-count">Life in the Community</span>
        </div>

        <span className="eyebrow" data-reveal>
          A faith put into motion
        </span>
        <h2 className="display section-heading" data-reveal>
          More than a gathering.
          <br />
          <em>A way of life.</em>
        </h2>

        <div className="ministry-grid">
          {movements.map(({ Icon, no, label, title, desc, img, href }) => (
            <article
              className="ministry-card arch-movement-card"
              key={title}
              data-reveal
              data-motion="up"
            >
              <div className="arch-movement-top">
                <span className="arch-movement-no">{no}</span>
                <span className="ministry-card-icon">
                  <Icon aria-hidden="true" />
                </span>
              </div>

              <div className="arch-movement-Thumb">
                <Image
                  src={`/images/${img}`}
                  alt={title}
                  width={480}
                  height={220}
                />
              </div>

              <div className="arch-movement-body">
                <small>{label}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>

              <Link href={href} className="arch-movement-link">
                <span>Walk with this ministry</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
