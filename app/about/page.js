'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, CheckCircle2, ArrowUpRight, Flame, BookOpen, HeartHandshake } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Timeline reveal
      gsap.from('.timeline-item', {
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        stagger: 0.18,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Leadership parallax
      gsap.to('.leader-img', {
        scrollTrigger: {
          trigger: '.leader-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -30,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-white">
      
      {/* Editorial Magazine Cover Header */}
      <section className="py-20 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>EDITORIAL CHRONICLE · FOUNDATION &amp; HISTORY</span>
          </div>

          <h1 className="font-serif font-black text-slate-950 text-4xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-tight mb-8">
            The Altar Belongeth to Yeshua.<br />
            <span className="italic font-normal text-amber-700">Rooted in Unshakable Truth.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mb-12">
            Yashua Resurrection Power Ministry is neither a private enterprise nor a human institution. Its foundation, builder, and eternal owner is <strong>Yeshua Hamashiach</strong>. The spiritual mantle is held with sacred fear and trembling by <strong>Apostle Polycarp Ukwudiri Samuel</strong> and his wife <strong>Evangelist Polycarp Comfort Amarachi</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Mantle Holder</span>
              <p className="font-bold text-slate-950 text-sm mt-1">Apostle Polycarp Ukwudiri Samuel</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Co-Laborer in Grace</span>
              <p className="font-bold text-slate-950 text-sm mt-1">Evangelist Polycarp Comfort Amarachi</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Holy Convocation</span>
              <p className="font-bold text-slate-950 text-sm mt-1">Biblical Seventh-Day Sabbath</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Editorial Spread */}
      <section className="leader-section py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-4 border-white">
              <img
                src="/images/apostle-and-evangelist.jpg"
                alt="Apostle Polycarp Ukwudiri Samuel & Evangelist Comfort Amarachi"
                className="leader-img w-full h-[520px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md p-5 rounded-2xl text-white border border-white/10 shadow-xl">
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Apostolic Stewards</span>
              <h4 className="font-serif font-bold text-base mt-0.5">Apostle Polycarp &amp; Evangelist Comfort Amarachi</h4>
              <p className="text-[11px] text-slate-400 mt-1">Preserving apostolic purity and prayer fire across all seasons.</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 pt-8 lg:pt-0">
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">DIVINE STEWARDSHIP</span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 leading-snug">
              Called into Holy Consecration, Not Convenience.
            </h2>
            
            <div className="bg-white p-6 rounded-2xl border-l-4 border-amber-500 shadow-sm">
              <p className="font-serif italic text-slate-800 text-sm leading-relaxed">
                "We do not glory in flesh, nor in worldly wisdom. We are watchmen on the wall, called to preserve the sanctity of the Word of God and prepare souls for the coming of our Messiah."
              </p>
              <span className="block text-xs font-bold text-slate-500 mt-3">— Apostle Polycarp Samuel</span>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Under their guidance, Yashua Resurrection Power Ministry has walked through valley seasons and mountain triumphs. Without resorting to commercialization, sensationalism, or human manipulation, the ministry maintains an uncompromising focus on the blood of Yeshua, holiness of life, and the manifestation of Holy Spirit power.
            </p>
          </div>

        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white timeline-container">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">HISTORICAL CHRONOLOGY</span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-slate-950 mt-2">
              The Journey of Faith
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Trace the hand of God through key epochs in the life of Yashua Resurrection Power Ministry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Year 2000 */}
            <div className="timeline-item bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <span className="text-3xl font-serif font-black text-slate-950">2000</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 rounded-full px-2.5 py-0.5 w-max mt-2">Genesis Mandate</span>
                <h3 className="font-bold text-base text-slate-950 mt-4">Birthed as a Ministry</h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  In 2000, under divine impulse, the ministry began headed by Apostle Polycarp Ukwudiri Samuel and his wife Evangelist Polycarp Comfort Amarachi, devoted to earnest prayer and evangelism.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-200 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Intercession &amp; Fasting Altar</span>
              </div>
            </div>

            {/* Year 2003 */}
            <div className="timeline-item bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <span className="text-3xl font-serif font-black text-slate-950">2003</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 rounded-full px-2.5 py-0.5 w-max mt-2">Ecclesia Ordained</span>
                <h3 className="font-bold text-base text-slate-950 mt-4">Established as a Church</h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  By 2003, the expanding fellowship transitioned into an officially established church congregation, fostering structured discipleship, kingdom auxiliaries, and community care.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-200 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pastoral Care &amp; Ordinances</span>
              </div>
            </div>

            {/* Year 2015 */}
            <div className="timeline-item bg-amber-50/50 border-2 border-amber-400 rounded-3xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow">
              <div>
                <span className="text-3xl font-serif font-black text-amber-700">2015</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 rounded-full px-2.5 py-0.5 w-max mt-2">Prophetic Shift</span>
                <h3 className="font-bold text-base text-slate-950 mt-4">Restoration of Sabbath</h3>
                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                  Though formerly a Sunday-keeping church, in 2015 the Holy Spirit directed the leadership through biblical revelation to align with the Seventh-Day Sabbath of the Lord.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-amber-200 text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Fourth Commandment Restored</span>
              </div>
            </div>

            {/* Present */}
            <div className="timeline-item bg-slate-950 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-3xl font-serif font-black text-amber-400">TODAY</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800 rounded-full px-2.5 py-0.5 w-max mt-2">Unshakable Grace</span>
                <h3 className="font-bold text-base text-white mt-4">Still Standing by Truth</h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Through the ups and downs of ministry, YRPM stands firm by the power of the Holy Spirit, holding fast to scriptural standards without retreat or compromise.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Owned by Yeshua Forever</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
