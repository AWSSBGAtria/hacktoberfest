import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { ExternalLink, Check } from 'lucide-react';

export default function About() {
  const cards = [
    {
      tag: 'OPEN SOURCE',
      title: 'Built by Community',
      desc: 'Hacktoberfest is all about celebrating the open source ecosystem. Whether you are submitting your first bug fix or building an entire package, every contribution matters.',
      accent: 'border-[#10201d]',
    },
    {
      tag: 'AWS CLOUD',
      title: 'AWS Student Builder Group',
      desc: 'Our student-led user group at Atria Institute of Technology trains students in cloud architecture, serverless systems, and generative AI through hands-on builder hack days.',
      accent: 'border-[#10201d]',
    },
    {
      tag: 'AGENTIC AI',
      title: 'Open-Weight Models',
      desc: 'Explore Google Gemma 4 on Ollama, the open SKILL.md agent standard, and Hermes Agent harnesses. Learn to deploy models locally and on AWS cloud services.',
      accent: 'border-[#10201d]',
    },
    {
      tag: '100% FREE',
      title: 'Free Food, Swag & Kits',
      desc: 'Thanks to our organizers and partners, the entire day is free for university students. Enjoy morning breakfast, lunch, high tea, stickers, and exclusive swag packs.',
      accent: 'border-[#10201d]',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#2e4742] text-[#f7f7f2] border-b-2 border-[#10201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-bold text-[#8bb2de] uppercase tracking-[0.08em] mb-3">
              ABOUT THE HACK DAY · BENGALURU
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#f7f7f2] uppercase">
              Building the next generation of open builders <br />
              <em className="text-[#f5b726] not-italic font-normal font-sans italic text-3xl sm:text-5xl lowercase">
                at atria institute of technology.
              </em>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            <p className="mb-4">
              Open source is built by people who share ideas, solve problems, and improve tools together. This in-person Hack Day brings developers and students together for hands-on collaboration.
            </p>
            <a
              href={EVENT_DETAILS.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#8bb2de] hover:underline"
            >
              Learn about AWS Student Builder Group Atria <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Neo-brutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] flex flex-col justify-between"
            >
              <div>
                <span className="ht-tag mb-4 inline-block">
                  {c.tag}
                </span>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#10201d] mb-3">
                  {c.title}
                </h3>

                <p className="text-sm text-[#34433f] font-sans leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#10201d]/15 flex items-center justify-between text-xs font-mono text-[#34433f]">
                <span className="font-bold flex items-center gap-1 text-[#e53927]">
                  <Check className="w-4 h-4" /> Ready for builders
                </span>
                <span>In-person @ Hebbal</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
