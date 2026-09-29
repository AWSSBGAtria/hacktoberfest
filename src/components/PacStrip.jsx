import React, { useEffect, useMemo, useRef } from 'react';
import {
  createWorld,
  updateWorld,
  ghostDisplayState,
  WALL,
  DOT,
  POWER,
} from '../utils/pacmaze';

// Arcade palette, tuned to sit inside the site's indigo chrome: the band is the
// one place the design goes full CRT, so the walls read as sky-blue outlines on
// deep navy and every actor is ink-stroked like the token cards are.
const BAND_BG = '#1a1839';
const WALL_FILL = '#211f47';
const WALL_EDGE = '#8bb2de';
const PELLET = '#f2f2eb';
const ENERGIZER = '#f5b726';
const INK = '#10201d';
const FRIGHT = '#5146d9';
const FLASH = '#f7f7f2';
const DEFAULT_GHOSTS = ['#e53927', '#e97b77', '#8bb2de', '#ff7a1a'];
const TAU = Math.PI * 2;
const DIR_ANGLE = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function drawGhost(ctx, x, y, radius, color, dir, state, time) {
  const ink = Math.max(1, radius * 0.14);
  ctx.lineWidth = ink;
  ctx.lineJoin = 'round';

  if (state !== 'eyes') {
    const fill = state === 'normal' ? color : state === 'flash' ? FLASH : FRIGHT;
    const bottom = y + radius * 0.92;
    const teeth = 5;
    const width = radius * 2;
    const step = width / teeth;
    const phase = Math.floor(time * 6) % 2;

    ctx.beginPath();
    ctx.arc(x, y - radius * 0.06, radius, Math.PI, 0);
    ctx.lineTo(x + radius, bottom);
    for (let i = 0; i < teeth; i += 1) {
      const x1 = x + radius - (i + 1) * step;
      const bulge = (i + phase) % 2 === 0 ? step * 0.5 : -step * 0.5;
      ctx.quadraticCurveTo(x1 + step / 2, bottom + bulge, x1, bottom);
    }
    ctx.lineTo(x - radius, y - radius * 0.06);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();

    if (state === 'frightened' || state === 'flash') {
      const face = state === 'flash' ? FRIGHT : FLASH;
      ctx.fillStyle = face;
      const eye = radius * 0.2;
      ctx.beginPath();
      ctx.arc(x - radius * 0.38, y - radius * 0.1, eye, 0, TAU);
      ctx.arc(x + radius * 0.38, y - radius * 0.1, eye, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = face;
      ctx.lineWidth = Math.max(1, radius * 0.16);
      ctx.beginPath();
      const zigY = y + radius * 0.38;
      const zigW = radius * 1.3;
      for (let i = 0; i <= 6; i += 1) {
        const zx = x - zigW / 2 + (zigW * i) / 6;
        const zy = zigY + (i % 2 === 0 ? 0 : radius * 0.24);
        if (i === 0) ctx.moveTo(zx, zy);
        else ctx.lineTo(zx, zy);
      }
      ctx.stroke();
      return;
    }
  }

  // Eyes: white spheres with pupils that lead the direction of travel.
  const eyeR = radius * 0.36;
  const pupilR = radius * 0.17;
  const off = radius * 0.42;
  const gazeX = [1, 0, -1, 0][dir] * pupilR * 0.6;
  const gazeY = [0, 1, 0, -1][dir] * pupilR * 0.6;
  for (const side of [-1, 1]) {
    const ex = x + side * off;
    const ey = y - radius * 0.12;
    ctx.beginPath();
    ctx.arc(ex, ey, eyeR, 0, TAU);
    ctx.fillStyle = '#f7f7f2';
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(1, radius * 0.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ex + gazeX, ey + gazeY, pupilR, 0, TAU);
    ctx.fillStyle = INK;
    ctx.fill();
  }
}

function drawPac(ctx, world, x, y, radius, dead) {
  const { dir, deadT } = world.pac;
  const open = dead
    ? Math.max(0.06, Math.min(Math.PI * 0.98, (deadT / 1.5) * Math.PI))
    : Math.max(0.05, Math.abs(Math.sin(world.time * Math.PI * 8)) * 0.5);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(DIR_ANGLE[dir]);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, open, -open, false);
  ctx.closePath();
  ctx.fillStyle = world.pacColor;
  ctx.fill();
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1, radius * 0.14);
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.restore();
}

