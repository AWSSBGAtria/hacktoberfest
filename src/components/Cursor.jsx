import { useEffect, useRef } from 'react';

/**
 * Custom cursor: a chunky rounded arrow head over a hexagonal fairy-dust
 * trail.
 *
 * The arrow is a single fixed element driven by one rAF loop with
 * exponential smoothing, so it lags the pointer by a few frames instead of
 * snapping. Its tip sits at the SVG origin and transform-origin is `0 0`,
 * so neither the smoothing nor the hover/press scaling can pull the point
 * away from the actual pointer.
 *
 * The trail is a canvas of free particles - the fairy-dust recipe (spawn at
 * the pointer, give each one a small random kick, pull it down with gravity,
 * shrink and fade it out) - but drawn as ink-stroked hexagons instead of
 * sparkles, in the event's orange/yellow/coral. Density comes out of how
 * fast the pointer moves, because the gap between spawns is randomised too.
 *
 * Frames (the venue map) get their own cursor: pointer events never reach us
 * from inside an iframe, so the arrow would freeze there. It steps aside
 * until the pointer comes back out.
 *
 * Only ever activates on real pointing devices; prefers-reduced-motion gets
 * the browser cursor as normal.
 */
const TRAIL_COLORS = ['#ff7a1a', '#f5b726', '#e97b77'];
const INK = '#10201d';
const HEX_R = 8; // radius at birth
const PARTICLE_COUNT = 2; // spawned per movement event
const GRAVITY = 0.022; // downward pull, px per frame²
const FADE = 0.965; // life multiplier per frame - the whole fade curve
const LIFE0 = 100;
const VEL_MIN = 0.45;
const VEL_MAX = 1.5;
const GAP_MIN = 3; // shortest pointer travel between spawns
const GAP_MAX = 12; // longest - the difference is what randomises density
const MAX_PARTICLES = 360;
const ALPHA = 0.85;
const STROKE = 1;

