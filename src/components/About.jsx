import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import {
  Code,
  Heart,
  Globe2,
  Users2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';

export default function About() {
  const points = [
    {
      title: 'Open Source for Everyone',
      desc: 'Whether you are opening your first GitHub pull request or maintaining major libraries, Hacktoberfest is for all skill levels.',
      icon: Code,
      accent: 'text-[#ff007a]',
      border: 'border-[#ff007a]/30',
    },
    {
      title: 'AWS Cloud & Agentic AI Focus',
      desc: 'Get hands-on with AWS Cloud computing services alongside modern open-weight LLMs like Google Gemma 4 on Ollama.',
      icon: Layers,
      accent: 'text-[#00f0ff]',
      border: 'border-[#00f0ff]/30',
    },
    {
      title: 'Real-Time Mentorship',
      desc: 'Stuck on a Git merge conflict or looking for good first issues? On-site mentors from AWS Student Builder Group will guide you step by step.',
      icon: Users2,
      accent: 'text-[#ffe600]',
      border: 'border-[#ffe600]/30',
    },
    {
      title: 'Swags, Badges & Global Impact',
      desc: 'Earn official Holopin badges, exclusive MLH x Hacktoberfest sticker packs, AWS goodies, and support global tree planting initiatives.',
      icon: Heart,
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007a]/10 border border-[#ff007a]/30 text-xs font-mono text-[#ff007a] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE OPEN SOURCE REVOLUTION</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Built by Developers, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-[#ff007a]">
              Driven by Community.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg leading-relaxed">
            Hacktoberfest is the month-long celebration of open source software. Join us at Atria Institute of Technology in Bengaluru for a day of collaboration, learning, and code contributions.
          </p>
        </div>

        {/* 2-Column Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          {/* Box 1: About the Hack Day */}
          <div className="p-8 rounded-3xl bg-[#0f1122] border border-white/10 hover:border-[#ff007a]/40 transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/[0.02] pointer-events-none select-none font-mono">
              OCT30
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff007a] uppercase tracking-wider mb-3">
                <Terminal className="w-4 h-4" />
                <span>The Hack Day Spirit</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-4">
                Celebrate Open Source in Bengaluru
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                Open source is built by people who share ideas, solve problems, and improve tools together. This in-person event offers a welcoming space to connect with fellow student builders, discover impactful projects, and submit pull requests that count towards Hacktoberfest.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                You do not need to be an expert. Bring your curiosity, questions, and willingness to learn. We have curated tracks for beginner pull requests, cloud architecture with AWS, and edge AI workflows.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Attendee Kit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lunch & Refreshments
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certificate Included
              </span>
            </div>
          </div>

          {/* Box 2: About AWS Student Builder Group @ Atria */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121427] to-[#0a0c16] border border-cyan-500/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#00f0ff]">
                  STUDENT USER GROUP
                </span>
                <a
                  href={EVENT_DETAILS.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  awsatria.tech <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-3">
                AWS Student Builder Group at Atria IT
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                A student-led, student-driven user group at Atria Institute of Technology focused on mastering cloud technologies via AWS. We empower students to build real applications across Generative AI, cloud security, modern serverless architectures, and open-source ecosystems.
              </p>

              {/* Host Lead Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 mt-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#ff007a] to-[#00f0ff] p-[2px] shrink-0">
                  <div className="w-full h-full rounded-[10px] bg-[#0b0c14] flex items-center justify-center font-display font-bold text-lg text-white">
                    DB
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-white">Darshan B</div>
                  <div className="text-xs font-mono text-slate-400">
                    Lead Organizer • AWS Student Builder Group Atria IT
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Atria Institute of Technology, Hebbal
              </span>
              <a
                href={EVENT_DETAILS.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-semibold text-[#00f0ff] hover:underline flex items-center gap-1"
              >
                Visit Club Website →
              </a>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-[#0f1120] border ${pt.border} hover:bg-[#13162b] transition-all`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${pt.accent} mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">{pt.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{pt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
