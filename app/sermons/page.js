import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CallToAction from "../../components/CallToAction";
import SermonLibrary from "../../components/SermonLibrary";
import VideoBackground from "../../components/ui/VideoBackground";

export const metadata = {
  title: "Sermons",
  description:
    "Explore Divine Service proclamations and Sabbath School studies from Yashua Resurrection Power Ministry INC.",
};

export default function SermonsPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="page-hero">
          <VideoBackground
            poster="/images/bible-open-warm.jpg"
            slides={[
              "/images/bible-open-warm.jpg",
              "/images/sabbath-school.jpg",
              "/images/divine-service.jpg",
            ]}
            alt="An open Bible in warm light"
            caption="Living Word Library"
            showControls={true}
          />
          <div className="container-wide">
            <span className="eyebrow">Messages &amp; Bible Study</span>
            <h1 className="display">
              Line upon line. <em>Truth that endures.</em>
            </h1>
            <p>
              Walk through the messages, scriptures, and study themes shared in
              our Sabbath School, Divine Service, and midweek gatherings.
            </p>
          </div>
        </section>

        <section className="section-space">
          <SermonLibrary />
        </section>

        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
