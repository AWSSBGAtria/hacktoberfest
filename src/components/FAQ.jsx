import React, { useState } from 'react';
import { FAQS, EVENT_DETAILS } from '../data/eventData';
import { HelpCircle, ChevronDown, MessageCircle, ExternalLink } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-mono text-[#ff007a] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Frequently Asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] via-[#8b5cf6] to-[#00f0ff]">
              Questions.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg">
            Everything you need to know about participating in the Hacktoberfest Hack Day at Atria IT.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-14">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-[#0d0f1e] overflow-hidden transition-all duration-200 hover:border-white/20"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00f0ff] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#ff007a]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-300 text-sm font-sans leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-display font-bold text-base text-white">Have more questions?</h4>
            <p className="text-xs font-mono text-slate-400">
              Join the official WhatsApp community to chat directly with organizers and mentors.
            </p>
          </div>

          <a
            href={EVENT_DETAILS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
