// Score store for the Pac-Challenge.
//
// Backed by the event-day MySQL database (`hacktober2026.scores`) through the
// scores API served on the same origin (`/api`, see server/index.js locally
// and api/*.js on Vercel). The browser lock (one run per browser) stays in
// localStorage; the one-entry-per-person rule is enforced by the UNIQUE email
// column (409 on duplicates).
//
// If the API is unreachable (static host without the functions deployed, DB
// outage, offline), reads and writes degrade to the local store instead of
// failing the player's screen - with a console warning so the degradation is
// visible. Set REMOTE_URL to null to run fully offline on the local store.

const ENTRIES_KEY = 'awssbg-pac-entries-v1';
const DONE_KEY = 'awssbg-pac-done-v1';

// Scores API base URL (backed by MySQL; see api/scores.js on Vercel and
// server/index.js for event day). Null keeps the local DB only.
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
  return loadEntriesLocal();
}

export function saveEntry(entry) {
  if (REMOTE_URL) return saveEntryRemote(entry);
  return saveEntryLocal(entry);
}

// Own-row lookup for the done screen: the public list carries no emails, so
// a returning player fetches just their record (?email=) and we fall back to
// this browser's store when the API is missing, down, or never saw the save.
export async function loadMine(email) {
  const key = String(email || '').trim().toLowerCase();
  const fromLocal = () =>
    loadEntriesLocal().find(
      (e) => e && e.email && String(e.email).toLowerCase() === key,
    ) || null;
  if (!REMOTE_URL) return fromLocal();
  try {
    const res = await fetch(
      `${REMOTE_URL}/scores?email=${encodeURIComponent(email)}`,
    );
    if (res.ok) return await res.json();
    if (res.status !== 404) throw new Error(`status ${res.status}`);
  } catch (err) {
    // API missing (static host without functions), DB down, or offline:
    // degrade to this browser's store rather than failing the screen.
    console.warn('[scoredb] scores API unreachable, reading local store:', err);
  }
  return fromLocal();
}

// Local store: also the fallback when the remote API is unreachable, so a
// missing/misconfigured backend degrades instead of breaking the flow.
function loadEntriesLocal() {
  const list = readLocal(ENTRIES_KEY, []);
  const entries = Array.isArray(list) ? list : [];
  // Leaderboard order: highest score first, fastest time breaks ties.
  return [...entries].sort((a, b) => b.score - a.score || a.time - b.time);
}

function saveEntryLocal(entry) {
  const entries = readLocal(ENTRIES_KEY, []);
  const list = Array.isArray(entries) ? entries : [];
  const clash = findClash(list, entry);
  if (clash) throw new Error(clash === 'person' ? 'duplicate-person' : 'duplicate-email');
  list.push(entry);
  try {
    writeLocal(ENTRIES_KEY, list);
    writeLocal(DONE_KEY, { email: entry.email });
  } catch {
    throw new Error('storage');
  }
  return entry;
}

// One entry per person: same email, or same name plus institution
// (case-insensitive, trimmed) - catches a second email from the same player.
function findClash(list, entry) {
  const email = entry.email.trim().toLowerCase();
  const name = entry.name.trim().toLowerCase();
  const inst = entry.institution.trim().toLowerCase();
  for (const e of list) {
    if (!e || !e.email) continue;
    if (String(e.email).toLowerCase() === email) return 'email';
    if (String(e.name || '').trim().toLowerCase() === name &&
        String(e.institution || '').trim().toLowerCase() === inst) return 'person';
  }
  return null;
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
  let list;
  try {
    const res = await fetch(`${REMOTE_URL}/scores`);
    // Reachable but unhappy (5xx etc.): still fall through to local below.
    if (!res.ok) throw new Error(`status ${res.status}`);
    list = await res.json();
    if (!Array.isArray(list)) throw new Error('bad payload');
  } catch (err) {
    // API missing (static host without functions), DB down, or offline:
    // degrade to this browser's store rather than failing the screen.
    console.warn('[scoredb] scores API unreachable, using local store:', err);
    return loadEntriesLocal();
  }
  return [...list].sort((a, b) => b.score - a.score || a.time - b.time);
}

async function saveEntryRemote(entry) {
  let res;
  try {
    res = await fetch(`${REMOTE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (err) {
    // Network-level failure (offline, API not deployed): save locally.
    console.warn('[scoredb] scores API unreachable, saving locally:', err);
    return saveEntryLocal(entry);
  }
  if (res.status === 409) {
    // The server is up and actively rejected this entry - never mask that
    // with a local save, or the one-entry-per-person rule would be bypassed.
    let reason = 'email';
    try {
      const data = await res.json();
      if (data && data.reason === 'person') reason = 'person';
    } catch {
      /* keep default */
    }
    throw new Error(reason === 'person' ? 'duplicate-person' : 'duplicate-email');
  }
  if (!res.ok) {
    // Server reachable but failing (404 on a static host, 5xx, ...):
    // degrade to the local store so the player's run still counts here.
    console.warn(`[scoredb] scores API returned ${res.status}, saving locally.`);
    return saveEntryLocal(entry);
  }
  try {
    writeLocal(DONE_KEY, { email: entry.email });
  } catch {
    /* lock is best-effort; the UNIQUE column is the real guard */
  }
  return entry;
}