function drawMaze(ctx, world, view) {
  const { tile, cssW, cssH } = view;
  ctx.fillStyle = BAND_BG;
  ctx.fillRect(0, 0, cssW, cssH);

  const { grid, rows, cols } = world;
  const at = (r, c) =>
    r < 0 || r >= rows ? WALL : grid[r][((c % cols) + cols) % cols];

  ctx.fillStyle = WALL_FILL;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] !== WALL) continue;
      ctx.fillRect(c * tile, r * tile, tile + 0.5, tile + 0.5);
    }
  }

  ctx.beginPath();
  ctx.strokeStyle = WALL_EDGE;
  ctx.lineWidth = 2;
  ctx.lineCap = 'square';
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] !== WALL) continue;
      const x = c * tile;
      const y = r * tile;
      if (at(r - 1, c) !== WALL) {
        ctx.moveTo(x, y + 1);
        ctx.lineTo(x + tile, y + 1);
      }
      if (at(r + 1, c) !== WALL) {
        ctx.moveTo(x, y + tile - 1);
        ctx.lineTo(x + tile, y + tile - 1);
      }
      if (at(r, c - 1) !== WALL) {
        ctx.moveTo(x + 1, y);
        ctx.lineTo(x + 1, y + tile);
      }
      if (at(r, c + 1) !== WALL) {
        ctx.moveTo(x + tile - 1, y);
        ctx.lineTo(x + tile - 1, y + tile);
      }
    }
  }
  ctx.stroke();

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = grid[r][c];
      if (cell !== DOT && cell !== POWER) continue;
      const x = c * tile + tile / 2;
      const y = r * tile + tile / 2;
      ctx.beginPath();
      if (cell === DOT) {
        ctx.arc(x, y, Math.max(1.1, tile * 0.1), 0, TAU);
        ctx.fillStyle = PELLET;
      } else {
        const pulse = 0.78 + 0.22 * Math.sin(world.time * 6);
        ctx.arc(x, y, Math.max(2, tile * 0.26 * pulse), 0, TAU);
        ctx.fillStyle = ENERGIZER;
      }
      ctx.fill();
    }
  }
}

