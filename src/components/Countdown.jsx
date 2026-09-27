import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS } from '../data/eventData';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(EVENT_DETAILS.eventTargetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days, color: 'text-[#00f0ff]', border: 'border-[#00f0ff]/30' },
    { label: 'HOURS', value: timeLeft.hours, color: 'text-[#ff007a]', border: 'border-[#ff007a]/30' },
    { label: 'MINUTES', value: timeLeft.minutes, color: 'text-[#ffe600]', border: 'border-[#ffe600]/30' },
    { label: 'SECONDS', value: timeLeft.seconds, color: 'text-[#10b981]', border: 'border-[#10b981]/30' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-mono tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          Countdown to Hack Day Kickoff
        </span>
        <span className="text-xs font-mono text-slate-400">Oct 30, 2026 • 08:30 IST</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className={`relative group bg-[#0e111e]/90 border ${block.border} rounded-2xl p-3 sm:p-4 text-center backdrop-blur-md overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className={`text-2xl sm:text-4xl md:text-5xl font-mono font-bold ${block.color} tracking-tight`}>
              {String(block.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-slate-400 mt-1 uppercase">
              {block.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
