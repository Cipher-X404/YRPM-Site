'use client';

import { Sparkles, Calendar, Clock, MapPin, ArrowUpRight, Shield } from 'lucide-react';

export default function EventsPage() {
  const events = [
    {
      title: 'Holy Sabbath Convocation & Expository Worship',
      schedule: 'EVERY SABBATH (SATURDAY)',
      time: '9:00 AM – 1:30 PM',
      badge: 'Primary Convocation',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'The pinnacle of our weekly walk. Beginning with interactive verse-by-verse Sabbath School Bible exegesis, followed by vibrant worship, deliverance prayer, and apostolic sermon by Apostle Polycarp Samuel.',
      location: 'Main Sanctuary & Online Broadcast',
      linkText: 'Directions & Times',
    },
    {
      title: 'Wednesday Faith Clinic & Miracle Hour',
      schedule: 'EVERY WEDNESDAY',
      time: '5:30 PM – 7:30 PM',
      badge: 'Healing & Deliverance',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'A consecrated atmosphere for the afflicted, sick, and burdened. Intensive intercession, laying on of hands, and testimonies of divine breakthroughs in Yeshua’s name.',
      location: 'Sanctuary Altar',
      linkText: 'Submit Prayer Request',
    },
    {
      title: 'Welcoming the Sabbath (Kabbalat Shabbat)',
      schedule: 'EVERY FRIDAY SUNSET',
      time: '5:00 PM',
      badge: 'Sacred Rest',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      description: 'Ushering in the sanctified hours of the Seventh Day. Acoustic worship, reading of Psalms, and family household dedications.',
      location: 'Sanctuary & Home Fellowships',
      linkText: 'Join Stream',
    },
    {
      title: 'Passover & Unleavened Bread Convocation',
      schedule: 'ANNUAL FEAST',
      time: 'APRIL 14 – 20',
      badge: 'Holy Solemnity',
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
      description: 'Seven days commemorating redemption through the sacrificial Lamb of God, Yeshua. Holy assemblies, breaking of bread, and communion in purity.',
      location: 'Cathedral Grounds',
      linkText: 'Convocation Schedule',
    },
    {
      title: 'Monthly Covenant Prayer Solemnity',
      schedule: 'MONTHLY FIRST FRUITS',
      time: '1st & 2nd Day of Every Month · 5:00 AM',
      badge: 'Dawn Decree',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Confronting the upcoming month with fasting and dawn prayer—standing in covenant alignment to claim double portion favor and angelic protection.',
      location: 'Early Morning Altar',
      linkText: 'Add to Calendar',
    },
  ];

  return (
    <div className="w-full bg-white">
      
      {/* Header */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>SACRED TIMES &amp; HOLY CONVOCATIONS</span>
          </div>

          <h1 className="font-serif font-black text-slate-950 text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
            The Calendar of Heaven.<br />
            <span className="italic font-normal text-amber-700">A Place at the Altar.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            All services are open to every soul desiring to encounter the unvarnished truth of God’s Word and experience resurrection power.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          {events.map((ev) => (
            <div
              key={ev.title}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ev.badgeColor}`}>
                    {ev.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {ev.schedule}
                  </span>
                </div>

                <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-950">
                  {ev.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {ev.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.time}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 md:pt-0">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all">
                  <span>{ev.linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
