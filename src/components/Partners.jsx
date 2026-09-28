import React from 'react';
import { PARTNERS } from '../data/eventData';
import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function Partners() {
  return (
    <section id="partners" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          eyebrow="ORGANIZERS & PARTNERS"
          title={<>Powered by leading</>}
          accent="developer communities."
          deck="Hacktoberfest Hack Day Bengaluru unites student builders, open source advocates, and industry developer programs."
        />

        {/* Partner Wall Grid (Exact Hacktoberfest Partner Tile Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNERS.map((partner, index) => {
            const squareColor = index % 2 === 0 ? 'bg-[#8bb2de]' : 'bg-[#f5b726]';
            return (
              <Reveal
                key={index}
                as="a"
                delay={(index % 4) * 80}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-card flex flex-col group text-decoration-none shadow-[5px_5px_0_#671912] hover:shadow-[3px_3px_0_#671912]"
              >
                {/* Partner Tile Top Label */}
                <div className="flex items-center justify-center gap-2 py-2 px-3 border-2 border-[#10201d] border-b-0 bg-[#292b65] text-[#f7f7f2] font-mono text-[11px] font-bold tracking-wider uppercase">
                  <span className={`w-2.5 h-2.5 ${squareColor} inline-block shadow-[2px_2px_0_#10201d]`} />
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
