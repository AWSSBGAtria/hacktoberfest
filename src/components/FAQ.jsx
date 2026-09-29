import React, { useEffect, useMemo, useState } from 'react';
import { FAQS, EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { ArrowRight, MessageCircle, Search, ChevronDown, LifeBuoy } from 'lucide-react';
import SectionHead from './SectionHead';

const CATS = ['All', 'Attending', 'Teams', 'First-timers', 'Registration'];

export default function FAQ() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [openId, setOpenId] = useState(0);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.map((faq, id) => ({ ...faq, id })).filter((faq) => {
      if (cat !== 'All' && faq.category !== cat) return false;
      if (!q) return true;
      return (
        faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  // Keep an answer open whenever the filter changes, so the list never sits
  // fully collapsed after a search.
  useEffect(() => {
    setOpenId(items.length ? items[0].id : -1);
  }, [query, cat]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="faq" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          eyebrow="FREQUENTLY ASKED QUESTIONS"
          title={<>Got questions?</>}
          accent="we have answers."
          pacColor="#8bb2de"
          deck="Everything you need to know about attending Hacktoberfest Hack Day Bengaluru as a university student."
        />

        {/* Toolbar: live search + category chips */}
        <div className="faq-toolbar">
          <label className="faq-search">
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search questions</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions - try “team”, “laptop”, “fee”…"
              aria-label="Search questions"
            />
          </label>
          <div className="faq-chips" role="group" aria-label="Filter by topic">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                className="faq-chip"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <p className="faq-count" role="status">
          {items.length} {items.length === 1 ? 'answer' : 'answers'}
          {cat !== 'All' ? ` in ${cat}` : ''}
          {query.trim() ? ` matching “${query.trim()}”` : ''}
        </p>

        {/* Answers */}
        {items.length ? (
          <div className="faq-list">
            {items.map((faq) => {
              const isOpen = openId === faq.id;
              const qId = `faq-q-${faq.id}`;
              const pId = `faq-a-${faq.id}`;
              return (
                <div key={faq.id} className={`faq-row${isOpen ? ' is-open' : ''}`}>
                  <button
                    id={qId}
                    type="button"
                    onClick={() => setOpenId(isOpen ? -1 : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={pId}
                    className="faq-q"
                  >
                    <span className="faq-q-text">
                      <span className="faq-cat">{faq.category}</span>
                      <span className="faq-question">{faq.q}</span>
                    </span>
                    <span className="faq-chevron" aria-hidden="true">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>
                  <div
                    id={pId}
                    role="region"
                    aria-labelledby={qId}
                    className={`faq-a${isOpen ? ' is-open' : ''}`}
                  >
                    <div>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="faq-empty">
            <p className="faq-empty-title">No answers match that search.</p>
            <p className="faq-empty-body">
              Try a shorter keyword, or ask a human - the WhatsApp group answers
              fast on event week.
            </p>
          </div>
        )}

        {/* Support card */}
        <div className="faq-support">
          <span className="faq-support-icon" aria-hidden="true">
            <LifeBuoy className="w-6 h-6" />
          </span>
          <div className="faq-support-copy">
            <p className="faq-support-title">Still stuck?</p>
            <p className="faq-support-body">
              Organisers and mentors answer in the WhatsApp group, usually within
              the hour on event week. For registration issues, start with MLH.
            </p>
          </div>
          <div className="faq-support-actions">
            <a
              href={EVENT_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ht-btn-primary whitespace-nowrap text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Ask in WhatsApp</span>
            </a>
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerFestiveConfetti}
              className="px-6 py-3.5 font-mono text-xs font-bold border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#e4e5da] shadow-[4px_4px_0_#10201d] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Register on MLH</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
