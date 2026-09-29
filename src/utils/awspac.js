// AWS SBG time-trial engine: a Google-doodle-style maze whose walls draw big
// outlined "AWS SBG" letters - corridors run around and through the letter
// rings, pellets line every corridor, and a ghost house sits in the word gap.
// The player steers with a queued direction; two ghosts run the classic
// Blinky/Pinky targeting. One run ends when every pellet is cleared (score +
// time count) or all 3 lives are lost.

import { WALL, DOT, EMPTY, POWER, DIRS } from './pacmaze';

export const TILE = 14;
export const LIVES_PER_ATTEMPT = 3;
export const PAC_SPEED = 7.4;
export const GHOST_SPEED = 5.1;
export const FRIGHT_SPEED = 3.6;
export const EYES_SPEED = 11;
export const FRIGHT_TIME = 6;
export const DOT_SCORE = 10;
export const POWER_SCORE = 50;
export const GHOST_SCORES = [200, 400];
// Scatter/chase waves like the arcade: mode swaps yank every ghost around,
// which is also what shakes a hunter out of a letter-counter loop or a
// corner camp. Shortened for a small map, then wraps forever.
const MODE_SCHEDULE = [
  ['scatter', 5],
  ['chase', 14],
  ['scatter', 5],
  ['chase', 14],
  ['scatter', 4],
  ['chase', 14],
  ['scatter', 4],
  ['chase', 12],
];
const DEATH_PAUSE = 1.2;
const OPP = [2, 3, 0, 1];

// Letter rings, 7 wide x 9 tall each, drawn 1-cell-thick doodle style. Every
// ring has openings so its inner corridor joins the outer lanes: A opens at
// the bottom, W at the top, S/S2 on the right spine, B top and bottom, G on
// the right. WG is the word gap; its middle holds the ghost house.
const A = [
  '...#...',
  '...#...',
  '..#.#..',
  '..#.#..',
  '..#.#..',
  '#######',
  '#.....#',
  '#.....#',
  '#.....#',
];
const W = [
  '#.....#',
  '#.....#',
  '#.....#',
  '#.....#',
  '#.#.#.#',
  '#.#.#.#',
  '#.#.#.#',
  '.#...#.',
  '.#...#.',
];
const S = [
  '..###..',
  '.#...#.',
  '.#.....',
  '.#.....',
  '..###..',
  '.....#.',
  '.....#.',
  '.#...#.',
  '..###..',
];
const B = [
  '.#####.',
  '.#...#.',
  '.#...#.',
  '.#...#.',
  '.#####.',
  '.#...#.',
  '.#...#.',
  '.#...#.',
  '.#####.',
];
const G = [
  '..####.',
  '.#...#.',
  '.#.....',
  '.#.....',
  '.#..##.',
  '.#...#.',
  '.#...#.',
  '.#...#.',
  '..###..',
];
const WG = [
  '.....',
  '.....',
  '.....',
  '.#.#.',
  '.#.#.',
  '.#.#.',
  '.###.',
  '.....',
  '.....',
];

const mod = (n, m) => ((n % m) + m) % m;

function buildLetterGrid() {
  // 57 x 13: border, one fast travel band top and bottom, and the letter
  // band (rows 2-10) between them. Single-cell gaps join the bands
  // vertically; the 5-wide word gap carries the ghost house with open lanes
  // each side.
  const BORDER = '#'.repeat(57);
  const BAND = `#${'.'.repeat(55)}#`;
  const rows = [BORDER, BAND];
  for (let i = 0; i < 9; i += 1) {
    rows.push(
      `#${A[i]}..${W[i]}..${S[i]}${WG[i]}${S[i]}..${B[i]}..${G[i]}#`,
    );
  }
  rows.push(BAND, BORDER);

  const grid = rows.map((line) =>
    Uint8Array.from([...line].map((ch) => (ch === '#' ? WALL : DOT))),
  );
  return { grid, rows: grid.length, cols: grid[0].length };
}

function reachableFrom(grid, rows, cols, sx, sy) {
  const seen = new Set([`${sx},${sy}`]);
  const queue = [[sx, sy]];
  const D = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length) {
    const [x, y] = queue.pop();
    for (const [dx, dy] of D) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (seen.has(key) || grid[ny][nx] === WALL) continue;
      seen.add(key);
      queue.push([nx, ny]);
    }
  }
  return seen;
}

