import React, { useState } from 'react';
import { SCHEDULE, EVENT_DETAILS } from '../data/eventData';

export default function Schedule() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Workshop', 'Hacking', 'Sprint', 'Fun & Snacks'];

  const filtered = SCHEDULE.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.type.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <section id="schedule" className="py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold text-[#e53927] uppercase tracking-[0.08em] mb-3">
              TIMELINE · OCTOBER 30, 2026
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#10201d] uppercase">
              The Hack Day Schedule <br />
              <em className="text-[#e53927] not-italic font-normal font-sans italic lowercase">
                from morning kickoff to awards.
              </em>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm text-[#34433f] font-sans leading-relaxed mb-4">
              Join us starting at 8:30 AM for breakfast and badge pickup. Mentors and organizers will be on deck throughout the day to support every builder.
            </p>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 font-mono text-xs border-2 border-[#10201d] font-bold transition-all cursor-pointer ${
                    activeFilter === f
                      ? 'bg-[#e97b77] text-[#10201d] shadow-[2px_2px_0_#671912]'
                      : 'bg-[#f7f7f2] text-[#34433f] hover:bg-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const isHighlight = item.highlight;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 border-2 border-[#10201d] flex flex-col justify-between ${
                  isHighlight
                    ? 'bg-[#f7f7f2] shadow-[7px_7px_0_#671912]'
                    : 'bg-[#f7f7f2] shadow-[5px_5px_0_#2e4742]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#10201d] tracking-tight">
                      {item.time.split('–')[0].trim()}
                    </span>
                    <span className="ht-tag text-[10px]">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#10201d] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#34433f] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#10201d]/15 text-xs font-mono text-[#34433f]">
                  Time: <span className="font-bold text-[#10201d]">{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
