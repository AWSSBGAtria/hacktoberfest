import React, { useState } from 'react';
import { FAQS, EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold text-[#e53927] uppercase tracking-[0.08em] mb-3">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#10201d] uppercase">
              Got questions? <br />
              <em className="text-[#e53927] not-italic font-normal font-sans italic lowercase">
                we have answers.
              </em>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#34433f] font-sans leading-relaxed">
            Everything you need to know about attending Hacktoberfest Hack Day Bengaluru as a university student.
          </p>
        </div>

        {/* FAQ Panel with 2px borders and hard drop shadow */}
        <div className="border-2 border-[#10201d] bg-[#f7f7f2] shadow-[7px_7px_0_#671912] divide-y-2 divide-[#10201d] mb-12">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 sm:px-8 sm:py-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display font-bold text-xl sm:text-2xl text-[#10201d] tracking-tight leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-2xl font-bold text-[#10201d] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-45 text-[#e53927]' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 text-sm sm:text-base text-[#34433f] font-sans leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