function nearestDot(grid, rows, cols, tx, ty, taken, open) {
  let best = null;
  let bestD = Infinity;
  for (let r = 1; r < rows - 1; r += 1) {
    for (let c = 1; c < cols - 1; c += 1) {
      if (grid[r][c] === WALL) continue;
      if (taken.has(`${c},${r}`)) continue;
      if (open && !open.has(`${c},${r}`)) continue;
      const d = (c - tx) * (c - tx) + (r - ty) * (r - ty);
      if (d < bestD) {
        bestD = d;
        best = [c, r];
      }
    }
  }
  return best;
}

function tileAt(game, tx, ty) {
  if (ty < 0 || ty >= game.rows) return WALL;
  if (tx < 0 || tx >= game.cols) return WALL;
  return game.grid[ty][tx];
}

function isWalkable(game, tx, ty) {
  return tileAt(game, tx, ty) !== WALL;
}

function firstOpenDir(game, cx, cy) {
  for (let d = 0; d < 4; d += 1) {
    if (isWalkable(game, cx + DIRS[d][0], cy + DIRS[d][1])) return d;
  }
  return 0;
}

function targetOf(actor, dir) {
  return [actor.cx + DIRS[dir][0], actor.cy + DIRS[dir][1]];
}

function dist2(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy;
}

function makeActor(x, y, dir) {
  return { x, y, dir, want: dir, cx: x, cy: y, tx: null, ty: null, hist: [] };
}

function eatAt(game) {
  const p = game.pac;
  const cell = game.grid[p.cy][p.cx];
  if (cell === DOT) {
    game.grid[p.cy][p.cx] = EMPTY;
    game.dotsLeft -= 1;
    game.score += DOT_SCORE;
  } else if (cell === POWER) {
    game.grid[p.cy][p.cx] = EMPTY;
    game.dotsLeft -= 1;
    game.score += POWER_SCORE;
    game.frightT = FRIGHT_TIME;
    game.ghostChain = 0;
    for (const g of game.ghosts) if (g.state !== 'eyes') g.reverse = true;
  }
}

function ghostTarget(game, ghost) {
  if (ghost.state === 'eyes') return [ghost.hx, ghost.hy];
  if (game.frightT > 0) return [ghost.x, ghost.y];
  if (MODE_SCHEDULE[game.modeIndex][0] === 'scatter') {
    return [ghost.scatter[0], ghost.scatter[1]];
  }
  const p = game.pac;
  if (ghost.role === 'pinky') {
    let ax = p.cx;
    let ay = p.cy;
    for (let i = 0; i < 4; i += 1) {
      ax += DIRS[p.dir][0];
      ay += DIRS[p.dir][1];
    }
    return [ax, ay];
  }
  return [p.x, p.y];
}

function chooseGhostDir(game, ghost) {
  const options = [];
  for (let d = 0; d < 4; d += 1) {
    if (d === OPP[ghost.dir]) continue;
    const [nx, ny] = targetOf(ghost, d);
    if (isWalkable(game, nx, ny)) options.push(d);
  }
  if (!options.length) {
    const back = OPP[ghost.dir];
    const [nx, ny] = targetOf(ghost, back);
    return isWalkable(game, nx, ny) ? back : ghost.dir;
  }
  if (game.frightT > 0 && ghost.state !== 'eyes') {
    return options[Math.floor(Math.random() * options.length)];
  }

  // Confinement breaker: greedy no-reverse steering cannot leave a loop,
  // so a hunter can orbit a letter ring or a corner pocket forever while its
  // target gradient points through walls. If the last sixteen arrivals span
  // only a handful of tiles, forget the target and step onto the
  // least-visited neighbour, reversing included, until the trail spreads out
  // again. (Kept to this one window: tighter triggers were measured to fight
  // the exit and re-trap hunters.)
  const recent = ghost.hist.slice(-16);
  const confined =
    recent.length >= 14 &&
    new Set(recent.map(([hx, hy]) => `${hx},${hy}`)).size <= 8;
  if (confined) {
    let pick = -1;
    let pickSeen = Infinity;
    for (let d = 0; d < 4; d += 1) {
      const [nx, ny] = targetOf(ghost, d);
      if (!isWalkable(game, nx, ny)) continue;
      let seen = 0;
      for (const [hx, hy] of ghost.hist) if (hx === nx && hy === ny) seen += 1;
      if (seen < pickSeen) {
        pickSeen = seen;
        pick = d;
      }
    }
    if (pick !== -1) return pick;
  }

  const [trx, try_] = ghostTarget(game, ghost);
  let best = options[0];
  let bestD = Infinity;
  for (const d of options) {
    const [nx, ny] = targetOf(ghost, d);
    const score = dist2(nx, ny, trx, try_);
    if (score < bestD) {
      bestD = score;
      best = d;
    }
  }
  return best;
}

