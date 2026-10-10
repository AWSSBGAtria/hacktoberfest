// Event-day backend for the Pac-Challenge scoreboard.
//
// One port serves both the built site and the scores API against the local
// MySQL database `hacktober2026` (table `scores`). Run `npm run build` once,
// then `npm run server` and open http://localhost:3001.
//
// The routes below are thin wrappers over server/store.js - the same data
// layer the Vercel functions (api/*.js) use in production - so local and
// production enforce identical validation and duplicate rules.
//
// Credentials come from the environment with local defaults, so nothing
// secret lives in git. Production: set DATABASE_URL to your MySQL URL -
//   DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/hacktober2026
// (e.g. the Railway/Render/PlanetScale connection string). Local fallback:
//   DB_HOST (localhost) DB_USER (root) DB_PASSWORD DB_NAME (hacktober2026)
//   PORT (3001)

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listScores, findScore, createScore, healthCheck } from './store.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

const app = express();
// Input logs for replay verification can be a few KB for a long run, so the
// body limit is larger than a plain JSON API would need. 256kb comfortably
// fits MAX_INPUTS (10000) direction changes without letting a fuzzer blow
// up memory.
app.use(express.json({ limit: '256kb' }));

app.get('/api/scores', async (req, res) => {
  // Same split as api/scores.js: ?email= for one's own row, bare for the list.
  const { status, body } = req.query.email
    ? await findScore(req.query.email)
    : await listScores();
  res.status(status).json(body);
});

app.post('/api/scores', async (req, res) => {
  const { status, body } = await createScore(req.body);
  res.status(status).json(body);
});

app.get('/api/health', async (req, res) => {
  const { status, body } = await healthCheck();
  res.status(status).json(body);
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
  '/challenges':
    'https://www.mlh.com/events/hacktoberfest-hack-day-bengaluru-x-aws-student-builder-group-at-atria-institute-of-technology/challenges',
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
