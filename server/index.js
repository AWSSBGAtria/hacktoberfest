// Event-day backend for the Pac-Challenge scoreboard.
//
// One port serves both the built site and the scores API against the local
// MySQL database `hacktober2026` (table `scores`). Run `npm run build` once,
// then `npm run server` and open http://localhost:3001.
//
// Credentials come from the environment with local defaults, so nothing
// secret lives in git. Production: set DATABASE_URL to your MySQL URL -
//   DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/hacktober2026
// (e.g. the Railway/Render/PlanetScale connection string). Local fallback:
//   DB_HOST (localhost) DB_USER (root) DB_PASSWORD DB_NAME (hacktober2026)
//   PORT (3001)

import express from 'express';
import mysql from 'mysql2/promise';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

const pool = process.env.DATABASE_URL
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const app = express();
app.use(express.json({ limit: '8kb' }));

app.get('/api/scores', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT name, email, institution, score, time, created_at AS `at` FROM scores ORDER BY score DESC, time ASC LIMIT 100',
    );
    res.json(rows.map((r) => ({ ...r, time: Number(r.time) })));
  } catch (err) {
    console.error('GET /api/scores:', err.message);
    res.status(500).json({ error: 'db' });
  }
});

app.post('/api/scores', async (req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 120);
  const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 160);
  const institution = String(req.body?.institution || '').trim().slice(0, 160);
  const score = Math.max(0, Math.floor(Number(req.body?.score) || 0));
  const time = Math.max(0, Math.round((Number(req.body?.time) || 0) * 10) / 10);
  if (!name || !EMAIL_RE.test(email) || !institution) {
    return res.status(400).json({ error: 'invalid' });
  }
  try {
    // One entry per person: same email, or same name plus institution
    // (case-insensitive) - catches a second email from the same player.
    const [existing] = await pool.query(
      'SELECT email, name, institution FROM scores WHERE LOWER(email) = LOWER(?) OR (LOWER(name) = LOWER(?) AND LOWER(institution) = LOWER(?)) LIMIT 1',
      [email, name, institution],
    );
    if (existing.length > 0) {
      const hit = existing[0];
      const reason =
        String(hit.email).toLowerCase() === email ? 'email' : 'person';
      return res.status(409).json({ error: 'duplicate', reason });
    }
    await pool.query(
      'INSERT INTO scores (name, email, institution, score, time) VALUES (?, ?, ?, ?, ?)',
      [name, email, institution, score, time],
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'duplicate', reason: 'email' });
    }
    console.error('POST /api/scores:', err.message);
    return res.status(500).json({ error: 'db' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Serve the built site (same origin => no CORS needed) with an SPA fallback.
const dist = path.join(here, '..', 'dist');

// Off-site routes. These are also handled client-side in src/App.jsx and by
// public/{volunteer,mentor,register}/index.html, but a 302 here means a direct
// hit, a shared link, or a bot never has to wait on the SPA to boot before it
// leaves - and it cannot 404 the way a static host without a fallback would.
const REDIRECTS = {
  '/volunteer': 'https://binary.so/EnumX2Q',
  '/mentor': 'https://binary.so/eGuTA0x',
  '/register':
    'https://events.mlh.com/events/15272-hacktoberfest-hack-day-bengaluru-x-aws-student-builder-group-at-atria-institute-of-technology',
};
for (const [from, to] of Object.entries(REDIRECTS)) {
  app.get(from, (req, res) => res.redirect(302, to));
}

app.use(express.static(dist));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`hacktober2026: site + scores API on http://localhost:${PORT}`);
});
