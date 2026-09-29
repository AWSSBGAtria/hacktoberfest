// Endless Pac-Man maze engine.
//
// A perfect maze is carved on a grid that wraps horizontally, so the strip has
// no seam: the run never ends. Entities move tile-to-tile exactly like the
// arcade original - they only turn on tile centres, never reverse on their own,
// and pick their next direction by target tile. Ghosts keep the classic role
// split (Blinky chases, Pinky ambushes ahead, Inky flanks, Clyde panics at
// close range), cycle scatter/chase, turn blue and wander when an energizer is
// eaten, and their eyes dash home before they respawn.

export const WALL = 0;
export const DOT = 1;
export const EMPTY = 2;
export const POWER = 3;

// right, down, left, up
export const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const OPP = [2, 3, 0, 1];

export const PAC_SPEED = 6.2;
export const GHOST_SPEED = 4.9;
export const FRIGHT_SPEED = 3.4;
export const EYES_SPEED = 12;
export const FRIGHT_TIME = 7;
const DEATH_TIME = 1.5;
// The arcade ends in an endless chase, but the strip runs forever, so the
// schedule wraps: scatter and chase keep trading places and the pack never
// settles into a permanent pincer.
const MODE_SCHEDULE = [
  ['scatter', 7],
  ['chase', 20],
  ['scatter', 7],
  ['chase', 20],
  ['scatter', 5],
  ['chase', 20],
  ['scatter', 5],
  ['chase', 18],
];
const POPUP_LIFE = 0.9;

const mod = (n, m) => ((n % m) + m) % m;

function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

// A perfect maze is full of dead ends, which corner Pac-Man in seconds. Real
// Pac-Man corridors loop, so punch tunnels through the walls: every dead end
// (with 70% odds) reconnects to a nearby corridor within four tiles. Loops keep
// the chase legible and the run alive.
function braid(grid, rows, cols, rand) {
  const open = (r, c) => grid[r][mod(c, cols)] !== WALL;
  const deadEnds = [];
  for (let r = 1; r < rows - 1; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === WALL) continue;
      let n = 0;
      if (open(r - 1, c)) n += 1;
      if (open(r + 1, c)) n += 1;
      if (open(r, c - 1)) n += 1;
      if (open(r, c + 1)) n += 1;
      if (n === 1) deadEnds.push([r, c]);
    }
  }

  for (const [sr, sc] of deadEnds) {
    if (rand() > 0.7) continue;
    const from = (r, c) => r === sr && c === sc;
    const queue = [[sr, sc, 0, [[sr, sc]]]];
    let carved = false;
    while (queue.length && !carved) {
      const [r, c, depth, path] = queue.shift();
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = mod(c + dc, cols);
        if (nr < 1 || nr > rows - 2) continue;
        if (grid[nr][nc] !== WALL) continue;
        const nextPath = [...path, [nr, nc]];
        // Does this wall tile already touch a corridor we are not carving?
        let joins = false;
        for (const [dr2, dc2] of DIRS) {
          const ar = nr + dr2;
          const ac = mod(nc + dc2, cols);
          if (ar < 1 || ar > rows - 2) continue;
          if (grid[ar][ac] === WALL) continue;
          const prev = path[path.length - 1];
          if (ar === prev[0] && ac === prev[1]) continue;
          if (from(ar, ac)) continue;
          joins = true;
          break;
        }
        if (joins) {
          for (const [pr, pc] of nextPath.slice(1)) grid[pr][pc] = DOT;
          carved = true;
          break;
        }
        if (depth + 1 < 4) queue.push([nr, nc, depth + 1, nextPath]);
      }
    }
  }
}

