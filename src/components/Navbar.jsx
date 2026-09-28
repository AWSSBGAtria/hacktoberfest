import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ path = '/' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Build', href: '/build' },
    { name: 'Day plan', href: '/day' },
    { name: 'Venue', href: '/venue' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      {/* Main Sticky Header */}
      <header className="site-header sticky top-0 z-40 text-[#f7f7f2] border-b-2 border-[#10201d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Wordmark Logo */}
            <a href="/" className="flex items-center gap-3 group text-decoration-none">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white uppercase leading-none">
                    HACKTOBERFEST
                  </span>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-[#e97b77] text-[#10201d] border-2 border-[#10201d] shadow-[2px_2px_0_#671912] uppercase leading-none">
                    2026
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#aebcff] tracking-wider uppercase mt-1">
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
                  aria-current={path === link.href ? 'page' : undefined}
                  className="text-[#f7f7f2] hover:text-[#aebcff] transition-colors"
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
                className="ht-btn-secondary is-compact"
              >
                WhatsApp Group
              </a>

              <a
                href={EVENT_DETAILS.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleRegisterClick}
                className="ht-btn-primary is-compact"
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
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-menu-panel md:hidden ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="site-mobile-menu border-b-2 border-[#10201d] px-6 py-6 space-y-4 font-mono text-sm">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={path === link.href ? 'page' : undefined}
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
                className="ht-btn-secondary w-full"
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
                className="ht-btn-primary w-full"
              >
                <span>Register on MLH</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
