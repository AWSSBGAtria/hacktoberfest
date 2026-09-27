import React, { useState } from 'react';
import { SCHEDULE, EVENT_DETAILS } from '../data/eventData';
import {
  Clock,
  Coffee,
  Megaphone,
  Code2,
  Laptop,
  Utensils,
  Terminal,
  Zap,
  GitCommit,
  Presentation,
  Trophy,
  Calendar,
} from 'lucide-react';

const scheduleIcons = {
  Coffee: Coffee,
  Megaphone: Megaphone,
  Code2: Code2,
  Laptop: Laptop,
  Utensils: Utensils,
  Terminal: Terminal,
  Zap: Zap,
  GitCommit: GitCommit,
  Presentation: Presentation,
  Trophy: Trophy,
};

export default function Schedule() {
  const [filter, setFilter] = useState('All');

  const filterOptions = ['All', 'Workshop', 'Hacking', 'Sprint', 'Fun & Snacks'];

  const filteredSchedule = SCHEDULE.filter((item) => {
    if (filter === 'All') return true;
    return item.type.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <section id="schedule" className="py-20 sm:py-28 bg-[#090a14] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>DAY AGENDA • OCTOBER 30</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            The Hack Day <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff007a] to-[#ffe600]">
              Hour-By-Hour Schedule.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg">
            From morning kit pickup and open-weight AI workshops to mentor office hours and evening prize presentations, here is how the day unfolds.
          </p>

          {/* Quick Date Reminder */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-[#00f0ff]" />
            <span>8:30 AM – 8:00 PM IST • Friday, October 30, 2026</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                filter === opt
                  ? 'bg-[#ff007a] text-white font-bold shadow-lg shadow-[#ff007a]/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
          {filteredSchedule.map((item, index) => {
            const Icon = scheduleIcons[item.icon] || Clock;
            return (
              <div
                key={index}
                className="relative group transition-all duration-200"
              >
                {/* Node on Timeline */}
                <div
                  className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                    item.highlight
                      ? 'bg-[#ff007a] border-white text-white shadow-md shadow-[#ff007a]/50'
                      : 'bg-[#0e101f] border-slate-600 text-slate-400 group-hover:border-[#00f0ff] group-hover:text-[#00f0ff]'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                {/* Event Card */}
                <div
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    item.highlight
                      ? 'bg-[#121429] border-[#ff007a]/40 shadow-lg shadow-[#ff007a]/10'
                      : 'bg-[#0d0f1c] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#00f0ff] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
