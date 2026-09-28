import React from 'react';
import SplitWords from './SplitWords';
import { useReveal } from '../hooks/useReveal';

/**
 * The one section header used by every route: mono eyebrow, display title
 * with its accent line, and a right-hand deck. Structure and spacing are
 * fixed here so every page opens a section the same way; colour is driven
 * by the surrounding surface (.theme-dark vs the default light surface).
 *
 * Title and accent are split as a single word stream so the stagger counts
 * straight through the line break, and the eyebrow/deck fade in behind it.
 */
export default function SectionHead({ eyebrow, title, accent, deck }) {
  const [ref, visible] = useReveal({ threshold: 0.3 });

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
      {deck ? <div className="section-deck">{deck}</div> : null}
    </div>
  );
}