function stepGhost(game, ghost, dt) {
  if (ghost.reverse) {
    ghost.reverse = false;
    if (ghost.tx !== null) {
      ghost.x = ghost.cx;
      ghost.y = ghost.cy;
      ghost.tx = null;
      ghost.ty = null;
    }
    ghost.dir = OPP[ghost.dir];
  }
  const speed =
    ghost.state === 'eyes' ? EYES_SPEED : game.frightT > 0 ? FRIGHT_SPEED : GHOST_SPEED;
  let left = speed * dt;
  let guard = 0;
  while (left > 0 && guard < 64) {
    guard += 1;
    if (ghost.tx === null) {
      const dir = chooseGhostDir(game, ghost);
      ghost.dir = dir;
      const [vx, vy] = targetOf(ghost, dir);
      ghost.tx = vx;
      ghost.ty = vy;
    }
    const dx = ghost.tx - ghost.x;
    const dy = ghost.ty - ghost.y;
    const d = Math.hypot(dx, dy);
    if (d <= left) {
      ghost.x = ghost.tx;
      ghost.y = ghost.ty;
      ghost.cx = ghost.tx;
      ghost.cy = ghost.ty;
      ghost.hist.push([ghost.cx, ghost.cy]);
      if (ghost.hist.length > 40) ghost.hist.splice(0, ghost.hist.length - 40);
      ghost.tx = null;
      ghost.ty = null;
      left -= d;
      if (ghost.state === 'eyes' && ghost.cx === ghost.hx && ghost.cy === ghost.hy) {
        ghost.state = 'normal';
      }
    } else {
      ghost.x += (dx / d) * left;
      ghost.y += (dy / d) * left;
      left = 0;
    }
  }
}

function stepPac(game, dt) {
  const p = game.pac;
  let left = PAC_SPEED * dt;
  let guard = 0;
  while (left > 0 && guard < 64) {
    guard += 1;
    if (p.tx === null) {
      eatAt(game);
      if (game.dotsLeft <= 0) {
        game.status = 'won';
        return;
      }
      if (isWalkable(game, ...targetOf(p, p.want))) p.dir = p.want;
      const [vx, vy] = targetOf(p, p.dir);
      if (!isWalkable(game, vx, vy)) return; // walled in: wait for a new want
      p.tx = vx;
      p.ty = vy;
    }
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    const d = Math.hypot(dx, dy);
    if (d <= left) {
      p.x = p.tx;
      p.y = p.ty;
      p.cx = p.tx;
      p.cy = p.ty;
      p.tx = null;
      p.ty = null;
      left -= d;
    } else {
      p.x += (dx / d) * left;
      p.y += (dy / d) * left;
      left = 0;
    }
  }
}

function collide(game) {
  const p = game.pac;
  for (const g of game.ghosts) {
    if (g.state === 'eyes') continue;
    if (dist2(p.x, p.y, g.x, g.y) > 0.64) continue;
    if (game.frightT > 0) {
      g.state = 'eyes';
      game.ghostChain += 1;
      game.score += GHOST_SCORES[game.ghostChain - 1] ?? 800;
      continue;
    }
    game.status = 'dying';
    game.deadT = 0;
    p.tx = null;
    p.ty = null;
    return;
  }
}

function resetPositions(game) {
  const p = game.pac;
  p.x = game.pacSpawn[0];
  p.y = game.pacSpawn[1];
  p.cx = p.x;
  p.cy = p.y;
  p.tx = null;
  p.ty = null;
  p.dir = 0;
  // Keep the player's queued direction: steering held through the death
  // blink applies the instant Pac-Man is back.
  game.ghosts.forEach((g) => {
    g.x = g.hx;
    g.y = g.hy;
    g.cx = g.hx;
    g.cy = g.hy;
    g.tx = null;
    g.ty = null;
    g.dir = firstOpenDir(game, g.hx, g.hy);
    g.want = g.dir;
    g.hist = [];
    g.state = 'normal';
    g.reverse = false;
    g.eyeT = 0;
  });
  game.frightT = 0;
}

