import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { JUDGES } from '../data/judges';
import { EVENT_DETAILS } from '../data/eventData';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

/**
 * One label/value pair in a judge card - Organisation, Other roles, Certified.
 * Only fields the source sheet actually states are rendered, so a judge with
 * one line of metadata gets a one-line card rather than an empty block.
 */
function Field({ label, value }) {
  return (
    <div>
      <dt className="font-mono text-[11px] font-bold uppercase leading-relaxed tracking-[0.1em] text-[#34433f]">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed text-[#10201d]">{value}</dd>
    </div>
  );
}

/**
 * The judging panel. Six cards on the indigo chrome surface, each one a
 * portrait with an index stamp, the judge's name and role, then only the
 * other positions, organisation and credentials the source sheet gives us -
 * no prose bio, no tag chips. The card recipe matches the track cards (hard
 * border, offset shadow, press-toward-the-shadow hover) so the page reads as
 * part of the same print run.
 */
export default function Panel() {
  return (
    <section
      id="panel"
      className="theme-section theme-dark py-20 sm:py-28 bg-[#211f47] text-[#f7f7f2] border-b-2 border-[#10201d]"
    >
      <div className="shell">
        <SectionHead
          eyebrow="THE JUDGING PANEL"
          title={<>Six practitioners</>}
          accent="reading your pull requests."
          pacColor="#f5b726"
          deck="Cloud, DevOps, platform engineering and generative AI — all six judges work in the stacks this event is built on."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {JUDGES.map((judge, i) => {
            const rows = [
              judge.company ? { label: 'Organisation', value: judge.company } : null,
              judge.positions?.length
                ? { label: 'Other roles', value: judge.positions.join(' · ') }
                : null,
              judge.credentials?.length
                ? { label: 'Certified', value: judge.credentials.join(' · ') }
                : null,
            ].filter(Boolean);

            return (
              <Reveal
                key={judge.id}
                as="article"
                delay={(i % 3) * 90}
                className="theme-card flex flex-col overflow-hidden bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[5px_5px_0_#671912] hover:shadow-[3px_3px_0_#671912]"
                style={{ '--acc': judge.accent }}
              >
                {/* Portrait with the card's index stamp pinned to its corner. */}
                <div className="relative border-b-2 border-[#10201d]">
                  <img
                    src={judge.photo}
                    alt={`${judge.name}, ${judge.role}`}
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="block w-full aspect-square object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center border-b-2 border-r-2 border-[#10201d] font-mono text-xs font-bold tracking-widest"
                    style={{ background: judge.accent, color: judge.accentInk }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
                      {judge.name}
                    </h3>
                    <p className="mt-2 flex items-start gap-2 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-[0.1em] text-[#34433f]">
                      <span
                        aria-hidden="true"
                        className="mt-px inline-block h-2.5 w-2.5 shrink-0 border border-[#10201d]"
                        style={{ background: judge.accent }}
                      />
                      <span>{judge.role}</span>
                    </p>
                  </div>

                  {rows.length > 0 && (
                    <dl className="mt-1 grid gap-3">
                      {rows.map((row) => (
                        <Field key={row.label} label={row.label} value={row.value} />
                      ))}
                    </dl>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* What the panel is scoring against - pointed at the published
            briefs rather than inventing a rubric of our own. */}
        <Reveal className="mt-12 sm:mt-16 border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d]">
          <p className="flex items-center gap-2 border-b-2 border-[#10201d] bg-[#f5b726] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
            Before you submit
          </p>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <h3 className="font-display text-2xl font-bold leading-tight">Three tracks, three briefs</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#34433f]">
                Every track brief publishes what the judges look for, so nothing you are
                scored on is a surprise. Mentors are on the floor all day if you want to
                walk a plan past someone before you commit it.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:justify-center">
              <a href="/build" className="ht-btn-primary text-xs py-2.5">
                <span>Read the track briefs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={EVENT_DETAILS.challengesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ht-btn-secondary-dark text-xs py-2.5"
              >
                <span>MLH challenges page</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#34433f]" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
