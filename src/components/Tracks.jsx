import React from 'react';
import { TRACKS } from '../data/eventData';
import { GitPullRequest, Cloud, Bot, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const trackIcons = {
  GitPullRequest: GitPullRequest,
  Cloud: Cloud,
  Bot: Bot,
  Sparkles: Sparkles,
};

export default function Tracks() {
  return (
    <section id="tracks" className="py-20 sm:py-28 bg-[#07080f] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ff007a]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-[#00f0ff] mb-4">
            <Bot className="w-3.5 h-3.5" />
            <span>HACKATHON TRACKS & THEMES</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Choose Your Domain & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe600] via-[#ff007a] to-[#00f0ff]">
              Make An Impact.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg">
            Whether you want to contribute pull requests to major open-source repos, build cloud architectures on AWS, or test open-weight agent models, we have a track for you.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRACKS.map((track) => {
            const Icon = trackIcons[track.icon] || Sparkles;
            return (
              <div
                key={track.id}
                className={`relative group rounded-3xl p-8 bg-gradient-to-b ${track.color} bg-[#0e1020] border ${track.border} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${track.badgeBg}`}>
                      {track.tag}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${track.accent}`} />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white mb-3">
                    {track.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                    {track.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                      Focus Areas & Tools
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {track.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Mentors on-site available</span>
                  <span className={`font-semibold flex items-center gap-1 ${track.accent}`}>
                    Build & Submit PR <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
