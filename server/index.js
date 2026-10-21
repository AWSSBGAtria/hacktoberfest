// Event-day backend for the Pac-Challenge scoreboard.
//
// One port serves both the built site and the scores API against the local
// MySQL database `hacktober2026` (table `scores`). Run `npm run build` once,
// then `npm run server` and open http://localhost:3001.
//
// The routes below are thin wrappers over server/store.js and server/guard.js
// - the same data and request-guard layers the Vercel functions (api/*.js)
// use in production - so local and production enforce identical validation,
// duplicate rules, origin checks and rate limits.
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
import { createScore, healthCheck } from './store.js';
import { guardRequest } from './guard.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

const app = express();
// One proxy in front on event day (and always on the hosted platforms), so
// trust exactly one X-Forwarded-For hop - that is what makes req.ip the real
// client and keeps the per-IP rate limit meaningful.
app.set('trust proxy', 1);

// The guard runs before the JSON parser: rate limiting a request only to
// discard it after it has been read and parsed is rate limiting too late.
app.use('/api', (req, res, next) => {
  const denied = guardRequest(req, 'api', 120);
  if (denied) {
    for (const [k, v] of Object.entries(denied.headers || {})) res.setHeader(k, v);
    return res.status(denied.status).json(denied.body);
  }
  next();
});

// Input logs for replay verification can be a few KB for a long run, so the
// body limit is larger than a plain JSON API would need. 256kb comfortably
// fits MAX_INPUTS (10000) direction changes without letting a fuzzer blow
// up memory.
app.use(express.json({ limit: '256kb' }));

// POST only: the results screen shows a player their own score and nothing
// else, so the read paths (public top-100 list, lookup by email) are gone.
// The write is also the expensive one - the run is re-simulated - so it
// carries a much tighter limit than the shared /api bucket above.
app.post('/api/scores', async (req, res) => {
  const denied = guardRequest(req, 'scores:post', 10);
  if (denied) {
    for (const [k, v] of Object.entries(denied.headers || {})) res.setHeader(k, v);
    return res.status(denied.status).json(denied.body);
  }
  const { status, body } = await createScore(req.body);
  res.status(status).json(body);
});

app.get('/api/health', async (req, res) => {
  const { status, body } = await healthCheck();
  res.status(status).json(body);
});

// Anything else under /api - including the retired GET /api/scores and the
// ?email= lookup - is a real 404 rather than falling through to the SPA
// fallback, which would answer a dead endpoint with index.html.
app.use('/api', (req, res) => res.status(404).json({ error: 'not-found' }));

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
