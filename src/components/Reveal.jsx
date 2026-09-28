import React from 'react';
import { useReveal } from '../hooks/useReveal';

/**
 * Shared scroll-reveal wrapper. Every card grid and timeline row on the
 * site uses this one recipe (fade + small rise) instead of each section
 * inventing its own entrance effect.
 */
export default function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, visible] = useReveal();
  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
