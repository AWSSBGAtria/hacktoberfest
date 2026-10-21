// Score store for the Pac-Challenge.
//
// Backed by the event-day MySQL database (`hacktober2026.scores`) through the
// scores API served on the same origin (`/api`, see server/index.js locally
// and api/*.js on Vercel). The browser lock (one run per browser) stays in
// localStorage; the one-entry-per-person rule is enforced by the UNIQUE email
// column (409 on duplicates).
//
// Write-only by design: the API has no read path at all. A player's result
// comes back from this browser's own store, so the site never exposes one
// participant's score to another (design.md section 13). That also means a
// successful remote save is mirrored into localStorage below - otherwise a
// first-time player, who has no local copy, would have nothing to restore.
//
// If the API is unreachable (static host without the functions deployed, DB
// outage, offline), writes degrade to the local store instead of failing the
// player's screen - with a console warning so the degradation is visible.
// Set REMOTE_URL to null to run fully offline on the local store.

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

export function saveEntry(entry) {
  if (REMOTE_URL) return saveEntryRemote(entry);
  return saveEntryLocal(entry);
}

// Own-row lookup for the done screen, read from this browser's store only.
// The API has no read path by design, so there is nothing to ask it; kept
// async because the call site awaits it.
export async function loadMine(email) {
  const key = String(email || '').trim().toLowerCase();
  return (
    loadEntriesLocal().find(
      (e) => e && e.email && String(e.email).toLowerCase() === key,
    ) || null
  );
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

/**
 * Remember a server-accepted entry in this browser. saveEntryRemote used to
 * write only the lock marker, which was fine while the done screen could ask
 * the server for the row - now that it cannot, a first-time player would have
 * nothing to show. This is a mirror, not a duplicate check: the server has
 * already ruled on uniqueness, so re-running findClash here would only be able
 * to turn a successful save into a spurious error.
 */
function mirrorLocal(entry) {
  const entries = readLocal(ENTRIES_KEY, []);
  const list = Array.isArray(entries) ? entries : [];
  const key = String(entry.email || '').trim().toLowerCase();
  const next = list.filter(
    (e) => !e || String(e.email || '').trim().toLowerCase() !== key,
  );
  next.push(entry);
  try {
    writeLocal(ENTRIES_KEY, next);
    writeLocal(DONE_KEY, { email: entry.email });
  } catch {
    /* private mode / quota: the UNIQUE column is the real guard */
  }
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
  if (res.status === 400) {
    // Server-side ceiling or replay verification rejected an impossible /
    // unverifiable run: this is the Burp/intercept guard firing, not a
    // transient failure, so do NOT degrade to a local save - that would
    // silently keep a tampered entry on the device.
    let reason = 'tampered';
    try {
      const data = await res.json();
      if (data && data.reason) reason = data.reason;
    } catch {
      /* keep default */
    }
    throw new Error(reason);
  }
  if (res.status === 503) {
    // The board is frozen (store.createScore refuses writes while
    // SUBMISSIONS_OPEN is unset). Deliberately NOT saved locally: falling
    // through to the local store would tell the player they are on the board
    // when the server has just told us they are not.
    throw new Error('closed');
  }
  if (!res.ok) {
    // Server reachable but refusing or failing (403 cross-origin, 429 rate
    // limit, 404 on a static host, 5xx, ...): degrade to the local store so
    // the player's run still counts here.
    console.warn(`[scoredb] scores API returned ${res.status}, saving locally.`);
    return saveEntryLocal(entry);
  }
  // Accepted by the server. Mirror it locally so the done screen has
  // something to restore - there is no read endpoint to ask any more.
  mirrorLocal(entry);
  return entry;
}
