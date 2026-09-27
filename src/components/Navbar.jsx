import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { Menu, X, Terminal, ExternalLink, MessageCircle, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Tracks', href: '#tracks' },
    { name: 'Rewards', href: '#rewards' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Venue', href: '#venue' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080911]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff007a] via-[#8b5cf6] to-[#00f0ff] p-[2px] transition-transform group-hover:scale-105 duration-200">
              <div className="w-full h-full bg-[#0b0c14] rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🎃</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-base tracking-wide text-white group-hover:text-[#00f0ff] transition-colors">
                  HACKTOBERFEST
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ff007a]/20 text-[#ff007a] border border-[#ff007a]/40 font-bold uppercase">
                  Hack Day
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors">
                AWS Student Builder Group • Atria IT
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all font-mono"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={EVENT_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all flex items-center gap-1.5 text-xs font-mono font-medium"
              title="Join WhatsApp Community"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">WhatsApp Group</span>
            </a>

            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRegisterClick}
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#00f0ff] via-[#ff007a] to-[#ffe600] hover:opacity-95 shadow-md shadow-[#ff007a]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-1.5 text-white drop-shadow-sm">
                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                Register on MLH
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRegisterClick}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#ff007a] text-white flex items-center gap-1"
            >
              Register
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f1b] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-mono font-medium text-slate-200 hover:bg-white/5 hover:text-[#00f0ff]"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href={EVENT_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 flex items-center justify-center gap-2 text-sm font-mono font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Join WhatsApp Community
            </a>

            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                handleRegisterClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-center text-sm text-white bg-gradient-to-r from-[#ff007a] to-[#8b5cf6] flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Register Now on MLH
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
