import React, { useEffect, useRef, useState } from 'react';

/**
 * Splits its children's text nodes into word spans that unmask in sequence.
 *
 * The reveal is a clip-path wipe rather than a transform+overflow pair so
 * tall glyphs and the `.section-title` line-height never get clipped, and
 * because a bare `translate`/`opacity` pair composits cleanly. Element
 * children (the accent <em>, the <br>) pass through untouched so the words
 * still number continuously across them.
 */
function toWords(node, base, counter) {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((chunk) => {
      if (!chunk) return null;
      if (/^\s+$/.test(chunk)) return chunk;
      counter.value += 1;
      return (
        <span key={`${base}-${counter.value}`} className="sw">
          <span className="sw-in" style={{ '--sw-delay': `${(counter.value - 1) * 55}ms` }}>
            {chunk}
          </span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => toWords(child, `${base}-${i}`, counter));
  }
  if (React.isValidElement(node)) {
    if (node.props.children === undefined) return node;
    return React.cloneElement(node, { children: toWords(node.props.children, base, counter) });
  }
  return node;
}

export default function SplitWords({ children }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const counter = useRef({ value: 0 });

  counter.current.value = 0;
  const split = toWords(children, 'w', counter.current);
  const total = counter.current.value;

  useEffect(() => {
    setReady(false);
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [total]);

  return (
    <span ref={ref} className={`split-words${ready ? ' is-in' : ''}`}>
      {split}
    </span>
  );
}
