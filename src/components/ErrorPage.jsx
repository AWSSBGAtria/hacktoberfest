import React from 'react';
import { ArrowRight, Home, RotateCcw, TriangleAlert } from 'lucide-react';
import Reveal from './Reveal';
import { EVENT_DETAILS } from '../data/eventData';

/**
 * Shared shell for the 404 and 500 routes.
 *
 * Both are the same shape on purpose: a stamped status code, one honest
 * sentence about what happened, and a real way out. A dead end that only
 * says "not found" wastes the visit - every link below is a page that
 * actually exists, because the most common reason to land here is a
 * mistyped or retired link from an old share.
 */
const DESTINATIONS = [
  { href: '/', label: 'Home', note: 'The event in one page' },
  { href: '/build', label: 'Tracks & themes', note: 'What you can build' },
  { href: '/day', label: 'Day plan', note: 'Timings, start to finish' },
  { href: '/venue', label: 'Venue', note: 'Address, map, what to bring' },
  { href: '/faq', label: 'FAQ', note: 'Teams, food, Wi-Fi, submitting' },
];

export default function ErrorPage({
  code,
  eyebrow,
  title,
  body,
  accent = '#aebaff',
  action,
}) {
  return (
    <section className="shell py-16 sm:py-24 lg:py-28">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center">
          {/* Stamped status code. The offset shadow is the site's "stamp"
              motif - the same press used on the CTA buttons. */}
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#5146d9]">
            {eyebrow}
          </p>
          <p
            aria-hidden="true"
            className="font-display font-black leading-[0.82] tracking-tight mt-5"
            style={{
              fontSize: 'clamp(5.5rem, 22vw, 12rem)',
              color: '#10201d',
              textShadow: `6px 6px 0 ${accent}`,
            }}
          >
            {code}
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10 text-center">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#10201d]">
            {title}
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#3d4a45] leading-relaxed mt-5 max-w-xl mx-auto">
            {body}
          </p>
        </Reveal>

        <Reveal delay={140} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/" className="ht-btn-primary w-full sm:w-auto">
            <span>Back to the home page</span>
            <Home className="w-4 h-4" aria-hidden="true" />
          </a>
          {action}
        </Reveal>

        {/* Escape hatches. Better a visitor keeps reading the site than
            bounces back to whatever search result sent them here. */}
        <Reveal delay={200} className="mt-16">
          <div className="border-t-2 border-[#10201d] pt-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#10201d] text-center">
              Where did you mean to go?
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {DESTINATIONS.map((item, i) => (
                <li key={item.href}>
                  <Reveal
                    delay={240 + i * 60}
                    className="h-full border-2 border-[#10201d] bg-[#f7f7f2] shadow-[4px_4px_0_#10201d] hover:shadow-[2px_2px_0_#10201d] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                  >
                    <a href={item.href} className="flex items-center justify-between gap-3 h-full px-5 py-4 group">
                      <span>
                        <span className="block font-display font-bold text-base text-[#10201d]">
                          {item.label}
                        </span>
                        <span className="block font-mono text-[11px] text-[#5b6862] mt-1">
                          {item.note}
                        </span>
                      </span>
                      <ArrowRight
                        className="w-4 h-4 shrink-0 text-[#5146d9] group-hover:translate-x-1 transition-transform duration-200"
                        aria-hidden="true"
                      />
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={420} className="mt-10 text-center">
          <p className="font-mono text-xs text-[#5b6862] leading-relaxed">
            Still stuck?{' '}
            <a
              href={EVENT_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#5146d9] underline underline-offset-4 hover:text-[#10201d]"
            >
              Ask on the WhatsApp group
            </a>{' '}
            or email the organizers at{' '}
            <a
              href="mailto:hacktober@awsatria.tech"
              className="font-bold text-[#5146d9] underline underline-offset-4 hover:text-[#10201d]"
            >
              hacktober@awsatria.tech
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The 500 route gets one extra control the 404 does not: a retry that
 *  actually re-runs the request, since a server fault may be transient. */
export function ServerErrorAction() {
  return (
    <button type="button" onClick={() => window.location.reload()} className="ht-btn-secondary-dark w-full sm:w-auto">
      <RotateCcw className="w-4 h-4" aria-hidden="true" />
      <span>Try again</span>
    </button>
  );
}

/** Small inline note used by the 500 copy so the fault is clearly ours. */
export function ServerFaultNote() {
  return (
    <p className="font-mono text-xs text-[#5b6862] mt-6 inline-flex items-center gap-2">
      <TriangleAlert className="w-3.5 h-3.5 text-[#e53927]" aria-hidden="true" />
      The error is on our side, not yours.
    </p>
  );
}
