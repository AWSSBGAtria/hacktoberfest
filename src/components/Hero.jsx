import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import Countdown from './Countdown';
import TerminalSnippet from './TerminalSnippet';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Hero() {
  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 md:pb-28 overflow-hidden cyber-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#ff007a]/20 via-[#8b5cf6]/20 to-[#00f0ff]/20 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#ff007a]/15 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#00f0ff]/15 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff007a] animate-pulse" />
            <span>Official Hacktoberfest 2026 Event</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-[#00f0ff] backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Hosted by AWS Student Builder Group @ Atria IT</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>MLH Partnered</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] mb-6">
            HACKTOBERFEST <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff007a] to-[#ffe600] drop-shadow-md">
              HACK DAY BENGALURU
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans mb-8">
            Celebrate open source, build hands-on cloud & AI tools, earn exclusive digital & physical swags, and level up your GitHub PR game with the{' '}
            <span className="text-white font-semibold">AWS Student Builder Group</span> at{' '}
            <span className="text-[#00f0ff] font-semibold">Atria Institute of Technology</span>.
          </p>

          {/* Event Quick Facts Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-3 sm:p-4 rounded-2xl bg-[#121424]/80 border border-white/10 backdrop-blur-md mb-8 text-xs sm:text-sm font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ff007a]" />
              <span className="font-semibold text-white">Friday, October 30, 2026</span>
            </div>
            <div className="hidden sm:block text-slate-600">|</div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ffe600]" />
              <span>8:30 AM – 8:00 PM IST</span>
            </div>
            <div className="hidden sm:block text-slate-600">|</div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00f0ff]" />
              <span>Atria IT, Hebbal, Bengaluru</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-10">
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-base text-white bg-gradient-to-r from-[#ff007a] via-[#a855f7] to-[#00f0ff] hover:opacity-95 shadow-xl shadow-[#ff007a]/30 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-spin" />
              <span>Register Now on MLH</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={EVENT_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-mono text-sm font-semibold text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>

          <p className="text-xs font-mono text-slate-400">
            ⚡ Free entry for all university students • Swag, lunch & mentorship included • Zero prior open-source experience needed
          </p>
        </div>

        {/* Live Countdown Grid */}
        <div className="mb-14">
          <Countdown />
        </div>

        {/* Interactive Terminal / Code Snippet */}
        <div className="max-w-3xl mx-auto">
          <TerminalSnippet />
        </div>

        {/* Down Indicator */}
        <div className="mt-12 text-center">
          <a
            href="#about"
            className="inline-flex flex-col items-center text-xs font-mono text-slate-500 hover:text-[#00f0ff] transition-colors"
          >
            <span>DISCOVER THE HACK DAY</span>
            <ChevronDown className="w-4 h-4 animate-bounce mt-1 text-[#00f0ff]" />
          </a>
        </div>
      </div>
    </section>
  );
}
