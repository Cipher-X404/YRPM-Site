'use client';

import { Sparkles, Heart, Flame, Shield, Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function MinistriesPage() {
  const ministries = [
    {
      title: 'Children Ministry (Kingdom Seedlings)',
      subtitle: 'Ages 2 – 12 · Every Sabbath Morning',
      badge: 'Next-Gen',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Nurturing young hearts with biblical foundations, memorization of scriptures, worship, and reverence for God in a secure, loving environment.',
      image: '/images/sabbath-school.jpg',
      points: ['Scripture memorization & Bible stories', 'Character formation & prayer devotion', 'Loving, background-checked teachers'],
    },
    {
      title: 'Resurrection Youth & Campus Fire',
      subtitle: 'Teens & Young Adults · Bi-Weekly Gatherings',
      badge: 'Young Adults',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Empowering the emerging generation to stand unapologetically for biblical truth and righteousness amidst modern cultural pressures.',
      image: '/images/worship-banner.jpg',
      points: ['Acoustic worship and intercession nights', 'Biblical apologetics & worldview discussion', 'Kingdom purpose & career mentorship'],
    },
    {
      title: 'Daughters of Zion (Women of Grace)',
      subtitle: 'Mothers & Daughters · Monthly Convocation',
      badge: 'Sisterhood',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Under the spiritual mothering of Evangelist Polycarp Comfort Amarachi, women gather for prayer, emotional healing, and building godly homes.',
      image: '/images/faith-clinic.jpg',
      points: ['Intercessory vigils for marriages & children', 'Biblical womanhood & mentorship', 'Benevolence & compassionate support network'],
    },
    {
      title: 'Global Evangelism & Mercy Outreach',
      subtitle: 'All Believers · Weekly Street & Hospital Missions',
      badge: 'Missions',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Demonstrating the love of Christ in tangible ways by feeding the hungry, clothing the destitute, and preaching the gospel of resurrection.',
      image: '/images/community-outreach.jpg',
      points: ['Urban food pantry & welfare assistance', 'Hospital visitations & prison outreach', 'Open-air gospel crusades'],
    },
  ];

  return (
    <div className="w-full bg-white">
      
      {/* Header */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>COMMUNITY, AUXILIARIES &amp; MISSIONS</span>
          </div>

          <h1 className="font-serif font-black text-slate-950 text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
            Every Generation.<br />
            <span className="italic font-normal text-amber-700">One Consecrated Family.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            Discover a place where your spiritual gifts can flourish. From children’s discipleship to international outreach, our ministries are devoted to spiritual maturity and love in action.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {ministries.map((ministry, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={ministry.title}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm`}
              >
                <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-md">
                    <img
                      src={ministry.image}
                      alt={ministry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className={`lg:col-span-6 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${ministry.badgeColor}`}>
                    {ministry.badge}
                  </span>
                  
                  <span className="block text-xs font-semibold text-slate-400">
                    {ministry.subtitle}
                  </span>

                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-950">
                    {ministry.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {ministry.description}
                  </p>

                  <ul className="space-y-2 pt-2">
                    {ministry.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <button className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950 border-b-2 border-amber-500 pb-1 hover:text-amber-700 transition-colors">
                      <span>Connect with this Ministry</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
