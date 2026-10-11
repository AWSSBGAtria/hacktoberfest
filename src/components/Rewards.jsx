import React from 'react';
import { REWARDS, EVENT_DETAILS } from '../data/eventData';
import { ArrowRight, Check, Trophy } from 'lucide-react';
import { triggerFestiveConfetti } from '../utils/confetti';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import Seal from './BadgeArt';

/**
 * Rewards is deliberately NOT the same surface as Tracks. Tracks are a light
 * "spec sheet" per challenge; this section is a dark vault where every reward
 * tier is shown as a stamped seal, so a visitor can tell "what you get for
 * showing up" apart from "what you get for winning" at a glance. Prize
 * specifics stay vague on purpose - details are confirmed closer to the day.
 */
const GROUPS = [
  {
    name: 'For every attendee',
    note: 'Included just for showing up and building',
    accent: '#8bb2de',
    cols: 'sm:grid-cols-2',
  },
  {
    name: 'Track winners',
    note: 'Awarded to the winning team of each challenge',
    accent: '#f5b726',
    cols: 'sm:grid-cols-2 lg:grid-cols-3',
  },
  {
    name: 'Recognition',
    note: 'Issued after the event to everyone who finishes the day',
    accent: '#ee8b83',
    cols: 'sm:grid-cols-1',
  },
];

export default function Rewards() {
  const handleRegisterClick = () => {
    triggerFestiveConfetti();
  };

  return (
    <section
      id="rewards"
      className="theme-section theme-dark py-20 sm:py-28 bg-[#211f47] text-[#f7f7f2] border-b-2 border-[#10201d]"
    >
      <div className="shell">
        {/* Intro */}
        <SectionHead
          title={<>What you walk away</>}
          accent="with on the day."
          deck={<>Three challenge tracks plus our own club bonus, and a goody haul worth over {EVENT_DETAILS.goodiesWorth}. Prize details land closer to the day.</>}
        />

        {/* Grouped Rewards */}
        <div className="space-y-14 mb-14">
          {GROUPS.map((group) => {
            const items = REWARDS.filter((r) => r.group === group.name);
            if (items.length === 0) return null;

            return (
              <div key={group.name}>
                <div
                  className="reward-tier"
                  style={{ '--tier': group.accent }}
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="reward-tier-name">{group.name}</h3>
                  </div>
                  <span className="reward-tier-note">{group.note}</span>
                </div>

                <div className={`grid grid-cols-1 ${group.cols} gap-6`}>
                  {items.map((r, i) => {
                    const isHighlight = Boolean(r.isHighlight);
                    const isPrize = group.name === 'Track winners';
                    const FooterIcon = isPrize ? Trophy : Check;
                    const footerLabel = isPrize
                      ? 'Awarded to the winning team'
                      : group.name === 'Recognition'
                        ? 'Issued after the event'
                        : 'Included for every attendee';

                    return (
                      <Reveal
                        key={r.title}
                        as="article"
                        delay={(i % 3) * 90}
                        className={`reward-card${isHighlight ? ' is-highlight' : ''}`}
                      >
                        <div className="reward-top">
                          <div className="min-w-0">
                            <span className="reward-tag">{r.tag}</span>
                            <h4 className="reward-title">{r.title}</h4>
                          </div>
                          <Seal
                            code={r.seal}
                            color={isHighlight ? '#e53927' : r.sealColor}
                            size={58}
                            label={`${r.seal} badge`}
                          />
                        </div>

                        <p className="reward-desc">{r.description}</p>

                        <div className="reward-foot">
                          <span>{r.category}</span>
                          <span className="reward-foot-cta">
                            <FooterIcon className="w-3.5 h-3.5" />
                            {footerLabel}
                          </span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom banner: one quiet line and the register button - the card
            grid above already makes the case. Sits on the section's dark
            navy, so the type stays light. */}
        <div className="theme-cta mt-2 pt-8 border-t-2 border-white/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f7f7f2] mb-2">
                Ready to build on Oct 23?
              </h3>
              <p className="text-sm text-[#c6caf0] font-sans">
                Food and attendee kits go to registered participants, while supplies last.
              </p>
          </div>

          <a
            href={EVENT_DETAILS.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleRegisterClick}
            className="ht-btn-primary whitespace-nowrap text-sm"
          >
            <span>Register for free</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
