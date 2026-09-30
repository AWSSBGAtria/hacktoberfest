// Vercel function: /api/scores (GET list, POST entry).
//
// This is the production half of the scoreboard - the static site alone has
// no API, so without this file every fetch('/api/scores') 404s in production.
// All rules live in server/store.js, shared with the event-day Express
// server (server/index.js), so both platforms behave identically.
//
// Requires DATABASE_URL in the project's Environment Variables (Vercel
// dashboard -> Settings -> Environment Variables), same as .env.example.

import { listScores, findScore, createScore } from '../server/store.js';

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
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // ?email= -> this person's own row (used to restore a locked-in entry);
    // bare GET -> the public top-100 list, which never carries emails.
    const email = req.query && req.query.email;
    const { status, body } = email ? await findScore(email) : await listScores();
    return send(res, status, body);
  }
  if (req.method === 'POST') {
    const { status, body } = await createScore(await readJsonBody(req));
    return send(res, status, body);
  }
  res.setHeader('Allow', 'GET, POST');
  return send(res, 405, { error: 'method' });
}