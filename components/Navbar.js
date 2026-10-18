'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X, ChevronDown, MapPin, Radio, HeartHandshake, BookOpen, Calendar } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Gatherings', href: '/events' },
  ];

  return (
    <>
      {/* Top Banner (Passion City style announcement ticker) */}
      <div className="bg-slate-950 text-white text-[11px] font-semibold py-2 px-4 border-b border-white/10 hidden sm:flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-wide">THIS SABBATH: 9:00 AM BIBLE EXEGESIS &amp; 10:45 AM DIVINE SERVICE</span>
          </div>
          <div className="flex items-center gap-6 text-slate-300">
            <Link href="/sermons" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Radio className="w-3 h-3 text-red-500" />
              <span>Watch Live Stream</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/#visit" className="hover:text-amber-400 transition-colors">
              Find Directions
            </Link>
          </div>
        </div>
      </div>

      {/* Main Floating / Fixed Navigation */}
      <header className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100' : 'bg-white py-4 border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-6 h-6 stroke-amber-400 fill-none stroke-2">
                <path d="M50 15 V85 M30 38 H70" />
                <circle cx="50" cy="38" r="14" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black tracking-wider text-base text-slate-950 leading-tight">YASHUA</span>
              <span className="text-[9px] font-bold tracking-[0.24em] text-slate-500 uppercase">Resurrection Power</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                    isActive ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Location & Plan Visit CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#visit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 tracking-wider uppercase px-3 py-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Locations</span>
            </Link>

            <Link
              href="/#visit"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Plan Your Visit</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-slate-800 hover:text-amber-600 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/#visit"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-slate-950 text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Plan Your Visit This Sabbath
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
