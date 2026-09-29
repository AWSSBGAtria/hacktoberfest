import React from 'react';
import SplitWords from './SplitWords';
import PacStrip from './PacStrip';
import { useReveal } from '../hooks/useReveal';

/**
 * The one section header used by every route: mono eyebrow, display title
 * with its accent line, and a right-hand side column. The side column holds
 * an optional compact Pac-Man box above the deck - the ambient chase lives
 * there now instead of a full-width ribbon, so the page keeps its rhythm.
 * Colour is driven by the surrounding surface (.theme-dark vs light).
 */
export default function SectionHead({ eyebrow, title, accent, deck, pacColor }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  const hasSide = Boolean(pacColor || deck);

  return (
    <div ref={ref} className={`section-head${visible ? ' is-visible' : ''}`}>
      <div className="section-head-main">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title">
          <SplitWords>
            {title}
            {accent ? (
              <>
                <br />
                <em>{accent}</em>
              </>
            ) : null}
          </SplitWords>
        </h2>
      </div>
      {hasSide ? (
        <div className="section-head-side">
          {pacColor ? (
            <div className="pac-spot">
              <PacStrip variant="mini" pacColor={pacColor} />
            </div>
          ) : null}
          {deck ? <div className="section-deck">{deck}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