// Rooms sit on odd rows / even columns; rows 0 and rows-1 stay solid walls.
// Columns wrap, so the maze is a horizontal torus - no left or right edge.
function carveMaze(rows, cols, rand) {
  const grid = [];
  for (let r = 0; r < rows; r += 1) grid.push(new Uint8Array(cols).fill(WALL));

  const roomRows = [];
  for (let r = 1; r <= rows - 2; r += 2) roomRows.push(r);
  const R = roomRows.length;
  const C = cols / 2;
  const visited = new Uint8Array(R * C);
  const stack = [[0, 0]];
  visited[0] = 1;
  grid[roomRows[0]][0] = DOT;

  const carveConnector = (aRow, bRow, col) => {
    grid[Math.min(aRow, bRow) + 1][col] = DOT;
  };

  while (stack.length) {
    const [rr, rc] = stack[stack.length - 1];
    const options = [];
    if (rr > 0 && !visited[(rr - 1) * C + rc]) options.push([rr - 1, rc]);
    if (rr < R - 1 && !visited[(rr + 1) * C + rc]) options.push([rr + 1, rc]);
    const left = mod(rc - 1, C);
    const right = mod(rc + 1, C);
    if (!visited[rr * C + left]) options.push([rr, left]);
    if (!visited[rr * C + right]) options.push([rr, right]);

    if (!options.length) {
      stack.pop();
      continue;
    }

    const [nr, nc] = options[Math.floor(rand() * options.length)];
    visited[nr * C + nc] = 1;
    grid[roomRows[nr]][nc * 2] = DOT;

    if (nr === rr) {
      const col = nc === right ? rc * 2 + 1 : rc * 2 - 1;
      grid[roomRows[rr]][mod(col, cols)] = DOT;
    } else {
      carveConnector(roomRows[rr], roomRows[nr], rc * 2);
    }

    stack.push([nr, nc]);
  }

  braid(grid, rows, cols, rand);

  // Four energizers, one per corner - the classic placement.
  const corners = [
    [0, 0],
    [0, C - 1],
    [R - 1, 0],
    [R - 1, C - 1],
  ];
  const energizers = [];
  for (const [rr, rc] of corners) {
    const tile = [rr * 2 + 1, rc * 2];
    if (grid[tile[0]][tile[1]] === WALL) continue;
    if (energizers.some(([r, c]) => r === tile[0] && c === tile[1])) continue;
    grid[tile[0]][tile[1]] = POWER;
    energizers.push(tile);
  }

  return { grid, roomRows, energizers };
}
function makeActor(x, y, dir) {
  return { x, y, dir, cx: x, cy: y, tx: null, ty: null };
}

function tileAt(world, tx, ty) {
  if (ty < 0 || ty >= world.rows) return WALL;
  return world.grid[ty][mod(tx, world.cols)];
}

function isWalkable(world, tx, ty) {
  return tileAt(world, tx, ty) !== WALL;
}

function target(actor, dir, cols) {
  const nx = actor.cx + DIRS[dir][0];
  const ny = actor.cy + DIRS[dir][1];
  return [nx, ny, mod(nx, cols), ny];
}

function dist2(ax, ay, bx, by, cols) {
  let dx = bx - ax;
  const half = cols / 2;
  if (dx > half) dx -= cols;
  else if (dx < -half) dx += cols;
  const dy = by - ay;
  return dx * dx + dy * dy;
}

function eatAt(world) {
  const p = world.pac;
  const cell = world.grid[p.cy][p.cx];
  if (cell === DOT) {
    world.grid[p.cy][p.cx] = EMPTY;
    world.dotsLeft -= 1;
  } else if (cell === POWER) {
    world.grid[p.cy][p.cx] = EMPTY;
    world.dotsLeft -= 1;
    world.frightT = FRIGHT_TIME;
    world.ghostChain = 0;
    for (const g of world.ghosts) if (g.state !== 'eyes') g.reverse = true;
  }
}

function refill(world) {
  const { grid } = world.mazeSource;
  for (let r = 0; r < world.rows; r += 1) {
    world.grid[r] = Uint8Array.from(grid[r]);
  }
  world.dotsLeft = 0;
  for (let r = 0; r < world.rows; r += 1) {
    for (let c = 0; c < world.cols; c += 1) {
      if (world.grid[r][c] === DOT || world.grid[r][c] === POWER) world.dotsLeft += 1;
    }
  }
}

function walkableCount(world, tx, ty) {
  let n = 0;
  for (let d = 0; d < 4; d += 1) {
    if (isWalkable(world, tx + DIRS[d][0], ty + DIRS[d][1])) n += 1;
  }
  return n;
}

