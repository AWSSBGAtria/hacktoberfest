import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { ExternalLink, Check } from 'lucide-react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

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
      desc: 'Thanks to our organizers and partners, the entire day is free for university students. Lunch, snacks, stickers and swag - a haul worth over ₹1.4 Lakh across the day.',
      accent: 'border-[#10201d]',
    },
  ];

  return (
    <section id="about" className="theme-section theme-dark py-20 sm:py-28 bg-[#211f47] text-[#f7f7f2] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro Row */}
        <SectionHead
          eyebrow="ABOUT THE HACK DAY · BENGALURU"
          title={<>Building the next generation of open builders</>}
          accent="at atria institute of technology."
          pacColor="#e97b77"
          deck={
            <>
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
            </>
          }
        />

        {/* 4 Neo-brutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => (
            <Reveal
              key={i}
              delay={(i % 2) * 90}
              className="theme-card p-6 sm:p-8 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] hover:shadow-[4px_4px_0_#671912] flex flex-col justify-between"
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
