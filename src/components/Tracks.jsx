import React from 'react';
import { TRACKS } from '../data/eventData';
import { ArrowRight } from 'lucide-react';

export default function Tracks() {
  return (
    <section id="tracks" className="py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold text-[#e53927] uppercase tracking-[0.08em] mb-3">
              TRACKS & DOMAINS
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#10201d] uppercase">
              Four ways to build <br />
              <em className="text-[#e53927] not-italic font-normal font-sans italic lowercase">
                your open source legacy.
              </em>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#34433f] font-sans leading-relaxed">
            Whether you are making your first git commit, building cloud applications with AWS, or testing modern open-weight LLMs, choose a track that excites you. Mentors are on-site to help.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TRACKS.map((t) => (
            <div
              key={t.id}
              className="p-8 bg-[#f7f7f2] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] flex flex-col justify-between"
            >
              <div>
                <span className="ht-tag mb-4 inline-block">
                  {t.tag}
                </span>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#10201d] mb-3">
                  {t.title}
                </h3>

                <p className="text-sm text-[#34433f] font-sans leading-relaxed mb-6">
                  {t.description}
                </p>

                <div className="mb-6">
                  <div className="font-mono text-[11px] text-[#34433f] uppercase font-bold tracking-wider mb-2">
                    Key Tools & Focus:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-xs font-mono bg-[#e4e5da] border border-[#10201d] text-[#10201d] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#10201d]/15 flex items-center justify-between text-xs font-mono">
                <span className="text-[#34433f]">All experience levels welcome</span>
                <span className="font-bold text-[#e53927] flex items-center gap-1">
                  Build Track <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
