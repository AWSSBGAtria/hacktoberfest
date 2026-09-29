// Score store for the Pac-Challenge.
//
// Backed by the event-day MySQL database (`hacktober2026.scores`) through the
// scores API served on the same origin (`/api`, see server/index.js). The
// browser lock (one run per browser) stays in localStorage; the one-entry-
// per-person rule is enforced by the UNIQUE email column (409 on duplicates).
// Set REMOTE_URL back to null to run fully offline on the local store.

const ENTRIES_KEY = 'awssbg-pac-entries-v1';
const DONE_KEY = 'awssbg-pac-done-v1';

// TODO: set to the scores API base URL (backed by MySQL) when available,
// e.g. 'https://example.com/api/pac'. Null keeps the local DB.
const REMOTE_URL = '/api';

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
  if (REMOTE_URL) return loadEntriesRemote();
  const list = readLocal(ENTRIES_KEY, []);
  const entries = Array.isArray(list) ? list : [];
  // Leaderboard order: highest score first, fastest time breaks ties.
  return [...entries].sort((a, b) => b.score - a.score || a.time - b.time);
}

export function saveEntry(entry) {
  if (REMOTE_URL) return saveEntryRemote(entry);
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
  try {
    writeLocal(DONE_KEY, { email: entry.email });
  } catch {
    /* lock is best-effort; the UNIQUE column is the real guard */
  }
  return entry;
}