function drawActors(ctx, world, view) {
  const { tile, cssW, cssH } = view;
  const spanX = world.cols * tile;
  const radius = tile * 0.44;

  // The world wraps on x, so anything parked on the far edge also gets a copy
  // one span over - that is how a ghost slips off the right and reappears left.
  for (const offset of [0, -spanX, spanX]) {
    for (const ghost of world.ghosts) {
      const gx = ghost.x * tile + tile / 2 + offset;
      const gy = ghost.y * tile + tile / 2;
      if (gx < -tile || gx > cssW + tile || gy < -tile || gy > cssH + tile) continue;
      drawGhost(ctx, gx, gy, radius, ghost.color, ghost.dir, ghostDisplayState(world, ghost), world.time);
    }

    const pac = world.pac;
    const px = pac.x * tile + tile / 2 + offset;
    const py = pac.y * tile + tile / 2;
    if (px >= -tile && px <= cssW + tile && py >= -tile && py <= cssH + tile) {
      drawPac(ctx, world, px, py, radius, pac.dead);
    }
  }

  ctx.font = `700 ${Math.max(9, tile * 0.52)}px ui-monospace, "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f7f7f2';
  for (const popup of world.popups) {
    const x = popup.x * tile + tile / 2;
    const y = popup.y * tile + tile / 2;
    ctx.globalAlpha = Math.max(0, Math.min(1, popup.life / 0.55));
    ctx.fillText(popup.value, x, y);
  }
  ctx.globalAlpha = 1;
}

function draw(ctx, world, view) {
  if (!world) return;
  drawMaze(ctx, world, view);
  drawActors(ctx, world, view);
}

// An ambient canvas chase: route headers get a short strip wearing that
// page's accent colour, and the hero's tall side panels get a big vertical
// maze. It is decoration - pointer-events off, aria-hidden, and the loop stops
// the moment the band scrolls away or the tab is hidden.
export default function PacStrip({
  variant = 'mini',
  pacColor = ENERGIZER,
  ghostColors = DEFAULT_GHOSTS,
  className = '',
  salt = '',
}) {
  const canvasRef = useRef(null);
  const colorsKey = ghostColors.join(',');
  const colors = useMemo(() => colorsKey.split(','), [colorsKey]);
  const seed = useMemo(
    () => hashSeed(`${variant}-${salt}-${pacColor}-${colorsKey}`),
    [variant, salt, pacColor, colorsKey],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let world = null;
    let view = null;
    let raf = 0;
    let last = 0;
    let running = false;
    let failures = 0;
    let inView = true;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const build = () => {
      const cssW = Math.round(canvas.clientWidth);
      const cssH = Math.round(canvas.clientHeight);
      if (cssW < 8 || cssH < 8) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Target ~7 rows of rooms, but never below 7 and never so small the
      // tiles turn into mush: 16px is the floor, 26px the ceiling. Side
      // panels flip the fit: tile from the (narrow) width, rows grow to cover
      // the full height, so the maze reads big and vertical.
      let rows;
      let cols;
      let tile;
      if (variant === 'side') {
        tile = Math.max(12, Math.min(26, cssW / 14));
        cols = Math.max(12, Math.round(cssW / tile));
        if (cols % 2 === 1) cols += 1;
        tile = cssW / cols;
        rows = Math.max(15, Math.ceil(cssH / tile));
        if (rows % 2 === 0) rows += 1;
        rows = Math.min(61, rows);
      } else {
        const tileTarget = Math.max(16, Math.min(26, cssH / 7));
        rows = Math.round(cssH / tileTarget);
        rows = Math.max(7, Math.min(11, rows));
        if (rows % 2 === 0) rows += 1;
        tile = cssH / rows;
        cols = Math.max(16, Math.ceil(cssW / tile));
        if (cols % 2 === 1) cols += 1;
      }

      const cells = rows * cols;
      const ghostCount =
        variant === 'hero'
          ? cells >= 300
            ? 4
            : cells >= 200
              ? 3
              : 2
          : variant === 'side'
            ? 3
            : 2;

      // A ghost never wears Pac-Man's colour - on the mini strips he borrows
      // that page's accent, so the pack shifts down by one. Roles travel with
      // the colour so Blinky stays red and Clyde stays orange.
      const roles = ['blinky', 'pinky', 'inky', 'clyde'];
      const pack = colors
        .map((color, index) => ({ color, role: roles[index] }))
        .filter((ghost) => ghost.color !== pacColor)
        .slice(0, ghostCount);

      world = createWorld({
        rows,
        cols,
        pacColor,
        ghostColors: pack.map((ghost) => ghost.color),
        ghostRoles: pack.map((ghost) => ghost.role),
        seed: seed + rows * 31 + cols,
      });
      view = { tile, cssW, cssH, rows, cols };
      draw(ctx, world, view);
    };

    const frame = (t) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      try {
        const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
        last = t;
        if (!dt || !world) return;
        updateWorld(world, dt);
        draw(ctx, world, view);
        failures = 0;
      } catch (err) {
        // Self-healing: a transient canvas/world fault rebuilds the maze
        // instead of freezing the strip; persistent faults park the loop
        // instead of spamming errors every frame.
        failures += 1;
        if (failures > 30) {
          running = false;
          cancelAnimationFrame(raf);
          return;
        }
        try {
          build();
        } catch {
          /* wait for the next resize/visibility nudge */
        }
      }
    };

    const sync = () => {
      const should =
        !motion.matches && inView && document.visibilityState === 'visible';
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (!should && world) draw(ctx, world, view);
    };

    const onVisibility = () => sync();
    const onMotion = () => {
      if (motion.matches && running) {
        running = false;
        cancelAnimationFrame(raf);
        if (world) {
          updateWorld(world, 0);
          draw(ctx, world, view);
        }
      } else {
        sync();
      }
    };

    let resizeTimer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        sync();
      }, 140);
    });
    observer.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    intersection.observe(canvas);

    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);

    build();
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
    };
  }, [seed, pacColor, colorsKey, variant]);

  return (
    <div
      className={`pac-strip pac-strip-${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      {variant === 'hero' && (
        <div className="pac-hud">
          <span className="pac-hud-1up">1UP</span>
          <span className="pac-hud-high">HIGH SCORE</span>
          <span className="pac-hud-endless">ENDLESS</span>
        </div>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
}
