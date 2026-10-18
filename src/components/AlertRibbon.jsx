import React from 'react';

/* Full-width strip that sits above the site header on every route. It is a
   plain in-app link, so the client router takes over on click - no reload. */
export default function AlertRibbon() {
  return (
    <a
      href="/shortlisted"
      className="group flex items-center justify-center gap-2 bg-[#e97b77] border-b-2 border-[#10201d] px-4 py-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#10201d] hover:bg-[#f5b726] transition-colors"
    >
      <span>View the shortlisted teams</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        -&gt;
      </span>
    </a>
  );
}