// Fleeing is scored against the whole pack, not just the closest ghost: picking
// the direction that maximises the minimum distance keeps him from dodging
// Blinky straight into Pinky. Ghosts are also projected one tile along their
// current heading, so a head-on charge is felt before it lands. Open corridors
// win ties, and running straight on is preferred so he does not stutter.
function fleeDir(world, options) {
  const threats = world.ghosts.filter((g) => g.state !== 'eyes');
  if (!threats.length) return null;
  if (nearestGhostDistance2(world) > 36) return null;

  let best = options[0];
  let bestScore = -Infinity;
  for (const d of options) {
    const [nx, ny] = target(world.pac, d, world.cols);
    let clear = Infinity;
    for (const g of threats) {
      const here = dist2(nx, ny, g.x, g.y, world.cols);
      const ahead = dist2(
        nx,
        ny,
        g.x + DIRS[g.dir][0],
        g.y + DIRS[g.dir][1],
        world.cols,
      );
      clear = Math.min(clear, here, ahead);
    }
    const score =
      clear * 100 + walkableCount(world, nx, ny) * 10 + (d === world.pac.dir ? 5 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

function nearestGhostDistance2(world) {
  const p = world.pac;
  let best = Infinity;
  for (const g of world.ghosts) {
    if (g.state === 'eyes') continue;
    best = Math.min(best, dist2(p.x, p.y, g.x, g.y, world.cols));
  }
  return best;
}

function choosePacDir(world) {
  const p = world.pac;
  const options = [];
  for (let d = 0; d < 4; d += 1) {
    const [nx, ny] = target(p, d, world.cols);
    if (!isWalkable(world, nx, ny)) continue;
    options.push(d);
  }
  if (!options.length) return OPP[p.dir];

  if (!world.frightT) {
    const scared = fleeDir(world, options);
    if (scared !== null) return scared;
  }

  const straight = options.includes(p.dir) ? p.dir : null;
  if (straight !== null) {
    const [nx, ny] = target(p, straight, world.cols);
    const cell = tileAt(world, nx, ny);
    if (cell === DOT || cell === POWER || world.dotsLeft < world.totalDots * 0.4) return straight;
  }

  const withDot = options.filter((d) => {
    const [nx, ny] = target(p, d, world.cols);
    const cell = tileAt(world, nx, ny);
    return cell === DOT || cell === POWER;
  });
  if (withDot.length) {
    if (withDot.includes(p.dir)) return p.dir;
    return withDot[Math.floor(world.rand() * withDot.length)];
  }
  if (straight !== null) return straight;
  return options[Math.floor(world.rand() * options.length)];
}

function pacTarget(world) {
  const p = world.pac;
  const [nx, ny] = target(p, p.dir, world.cols);
  return [nx, ny];
}

function ghostTarget(world, ghost) {
  if (ghost.state === 'eyes') return [world.home.col, world.home.row];
  if (world.frightT > 0) return [ghost.x, ghost.y];

  const [pacX, pacY] = pacTarget(world);
  const p = world.pac;

  switch (ghost.role) {
    case 'pinky': {
      // Four tiles ahead of Pac-Man - the classic ambush.
      let ax = p.cx;
      let ay = p.cy;
      for (let i = 0; i < 4; i += 1) {
        ax += DIRS[p.dir][0];
        ay += DIRS[p.dir][1];
      }
      return [ax, ay];
    }
    case 'inky': {
      // Blinky's position reflected through two tiles ahead of Pac-Man.
      const blinky = world.ghosts[0];
      const [ax, ay] = pacTarget(world);
      return [ax * 2 - blinky.x, ay * 2 - blinky.y];
    }
    case 'clyde': {
      // Chases until he gets close, then bolts for his corner.
      const near = dist2(ghost.x, ghost.y, p.x, p.y, world.cols) > 64;
      if (near) return [pacX, pacY];
      return [ghost.scatter[0], ghost.scatter[1]];
    }
    default:
      return [pacX, pacY];
  }
}

function chooseGhostDir(world, ghost) {
  const options = [];
  for (let d = 0; d < 4; d += 1) {
    if (d === OPP[ghost.dir]) continue;
    const [nx, ny] = target(ghost, d, world.cols);
    if (isWalkable(world, nx, ny)) options.push(d);
  }
  if (!options.length) {
    const back = OPP[ghost.dir];
    const [nx, ny] = target(ghost, back, world.cols);
    return isWalkable(world, nx, ny) ? back : ghost.dir;
  }

  if (world.frightT > 0 && ghost.state !== 'eyes') {
    return options[Math.floor(world.rand() * options.length)];
  }

  const [tr, tc] = ghostTarget(world, ghost);
  let best = options[0];
  let bestD = Infinity;
  for (const d of options) {
    const [nx, ny] = target(ghost, d, world.cols);
    const score = dist2(nx, ny, tr, tc, world.cols);
    if (score < bestD) {
      bestD = score;
      best = d;
    }
  }
  return best;
}

function stepGhost(world, ghost, dt) {
  if (ghost.reverse) {
    ghost.reverse = false;
    if (ghost.tx !== null) {
      // Undo the half-step and flip - the arcade reverses the instant an
      // energizer is eaten.
      ghost.x = ghost.cx;
      ghost.y = ghost.cy;
      ghost.tx = null;
      ghost.ty = null;
    }
    ghost.dir = OPP[ghost.dir];
  }

  const speed =
    ghost.state === 'eyes'
      ? EYES_SPEED
      : world.frightT > 0
        ? FRIGHT_SPEED
        : world.ghostSpeed;

  let left = speed * dt;
  let guard = 0;
  while (left > 0 && guard < 64) {
    guard += 1;
    if (ghost.tx === null) {
      const dir = chooseGhostDir(world, ghost);
      ghost.dir = dir;
      const [vx, vy] = target(ghost, dir, world.cols);
      ghost.tx = vx;
      ghost.ty = vy;
    }
    const dx = ghost.tx - ghost.x;
    const dy = ghost.ty - ghost.y;
    const d = Math.hypot(dx, dy);
    if (d <= left) {
      // Normalise through the wrap: the logical tile is modded but the raw
      // float position is what the next target is measured from, so a raw
      // -1/cols left standing would send the next leg back across the whole
      // map, through walls, to a random death. mod() keeps both in agreement.
      ghost.x = mod(ghost.tx, world.cols);
      ghost.y = ghost.ty;
      ghost.cx = mod(Math.round(ghost.tx), world.cols);
      ghost.cy = Math.round(ghost.ty);
      ghost.tx = null;
      ghost.ty = null;
      left -= d;
      if (
        ghost.state === 'eyes' &&
        ghost.cx === world.home.col &&
        ghost.cy === world.home.row
      ) {
        ghost.state = 'normal';
      }
    } else {
      ghost.x += (dx / d) * left;
      ghost.y += (dy / d) * left;
      left = 0;
    }
  }
}

function resetActors(world) {
  const { home } = world;
  const pac = world.pac;
  pac.x = home.pacCol;
  pac.y = home.row;
  pac.cx = home.pacCol;
  pac.cy = home.row;
  pac.tx = null;
  pac.ty = null;
  pac.dir = 0;
  pac.dead = false;
  pac.deadT = 0;

  world.ghosts.forEach((g, i) => {
    const col = mod(home.pacCol + (world.cols >> 1) + i * 2, world.cols);
    const start = isWalkable(world, col, home.row) ? col : home.col;
    g.x = start;
    g.y = home.row;
    g.cx = start;
    g.cy = home.row;
    g.tx = null;
    g.ty = null;
    g.dir = i % 2 ? 2 : 0;
    g.state = 'normal';
    g.reverse = false;
  });

  world.frightT = 0;
  world.ghostChain = 0;
}

function stepMode(world, dt) {
  if (world.frightT > 0) {
    world.frightT = Math.max(0, world.frightT - dt);
    if (world.frightT === 0) world.ghostChain = 0;
    return;
  }
  const [, length] = MODE_SCHEDULE[world.modeIndex];
  world.modeT += dt;
  if (world.modeT >= length) {
    world.modeIndex = (world.modeIndex + 1) % MODE_SCHEDULE.length;
    world.modeT = 0;
    for (const g of world.ghosts) if (g.state !== 'eyes') g.reverse = true;
  }
}

function collide(world) {
  const p = world.pac;
  if (p.dead) return;
  for (const g of world.ghosts) {
    if (g.state === 'eyes') continue;
    if (dist2(p.x, p.y, g.x, g.y, world.cols) > 0.64) continue;
    if (world.frightT > 0) {
      g.state = 'eyes';
      world.ghostChain += 1;
      const value = 200 * 2 ** (world.ghostChain - 1);
      world.popups.push({ x: g.x, y: g.y, value: String(value), life: POPUP_LIFE });
      continue;
    }
    p.dead = true;
    p.deadT = 0;
    p.tx = null;
    p.ty = null;
  }
}

export function createWorld({
  rows,
  cols,
  pacColor,
  ghostColors,
  ghostRoles = ['blinky', 'pinky', 'inky', 'clyde'],
  seed = 7,
  ghostSpeed = GHOST_SPEED,
}) {
  const rand = makeRng(seed);
  const maze = carveMaze(rows, cols, rand);
  const roomRows = maze.roomRows;
  const row = roomRows[Math.floor(roomRows.length / 2)] ?? 1;
  const home = { row, col: 2 * Math.floor(cols / 4), pacCol: 4 };

  const world = {
    rows,
    cols,
    grid: maze.grid.map((r) => Uint8Array.from(r)),
    mazeSource: maze,
    rand,
    roomRows,
    home,
    pacColor,
    ghostSpeed,
    time: 0,
    mouth: 0,
    frightT: 0,
    ghostChain: 0,
    modeIndex: 0,
    modeT: 0,
    popups: [],
    dotsLeft: 0,
    totalDots: 0,
    pac: makeActor(home.pacCol, row, 0),
    ghosts: [],
  };

  // On a torus the two "ends" sit next to each other, so scatter corners are
  // spread along the axis that actually has distance: both halves, top and bottom.
  const half = cols >> 1;
  const scatter = [
    [0, row],
    [half, row],
    [0, roomRows[roomRows.length - 1]],
    [half, roomRows[0]],
  ];
  ghostColors.forEach((color, i) => {
    const startCol = mod(home.pacCol + (cols >> 1) + i * 2, cols);
    const g = makeActor(isWalkable(world, startCol, row) ? startCol : home.col, row, i % 2 ? 2 : 0);
    g.color = color;
    g.role = ghostRoles[i] ?? 'blinky';
    g.scatter = scatter[i % 4];
    g.state = 'normal';
    g.reverse = false;
    world.ghosts.push(g);
  });

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (maze.grid[r][c] === DOT || maze.grid[r][c] === POWER) world.dotsLeft += 1;
    }
  }
  world.totalDots = world.dotsLeft;
  eatAt(world);

  return world;
}

export function updateWorld(world, dt) {
  world.time += dt;

  const p = world.pac;
  if (p.dead) {
    p.deadT += dt;
    if (p.deadT >= DEATH_TIME) resetActors(world);
    return;
  }

  stepMode(world, dt);

  p.mouth = (p.mouth + dt) % 1;
  let left = PAC_SPEED * dt;
  let guard = 0;
  while (left > 0 && guard < 64) {
    guard += 1;
    if (p.tx === null) {
      eatAt(world);
      if (world.dotsLeft <= world.totalDots * 0.12) refill(world);
      const dir = choosePacDir(world);
      p.dir = dir;
      const [vx, vy] = target(p, dir, world.cols);
      p.tx = vx;
      p.ty = vy;
    }
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    const d = Math.hypot(dx, dy);
    if (d <= left) {
      // Same wrap normalisation as the ghosts (see stepGhost): without it a
      // left-edge exit desyncs the float position from the logical tile and
      // the next leg rides back through every wall on the map.
      p.x = mod(p.tx, world.cols);
      p.y = p.ty;
      p.cx = mod(Math.round(p.tx), world.cols);
      p.cy = Math.round(p.ty);
      p.tx = null;
      p.ty = null;
      left -= d;
    } else {
      p.x += (dx / d) * left;
      p.y += (dy / d) * left;
      left = 0;
    }
  }

  for (const ghost of world.ghosts) stepGhost(world, ghost, dt);
  collide(world);

  world.popups = world.popups.filter((popup) => {
    popup.life -= dt;
    return popup.life > 0;
  });
}

export function ghostDisplayState(world, ghost) {
  if (ghost.state === 'eyes') return 'eyes';
  if (world.frightT > 0) {
    const flashing = world.frightT < 2 && Math.floor(world.time * 6) % 2 === 1;
    return flashing ? 'flash' : 'frightened';
  }
  return 'normal';
}
