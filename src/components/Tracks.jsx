import React from 'react';
import { TRACKS, EVENT_DETAILS } from '../data/eventData';
import { GitPullRequest, Sparkles, Cloud, ArrowRight } from 'lucide-react';
import { triggerFestiveConfetti } from '../utils/confetti';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import Seal from './BadgeArt';

const ICONS = { GitPullRequest, Sparkles, Cloud };

export default function Tracks() {
  return (
    <section id="tracks" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          title={<>Three ways to build</>}
          accent="and three ways to win."
          pacColor="#aebcff"
          deck="Every project qualifies for the core Hacktoberfest challenge; anything using Gemma 4 or AWS can qualify for those too. Mentors are on site."
        />

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
                  <span className="track-medallion" aria-hidden="true">
                    <Icon size={24} strokeWidth={2} />
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

                  {t.href ? (
                    <a className="track-brief-link" href={t.href}>
                      <span>Read the full track brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>

                <div className="track-prize">
                  <Seal code={t.prizeSeal} color={t.accent} size={52} />
                  <div>
                    <p className="track-prize-label">Recognition</p>
                    <p className="track-prize-body">{t.prize}</p>
                  </div>
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
          <a
            href={EVENT_DETAILS.challengesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ht-btn-secondary-dark text-sm"
          >
            <span>Read the full briefs</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <p className="build-cta-note">
            Teams can form beforehand, or meet someone in the morning — solo builders are just as welcome.
          </p>
        </div>
      </div>
    </section>
  );
}
