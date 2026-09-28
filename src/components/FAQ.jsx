import React, { useState } from 'react';
import { FAQS, EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          eyebrow="FREQUENTLY ASKED QUESTIONS"
          title={<>Got questions?</>}
          accent="we have answers."
          deck="Everything you need to know about attending Hacktoberfest Hack Day Bengaluru as a university student."
        />

        {/* FAQ Panel with 2px borders and hard drop shadow, on the shared shell width */}
        <Reveal className="brutal-static border-2 border-[#10201d] bg-[#f7f7f2] shadow-[7px_7px_0_#671912] divide-y-2 divide-[#10201d] mb-12">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const qId = `faq-q-${idx}`;
            const pId = `faq-a-${idx}`;
            return (
              <div key={idx}>
                <button
                  id={qId}
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={pId}
                  className="w-full text-left p-6 sm:px-8 sm:py-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#e4e5da] transition-colors"
                >
                  <span className="flex items-start gap-4 sm:gap-5 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`mt-1 shrink-0 font-mono text-[11px] font-bold leading-none px-2 py-1.5 border-2 border-[#10201d] transition-colors ${
                        isOpen ? 'bg-[#e53927] text-[#f7f7f2]' : 'bg-[#e4e5da] text-[#34433f]'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display font-bold text-xl sm:text-2xl text-[#10201d] tracking-tight leading-snug">
                      {faq.q}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`font-mono text-2xl font-bold leading-none shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-45 text-[#e53927]' : 'text-[#10201d]'
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={pId}
                  role="region"
                  aria-labelledby={qId}
                  className={`accordion-panel ${isOpen ? 'is-open' : ''}`}
                >
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                    <div className="h-0.5 w-6 bg-[#e53927] mb-3.5" aria-hidden="true" />
                    {/* 65-75ch body measure: keeps answers readable instead of
                        stretching edge-to-edge across the full panel. */}
                    <p className="max-w-[70ch] text-sm sm:text-base text-[#34433f] font-sans leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>

        {/* FAQ CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a
            href={EVENT_DETAILS.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerFestiveConfetti}
            className="ht-btn-primary w-full sm:w-auto text-sm"
          >
            <span>Register on MLH</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>

          <a
            href={EVENT_DETAILS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 font-mono text-xs font-bold border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#e4e5da] shadow-[4px_4px_0_#10201d] flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 text-[#e53927]" />
            Ask in WhatsApp Group
          </a>
        </div>
      </div>
    </section>
  );
}
