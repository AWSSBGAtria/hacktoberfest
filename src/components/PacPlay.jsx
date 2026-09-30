import React, { useEffect, useRef, useState } from 'react';
import {
  createChallenge,
  setWant,
  updateChallenge,
  TILE,
  LIVES_PER_ATTEMPT,
} from '../utils/awspac';
import { ghostDisplayState, WALL, DOT, POWER } from '../utils/pacmaze';
import { loadMine, saveEntry, getLock } from '../utils/scoredb';

const BOARD_BG = '#1a1839';
const WALL_FILL = '#211f47';
const WALL_EDGE = '#8bb2de';
const PELLET = '#f2f2eb';
const INK = '#10201d';
const TAU = Math.PI * 2;
const DIR_ANGLE = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

function formatTime(t) {
  if (t === null || t === undefined) return '–';
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

function drawGhost(ctx, x, y, radius, color, dir, face, time) {
  ctx.lineWidth = Math.max(1, radius * 0.14);
  ctx.lineJoin = 'round';
  if (face !== 'eyes') {
    const fill = face === 'normal' ? color : face === 'flash' ? '#f7f7f2' : '#5146d9';
    const bottom = y + radius * 0.92;
    const teeth = 5;
    const step = (radius * 2) / teeth;
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
    if (face !== 'normal') {
      // Scared face: dot eyes and a zigzag mouth, like the arcade.
      const paint = face === 'flash' ? '#5146d9' : '#f7f7f2';
      ctx.fillStyle = paint;
      const eye = radius * 0.2;
      ctx.beginPath();
      ctx.arc(x - radius * 0.38, y - radius * 0.1, eye, 0, TAU);
      ctx.arc(x + radius * 0.38, y - radius * 0.1, eye, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = paint;
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

function drawBoard(ctx, game) {
  const W = game.cols * TILE;
  const H = game.rows * TILE;
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = WALL_FILL;
  for (let r = 0; r < game.rows; r += 1) {
    for (let c = 0; c < game.cols; c += 1) {
      if (game.grid[r][c] !== WALL) continue;
      ctx.fillRect(c * TILE, r * TILE, TILE + 0.5, TILE + 0.5);
    }
  }
  const at = (r, c) =>
    r < 0 || r >= game.rows || c < 0 || c >= game.cols ? WALL : game.grid[r][c];
  ctx.beginPath();
  ctx.strokeStyle = WALL_EDGE;
  ctx.lineWidth = 2;
  for (let r = 0; r < game.rows; r += 1) {
    for (let c = 0; c < game.cols; c += 1) {
      if (game.grid[r][c] !== WALL) continue;
      const x = c * TILE;
      const y = r * TILE;
      if (at(r - 1, c) !== WALL) {
        ctx.moveTo(x, y + 1);
        ctx.lineTo(x + TILE, y + 1);
      }
      if (at(r + 1, c) !== WALL) {
        ctx.moveTo(x, y + TILE - 1);
        ctx.lineTo(x + TILE, y + TILE - 1);
      }
      if (at(r, c - 1) !== WALL) {
        ctx.moveTo(x + 1, y);
        ctx.lineTo(x + 1, y + TILE);
      }
      if (at(r, c + 1) !== WALL) {
        ctx.moveTo(x + TILE - 1, y);
        ctx.lineTo(x + TILE - 1, y + TILE);
      }
    }
  }
  ctx.stroke();

  for (let r = 0; r < game.rows; r += 1) {
    for (let c = 0; c < game.cols; c += 1) {
      const cell = game.grid[r][c];
      if (cell !== DOT && cell !== POWER) continue;
      const x = c * TILE + TILE / 2;
      const y = r * TILE + TILE / 2;
      ctx.beginPath();
      if (cell === DOT) {
        ctx.arc(x, y, Math.max(1.2, TILE * 0.13), 0, TAU);
        ctx.fillStyle = PELLET;
      } else {
        const pulse = 0.78 + 0.22 * Math.sin(game.time * 6);
        ctx.arc(x, y, Math.max(2.4, TILE * 0.3 * pulse), 0, TAU);
        ctx.fillStyle = '#f5b726';
      }
      ctx.fill();
    }
  }

  const radius = TILE * 0.44;
  for (const g of game.ghosts) {
    drawGhost(
      ctx,
      g.x * TILE + TILE / 2,
      g.y * TILE + TILE / 2,
      radius,
      g.color,
      g.dir,
      ghostDisplayState(game, g),
      game.time,
    );
  }

  // Pac blinks while caught; otherwise he chomps toward his heading.
  const p = game.pac;
  const blinkOff = game.status === 'dying' && Math.floor(game.deadT / 0.15) % 2 === 1;
  if (!blinkOff) {
    const open = Math.max(0.05, Math.abs(Math.sin(game.time * Math.PI * 8)) * 0.5);
    ctx.save();
    ctx.translate(p.x * TILE + TILE / 2, p.y * TILE + TILE / 2);
    ctx.rotate(DIR_ANGLE[p.dir]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, open, -open, false);
    ctx.closePath();
    ctx.fillStyle = '#f5b726';
    ctx.fill();
    ctx.lineWidth = Math.max(1, radius * 0.14);
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.restore();
  }
}

function PacLogo() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <path
        d="M16 16 L28.5 8.5 A13.5 13.5 0 1 0 28.5 23.5 Z"
        fill="#f5b726"
        stroke="#10201d"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="10.5" r="2.1" fill="#10201d" />
    </svg>
  );
}

const KEY_DIRS = {
  ArrowUp: 3,
  ArrowDown: 1,
  ArrowLeft: 2,
  ArrowRight: 0,
  w: 3,
  s: 1,
  a: 2,
  d: 0,
  W: 3,
  S: 1,
  A: 2,
  D: 0,
};

export default function PacPlay() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState('guide');
  const [won, setWon] = useState(false);
  const [endScore, setEndScore] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', institution: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [entry, setEntry] = useState(null);

  const gameRef = useRef(null);
  const canvasRef = useRef(null);
  const panelRef = useRef(null);
  const scoreRef = useRef(null);
  const timeRef = useRef(null);
  const livesRef = useRef(null);
  const dotsRef = useRef(null);
  const touchRef = useRef(null);

  const openModal = async () => {
    const lock = getLock();
    if (lock) {
      try {
        // Own row only: the public list no longer carries emails.
        const mine = await loadMine(lock.email);
        setEntry(mine || lock);
      } catch {
        setEntry(lock);
      }
      setScreen('done');
    } else {
      setScreen('guide');
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    gameRef.current = null;
  };

  const startRun = () => {
    gameRef.current = createChallenge();
    setScreen('playing');
  };

  // Size the canvas once per run, then run the loop.
  useEffect(() => {
    if (!open || screen !== 'playing') return undefined;
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = game.cols * TILE * dpr;
    canvas.height = game.rows * TILE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let last = performance.now();
    let alive = true;
    const frame = (t) => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
      last = t;
      const g = gameRef.current;
      if (!g || !dt) return;
      updateChallenge(g, dt);
      if (scoreRef.current) scoreRef.current.textContent = String(g.score);
      if (timeRef.current) timeRef.current.textContent = formatTime(g.time);
      if (livesRef.current) {
        livesRef.current.textContent =
          '●'.repeat(Math.max(0, g.lives)) + '○'.repeat(Math.max(0, LIVES_PER_ATTEMPT - g.lives));
      }
      if (dotsRef.current) dotsRef.current.textContent = String(g.dotsLeft);
      drawBoard(ctx, g);
      if (g.status === 'won' || g.status === 'lost') {
        alive = false;
        setWon(g.status === 'won');
        setEndScore(g.score);
        setEndTime(g.time);
        setScreen('result');
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [open, screen]);

  // Keyboard steering + Escape, only while the modal is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      const dir = KEY_DIRS[event.key];
      if (dir === undefined) return;
      if (screen !== 'playing') return;
      event.preventDefault();
      setWant(gameRef.current, dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, screen]);

  // Lock body scroll + focus the panel when the modal opens.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (panelRef.current) panelRef.current.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  const steer = (dir) => setWant(gameRef.current, dir);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event) => {
    const start = touchRef.current;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    touchRef.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3));
  };

  const setField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setFormError('');
  };

  const submitEntry = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const institution = form.institution.trim();
    if (!name || !email || !institution) {
      setFormError('Please fill your name, email and institution - all three are needed.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('That email does not look right - please check it once.');
      return;
    }
    const record = {
      name,
      email,
      institution,
      score: endScore,
      time: Math.round(endTime * 10) / 10,
      at: new Date().toISOString(),
    };
    setSaving(true);
    try {
      await saveEntry(record);
    } catch (err) {
      setSaving(false);
      if (err && err.message === 'duplicate-email') {
        setFormError('This email already has an entry - one entry per person.');
      } else if (err && err.message === 'duplicate-person') {
        setFormError('Someone with this name and institution already entered - one entry per person.');
      } else if (err && err.message === 'duplicate') {
        setFormError('This email already has an entry - one entry per person.');
      } else if (err && err.message === 'remote') {
        setFormError('Could not reach the scoreboard - please try again.');
      } else {
        setFormError('This browser refused to save - please try another one.');
      }
      return;
    }
    setEntry(record);
    setScreen('done');
  };

  return (
    <>
      {!open && (
        <button type="button" className="pac-fab" onClick={openModal} aria-haspopup="dialog">
          <PacLogo />
          <span>Play me for a surprise!</span>
        </button>
      )}

      {open && (
        <div className="pac-overlay">
          <div
            ref={panelRef}
            className="pac-panel"
            role="dialog"
            aria-modal="true"
            aria-label="AWS SBG Pac-Challenge"
            tabIndex={-1}
          >
            <div className="pac-panel-head">
              <div>
                <p className="pac-eyebrow">AWS SBG · PAC-CHALLENGE</p>
                <p className="pac-title">Chomp the club name</p>
              </div>
              <button
                type="button"
                className="pac-close"
                onClick={closeModal}
                aria-label="Close game"
              >
                ×
              </button>
            </div>

            {screen === 'guide' && (
              <div className="pac-body">
                <ol className="pac-rules">
                  <li>
                    <strong>Clear the maze.</strong> Eat every pellet inside the giant
                    AWS&nbsp;SBG - the clock starts the moment you move.
                  </li>
                  <li>
                    <strong>Steer with arrow keys, WASD, swipe, or the D-pad.</strong>{' '}
                    Blinky chases you, Pinky cuts you off.
                  </li>
                  <li>
                    <strong>One run, 3 lives.</strong> Get caught three times and the
                    run ends - and the clock keeps ticking while you are down.
                  </li>
                  <li>
                    <strong>Score everything.</strong> 10 per pellet, 50 per
                    energizer, 200 then 400 for blue ghosts. Score and time both
                    count: highest score wins, fastest time breaks ties.
                  </li>
                </ol>
                <p className="pac-goodies">
                  Top scores on the day win goodies - the board closes when the
                  Hack Day starts. After your run, drop your name, email and
                  institution to lock your entry. One entry per person.
                </p>
                <button type="button" className="ht-btn-primary" onClick={startRun} autoFocus>
                  Start my run
                </button>
              </div>
            )}

            {screen === 'playing' && (
              <div className="pac-body">
                <div className="pac-hudrow">
                  <span>
                    SCORE <strong ref={scoreRef}>0</strong>
                  </span>
                  <span>
                    TIME <strong ref={timeRef}>0:00.0</strong>
                  </span>
                  <span className="pac-lives">
                    LIVES <strong ref={livesRef}>●●●</strong>
                  </span>
                  <span>
                    LEFT <strong ref={dotsRef}>–</strong>
                  </span>
                </div>
                <div className="pac-boardwrap">
                  <canvas
                    ref={canvasRef}
                    className="pac-board"
                    style={{
                      aspectRatio: `${gameRef.current ? gameRef.current.cols * TILE : 798} / ${
                        gameRef.current ? gameRef.current.rows * TILE : 182
                      }`,
                    }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  />
                </div>
                <div className="pac-dpad" aria-label="Steer Pac-Man">
                  <button type="button" onClick={() => steer(3)} aria-label="Up">
                    ▲
                  </button>
                  <div className="pac-dpad-mid">
                    <button type="button" onClick={() => steer(2)} aria-label="Left">
                      ◀
                    </button>
                    <button type="button" onClick={() => steer(1)} aria-label="Down">
                      ▼
                    </button>
                    <button type="button" onClick={() => steer(0)} aria-label="Right">
                      ▶
                    </button>
                  </div>
                </div>
                <p className="pac-hint">Arrow keys / WASD / swipe work too. Esc abandons the run.</p>
              </div>
            )}

            {screen === 'result' && (
              <div className="pac-body">
                <p className="pac-big">
                  {won ? 'Maze cleared!' : 'Caught three times.'}
                </p>
                <p className="pac-resultline">
                  Score <strong>{endScore}</strong> · Time{' '}
                  <strong>{formatTime(endTime)}</strong>
                </p>
                <p className="pac-sub">
                  {won
                    ? 'Every pellet of the AWS SBG, gone.'
                    : 'The ghosts keep the maze this time. Your score still counts - lock it in.'}{' '}
                  Winners are the highest scores, fastest first on ties - the board
                  closes when the Hack Day starts. Goodies go out at the awards,
                  so use your real institution email. Your score stays private:
                  only you see it here.
                </p>
                <form className="pac-form" onSubmit={submitEntry} noValidate>
                  <label>
                    Name
                    <input
                      type="text"
                      value={form.name}
                      onChange={setField('name')}
                      placeholder="Aarav Sharma"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="you@college.edu"
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    Institution
                    <input
                      type="text"
                      value={form.institution}
                      onChange={setField('institution')}
                      placeholder="Atria Institute of Technology"
                      autoComplete="organization"
                    />
                  </label>
                  {formError && (
                    <p className="pac-error" role="alert">
                      {formError}
                    </p>
                  )}
                  <button type="submit" className="ht-btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Submit entry'}
                  </button>
                </form>
              </div>
            )}

            {screen === 'done' && (
              <div className="pac-body pac-center">
                <p className="pac-big">You are on the board!</p>
                <p className="pac-sub">
                  {entry && entry.name ? `${entry.name}, your ` : 'Your '}
                  {entry && entry.score !== undefined
                    ? `score of ${entry.score} pts${
                        entry.time !== undefined ? ` in ${formatTime(entry.time)}` : ''
                      } is locked in${
                        entry.institution ? ` for ${entry.institution}` : ''
                      }.`
                    : 'entry is locked in.'}{' '}
                  One entry per person - your run is used up. The board closes when
                  the Hack Day starts; top scores take home the goodies at the
                  awards.
                </p>
                <button type="button" className="pac-btn-secondary" onClick={closeModal} autoFocus>
                  Back to the event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
