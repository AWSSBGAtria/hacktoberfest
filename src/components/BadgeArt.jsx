import React from 'react';

/**
 * Starburst seal artwork used across the /build page.
 *
 * Every prize and badge named in the MLH Hacktoberfest Host Handbook (the DEV
 * Badge, the participation badge, the event pack, partner swag) gets an
 * original stamped seal instead of a bullet point, so "what you win" reads as
 * a wall of earned objects rather than another list of text cards.
 *
 * The shape is generated (not traced from anyone's asset) so it sits inside
 * the site's stamp language: flat offset colour, hard 4px ink outline, zero
 * blur, no gradients.
 */
function sealPath(cx, cy, rOuter, rInner, teeth) {
  const points = [];
  const total = teeth * 2;
  for (let i = 0; i < total; i += 1) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    points.push(
      `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
    );
  }
  return `M${points.join('L')}Z`;
}

const SEAL_D = sealPath(60, 60, 57, 47.5, 18);

export default function Seal({ code, color = '#5146d9', size = 96, label, className = '' }) {
  return (
    <span
      className={`badge-seal ${className}`.trim()}
      style={{ width: `${size}px`, '--seal-size': `${size}px` }}
      role="img"
      aria-label={label || code}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <path d={SEAL_D} fill={color} stroke="#10201d" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="60" cy="60" r="43" fill="#f7f7f2" stroke="#10201d" strokeWidth="4" />
        <circle
          cx="60"
          cy="60"
          r="36"
          fill="none"
          stroke="#10201d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 7"
        />
      </svg>
      <span className="badge-seal-code">{code}</span>
    </span>
  );
}
