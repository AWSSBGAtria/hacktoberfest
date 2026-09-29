// Score store for the Pac-Challenge.
//
// Right now this site is fully static (no server), so the "local DB" is the
// browser's localStorage: entries keyed by lower-cased email (one entry per
// person) plus a lock flag recording that this browser has played.
//
// When the MySQL URL arrives, point REMOTE_URL at the scores endpoint and
// implement the three remote functions below - the game component only talks
// to loadEntries/saveEntry/getLock, so nothing else has to change. Expected
// row shape: { name, email, institution, score, time, at }.

const ENTRIES_KEY = 'awssbg-pac-entries-v1';
const DONE_KEY = 'awssbg-pac-done-v1';

// TODO: set to the scores API base URL (backed by MySQL) when available,
// e.g. 'https://example.com/api/pac'. Null keeps the local DB.
const REMOTE_URL = null;

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadEntries() {
  const list = readLocal(ENTRIES_KEY, []);
  const entries = Array.isArray(list) ? list : [];
  // Leaderboard order: highest score first, fastest time breaks ties.
  return [...entries].sort((a, b) => b.score - a.score || a.time - b.time);
}

export function saveEntry(entry) {
  const entries = readLocal(ENTRIES_KEY, []);
  const list = Array.isArray(entries) ? entries : [];
  if (
    list.some(
      (e) => e.email && e.email.toLowerCase() === entry.email.toLowerCase(),
    )
  ) {
    throw new Error('duplicate');
  }
  list.push(entry);
  try {
    writeLocal(ENTRIES_KEY, list);
    writeLocal(DONE_KEY, { email: entry.email });
  } catch {
    throw new Error('storage');
  }
  return entry;
}

export function getLock() {
  if (REMOTE_URL) return null; // remote mode judges replays server-side
  return readLocal(DONE_KEY, null);
}

export function clearLock() {
  try {
    localStorage.removeItem(DONE_KEY);
  } catch {
    /* private mode - nothing to clear */
  }
}

async function loadEntriesRemote() {
  const res = await fetch(`${REMOTE_URL}/scores`);
  if (!res.ok) throw new Error('remote');
  const list = await res.json();
  return [...list].sort((a, b) => b.score - a.score || a.time - b.time);
}

async function saveEntryRemote(entry) {
  const res = await fetch(`${REMOTE_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (res.status === 409) throw new Error('duplicate');
  if (!res.ok) throw new Error('remote');
  return entry;
}
