import React from 'react';
import { PARTNERS } from '../data/eventData';
import { ExternalLink, Handshake, ShieldCheck } from 'lucide-react';

export default function Partners() {
  return (
    <section id="partners" className="py-20 sm:py-24 bg-[#090b16] relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-[#00f0ff] mb-4">
            <Handshake className="w-3.5 h-3.5" />
            <span>ORGANIZERS & PARTNERS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Powered by Leading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-[#ff007a]">
              Developer Communities.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg">
            This hack day is brought to you through collaborative efforts uniting university student builders and the global open source community.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNERS.map((partner, index) => (
            <a
              key={index}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-[#0f1222] border border-white/10 hover:border-[#00f0ff]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00f0ff]">
                    {partner.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                <div className="h-12 flex items-center mb-3">
                  <span className="font-display font-black text-xl text-white group-hover:text-[#00f0ff] transition-colors">
                    {partner.logoText}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 mb-1">{partner.role}</div>
                <h4 className="font-display font-bold text-base text-slate-100 mb-2">
                  {partner.name}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">
                  {partner.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-cyan-400 group-hover:underline flex items-center gap-1">
                Learn more <span>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
