import React from 'react';
import { REWARDS, EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { Award, Gift, CloudLightning, TreePine, Trophy, FileCheck2, Sparkles, ExternalLink } from 'lucide-react';

const rewardIcons = {
  Award: Award,
  Gift: Gift,
  CloudLightning: CloudLightning,
  TreePine: TreePine,
  Trophy: Trophy,
  FileCheck2: FileCheck2,
};

export default function Rewards() {
  const handleClaimPreview = () => {
    triggerFestiveConfetti();
  };

  return (
    <section id="rewards" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono text-yellow-300 mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>SWAGS, PRIZES & PERKS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Every Contribution <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe600] via-[#00f0ff] to-[#ff007a]">
              Gets Rewarded.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg">
            Whether through official global Hacktoberfest badges, physical stickers from MLH, or AWS Cloud Club bounties, there are perks for every participant.
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {REWARDS.map((item, idx) => {
            const Icon = rewardIcons[item.icon] || Gift;
            return (
              <div
                key={idx}
                className="relative group p-6 sm:p-8 rounded-3xl bg-[#0e101f] border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-lg"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 mb-1">{item.category}</div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Included for participants</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Swag Banner CTA */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#ff007a]/20 via-[#8b5cf6]/20 to-[#00f0ff]/20 border border-white/15 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Ready to claim your Hacktoberfest 2026 swag?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-sans max-w-xl">
              Seats are limited for the in-person hack day at Atria IT. Register now via MLH to confirm your spot and swag kit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleClaimPreview}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Celebrate!
            </button>

            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClaimPreview}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-display font-bold text-sm text-black bg-[#00f0ff] hover:bg-[#38f8ff] shadow-lg shadow-[#00f0ff]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Register for Swag</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
