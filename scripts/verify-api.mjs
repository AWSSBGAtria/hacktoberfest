// Verifies the scores API against the shared server/store.js layer: invokes
// the Vercel serverless handlers (api/*.js) with mock req/res the way the
// Vercel Node runtime would, then checks GET/POST/409/400/405/health
// semantics against the configured database (DATABASE_URL or local MySQL).
//
//   npm run api:verify            # local MySQL fallback
//   set -a; . ./.env; set +a      # or TiDB, the Vercel path
//   npm run api:verify
const scoresHandler = (await import('../api/scores.js')).default;
const healthHandler = (await import('../api/health.js')).default;

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(b) { this.body = b; },
  };
  res.json = function (b) { this.body = JSON.stringify(b); };
  return res;
}

async function call(handler, { method = 'GET', body, query } = {}) {
  const req = { method, body, query };
  const res = mockRes();
  await handler(req, res);
  return {
    status: res.statusCode,
    json: res.body ? JSON.parse(res.body) : null,
    ct: res.headers['content-type'],
    cache: res.headers['cache-control'],
  };
}

// Unique-per-run fixture suffix: saved rows are permanent, so static
// name/institution pairs would 409 on the second run.
const RUN = Date.now().toString(36);

const results = [];
function check(label, cond, detail = '') {
  results.push({ label, ok: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ` -- ${detail}` : ''}`);
}

// GET /api/scores
{
  const r = await call(scoresHandler);
  const noEmails = Array.isArray(r.json) && r.json.every((row) => !('email' in row));
  check('GET scores 200 array', r.status === 200 && Array.isArray(r.json) && r.ct?.includes('application/json'), `status=${r.status}`);
  check('GET list never exposes email', noEmails, `rows=${Array.isArray(r.json) ? r.json.length : '?'}`);
}
// POST valid entry
{
  const email = `vercel-test-${Date.now()}@example.com`;
  const r = await call(scoresHandler, {
    method: 'POST',
    body: { name: `Vercel Harness ${RUN}`, email, institution: `Test Inst ${RUN}`, score: 42, time: 12.3 },
  });
  check('POST valid -> 201', r.status === 201 && r.json?.ok === true, `status=${r.status} ${JSON.stringify(r.json)}`);
  // own-row lookup by email
  const mine = await call(scoresHandler, { query: { email } });
  check('GET ?email= own row -> 200', mine.status === 200 && mine.json?.email === email && mine.json?.score === 42, `status=${mine.status} ${JSON.stringify(mine.json)}`);
  // unknown email
  const missing = await call(scoresHandler, { query: { email: `nobody-${Date.now()}@example.com` } });
  check('GET ?email= unknown -> 404', missing.status === 404, `status=${missing.status}`);
  // malformed email
  const bad = await call(scoresHandler, { query: { email: 'not-an-email' } });
  check('GET ?email= malformed -> 400', bad.status === 400, `status=${bad.status}`);
  // duplicate by email
  const d = await call(scoresHandler, {
    method: 'POST',
    body: { name: `Vercel Harness ${RUN}`, email, institution: `Test Inst ${RUN}`, score: 1, time: 1 },
  });
  check('POST dup email -> 409 reason=email', d.status === 409 && d.json?.reason === 'email', `status=${d.status} ${JSON.stringify(d.json)}`);
  // duplicate by name+institution
  const d2 = await call(scoresHandler, {
    method: 'POST',
    body: { name: `vercel harness ${RUN}`, email: `other-${email}`, institution: `test inst ${RUN}`, score: 1, time: 1 },
  });
  check('POST dup person -> 409 reason=person', d2.status === 409 && d2.json?.reason === 'person', `status=${d2.status} ${JSON.stringify(d2.json)}`);
}
// POST invalid
{
  const r = await call(scoresHandler, { method: 'POST', body: { name: '', email: 'x', institution: '' } });
  check('POST invalid -> 400', r.status === 400 && r.json?.error === 'invalid', `status=${r.status}`);
}
// POST with string body (Vercel can hand raw string)
{
  const email = `vercel-str-${Date.now()}@example.com`;
  const r = await call(scoresHandler, {
    method: 'POST',
    body: JSON.stringify({ name: `Str Body ${RUN}`, email, institution: `Inst ${RUN}`, score: 7, time: 3.2 }),
  });
  check('POST string body -> 201', r.status === 201, `status=${r.status} ${JSON.stringify(r.json)}`);
}
// POST with no body (stream fallback path)
{
  const r = await call(scoresHandler, { method: 'POST' });
  check('POST empty -> 400', r.status === 400, `status=${r.status}`);
}
// Method not allowed
{
  const r = await call(scoresHandler, { method: 'PUT' });
  check('PUT -> 405', r.status === 405, `status=${r.status}`);
}
// Health
{
  const r = await call(healthHandler);
  check('health 200 ok', r.status === 200 && r.json?.ok === true, `status=${r.status} ${JSON.stringify(r.json)}`);
}
// no-store cache header
{
  const r = await call(scoresHandler);
  check('no-store cache header', r.cache === 'no-store', `cache=${r.cache}`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
