import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import BuildPage from './pages/BuildPage';
import DayPage from './pages/DayPage';
import VenuePage from './pages/VenuePage';
import FaqPage from './pages/FaqPage';
import PacPlay from './components/PacPlay';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

function getPath() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function RouteView({ path }) {
  switch (path) {
    case '/about':
      return <AboutPage />;
    case '/build':
      return <BuildPage />;
    case '/day':
      return <DayPage />;
    case '/venue':
      return <VenuePage />;
    case '/community':
    case '/faq':
      return <FaqPage />;
    default:
      return <HomePage />;
  }
}

/* Concise, per-route titles: what the page is, then the event name.
   One line, no keyword stuffing, no `| AWS Student Builder Group` tail. */
const TITLES = {
  '/': 'Hacktoberfest Hack Day Bengaluru 2026',
  '/about': 'About — Hack Day Bengaluru',
  '/build': 'Tracks — Hack Day Bengaluru',
  '/day': 'Schedule — Hack Day Bengaluru',
  '/venue': 'Venue & Map — Hack Day Bengaluru',
  '/community': 'FAQ — Hack Day Bengaluru',
  '/faq': 'FAQ — Hack Day Bengaluru',
};

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handlePopState = () => transitionTo(getPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.title = TITLES[path] || TITLES['/'];
  }, [path]);

  // Swap the route through the View Transitions API so the header and footer
  // stay pinned while only the content cross-fades. This is the one route
  // transition in the app - there is no CSS entry animation behind it, so
  // browsers without the API (and reduced-motion users) get an instant swap.
  const transitionTo = (next) => {
    const commit = () => {
      setPath(next);
      window.scrollTo(0, 0);
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition !== 'function' || reduce) {
      commit();
      return;
    }
    const view = document.startViewTransition(() => flushSync(commit));
    view.finished.catch(() => {});
  };

  // Intercept in-app anchor clicks for instant client-side routing (no
  // full-page reload flash) instead of a hard browser navigation.
  useEffect(() => {
    const handleClick = (event) => {
      const anchor = event.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/') || anchor.target === '_blank') return;

      event.preventDefault();
      const next = href.replace(/\/$/, '') || '/';
      if (next === getPath()) return;
      window.history.pushState({}, '', href);
      transitionTo(next);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Magnetic CTAs: the stamp-press buttons lean a few pixels toward the
  // pointer, which reads as weight rather than as a hover gimmick.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return undefined;

    let current = null;
    const reset = () => {
      if (!current) return;
      current.style.setProperty('--mx', '0px');
      current.style.setProperty('--my', '0px');
      current = null;
    };
    const onMove = (event) => {
      const el = event.target && event.target.closest
        ? event.target.closest('.ht-btn-primary, .ht-btn-secondary')
        : null;
      if (el !== current) {
        reset();
        current = el;
      }
      if (!current) return;
      const box = current.getBoundingClientRect();
      const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
      current.style.setProperty('--mx', `${(dx * 5).toFixed(2)}px`);
      current.style.setProperty('--my', `${(dy * 4).toFixed(2)}px`);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      document.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f2eb] text-[#10201d] flex flex-col font-sans selection:bg-[#e97b77] selection:text-[#10201d]">
      <ScrollProgress />
      <Navbar path={path} />
      <main className="route-view flex-grow" key={path}>
        <RouteView path={path} />
      </main>
      <Footer />
      <PacPlay />
      <Cursor />
    </div>
  );
}
