import React from 'react';
import { HIGHLIGHTS } from '../data/eventData';
import { Clock, Users, Gift, Cpu } from 'lucide-react';
import Reveal from './Reveal';

const iconMap = {
  Clock: Clock,
  Users: Users,
  Gift: Gift,
  Cpu: Cpu,
};

export default function Highlights() {
  return (
    <div className="bg-[#f2f2eb] border-b-2 border-[#10201d] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGHLIGHTS.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Clock;
            return (
              <Reveal
                key={idx}
                delay={(idx % 4) * 80}
                className="theme-card p-5 bg-[#f7f7f2] border-2 border-[#10201d] shadow-[5px_5px_0_#671912] hover:shadow-[3px_3px_0_#671912] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#e4e5da] border-2 border-[#10201d] text-[#e53927]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="ht-tag !bg-[#292b65]">{item.badge}</span>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-[#10201d] tracking-tight leading-tight">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-[#34433f] mt-1">
                    {item.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
