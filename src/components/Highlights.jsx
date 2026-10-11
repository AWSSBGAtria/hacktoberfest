import React from 'react';
import { HIGHLIGHTS } from '../data/eventData';

/**
 * A quiet stat rail, not a card grid: four facts on one hairline rule.
 * The old version stacked an icon box, a badge pill, a display number and
 * a label per stat - four competing weights for four short facts.
 */
export default function Highlights() {
  return (
    <div className="bg-[#f2f2eb] border-b-2 border-[#10201d] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
          {HIGHLIGHTS.map((item, idx) => (
            <div key={idx} className="border-t-2 border-[#10201d] pt-3">
              <p className="font-display font-bold text-lg sm:text-xl text-[#10201d] tracking-tight leading-tight">
                {item.value}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#34433f] mt-1.5 leading-relaxed">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