function traceHex(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i;
    const px = x + r * Math.cos(a);
    const py = y + r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, label';

export default function Cursor() {
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const root = document.documentElement;
    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return undefined;
    const ctx = canvas.getContext('2d');

    root.classList.add('has-custom-cursor');

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const target = { x: w / 2, y: h / 2 };
    const pos = { x: target.x, y: target.y };
    const last = { x: target.x, y: target.y };
    const fx = { hot: false, down: false, scale: 1, hotScale: 1, shown: false, blocked: false };
    let pendingShow = false;
    const particles = [];
    let cell = 0;
    let nextGap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);

    const applyOpacity = () => {
      const v = fx.shown && !fx.blocked ? '1' : '0';
      cursor.style.opacity = v;
      canvas.style.opacity = v;
    };

    // One hexagon: random kick (upward-biased), random tint, full life.
    const spawn = (x, y, vx, vy) => {
      particles.push({
        x,
        y,
        vx,
        vy,
        life: LIFE0,
        r: HEX_R * (0.7 + Math.random() * 0.6),
        color: TRAIL_COLORS[(cell + particles.length) % TRAIL_COLORS.length],
      });
      cell += 1;
      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };

    const spawnDust = (x, y) => {
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        spawn(
          x,
          y,
          (Math.random() < 0.5 ? -1 : 1) * (VEL_MIN + Math.random() * (VEL_MAX - VEL_MIN)),
          -(Math.random() * VEL_MAX),
        );
      }
    };

    const setHot = (hot) => {
      if (hot === fx.hot) return;
      fx.hot = hot;
      fx.hotScale = hot ? 1.28 : 1;
      cursor.classList.toggle('is-hot', hot);
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!fx.shown || pendingShow) {
        // First move, or the first one after coming back out of an iframe:
        // snap instead of gliding in from a stale position.
        fx.shown = true;
        fx.blocked = false;
        pendingShow = false;
        pos.x = target.x;
        pos.y = target.y;
        last.x = target.x;
        last.y = target.y;
        nextGap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
        root.classList.remove('cursor-native');
        applyOpacity();
        return;
      }

      const dist = Math.hypot(target.x - last.x, target.y - last.y);
      if (dist >= nextGap) {
        // Dust lands along the path actually travelled, not only at the
        // event's end point, so a fast flick still leaves a full streak.
        const steps = Math.min(6, Math.ceil(dist / nextGap));
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;
          spawnDust(last.x + (target.x - last.x) * t, last.y + (target.y - last.y) * t);
        }
        last.x = target.x;
        last.y = target.y;
        nextGap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      }

      setHot(Boolean(event.target && event.target.closest && event.target.closest(INTERACTIVE)));
    };

    const onDown = (event) => {
      fx.down = true;
      for (let i = 0; i < 8; i += 1) {
        const a = (Math.PI / 4) * i + Math.PI / 8;
        const v = VEL_MAX * (0.8 + Math.random() * 0.6);
        spawn(event.clientX, event.clientY, Math.cos(a) * v, Math.sin(a) * v);
      }
    };
    const onUp = () => { fx.down = false; };
    const onLeave = () => { fx.shown = false; applyOpacity(); };

    // Iframes swallow pointer events, so step the arrow aside while the
    // pointer is inside one and bring it back on the next real move.
    const frames = [];
    const onFrameEnter = () => {
      fx.blocked = true;
      pendingShow = false;
      root.classList.add('cursor-native');
      applyOpacity();
    };
    const onFrameLeave = () => {
      pendingShow = true;
    };
    const bindFrame = (frame) => {
      if (frames.indexOf(frame) !== -1) return;
      frames.push(frame);
      frame.addEventListener('mouseenter', onFrameEnter);
      frame.addEventListener('mouseleave', onFrameLeave);
    };
    const scanFrames = () => {
      document.querySelectorAll('iframe').forEach(bindFrame);
    };
    scanFrames();
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'IFRAME') bindFrame(node);
          else if (node.querySelectorAll) node.querySelectorAll('iframe').forEach(bindFrame);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    applyOpacity();

    let raf = 0;
    let prev = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - prev, 50);
      prev = now;
      const k = 1 - Math.exp(-dt / 80);
      // Physics is authored in px/frame at 60fps - normalise so a slow
      // frame doesn't freeze the dust mid-air.
      const f = dt / 16.667;

      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      fx.scale += ((fx.down ? 0.86 : fx.hotScale) - fx.scale) * k;

      cursor.style.transform =
        `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) ` +
        `scale(${fx.scale.toFixed(3)})`;

      ctx.clearRect(0, 0, w, h);
      if (particles.length) {
        ctx.lineJoin = 'round';
        ctx.miterLimit = 4;
        for (let i = particles.length - 1; i >= 0; i -= 1) {
          const p = particles[i];
          p.x += p.vx * f;
          p.y += p.vy * f;
          p.vy += GRAVITY * f;
          p.life *= Math.pow(FADE, f);
          const scale = Math.max(p.life / LIFE0, 0);
          if (scale < 0.06) {
            particles.splice(i, 1);
            continue;
          }
          const r = p.r * scale;
          ctx.globalAlpha = ALPHA * scale;
          traceHex(ctx, p.x, p.y, r);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.lineWidth = Math.max(STROKE * scale, 0.4);
          ctx.strokeStyle = INK;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      frames.forEach((frame) => {
        frame.removeEventListener('mouseenter', onFrameEnter);
        frame.removeEventListener('mouseleave', onFrameLeave);
      });
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.classList.remove('has-custom-cursor');
      root.classList.remove('cursor-native');
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <span ref={cursorRef} className="cursor-arrow" aria-hidden="true">
        <svg viewBox="0 0 28 30" focusable="false">
          <path
            className="cursor-arrow-body"
            d="M1.8 1.8 L26.2 11.4 L12.8 18 L6 28 Z"
          />
        </svg>
      </span>
    </>
  );
}
