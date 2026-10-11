import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

const cards = [
  {
    tag: 'OPEN SOURCE',
    title: 'Built by community',
    desc: 'Whether you are submitting your first fix or shipping a whole package, every contribution counts.',
  },
  {
    tag: 'AWS CLOUD',
    title: 'AWS Student Builder Group',
    desc: 'Our student-led group at Atria runs hands-on days on cloud, serverless and generative AI.',
  },
  {
    tag: 'AGENTIC AI',
    title: 'Open-weight models',
    desc: 'Explore Google Gemma 4 on Ollama and the open SKILL.md agent standard, locally and on AWS.',
  },
  {
    tag: '100% FREE',
    title: 'Food, swag & kits',
    desc: 'Free for university students: lunch, snacks, stickers and a haul worth over ₹1.4 Lakh.',
  },
];

export default function About() {
  return (
    <section id="about" className="theme-section theme-dark py-20 sm:py-28 bg-[#211f47] text-[#f7f7f2] border-b-2 border-[#10201d]">
      <div className="shell">
        <SectionHead
          title={<>Building the next generation</>}
          accent="of open builders."
          pacColor="#e97b77"
          deck={
            <>
              <p className="mb-4">
                An in-person Hack Day where students build open source together, on campus at Atria.
              </p>
              <a
                href={EVENT_DETAILS.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#8bb2de] hover:underline"
              >
                About our student group <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => (
            <Reveal
              key={i}
              delay={(i % 2) * 90}
              className="theme-card p-6 sm:p-7 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[4px_4px_0_#671912] hover:shadow-[2px_2px_0_#671912]"
            >
              <p className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase text-[#e53927] mb-3">
                {c.tag}
              </p>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#10201d] mb-2">
                {c.title}
              </h3>

              <p className="text-sm text-[#34433f] font-sans leading-relaxed">
                {c.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
