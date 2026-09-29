import React, { useEffect, useRef } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import PacStrip from './PacStrip';
import { ArrowRight, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';

export default function Hero() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  // The two corner staircases drift apart as the hero scrolls and lean away
  // from the pointer - depth without adding anything new to the composition.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = 0;
    let mx = 0;
    let my = 0;

    const paint = () => {
      raf = 0;
      const scroll = window.scrollY;
      if (scroll > window.innerHeight * 1.2) return;
      if (leftRef.current) {
        leftRef.current.style.transform =
          `translate3d(${(-mx * 18).toFixed(1)}px, ${(scroll * 0.22 - my * 14).toFixed(1)}px, 0)`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform =
          `translate3d(${(mx * 18).toFixed(1)}px, ${(scroll * 0.34 + my * 14).toFixed(1)}px, 0)`;
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onMove = (event) => {
      mx = event.clientX / window.innerWidth - 0.5;
      my = event.clientY / window.innerHeight - 0.5;
      request();
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero-shell relative overflow-hidden text-[#f7f7f2] border-b-2 border-[#10201d] pt-12 sm:pt-20">
      {/* Corner Pixel Staircase Decorations (Hacktoberfest Motif) */}
      <div ref={leftRef} aria-hidden="true" className="hero-decoration absolute top-0 left-0 w-36 sm:w-56 pointer-events-none opacity-40 lg:opacity-75">
        <svg viewBox="0 0 317 293" fill="none" className="w-full h-auto">
          <path d="M122 195H73V244H122V195Z" fill="#F7F7F2" />
          <path d="M73 244H24V293H73V244Z" fill="#F7F7F2" />
          <path d="M171 146H122V195H171V146Z" fill="#F7F7F2" />
          <path d="M219 97H171V146H219V97Z" fill="#F7F7F2" />
          <path d="M268 48H219V97H268V48Z" fill="#F7F7F2" />
          <path d="M317 0H268V48H317V0Z" fill="#F7F7F2" />
          <path d="M146 48H171V0H146V48Z" fill="#E53927" />
          <path d="M97 48H122V0H97V48Z" fill="#E53927" />
          <path d="M48 48H73V0H48V48Z" fill="#E53927" />
          <path d="M0 48H24V0H0V48Z" fill="#E53927" />
          <path d="M73 146H97V97H73V146Z" fill="#E53927" />
        </svg>
      </div>

      <div ref={rightRef} aria-hidden="true" className="hero-decoration absolute top-0 right-0 w-36 sm:w-56 pointer-events-none opacity-40 lg:opacity-75">
        <svg viewBox="0 0 317 293" fill="none" className="w-full h-auto">
          <path d="M49 244H0V293H49V244Z" fill="#F7F7F2" />
          <path d="M98 195H49V244H98V195Z" fill="#F7F7F2" />
          <path d="M147 146H98V195H147V146Z" fill="#F7F7F2" />
          <path d="M195 97H147V146H195V97Z" fill="#F7F7F2" />
          <path d="M244 48H195V97H244V48Z" fill="#F7F7F2" />
          <path d="M292 0H244V48H292V0Z" fill="#F7F7F2" />
          <path d="M171 244H147V293H171V244Z" fill="#E53927" />
          <path d="M220 244H195V293H220V244Z" fill="#E53927" />
          <path d="M269 244H244V293H269V244Z" fill="#E53927" />
        </svg>
      </div>

      {/* Ambient side mazes - the chase runs full-height down both edges on
          wide screens, behind the copy. Pure decoration. */}
      <PacStrip variant="side" salt="left" className="pac-side pac-side-left" />
      <PacStrip variant="side" salt="right" className="pac-side pac-side-right" />

      <div className="hero-content relative z-10 mx-auto px-4 sm:px-8 lg:px-12 pb-20 sm:pb-28">
        {/* Eyebrow with the four event colours riding on the same line */}
        <p className="font-mono text-xs sm:text-sm text-[#f6c4c1] uppercase tracking-[0.1em] mb-4 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 bg-[#e53927]" />
            <span className="w-2.5 h-2.5 bg-[#8bb2de]" />
            <span className="w-2.5 h-2.5 bg-[#f5b726]" />
            <span className="w-2.5 h-2.5 bg-[#e97b77]" />
          </span>
          Friday, October 23, 2026 · In-Person Hack Day · Bengaluru, India
        </p>

        {/* Hero Heading */}
        <h1 className="hero-title font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#f7f7f2] mb-6 uppercase">
          <span className="hero-title-line">Hacktoberfest</span>
          <span className="hero-title-line hero-title-subline">Hack Day <em>Bengaluru</em></span>
        </h1>

        <p className="hero-manifesto">AI and open source belong to everyone.</p>

        {/* Subtitle / Deck */}
        <p className="hero-deck text-base sm:text-xl text-[#f7f7f2] leading-relaxed mb-8 font-sans">
          Join the <strong className="font-bold underline decoration-[#f5b726] decoration-2 underline-offset-4">AWS Student Builder Group</strong> at <strong className="font-bold">Atria Institute of Technology</strong> for a full day of open-source building, Google Gemma 4 AI exploration, and hands-on cloud development.
        </p>

        {/* Event Quick Facts Badges */}
        <div className="hero-facts inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2.5 text-xs font-mono text-[#f7f7f2] mb-10">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#f5b726]" />
            October 23, 2026
          </span>
          <span className="text-white/40">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#8bb2de]" />
            8:30 AM – 8:00 PM IST
          </span>
          <span className="text-white/40">·</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#e97b77]" />
            Atria IT, Hebbal, Bengaluru
          </span>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto mb-10">
          <a
            href={EVENT_DETAILS.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleRegisterClick}
            className="ht-btn-primary w-full sm:w-auto text-sm"
          >
            <span>Register on MLH</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>

          <a
            href={EVENT_DETAILS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ht-btn-secondary w-full sm:w-auto text-sm"
          >
            Join WhatsApp Group
          </a>

          <a href="/badge" className="ht-btn-secondary w-full sm:w-auto text-sm">
            <span>Get your badge</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        {/* Sponsor lockup */}
        <div className="hero-partners">
          <div className="hero-sponsor">
            <span className="hero-sponsor-label">Powered by</span>
            <div className="hero-sponsor-plate">
              <img src="/MLH.png" alt="Major League Hacking" className="hero-logo-mlh" />
              <span className="hero-sponsor-x" aria-hidden="true">×</span>
              <img src="/Dev.png" alt="DEV" className="hero-logo-dev" />
            </div>
          </div>

          <span className="hero-sponsor-divider" aria-hidden="true" />

          <div className="hero-sponsor">
            <span className="hero-sponsor-label">Presenting Partner</span>
            <div className="hero-sponsor-plate">
              <img src="/DigitalOcean.png" alt="DigitalOcean" className="hero-logo-do" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
