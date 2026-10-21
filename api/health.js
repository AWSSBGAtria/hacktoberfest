// Vercel function: /api/health - DB connectivity probe (mirrors the Express
// route in server/index.js via the shared server/store.js layer).
//
// Guarded like every other /api/ route: an unauthenticated probe that
// answers instantly is a free way to burn DB connections, so it gets the
// same origin check and a rate limit. The body is a bare ok flag - store.js
// never echoes the driver error, which can carry host and user names.

import { healthCheck } from '../server/store.js';
import { guardRequest } from '../server/guard.js';

export default async function handler(req, res) {
  const denied = guardRequest(req, 'health', 30);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (denied) {
    for (const [k, v] of Object.entries(denied.headers || {})) res.setHeader(k, v);
    res.statusCode = denied.status;
    return res.end(JSON.stringify(denied.body));
  }
  const { status, body } = await healthCheck();
  res.statusCode = status;
  res.end(JSON.stringify(body));
}
