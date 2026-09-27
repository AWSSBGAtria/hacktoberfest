import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { ArrowRight, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';

export default function Hero() {
  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  return (
    <section className="relative overflow-hidden bg-[#3d5f58] text-[#f7f7f2] border-b-2 border-[#10201d] pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Corner Pixel Staircase Decorations (Hacktoberfest Motif) */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-36 sm:w-56 pointer-events-none opacity-40 lg:opacity-75">
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

      <div aria-hidden="true" className="absolute top-0 right-0 w-36 sm:w-56 pointer-events-none opacity-40 lg:opacity-75">
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 4 Colored Squares */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-3.5 h-3.5 bg-[#e53927]" />
          <span className="w-3.5 h-3.5 bg-[#8bb2de]" />
          <span className="w-3.5 h-3.5 bg-[#f5b726]" />
          <span className="w-3.5 h-3.5 bg-[#e97b77]" />
        </div>

        {/* Eyebrow */}
        <p className="font-mono text-xs sm:text-sm text-[#f6c4c1] uppercase tracking-[0.1em] mb-4">
          Friday, October 30, 2026 · In-Person Hack Day · Bengaluru, India
        </p>

        {/* Hero Heading */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.94] text-[#f7f7f2] mb-6 uppercase">
          Hacktoberfest Hack Day: <br />
          <em className="text-[#8bb2de] not-italic block mt-2 lowercase text-3xl sm:text-5xl lg:text-6xl font-normal font-sans italic">
            ai & open source belong to everyone.
          </em>
        </h1>

        {/* Subtitle / Deck */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#f7f7f2] leading-relaxed mb-8 font-sans">
          Join the <strong className="font-bold underline decoration-[#f5b726] decoration-2 underline-offset-4">AWS Student Builder Group</strong> at <strong className="font-bold">Atria Institute of Technology</strong> for a full day of open-source building, Google Gemma 4 AI exploration, and hands-on cloud development.
        </p>

        {/* Event Quick Facts Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2.5 bg-[#2e4742] border-2 border-[#10201d] shadow-[4px_4px_0_#10201d] text-xs font-mono text-[#f7f7f2] mb-10">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#f5b726]" />
            October 30, 2026
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-14">
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
        </div>

        {/* Partner Chips (Matching exact hacktoberfest.com style) */}
        <div className="pt-8 border-t border-white/15">
          <span className="font-mono text-[11px] text-[#f6c4c1] tracking-widest uppercase block mb-4">
            Hosted & Powered By
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] shadow-[4px_4px_0_#2e4742]">
              <span className="font-display font-bold text-sm tracking-tight">AWS Student Builder Group</span>
              <span className="font-mono text-[10px] bg-[#f5b726] px-1 py-0.2 text-[#10201d] font-bold">Atria IT</span>
            </div>

            <span className="font-display font-bold text-lg text-white">×</span>

            <div className="flex items-center gap-2 px-3.5 py-2 border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] shadow-[4px_4px_0_#2e4742]">
              <span className="font-display font-black text-sm tracking-tight text-[#e53927]">MLH</span>
              <span className="font-mono text-[10px] text-slate-600">Major League Hacking</span>
            </div>

            <span className="font-display font-bold text-lg text-white">×</span>

            <div className="flex items-center gap-2 px-3.5 py-2 border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] shadow-[4px_4px_0_#2e4742]">
              <span className="font-display font-bold text-sm tracking-tight">Hacktoberfest 2026</span>
            </div>

            <span className="font-display font-bold text-lg text-white">×</span>

            <div className="flex items-center gap-2 px-3.5 py-2 border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] shadow-[4px_4px_0_#2e4742]">
              <span className="font-display font-bold text-sm tracking-tight">Atria IT Campus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
