'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, Flame, BookOpen, Clock, Users, Shield, Calendar, 
  Sparkles, ChevronRight, Play, MapPin, HeartHandshake, Compass, 
  CheckCircle2, Radio, Volume2, Car, Coffee, Smile
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const headlineRef = useRef(null);
  const pinSectionRef = useRef(null);
  const cardsTrackRef = useRef(null);
  const dragProxyRef = useRef(null);
  const morphSvgRef = useRef(null);

  const slides = [
    { src: '/images/worship-congregation-hands.jpg', alt: 'Congregation worshipping with hands raised' },
    { src: '/images/pastor-sermon.jpg', alt: 'Pastor delivering sermon' },
    { src: '/images/divine-service.jpg', alt: 'Sanctuary worship gathering' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger, Draggable);

    // 1. Split Text Reveal on Hero Headline
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.hero-word');
      gsap.fromTo(
        words,
        { opacity: 0, y: 35, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.08, duration: 0.9, ease: 'back.out(1.4)', delay: 0.2 }
      );
    }

    const pinCtx = gsap.context(() => {
      // 2. Section Pinning
      if (pinSectionRef.current && cardsTrackRef.current) {
        ScrollTrigger.create({
          trigger: pinSectionRef.current,
          start: 'top top+=60',
          end: '+=800',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          animation: gsap.to(cardsTrackRef.current, {
            x: () => -(cardsTrackRef.current.scrollWidth - window.innerWidth + 120),
            ease: 'none',
          }),
        });
      }

      // 3. Draggable Interactions
      if (dragProxyRef.current) {
        Draggable.create(dragProxyRef.current, {
          type: 'x',
          edgeResistance: 0.75,
          bounds: { minX: -600, maxX: 0 },
          inertia: true,
        });
      }

      // 4. SVG Shape Morphing
      if (morphSvgRef.current) {
        const path2 = "M 50 15 C 30 12 15 25 12 50 C 10 75 25 88 50 85 C 75 88 88 75 88 50 C 85 25 70 12 50 15 Z";
        gsap.to(morphSvgRef.current, {
          attr: { d: path2 },
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    return () => pinCtx.revert();
  }, []);

  return (
    <div className="w-full bg-white">
      
      {/* ==============================================================
          HERO SECTION (Pure White Split-Layout, Strict User Constraints)
          ============================================================== */}
      <section className="relative w-full min-h-[90vh] flex items-center bg-white overflow-hidden py-10">
        <div className="w-full max-w-[1540px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column (Content Stack - ~45% width) */}
          <div className="w-full lg:w-[45%] flex flex-col items-start z-10">
            
            {/* 1. Main Headline */}
            <h1 ref={headlineRef} className="font-serif font-black text-slate-950 text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.08] tracking-tight mb-6">
              <span className="block">
                <span className="hero-word inline-block mr-3">Encounter</span>
                <span className="hero-word inline-block mr-3">Timeless</span>
                <span className="hero-word inline-block">Faith</span>
              </span>
              <span className="block text-slate-950">
                <span className="hero-word inline-block mr-3">Experience</span>
                <span className="hero-word inline-block mr-3">Resurrection</span>
                <span className="hero-word inline-block">Power</span>
              </span>
            </h1>

            {/* 2. Sub-headline */}
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
              Welcome to Yashua Resurrection Power ministry (YRPM). Discover a community grounded in the Word, empowered by the Holy Spirit, and devoted to sharing the love of Christ in every season of life.
            </p>

            {/* 3. Primary Call-to-Action (CTA) Button */}
            <div className="mb-10">
              <Link
                href="/#visit"
                className="inline-flex items-center justify-between gap-6 pl-7 pr-2 py-2 bg-slate-950 hover:bg-black text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <span className="font-semibold text-sm tracking-wide">Plan Your Visit</span>
                <span className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-sm">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </Link>
            </div>

            {/* 4 & 5 & 6. Secondary Card + Circular Rotating Badge */}
            <div className="flex items-center gap-6 sm:gap-10 w-full flex-wrap sm:flex-nowrap">
              
              {/* Secondary Image & Text */}
              <div className="flex flex-col items-start group cursor-pointer">
                <div className="w-56 sm:w-64 h-36 rounded-[28px] overflow-hidden shadow-md bg-slate-100 mb-3.5 transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src="/images/open-bible-cross.jpg"
                    alt="Open Bible resting next to a wooden cross"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif font-bold text-slate-950 text-base leading-snug">
                  Sunday Worship Experience
                </h3>
                <p className="text-slate-500 text-xs font-medium">
                  Faith. Fellowship. Transformation.
                </p>
              </div>

              {/* 6. Circular Rotating Badge */}
              <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0 cursor-pointer group">
                <svg className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none" viewBox="0 0 160 160">
                  <defs>
                    <path id="badgeCirclePath" d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0" fill="none" />
                  </defs>
                  <text className="text-[11.5px] font-bold tracking-[0.22em] uppercase fill-slate-950">
                    <textPath href="#badgeCirclePath" startOffset="0%">
                      JOIN US SUNDAY • JOIN US SUNDAY • 
                    </textPath>
                  </text>
                </svg>

                <div className="w-[72px] h-[72px] bg-slate-950 rounded-full flex flex-col items-center justify-center text-white z-10 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:bg-black">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] mb-0.5 text-white" />
                  <span className="text-[9px] font-bold tracking-wider uppercase text-white">Watch Live</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (Main Feature Image - ~55% width, bleeding off right edge) */}
          <div className="w-full lg:w-[55%] flex flex-col items-center">
            
            {/* Custom Asymmetrical Organic S-Curve Shape Container */}
            <div className="w-full h-[460px] sm:h-[580px] xl:h-[660px] relative organic-hero-mask bg-slate-900 shadow-2xl">
              {slides.map((slide, index) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                  style={{ transitionProperty: 'opacity, transform' }}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2.5 mt-6" role="tablist" aria-label="Hero carousel pagination">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-10 bg-red-600' : 'w-7 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                  aria-selected={index === currentSlide}
                />
              ))}
            </div>

          </div>

        </div>

        {/* SVG ClipPath Definition for the Hero Shape */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <clipPath id="heroOrganicMask" clipPathUnits="objectBoundingBox">
              <path d="M 0.22,0 
                       L 1,0 
                       L 1,0.985 
                       Q 1,1 0.985,1 
                       L 0.38,1 
                       C 0.22,1 0.14,0.88 0.16,0.76 
                       C 0.18,0.62 0.26,0.52 0.24,0.38 
                       C 0.20,0.20 0.08,0.06 0,0.08 
                       C 0,0.02 0.08,0 0.22,0 Z" />
            </clipPath>
          </defs>
        </svg>
      </section>

      {/* ==============================================================
          PASSION CITY CHURCH INFLUENCED: "GATHER TO WORSHIP, SCATTER TO SERVE"
          ============================================================== */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-600">THE SACRED RHYTHM</span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-slate-950 mt-2">
              We Gather to Worship.<br />
              <span className="italic font-normal text-amber-700">We Scatter to Serve.</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed">
              At Yashua Resurrection Power Ministry, gatherings are not mere routines. They are sacred encounters where the Lord prepares us to carry His resurrecting love into our communities, workplaces, and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center mb-6 shadow-sm">
                <BookOpen className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">First Movement</span>
              <h3 className="font-serif font-bold text-xl text-slate-950 mt-1">Immerse in the Word</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Grounding every believer in the unadulterated scriptures through weekly Sabbath School exegesis and deep doctrinal teaching.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mb-6 shadow-sm">
                <Flame className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Second Movement</span>
              <h3 className="font-serif font-bold text-xl text-slate-950 mt-1">Resurrection Fire</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Tarrying in authentic apostolic prayer, laying on of hands, and deliverance from generational oppression in Yeshua’s name.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center mb-6 shadow-sm">
                <HeartHandshake className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Third Movement</span>
              <h3 className="font-serif font-bold text-xl text-slate-950 mt-1">Scatter in Compassion</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Stepping outside the walls through street evangelism, food welfare distribution, and hospital visitation missions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================
          EDITORIAL FOUNDATION & LEADERSHIP SPREAD
          ============================================================== */}
      <section className="py-24 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>THE ALTAR &amp; THE WORD</span>
            </div>
            
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-slate-950 leading-tight">
              An Altar Owned by Yeshua.<br />
              <span className="italic font-normal text-amber-700">Held by an Apostolic Mantle.</span>
            </h2>

            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              YRPM is not a self-owned enterprise or commercial venue. The foundation and eternal head of this ministry is <strong>Yeshua Hamashiach</strong>. Birthed as a ministry in 2000, ordained into an established church in 2003, and redirected in 2015 by the Holy Spirit into observing the Seventh-Day Sabbath, we stand unmovable upon the uncompromised Word.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-l-2 border-amber-500 pl-4">
                <span className="block text-2xl font-serif font-black text-slate-950">2000 → 2026</span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Unbroken Fire &amp; Revival</span>
              </div>
              <div className="border-l-2 border-slate-900 pl-4">
                <span className="block text-2xl font-serif font-black text-slate-950">Sabbath Truth</span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Holy Convocation Restored</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-slate-950 font-bold text-sm border-b-2 border-amber-500 pb-1 hover:text-amber-700 transition-colors"
              >
                <span>Read Full Leadership &amp; History Chronicle</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              <img
                src="/images/apostle-and-evangelist.jpg"
                alt="Apostle Polycarp Ukwudiri Samuel & Evangelist Comfort Amarachi"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Mantle Bearers</span>
                <h4 className="font-serif font-bold text-lg">Apostle Polycarp &amp; Evangelist Comfort Samuel</h4>
                <p className="text-xs text-slate-300 mt-1">Shepherding with apostolic humility, purity, and spiritual warfare.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================
          PLAN YOUR VISIT (PASSION CITY 515 LOCATION GUIDE EXPERIENCE)
          ============================================================== */}
      <section id="visit" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wider uppercase mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>VISITOR EXPERIENCE &amp; LOCATION GUIDE</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-slate-950">
              Everything You Need for Your First Sabbath Visit.
            </h2>
            <p className="text-slate-600 text-base mt-4 leading-relaxed">
              We know visiting a new congregation can feel unfamiliar. Here is a clear guide on what to expect, where to park, and how our worship family welcomes you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step 1: Arrival & Parking */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm mb-6">
                1
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                <Car className="w-4 h-4" />
                <span>Arrival &amp; Parking</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Arrive 20 Mins Early</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Free on-site parking is available. Our welcoming Door Holders will greet you, assist with finding parking, and direct you straight to the main sanctuary entrance.
              </p>
            </div>

            {/* Step 2: Family & Children */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm mb-6">
                2
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                <Smile className="w-4 h-4" />
                <span>Children &amp; Families</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Kingdom Seedlings Check-In</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Have little ones? Our safe, background-checked Children Ministry provides interactive Bible learning, memory verse games, and praise during both service hours.
              </p>
            </div>

            {/* Step 3: Fellowship */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm mb-6">
                3
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                <Coffee className="w-4 h-4" />
                <span>Agape Fellowship</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Stay for Fellowship</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                Following the Divine Service, join our pastors, prayer ministers, and members for warm refreshments. We would love to meet you personally and pray over your family.
              </p>
            </div>

          </div>

          {/* Location Bar */}
          <div className="mt-12 p-8 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg">YRPM Sanctuary &amp; Altar of Deliverance</h4>
                <p className="text-xs text-slate-400">Weekly Convocations: Sabbath 9:00 AM &amp; Wednesday 5:30 PM</p>
              </div>
            </div>
            <button className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md">
              Open in Maps &amp; Directions
            </button>
          </div>

        </div>
      </section>

      {/* ==============================================================
          GSAP PINNED CHOREOGRAPHY ("Rhythm of Worship")
          ============================================================== */}
      <section ref={pinSectionRef} className="py-20 bg-slate-950 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">GSAP PINNED CHOREOGRAPHY</span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl mt-2">The Rhythm of Worship</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Explore our continuous cycle of prayer, teaching, and solemn convocations as you scroll.
            </p>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300">
            <span>View All Gatherings</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pinned horizontal cards track */}
        <div className="w-full overflow-hidden">
          <div ref={cardsTrackRef} className="flex gap-6 pl-6 sm:pl-12 w-max">
            
            <div className="w-80 h-96 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/60 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">Weekly</span>
                <h3 className="font-serif font-bold text-2xl mt-4">Holy Sabbath Convocation</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  9:00 AM – 1:30 PM. Complete immersion in scripture expository study followed by apostolic prayer and worship.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Sanctuary &amp; Live Stream</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="w-80 h-96 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/60 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">Midweek</span>
                <h3 className="font-serif font-bold text-2xl mt-4">Faith Clinic &amp; Deliverance</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Wednesdays 5:30 PM. Intensive laying on of hands, spiritual warfare, and testimonies of supernatural healings.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Miracle Altar</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="w-80 h-96 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/60 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">Monthly</span>
                <h3 className="font-serif font-bold text-2xl mt-4">Covenant Prayer Solemnity</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  1st &amp; 2nd of each new month. Dawn intercession commanding blessing and spiritual dominion over the days ahead.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Dawn 5:00 AM</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="w-80 h-96 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-red-500/60 transition-colors">
              <div>
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider">Annual</span>
                <h3 className="font-serif font-bold text-2xl mt-4">Passover &amp; Unleavened Bread</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  April 14 – 20. Sacred commemoration of redemption through the shed blood of Yeshua the Lamb of God.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>7-Day Convocation</span>
                <ArrowUpRight className="w-4 h-4 text-red-400" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================
          DRAGGABLE PILLARS & CREEDS
          ============================================================== */}
      <section className="py-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GSAP DRAGGABLE &amp; INERTIA</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950">Scriptural Pillars &amp; Creeds</h2>
          </div>
          <p className="text-xs text-slate-400 font-semibold">← Drag cards horizontally with inertia →</p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div ref={dragProxyRef} className="flex gap-6 cursor-grab active:cursor-grabbing select-none w-max">
            
            <div className="w-80 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-amber-600 uppercase">Pillar 01</span>
              <h4 className="font-serif font-bold text-xl text-slate-900 mt-2">The Lord of the Sabbath</h4>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                "The Sabbath was made for man, and not man for the Sabbath: Therefore the Son of man is Lord also of the Sabbath." — Mark 2:27-28
              </p>
            </div>

            <div className="w-80 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-amber-600 uppercase">Pillar 02</span>
              <h4 className="font-serif font-bold text-xl text-slate-900 mt-2">Resurrection Power</h4>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                "That I may know him, and the power of his resurrection, and the fellowship of his sufferings, being made conformable unto his death." — Philippians 3:10
              </p>
            </div>

            <div className="w-80 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-amber-600 uppercase">Pillar 03</span>
              <h4 className="font-serif font-bold text-xl text-slate-900 mt-2">Scriptural Inerrancy</h4>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                "Precept upon precept, line upon line, here a little, and there a little." Full harmony between the Torah, Prophets, and Apostolic writings.
              </p>
            </div>

            <div className="w-80 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-amber-600 uppercase">Pillar 04</span>
              <h4 className="font-serif font-bold text-xl text-slate-900 mt-2">Deliverance &amp; Liberty</h4>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Setting captives free from demonic oppression, sickness, and generational curses through the uncontested power of the blood of Yeshua.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================
          SVG MORPHING CALLOUT
          ============================================================== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          
          <div className="w-24 h-24 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-400/20 stroke-amber-400 stroke-2">
              <path ref={morphSvgRef} d="M 50 10 C 25 10 10 30 10 55 C 10 80 35 90 55 90 C 85 90 90 70 90 50 C 90 25 75 10 50 10 Z" />
            </svg>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-5xl max-w-2xl">
            "Come Unto Me, All Ye That Labour."
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl">
            Whether you are searching for authentic biblical truth, seeking prayer for physical healing, or ready to deepen your walk with Yeshua, there is a seat prepared for you.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#visit"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Plan Your Visit This Sabbath
            </Link>
            <Link
              href="/sermons"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full text-xs uppercase tracking-wider transition-all"
            >
              Watch Recent Sermons
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
