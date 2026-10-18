'use client';

import { useState } from 'react';
import { Play, BookOpen, Flame, Clock, Calendar, Download, Headphones, ArrowUpRight, Share2, Sparkles } from 'lucide-react';

export default function SermonsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full bg-white">
      
      {/* Header */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>SPOKEN WORD &amp; EXPOSITORY THEOLOGY</span>
          </div>

          <h1 className="font-serif font-black text-slate-950 text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
            Hear the Proclamation.<br />
            <span className="italic font-normal text-amber-700">Enter the Scripture.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
            We present two distinct expressions of teaching: the prophetic fire of <strong>Divine Service</strong> and the deep verse-by-verse exegesis of <strong>Sabbath School</strong>.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Expressions
            </button>
            <button
              onClick={() => setActiveTab('divine')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                activeTab === 'divine'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Divine Service (Apostolic Proclamation)</span>
            </button>
            <button
              onClick={() => setActiveTab('sabbath')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                activeTab === 'sabbath'
                  ? 'bg-sky-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sabbath School (Expository Study)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================================
          EXPRESSION 1: DIVINE SERVICE (Cinematic, Moody, Regal Gold)
          ============================================================== */}
      {(activeTab === 'all' || activeTab === 'divine') && (
        <section className="py-20 bg-slate-950 text-white border-b border-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">EXPRESSION NO. 01</span>
                <h2 className="font-serif font-black text-3xl sm:text-4xl mt-1">Divine Service Proclamations</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                  Prophetic exhortations delivered from the sacred altar by Apostle Polycarp Samuel, accompanied by the power of the Holy Spirit.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider w-max">
                High Apostolic Fire
              </span>
            </div>

            {/* Featured Video Player Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-video bg-black group cursor-pointer shadow-lg">
                <img
                  src="/images/divine-sermon-banner.jpg"
                  alt="Divine Service Sermon Stream"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-slate-950 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded text-[11px] font-mono text-white">
                  1:18:24
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold">
                  <span>Sabbath Keynote</span>
                  <span>•</span>
                  <span className="text-slate-400">Recorded Live</span>
                </div>
                
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-snug">
                  The Unshakable Foundation: When Nations Tremble
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Drawing from Hebrews 12 and Jeremiah 1, Apostle Polycarp proclaims why the believer anchored in the resurrection power of Yeshua cannot be moved by economic or political shaking.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <img
                    src="/images/pastor-sermon.jpg"
                    alt="Apostle Polycarp Samuel"
                    className="w-10 h-10 rounded-full object-cover border border-amber-400"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">Apostle Polycarp Ukwudiri Samuel</span>
                    <span className="text-[10px] text-slate-400">Senior Mantle Bearer</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold tracking-wider uppercase transition-all">
                    Watch Broadcast
                  </button>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold tracking-wide transition-all">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Audio</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Divine Sermons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="h-44 relative overflow-hidden bg-black">
                  <img src="/images/worship-congregation-hands.jpg" alt="Tarrying for the Latter Rain" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-black/70 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">Breakthrough</span>
                </div>
                <div className="p-5">
                  <span className="text-[11px] text-slate-400">48 Mins · Sabbath Morning</span>
                  <h4 className="font-serif font-bold text-lg text-white mt-1">Tarrying for the Latter Rain</h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">The imperative of earnest prayer before the throne of grace to witness true spiritual revival.</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="h-44 relative overflow-hidden bg-black">
                  <img src="/images/faith-clinic.jpg" alt="The Broken Yoke" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-black/70 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">Deliverance</span>
                </div>
                <div className="p-5">
                  <span className="text-[11px] text-slate-400">1 hr 02 mins · Faith Clinic</span>
                  <h4 className="font-serif font-bold text-lg text-white mt-1">The Broken Yoke &amp; Liberty</h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">Walking in deliverance from generational entanglements by the uncontested blood of Yeshua.</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="h-44 relative overflow-hidden bg-black">
                  <img src="/images/covenant-prayer.jpg" alt="Covenant Altar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-black/70 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">Covenant</span>
                </div>
                <div className="p-5">
                  <span className="text-[11px] text-slate-400">55 mins · New Month Altar</span>
                  <h4 className="font-serif font-bold text-lg text-white mt-1">Confronting the New Month</h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">Standing at the dawn altar in covenant decree to unlock double portion blessings.</p>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ==============================================================
          EXPRESSION 2: SABBATH SCHOOL (Warm Ivory Parchment & Expository)
          ============================================================== */}
      {(activeTab === 'all' || activeTab === 'sabbath') && (
        <section className="py-20 bg-[#fbf9f5] border-b border-[#e9e3d8]">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-800">EXPRESSION NO. 02</span>
                <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 mt-1">Sabbath School Scripture Studies</h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                  Interactive verse-by-verse expository exegesis comparing precept upon precept across Torah, the Prophets, and the New Covenant writings.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider w-max border border-sky-200">
                Expository Exegesis
              </span>
            </div>

            {/* Featured Study Module */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-[#e4ded3] rounded-3xl p-6 sm:p-10 mb-12 shadow-sm">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-800">CURRENT QUARTERLY · LESSON 07</span>
                <h3 className="font-serif font-black text-2xl sm:text-4xl text-slate-950 leading-tight">
                  The Fourth Commandment: The Unrepealed Sign of Creation &amp; Rest
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  An in-depth theological treatise exploring Genesis 2:1-3, Exodus 20:8-11, and Hebrews 4:1-11, uncovering the perpetual and spiritual significance of the Seventh-Day Sabbath for all believers.
                </p>

                <div className="p-4 rounded-xl bg-amber-50/70 border-l-4 border-amber-600 text-xs text-amber-950 font-serif italic">
                  "Verily my Sabbaths ye shall keep: for it is a sign between me and you throughout your generations." — Exodus 31:13
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold tracking-wide transition-all">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Study Guide (PDF)</span>
                  </button>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tracking-wide transition-all">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Listen to Class Audio</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#ded7ca] shadow-md">
                  <img
                    src="/images/sabbath-study-banner.jpg"
                    alt="Sabbath School Expository Study"
                    className="w-full h-[320px] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Lessons Table */}
            <div className="bg-white border border-[#e4ded3] rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Lesson Syllabus</span>
                <span>Scriptural Reference</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Lesson 01: The Divine Architecture of Time</span>
                    <span className="text-xs text-slate-500">Sanctification of the Seventh Day at Creation</span>
                  </div>
                  <span className="font-serif italic text-sky-900 text-xs">Genesis 2:1–3; Mark 2:27</span>
                </div>

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Lesson 02: The Passover Lamb &amp; Unleavened Purity</span>
                    <span className="text-xs text-slate-500">Shadow to substance fulfilled in Yeshua</span>
                  </div>
                  <span className="font-serif italic text-sky-900 text-xs">Exodus 12; 1 Cor 5:7–8</span>
                </div>

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900 block">Lesson 03: The Holy Spirit in the Tabernacle Order</span>
                    <span className="text-xs text-slate-500">Altar consecration and priesthood of believers</span>
                  </div>
                  <span className="font-serif italic text-sky-900 text-xs">Leviticus 6; Romans 12:1–2</span>
                </div>

              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
