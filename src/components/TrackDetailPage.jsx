import React from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { TRACK_PAGES, TRACK_PAGE_ORDER } from '../data/trackDetails';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

/**
 * One full-length track brief, driven by src/data/trackDetails.js. The /build
 * cards stay the short spec sheets; this is the complete brief - requirements,
 * judging guidance, partner info and resources - in the site's stamp language:
 * ink borders, hard offset shadows, mono labels, one accent per track.
 *
 * Judging is presented without weights: all three tracks share one criteria
 * sheet, so per-track percentages must never appear here.
 */

function Block({ block, accent, accentInk }) {
  switch (block.kind) {
    case 'prose':
      return (
        <Reveal className="tb-prose">
          {block.lead ? <p className="tb-lead">{block.lead}</p> : null}
          {block.paragraphs?.map((text) => (
            <p key={text.slice(0, 40)}>{text}</p>
          ))}
          {block.bullets ? (
            <ul className="tb-bullets">
              {block.bullets.map((text) => (
                <li key={text.slice(0, 40)}>{text}</li>
              ))}
            </ul>
          ) : null}
        </Reveal>
      );

    case 'cards':
      return (
        <div className="tb-cards">
          {block.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 80} className="tb-card ht-card">
              <span className="tb-card-dot" style={{ background: accent }} aria-hidden="true" />
              <h3 className="tb-card-title">{item.title}</h3>
              <p className="tb-card-body">{item.body}</p>
            </Reveal>
          ))}
        </div>
      );

    case 'table':
      return (
        <Reveal className="tb-table-wrap">
          {block.caption ? <p className="tb-caption">{block.caption}</p> : null}
          <div className="tb-table-scroll">
            <table className="tb-table">
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell.slice(0, 24)}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tb-table-hint" aria-hidden="true">Swipe to read the full table →</p>
        </Reveal>
      );

    case 'chips':
      return (
        <Reveal className="tb-chips-block">
          {block.label ? <p className="tb-caption">{block.label}</p> : null}
          <div className="tb-chips">
            {block.items.map((item) => (
              <span key={item} className="tb-chip" style={{ '--acc': accent }}>
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      );

    case 'stats':
      return (
        <div className="tb-stats">
          {block.items.map((item, i) => (
            <Reveal key={item.label} delay={(i % 4) * 70} className="tb-stat ht-card">
              <p className="tb-stat-value">{item.value}</p>
              <p className="tb-stat-label">{item.label}</p>
            </Reveal>
          ))}
        </div>
      );

    case 'links':
      return (
        <div className="tb-links">
          {block.items.map((item, i) => (
            <Reveal key={item.href} delay={(i % 3) * 70}>
              <a
                className="tb-link ht-card"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="tb-link-top">
                  <span className="tb-link-label">{item.label}</span>
                  <ExternalLink className="tb-link-icon" size={16} aria-hidden="true" />
                </span>
                <span className="tb-link-desc">{item.desc}</span>
              </a>
            </Reveal>
          ))}
        </div>
      );

    case 'steps':
      return (
        <ol className="tb-steps">
          {block.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 5) * 70} as="li" className="tb-step">
              <span className="tb-step-num" style={{ background: accent, color: accentInk }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="tb-step-title">{item.title}</h3>
                <p className="tb-step-body">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      );

    case 'callout':
      return (
        <Reveal className="tb-callout">
          <h3 className="tb-callout-title">{block.title}</h3>
          <p className="tb-callout-body">{block.body}</p>
          {block.note ? <p className="tb-callout-note">{block.note}</p> : null}
        </Reveal>
      );

    default:
      return null;
  }
}

export default function TrackDetailPage({ track }) {
  const siblings = TRACK_PAGE_ORDER.filter((slug) => slug !== track.slug.replace('/tracks/', ''));

  return (
    <>
      {/* Masthead: dark chrome band, same indigo frame as the hero, auto height */}
      <section
        className="track-hero"
        style={{ '--acc': track.accent, '--acc-ink': track.accentInk }}
      >
        <div className="shell">
          <a href="/build" className="track-back">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>All tracks</span>
          </a>

          <p className="track-hero-tag">
            {track.tag} · Track {track.number} of 03
          </p>

          <h1 className="track-hero-title">{track.title}</h1>

          <p className="track-hero-deck">{track.deck}</p>

          <div className="track-partner">
            <span className="track-partner-label">{track.partner.role}</span>
            <span className="track-partner-plate">
              <span className="track-partner-name">{track.partner.name}</span>
              <span className="track-partner-line">{track.partner.line}</span>
            </span>
            <span className="track-partner-links">
              {track.partner.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              ))}
            </span>
          </div>

          <dl className="track-facts">
            {track.facts.map((fact) => (
              <div key={fact.label} className="track-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="track-hero-cta">
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ht-btn-primary text-sm"
            >
              <span>Register on MLH</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={EVENT_DETAILS.challengesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ht-btn-secondary text-sm"
            >
              <span>OrganizerHQ challenges</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Brief sections */}
      {track.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="theme-section bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]"
        >
          <div className="shell">
            <SectionHead
              eyebrow={section.eyebrow}
              title={section.title}
              accent={section.accent}
              deck={section.deck}
              pacColor={section.pacColor}
            />
            {section.blocks.map((block, i) => (
              <div className="tb-block" key={`${section.id}-${i}`}>
                <Block block={block} accent={track.accent} accentInk={track.accentInk} />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Closing: the other two tracks, so a reader can compare before choosing one */}
      <section className="theme-section bg-[#f2f2eb] text-[#10201d]">
        <div className="shell">
          <SectionHead
            eyebrow="The other tracks"
            title="Three tracks -"
            accent="one submission per team."
            deck="Each team works on and submits to a single track. If your build could fit more than one, pick the track that suits it best - it is judged there and only there."
          />
          <div className="tb-next">
            {siblings.map((slug) => {
              const other = TRACK_PAGES[slug];
              return (
                <Reveal key={slug} className="tb-next-card ht-card">
                  <span className="tb-next-band" style={{ background: other.accent }} aria-hidden="true" />
                  <p className="tb-next-tag">Track {other.number} · {other.tag}</p>
                  <h3 className="tb-next-title">{other.title}</h3>
                  <p className="tb-next-deck">{other.deck}</p>
                  <a className="tb-next-link" href={other.slug}>
                    Read the brief
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
