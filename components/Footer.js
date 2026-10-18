import Link from 'next/link';
import { Church, MapPin, Calendar, Heart, Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mandate */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-serif font-black text-xl tracking-wider text-white">YASHUA RESURRECTION POWER</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A sacred assembly observing the biblical Seventh-Day Sabbath, standing in resurrection power, and honoring Yeshua Hamashiach as the true cornerstone and owner of this house.
            </p>
            <div className="text-xs text-amber-400 font-semibold tracking-wide flex items-center gap-2">
              <span>Mantle Bearers:</span>
              <span className="text-slate-300">Apostle Polycarp Ukwudiri Samuel &amp; Evangelist Polycarp Comfort Amarachi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-slate-300 hover:text-amber-400 transition-colors">Our Story &amp; Mandate</Link></li>
              <li><Link href="/sermons" className="text-slate-300 hover:text-amber-400 transition-colors">Sermon Library</Link></li>
              <li><Link href="/ministries" className="text-slate-300 hover:text-amber-400 transition-colors">Ministries &amp; Auxiliaries</Link></li>
              <li><Link href="/events" className="text-slate-300 hover:text-amber-400 transition-colors">Feasts &amp; Convocations</Link></li>
            </ul>
          </div>

          {/* Gathering Times */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Convocations</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="block font-bold text-amber-400">Seventh-Day Sabbath:</span>
                <span>9:00 AM – 1:30 PM (Sanctuary &amp; Live)</span>
              </div>
              <div>
                <span className="block font-bold text-amber-400">Wednesday Faith Clinic:</span>
                <span>5:30 PM – 7:30 PM</span>
              </div>
              <div>
                <span className="block font-bold text-amber-400">Monthly Covenant Prayer:</span>
                <span>1st &amp; 2nd Day of Every Month</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Yashua Resurrection Power Ministry (YRPM). Foundation &amp; Head: Yeshua Hamashiach.</p>
          <div className="flex items-center gap-6">
            <span>Sabbath Sanctuary</span>
            <span>Holy Ghost Empowered</span>
            <span>Uncompromising Truth</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