export function createChallenge() {
  const { grid, rows, cols } = buildLetterGrid();

  // Fixed stage marks (word-gap house sits at columns 26-30, rows 5-8):
  // pac top-left band, ghost dens at the house door, house interior empty.
  const pacSpawn = [4, 1];
  const houseInner = [
    [28, 6],
    [28, 7],
  ];
  for (const [hx, hy] of [[28, 5], [26, 5], ...houseInner]) grid[hy][hx] = EMPTY;

  // Anything a letter ring seals off loses its pellets, so the maze is
  // always clearable no matter how the outlines fall.
  const open = reachableFrom(grid, rows, cols, pacSpawn[0], pacSpawn[1]);
  for (let r = 1; r < rows - 1; r += 1) {
    for (let c = 1; c < cols - 1; c += 1) {
      if (grid[r][c] !== WALL && !open.has(`${c},${r}`)) grid[r][c] = EMPTY;
    }
  }

  const taken = new Set([
    pacSpawn.join(','),
    [28, 5].join(','),
    [26, 5].join(','),
    ...houseInner.map(([hx, hy]) => `${hx},${hy}`),
  ]);
  const dens = [
    [28, 5],
    [26, 5],
  ];

  // Four energizers near the four inner corners.
  const powers = [
    nearestDot(grid, rows, cols, 2, 1, taken, open),
    nearestDot(grid, rows, cols, cols - 3, 1, taken, open),
    nearestDot(grid, rows, cols, 2, rows - 2, taken, open),
    nearestDot(grid, rows, cols, cols - 3, rows - 2, taken, open),
  ];
  powers.forEach((cell) => {
    if (!cell) return;
    taken.add(cell.join(','));
    grid[cell[1]][cell[0]] = POWER;
  });

  let dotsLeft = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === DOT || grid[r][c] === POWER) dotsLeft += 1;
    }
  }

  const game = {
    grid,
    rows,
    cols,
    pacSpawn,
    pac: makeActor(pacSpawn[0], pacSpawn[1], 0),
    ghosts: [],
    dotsLeft,
    totalDots: dotsLeft,
    lives: LIVES_PER_ATTEMPT,
    frightT: 0,
    ghostChain: 0,
    modeIndex: 0,
    modeT: 0,
    score: 0,
    time: 0,
    deadT: 0,
    status: 'playing',
  };
  const roles = ['blinky', 'pinky'];
  const colors = ['#e53927', '#e97b77'];
  const scatter = [
    [1, 1],
    [cols - 2, 1],
  ];
  dens.forEach(([hx, hy], i) => {
    const dir = firstOpenDir({ grid, rows, cols }, hx, hy);
    const g = makeActor(hx, hy, dir);
    g.hx = hx;
    g.hy = hy;
    g.role = roles[i];
    g.color = colors[i];
    g.scatter = scatter[i];
    g.state = 'normal';
    g.reverse = false;
    g.eyeT = 0;
    game.ghosts.push(g);
  });
  // The spawn tiles start eaten so the counters open at totalDots dots.
  eatAt(game);
  return game;
}

export function setWant(game, dir) {
  if (game && (game.status === 'playing' || game.status === 'dying')) {
    game.pac.want = dir;
  }
}

function stepMode(game, dt) {
  if (game.frightT > 0) return; // the fright clock owns reversals meanwhile
  const [, length] = MODE_SCHEDULE[game.modeIndex];
  game.modeT += dt;
  if (game.modeT >= length) {
    game.modeIndex = (game.modeIndex + 1) % MODE_SCHEDULE.length;
    game.modeT = 0;
    for (const g of game.ghosts) if (g.state !== 'eyes') g.reverse = true;
  }
}

export function updateChallenge(game, dt) {
  if (game.status === 'won' || game.status === 'lost') return;
  game.time += dt; // the clock keeps ticking through deaths - that is the game
  if (game.frightT > 0) {
    game.frightT = Math.max(0, game.frightT - dt);
    if (game.frightT === 0) game.ghostChain = 0;
  }

  if (game.status === 'dying') {
    game.deadT += dt;
    if (game.deadT >= DEATH_PAUSE) {
      game.lives -= 1;
      if (game.lives <= 0) {
        game.status = 'lost';
      } else {
        resetPositions(game);
        game.status = 'playing';
      }
    }
    return;
  }

  stepMode(game, dt);
  stepPac(game, dt);
  if (game.status === 'won') return;
  for (const ghost of game.ghosts) stepGhost(game, ghost, dt);
  for (const ghost of game.ghosts) {
    // Failsafe: greedy eyes can orbit loops forever without reaching the den.
    // After ten seconds they pop home instead of haunting the maze unseen.
    if (ghost.state === 'eyes') {
      ghost.eyeT = (ghost.eyeT || 0) + dt;
      if (ghost.eyeT > 10) {
        ghost.x = ghost.hx;
        ghost.y = ghost.hy;
        ghost.cx = ghost.hx;
        ghost.cy = ghost.hy;
        ghost.tx = null;
        ghost.ty = null;
        ghost.state = 'normal';
        ghost.eyeT = 0;
      }
    } else {
      ghost.eyeT = 0;
    }
  }
  collide(game);
}
