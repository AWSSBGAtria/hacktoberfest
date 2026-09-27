import React from 'react';
import { HIGHLIGHTS } from '../data/eventData';
import { Clock, Users, Gift, Cpu } from 'lucide-react';

const iconMap = {
  Clock: Clock,
  Users: Users,
  Gift: Gift,
  Cpu: Cpu,
};

export default function Highlights() {
  return (
    <section className="py-12 border-y border-white/10 bg-[#090b14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGHLIGHTS.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Clock;
            return (
              <div
                key={idx}
                className="relative group p-6 rounded-2xl bg-[#0f111f] border border-white/10 hover:border-[#00f0ff]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00f0ff]/10 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f0ff] group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-1 tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-mono text-slate-400">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
