import React from 'react';
import { TRACKS, EVENT_DETAILS } from '../data/eventData';
import { GitPullRequest, Sparkles, Cloud, ArrowRight } from 'lucide-react';
import { triggerFestiveConfetti } from '../utils/confetti';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import Seal from './BadgeArt';

const ICONS = { GitPullRequest, Sparkles, Cloud };

const STEPS = [
  {
    n: '01',
    title: 'Pick a track',
    body: 'Core Hacktoberfest, Gemma 4, or AWS. One project can qualify for more than one.',
  },
  {
    n: '02',
    title: 'Build all day',
    body: 'Mentors from AWS Student Builder Group and open source roam the room from 10:15 AM.',
  },
  {
    n: '03',
    title: 'Demo and submit',
    body: 'Push your repo, open your PR, and get your project on stage.',
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          eyebrow="CHALLENGE TRACKS"
          title={<>Three ways to build</>}
          accent="and three shots at prizes."
          deck="Every project can qualify for the core Hacktoberfest challenge, and any project that also uses Gemma 4 or AWS can qualify for those too. Mentors are on-site to help."
        />

        {/* How the day pays out - handbook-backed, so the tracks read as a
            process rather than three isolated posters. */}
        <div className="build-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="build-step">
              <span className="build-step-num" aria-hidden="true">
                {s.n}
              </span>
              <div>
                <p className="build-step-title">{s.title}</p>
                <p className="build-step-body">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {TRACKS.map((t, i) => {
            const Icon = ICONS[t.icon] || GitPullRequest;
            return (
              <Reveal
                key={t.id}
                as="article"
                delay={(i % 3) * 90}
                className="track-card"
                style={{ '--acc': t.accent, '--acc-ink': t.accentInk }}
              >
                <span className="track-band" aria-hidden="true" />

                <div className="track-body">
                  <span className="track-number" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="track-medallion" aria-hidden="true">
                    <Icon size={24} strokeWidth={2.4} />
                  </span>

                  <p className="track-tag">{t.tag}</p>

                  <h3 className="track-title">{t.title}</h3>

                  <p className="track-desc">{t.description}</p>

                  <div className="track-tools">
                    <p className="track-tools-label">Key tools &amp; focus</p>
                    <div className="track-chips">
                      {t.skills.map((skill) => (
                        <span key={skill} className="track-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="track-prize">
                  <Seal code={t.prizeSeal} color={t.accent} size={58} />
                  <div>
                    <p className="track-prize-label">What you win</p>
                    <p className="track-prize-body">{t.prize}</p>
                  </div>
                </div>

                <div className="track-foot">
                  <span>All experience levels welcome</span>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="build-cta">
          <a
            href={EVENT_DETAILS.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerFestiveConfetti}
            className="ht-btn-primary text-sm"
          >
            <span>Register on MLH</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <p className="build-cta-note">
            Teams form at 10:15 AM — solo builders are just as welcome.
          </p>
        </div>
      </div>
    </section>
  );
}
