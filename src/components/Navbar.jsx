import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Tracks', href: '#tracks' },
    { name: 'Rewards', href: '#rewards' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Venue', href: '#venue' },
    { name: 'FAQs', href: '#faq' },
  ];

  return (
    <>
      {/* Top Banner (Hacktoberfest Preptember Bar) */}
      {!bannerDismissed && (
        <div className="relative z-50 bg-[#8bb2de] text-[#10201d] border-b-2 border-[#10201d] font-mono text-xs py-2.5 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-center relative">
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRegisterClick}
              className="text-center font-semibold tracking-wide hover:underline flex items-center gap-1.5"
            >
              <span>Hacktoberfest Hack Day Bengaluru is happening Oct 30! Registration is live on MLH</span>
              <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <button
              onClick={() => setBannerDismissed(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:opacity-60 text-[#10201d]"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#3d5f58] text-[#f7f7f2] border-b-2 border-[#10201d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Wordmark Logo */}
            <a href="#" className="flex items-center gap-3 group text-decoration-none">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white uppercase leading-none">
                    HACKTOBERFEST
                  </span>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#e97b77] text-[#10201d] border border-[#10201d] shadow-[2px_2px_0_#671912] uppercase leading-none">
                    2026
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#f6c4c1] tracking-wider uppercase mt-1">
                  AWS STUDENT BUILDER GROUP · ATRIA IT
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#f7f7f2] hover:text-[#f6c4c1] hover:underline transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={EVENT_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 font-mono text-xs font-semibold text-[#f7f7f2] border-2 border-white/60 hover:bg-white hover:text-[#10201d] transition-all rounded-none shadow-[3px_3px_0_#2e4742]"
              >
                WhatsApp Group
              </a>

              <a
                href={EVENT_DETAILS.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleRegisterClick}
                className="px-4 py-2 font-mono text-xs font-bold text-[#10201d] bg-[#e97b77] border-2 border-[#10201d] shadow-[4px_4px_0_#671912] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#671912] transition-all flex items-center gap-1.5"
              >
                <span>Register on MLH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:opacity-80"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#3d5f58] border-b-2 border-[#10201d] px-6 py-6 space-y-4 font-mono text-sm">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#f7f7f2] hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
              <a
                href={EVENT_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-center border-2 border-white text-white font-mono font-semibold text-xs"
              >
                Join WhatsApp Group
              </a>

              <a
                href={EVENT_DETAILS.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleRegisterClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center bg-[#e97b77] border-2 border-[#10201d] text-[#10201d] font-mono font-bold text-xs shadow-[4px_4px_0_#671912]"
              >
                Register on MLH →
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
