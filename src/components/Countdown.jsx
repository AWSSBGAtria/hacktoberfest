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
    { label: 'Days', value: timeLeft.days, color: 'text-[#e53927]' },
    { label: 'Hours', value: timeLeft.hours, color: 'text-[#10201d]' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'text-[#10201d]' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'text-[#e53927]' },
  ];

  return (
    <div className="bg-[#e4e5da] border-b-2 border-[#10201d] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="font-mono text-xs text-[#34433f] uppercase font-bold tracking-wider mb-1 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 bg-[#e53927] inline-block animate-pulse" />
              Event Starts In
            </div>
            <div className="font-display font-bold text-2xl text-[#10201d]">
              October 30, 2026 · 8:30 AM IST
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full md:w-auto">
            {timeBlocks.map((block) => (
              <div
                key={block.label}
                className="bg-[#f7f7f2] border-2 border-[#10201d] shadow-[4px_4px_0_#671912] p-2.5 sm:p-4 text-center min-w-[70px] sm:min-w-[95px]"
              >
                <div className={`font-display font-extrabold text-2xl sm:text-4xl ${block.color} leading-none tracking-tight`}>
                  {String(block.value).padStart(2, '0')}
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-[#34433f] uppercase font-bold mt-1">
                  {block.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
