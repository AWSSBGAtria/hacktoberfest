import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { SCHEDULE } from '../data/eventData';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

/* One colour per block of the day. The badge at the top-left of every row
   and the dot on the timeline both read these, so a glance down the page
   shows where you are in the day without having to read a word. */
const TYPE_COLORS = {
  Registration: ['#ee8b83', '#10201d'],
  Opening: ['#8bb2de', '#10201d'],
  Hacking: ['#f5b726', '#10201d'],
  Quiz: ['#e53927', '#f7f7f2'],
  Break: ['#34433f', '#f2f2eb'],
  Judging: ['#211f47', '#8bb2de'],
  Ceremony: ['#671912', '#f5b726'],
};

export default function Schedule() {
  return (
    <section id="schedule" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          eyebrow="TIMELINE · OCTOBER 23, 2026"
          title={<>The Hack Day Schedule</>}
          accent="from morning kickoff to awards."
          pacColor="#e53927"
          deck={
            <>
              <p>
                Doors open at 8:30 AM for check-in and badge pickup, and the day runs through the awards at 7:00 PM. Mentors and organizers will be on deck throughout to support every builder.
              </p>
            </>
          }
        />

        {/* Continuous event flow */}
        <div className="schedule-flow">
          {SCHEDULE.map((item, index) => {
            const [event, eventInk] = TYPE_COLORS[item.type] || ['#10201d', '#f7f7f2'];
            return (
              <Reveal
                key={item.time}
                as="article"
                className={`schedule-item ${item.highlight ? 'schedule-item-highlight' : ''}`}
                style={{ '--event': event, '--event-ink': eventInk }}
              >
                <time className="schedule-time" dateTime={item.time}>
                  {item.time.split('–')[0].trim()}
                </time>
                <div className="schedule-node" aria-hidden="true" />
                <div className="schedule-content">
                  <span className="ht-tag schedule-tag text-[10px]">{item.type}</span>

                  <div className="schedule-aside">
                    <time className="schedule-range" dateTime={item.time}>{item.time}</time>
                    <span className="schedule-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="schedule-main">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#10201d] mb-3">
                      {item.title}
                    </h3>
                    <p className="schedule-desc font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Participant Handbook callout - the day's rulebook, right where
            participants finish reading the day itself. */}
        <Reveal className="mt-12 sm:mt-16">
          <div className="theme-cta p-8 sm:p-12 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#e53927] hover:shadow-[4px_4px_0_#e53927] hover:translate-x-[3px] hover:translate-y-[3px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="ht-tag mb-3 inline-block">BEFORE YOU BUILD</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-4xl uppercase tracking-tight text-[#10201d] mb-2">
                Read the Participant Handbook
              </h3>
              <p className="text-sm sm:text-base text-[#34433f] font-sans">
                Rules, team sizes, judging criteria, code of conduct, and the
                day-of checklist - everything you need for October 23, in one PDF.
              </p>
            </div>

            <a
              href="/docs/Participant_Handbook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ht-btn-primary whitespace-nowrap text-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>View Handbook</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
