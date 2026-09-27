import React from 'react';
import { PARTNERS } from '../data/eventData';
import { ExternalLink } from 'lucide-react';

export default function Partners() {
  return (
    <section id="partners" className="py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold text-[#e53927] uppercase tracking-[0.08em] mb-3">
              ORGANIZERS & PARTNERS
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#10201d] uppercase">
              Powered by leading <br />
              <em className="text-[#e53927] not-italic font-normal font-sans italic lowercase">
                developer communities.
              </em>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#34433f] font-sans leading-relaxed">
            Hacktoberfest Hack Day Bengaluru unites student builders, open source advocates, and industry developer programs.
          </p>
        </div>

        {/* Partner Wall Grid (Exact Hacktoberfest Partner Tile Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNERS.map((partner, index) => {
            const squareColor = index % 2 === 0 ? 'bg-[#8bb2de]' : 'bg-[#f5b726]';
            return (
              <a
                key={index}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col group text-decoration-none shadow-[5px_5px_0_#671912] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#671912] transition-all"
              >
                {/* Partner Tile Top Label */}
                <div className="flex items-center justify-center gap-2 py-2 px-3 border-2 border-[#10201d] border-b-0 bg-[#3d5f58] text-[#f7f7f2] font-mono text-[11px] font-bold tracking-wider uppercase">
                  <span className={`w-2.5 h-2.5 ${squareColor} inline-block shadow-[2px_2px_0_#2e4742]`} />
                  <span>{partner.badge}</span>
                </div>

                {/* Partner Tile Body */}
                <div className="p-6 border-2 border-[#10201d] bg-[#f7f7f2] flex-grow flex flex-col justify-between">
                  <div>
                    <div className="font-display font-black text-2xl text-[#10201d] mb-1">
                      {partner.logoText}
                    </div>

                    <div className="font-mono text-xs text-[#e53927] font-bold uppercase mb-3">
                      {partner.role}
                    </div>

                    <p className="text-xs text-[#34433f] font-sans leading-relaxed">
                      {partner.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#10201d]/15 flex items-center justify-between text-xs font-mono text-[#10201d] font-bold group-hover:underline">
                    <span>Learn more</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
