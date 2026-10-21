// Vercel function: /api/scores (POST entry only).
//
// This is the production half of the scoreboard - the static site alone has
// no API, so without this file every fetch('/api/scores') 404s in production.
// All rules live in server/store.js, shared with the event-day Express
// server (server/index.js), so both platforms behave identically. The same
// goes for the request guard in server/guard.js.
//
// There is no read path any more. The results screen shows a player their
// own score and nothing else (design.md section 13), so the old public
// top-100 list and the email lookup - which between them exposed every
// participant's name, institution and score - have been removed rather than
// merely hidden.
//
// Requires DATABASE_URL in the project's Environment Variables (Vercel
// dashboard -> Settings -> Environment Variables), same as .env.example.

import { createScore } from '../server/store.js';
import { guardRequest } from '../server/guard.js';

// Vercel's Node runtime normally hands us req.body already parsed (object) or
// as a JSON string. If it doesn't (raw stream), read and parse it ourselves.
// Anything unparseable becomes {} and store.createScore rejects it (400).
async function readJsonBody(req) {
  const body = req.body;
  if (body !== undefined && body !== null) {
    if (typeof body === 'object') return body;
    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return {};
      }
    }
  }
  // Fall back to the raw request stream.
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Raw Node response helpers: Vercel's Node runtime gives a plain
// ServerResponse (no res.status().json() helpers, unlike Express).
function send(res, status, body, extra) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(extra || {})) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  // Same-origin + rate limit, ahead of anything expensive (a POST body is
  // re-simulated, so it is the route worth defending hardest).
  const denied = guardRequest(req, 'scores:post', 10);
  if (denied) return send(res, denied.status, denied.body, denied.headers);

  if (req.method === 'POST') {
    const { status, body } = await createScore(await readJsonBody(req));
    return send(res, status, body);
  }
  res.setHeader('Allow', 'POST');
  return send(res, 405, { error: 'method' });
}
