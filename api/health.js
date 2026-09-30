// Vercel function: /api/health - DB connectivity probe (mirrors the Express
// route in server/index.js via the shared server/store.js layer).

import { healthCheck } from '../server/store.js';

export default async function handler(req, res) {
  const { status, body } = await healthCheck();
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}