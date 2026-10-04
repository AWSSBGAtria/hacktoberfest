// Shared scores data layer - the one implementation of the scoreboard rules,
// used by BOTH the event-day Express server (server/index.js) and the Vercel
// serverless functions (api/*.js) so validation, duplicate detection and row
// shape can never drift between local and production.
//
// Every export returns a { status, body } result instead of touching a
// response object, which keeps it platform-agnostic (Express res.status().json()
// and raw Node res.statusCode/res.end() both just relay these).
//
// Connection: production uses one variable - DATABASE_URL (TiDB Cloud URL,
// TLS verified against the system CA store). Local fallback:
// DB_HOST (localhost) DB_USER (root) DB_PASSWORD DB_NAME (hacktober2026).

import mysql from 'mysql2/promise';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hard ceiling on score/time, used to refuse Burp'd submissions. Mirrors
// MAX_REALISTIC_SCORE / MAX_REALISTIC_TIME in src/utils/awspac.js:
//   dots:    440 x 10           = 4400
//   powers:  4 x 50             =  200
//   ghosts:  4 energizers x (200 + 400)   = 2400
//   total                       = 7000
// Inlined here so the datastore does not import the client bundle (Vite-
// resolved extensionless imports in awspac.js/pacmaze.js are not portable to
// the plain Node runtime Vercel serves api/* on).
export const SCORE_CAP = 7000;
export const TIME_CAP = 3600;

// One pool per process: Express keeps it for the whole server lifetime, and a
// Vercel function instance reuses it across warm invocations.
let pool;

function getPool() {
  if (pool) return pool;
  pool = process.env.DATABASE_URL
    ? mysql.createPool({
        uri: process.env.DATABASE_URL,
        // Managed clouds (TiDB Cloud included) terminate MySQL with mandatory
        // TLS; verify against the system CA store.
        ssl: { rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit: 10,
      })
    : mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Darshan1122',
        database: process.env.DB_NAME || 'hacktober2026',
        waitForConnections: true,
        connectionLimit: 10,
      });
  return pool;
}

// GET /api/scores - top 100 by score, time breaks ties. Rows deliberately
// carry no email: the list is public, and the only consumer that must
// identify a person (the done screen) fetches its own row via findScore.
export async function listScores() {
  try {
    const [rows] = await getPool().query(
      'SELECT name, institution, score, time, created_at AS `at` FROM scores ORDER BY score DESC, time ASC LIMIT 100',
    );
    return { status: 200, body: rows.map((r) => ({ ...r, time: Number(r.time) })) };
  } catch (err) {
    console.error('GET /api/scores:', err.message);
    return { status: 500, body: { error: 'db' } };
  }
}

// GET /api/scores?email= - one person's own row (full record, including
// their email) so a returning player can restore their locked-in entry.
// Knowing the email is the capability; unknown or malformed -> 404/400.
export async function findScore(rawEmail) {
  const email = String(rawEmail || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { status: 400, body: { error: 'invalid' } };
  }
  try {
    const [rows] = await getPool().query(
      'SELECT name, email, institution, score, time, created_at AS `at` FROM scores WHERE LOWER(email) = ? LIMIT 1',
      [email],
    );
    if (rows.length === 0) {
      return { status: 404, body: { error: 'not-found' } };
    }
    return { status: 200, body: { ...rows[0], time: Number(rows[0].time) } };
  } catch (err) {
    console.error('GET /api/scores?email=:', err.message);
    return { status: 500, body: { error: 'db' } };
  }
}

// POST /api/scores - validates input, enforces one entry per person (same
// email, or same name plus institution, case-insensitive) before inserting.
export async function createScore(raw) {
  const name = String(raw?.name || '').trim().slice(0, 120);
  const email = String(raw?.email || '').trim().toLowerCase().slice(0, 160);
  const institution = String(raw?.institution || '').trim().slice(0, 160);
  const score = Math.max(0, Math.floor(Number(raw?.score) || 0));
  const time = Math.max(0, Math.round((Number(raw?.time) || 0) * 10) / 10);
  if (!name || !EMAIL_RE.test(email) || !institution) {
    return { status: 400, body: { error: 'invalid' } };
  }
  // A browser PAC-MAN score is not server-verifiable (the whole game is
  // client-side), so an intercepting proxy could otherwise POST any score.
  // Refuse anything that could not have come from a real 3-life run on this
  // maze instead of silently accepting an altered value - a cheater's 999999
  // becomes an error, not a winning entry.
  if (score > SCORE_CAP || time > TIME_CAP) {
    return { status: 400, body: { error: 'invalid', reason: 'tampered' } };
  }
  try {
    const [existing] = await getPool().query(
      'SELECT email, name, institution FROM scores WHERE LOWER(email) = LOWER(?) OR (LOWER(name) = LOWER(?) AND LOWER(institution) = LOWER(?)) LIMIT 1',
      [email, name, institution],
    );
    if (existing.length > 0) {
      const hit = existing[0];
      const reason =
        String(hit.email).toLowerCase() === email ? 'email' : 'person';
      return { status: 409, body: { error: 'duplicate', reason } };
    }
    await getPool().query(
      'INSERT INTO scores (name, email, institution, score, time) VALUES (?, ?, ?, ?, ?)',
      [name, email, institution, score, time],
    );
    return { status: 201, body: { ok: true } };
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return { status: 409, body: { error: 'duplicate', reason: 'email' } };
    }
    console.error('POST /api/scores:', err.message);
    return { status: 500, body: { error: 'db' } };
  }
}

// GET /api/health - cheap connectivity probe for the DB.
export async function healthCheck() {
  try {
    await getPool().query('SELECT 1');
    return { status: 200, body: { ok: true } };
  } catch (err) {
    return { status: 500, body: { ok: false, error: err.message } };
  }
}