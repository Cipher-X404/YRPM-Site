import HeroSection from "../components/HeroSection";
import AboutPreview from "../components/AboutPreview";
import WeeklyRhythm from "../components/WeeklyRhythm";
import SermonShowcase from "../components/SermonShowcase";
import LeadershipSpread from "../components/LeadershipSpread";
import LiveStreamBanner from "../components/LiveStreamBanner";
import PlanYourVisit from "../components/PlanYourVisit";
import TestimonialWall from "../components/TestimonialWall";
import MinistriesGrid from "../components/MinistriesGrid";
import ScripturePillars from "../components/ScripturePillars";
import NewsletterCapture from "../components/NewsletterCapture";
import CallToAction from "../components/CallToAction";
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <WeeklyRhythm />
      <SermonShowcase />
      <LeadershipSpread />
      <LiveStreamBanner />
      <PlanYourVisit />
      <TestimonialWall />
      <MinistriesGrid />
      <ScripturePillars />
      <NewsletterCapture />
      <CallToAction />
    </>
  );
}
