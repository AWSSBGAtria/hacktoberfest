import React from 'react';
import { REWARDS, EVENT_DETAILS } from '../data/eventData';
import { ArrowRight } from 'lucide-react';

export default function Rewards() {
  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  return (
    <section id="rewards" className="py-20 sm:py-28 bg-[#e4e5da] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold text-[#e53927] uppercase tracking-[0.08em] mb-3">
              SWAG & RECOGNITION
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#10201d] uppercase">
              Earn verified badges <br />
              <em className="text-[#e53927] not-italic font-normal font-sans italic lowercase">
                and exclusive swag kits.
              </em>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#34433f] font-sans leading-relaxed">
            Participants at Atria Institute of Technology receive physical sticker packs, Holopin digital badges, AWS goodies, and support global environmental tree-planting efforts.
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {REWARDS.map((r, i) => {
            const isHighlight = i === 4; // Top winner card highlighted in yellow
            return (
              <div
                key={i}
                className={`p-6 sm:p-8 border-2 border-[#10201d] flex flex-col justify-between ${
                  isHighlight
                    ? 'bg-[#f5b726] shadow-[7px_7px_0_#8a5d13]'
                    : 'bg-[#f7f7f2] shadow-[7px_7px_0_#671912]'
                }`}
              >
                <div>
                  <span className={`ht-tag mb-4 inline-block ${isHighlight ? '!bg-[#10201d] !text-[#f5b726]' : ''}`}>
                    {r.tag}
                  </span>

                  <h3 className="font-display font-bold text-2xl text-[#10201d] mb-3">
                    {r.title}
                  </h3>

                  <p className="text-sm text-[#34433f] font-sans leading-relaxed mb-6">
                    {r.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#10201d]/15 flex items-center justify-between font-mono text-xs">
                  <span className="text-[#34433f]">{r.category}</span>
                  <span className="font-bold text-[#e53927]">Included ✓</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Call to Action */}
        <div className="p-8 sm:p-12 bg-[#3d5f58] text-[#f7f7f2] border-2 border-[#10201d] shadow-[7px_7px_0_#10201d] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl uppercase tracking-tight text-white mb-2">
              Ready to claim your swag kit on Oct 30?
            </h3>
            <p className="text-sm sm:text-base text-[#f6c4c1] font-sans">
              Attendee kits and food are limited to registered participants. Make sure to complete your registration via MLH.
            </p>
          </div>

          <a
            href={EVENT_DETAILS.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleRegisterClick}
            className="ht-btn-primary whitespace-nowrap text-sm"
          >
            <span>Register for Free</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
