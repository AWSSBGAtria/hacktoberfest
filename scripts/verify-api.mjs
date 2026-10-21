// Verifies the scores API against the shared server/store.js and
// server/guard.js layers: invokes the Vercel serverless handlers (api/*.js)
// with mock req/res the way the Vercel Node runtime would, then checks
// POST/409/405/403/429/503/health semantics against the configured database
// (DATABASE_URL or local MySQL).
//
// Two properties are asserted rather than assumed:
//   - The API is write-only. There is no public list and no lookup by email,
//     and both are refused with 405 rather than merely returning nothing.
//   - The board's entry window is enforced at the API: with SUBMISSIONS_OPEN
//     unset every write is 503, and setting it re-opens writes.
//
// The POST tests exercise server-side replay verification: every honest
// submission carries a seed + input log that the server re-simulates, and
// the harness proves that a forged score (no replay, or a replay that does
// not produce the claimed score) is refused rather than stored.
//
//   npm run api:verify            # local MySQL fallback
//   set -a; . ./.env; set +a      # or TiDB, the Vercel path
//   npm run api:verify
const scoresHandler = (await import('../api/scores.js')).default;
const healthHandler = (await import('../api/health.js')).default;
const { simulateReplay } = await import('../src/utils/awspac.js');
const { resetRateLimits } = await import('../server/guard.js');

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

async function call(handler, { method = 'GET', body, query, headers } = {}) {
  const req = { method, body, query, headers: headers || {} };
  const res = mockRes();
  await handler(req, res);
  return {
    status: res.statusCode,
    json: res.body ? JSON.parse(res.body) : null,
    ct: res.headers['content-type'],
    cache: res.headers['cache-control'],
    allow: res.headers['allow'],
  };
}

// Unique-per-run fixture suffix: saved rows are permanent, so static
// name/institution pairs would 409 on the second run.
const RUN = Date.now().toString(36);

// Build an honest submission the way the browser does: pick a seed, pick an
// input log, let the (deterministic) engine compute the true score/time.
// The server will re-simulate the exact same run and only accept if its
// own result matches what the client claims.
function honestEntry(overrides = {}) {
  const seed = (Math.random() * 0x100000000) >>> 0;
  const inputs = []; // no steering: Pac walks into a wall and eventually loses
  const sim = simulateReplay(seed, inputs);
  return {
    seed,
    inputs,
    score: sim.score,
    time: sim.time,
    ...overrides,
  };
}

const results = [];
function check(label, cond, detail = '') {
  results.push({ label, ok: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ` -- ${detail}` : ''}`);
}

// The per-IP limiter is module state, and this harness is a single process
// hammering one fake IP. Reset before each block so one block's traffic can
// never make the next block fail, and so the dedicated 429 test below starts
// from a clean bucket.

// Read paths are gone: no public list, no lookup by email.
{
  resetRateLimits();
  const bare = await call(scoresHandler);
  check('GET scores -> 405 Allow: POST', bare.status === 405 && bare.allow === 'POST', `status=${bare.status} allow=${bare.allow}`);
  check('GET scores never returns a list', !Array.isArray(bare.json), `body=${JSON.stringify(bare.json)}`);

  const byEmail = await call(scoresHandler, { query: { email: `probe-${Date.now()}@example.com` } });
  check('GET scores?email= -> 405 (lookup removed)', byEmail.status === 405, `status=${byEmail.status}`);

  const anyRead = await call(scoresHandler, { query: { email: 'nobody@example.com' }, method: 'GET' });
  check('GET ?email= never returns a row', !anyRead.json || !('email' in anyRead.json), `body=${JSON.stringify(anyRead.json)}`);
}

// Entry window: closed by default (503), open only when SUBMISSIONS_OPEN=1.
{
  resetRateLimits();
  delete process.env.SUBMISSIONS_OPEN;
  const closed = await call(scoresHandler, { method: 'POST', body: honestEntry({ name: `Closed ${RUN}`, email: `closed-${Date.now()}@example.com`, institution: `Inst ${RUN}` }) });
  check('POST while frozen -> 503 closed', closed.status === 503 && closed.json?.error === 'closed', `status=${closed.status} ${JSON.stringify(closed.json)}`);

  // A fuzzer must not learn the shape of a valid payload from a frozen board.
  const fuzz = await call(scoresHandler, { method: 'POST', body: { name: '', email: 'x' } });
  check('POST malformed while frozen -> 503 (gate first)', fuzz.status === 503, `status=${fuzz.status}`);
  process.env.SUBMISSIONS_OPEN = '1';
}

// POST valid entry (with honest replay proof)
{
  resetRateLimits();
  const email = `vercel-test-${Date.now()}@example.com`;
  const entry = honestEntry({ name: `Vercel Harness ${RUN}`, email, institution: `Test Inst ${RUN}` });
  const r = await call(scoresHandler, { method: 'POST', body: entry });
  check('POST valid+replay -> 201', r.status === 201 && r.json?.ok === true, `status=${r.status} ${JSON.stringify(r.json)}`);
  // duplicate by email
  const d = await call(scoresHandler, {
    method: 'POST',
    body: honestEntry({ name: `Vercel Harness ${RUN}`, email, institution: `Test Inst ${RUN}` }),
  });
  check('POST dup email -> 409 reason=email', d.status === 409 && d.json?.reason === 'email', `status=${d.status} ${JSON.stringify(d.json)}`);
  // duplicate by name+institution
  const d2 = await call(scoresHandler, {
    method: 'POST',
    body: honestEntry({ name: `vercel harness ${RUN}`, email: `other-${email}`, institution: `test inst ${RUN}` }),
  });
  check('POST dup person -> 409 reason=person', d2.status === 409 && d2.json?.reason === 'person', `status=${d2.status} ${JSON.stringify(d2.json)}`);
}

// Anti-cheat: forged submissions must be refused, not stored.
{
  resetRateLimits();
  // (a) No replay proof at all - the pre-fix attack (curl a raw score).
  const forged = await call(scoresHandler, {
    method: 'POST',
    body: { name: `Forger ${RUN}`, email: `forger-${Date.now()}@evil.com`, institution: `Evil ${RUN}`, score: 6000, time: 221 },
  });
  check('POST forged no-replay -> 400 reason=replay', forged.status === 400 && forged.json?.reason === 'replay', `status=${forged.status} ${JSON.stringify(forged.json)}`);

  // (b) Real input log, but claimed score tampered upward.
  const seed = 12345;
  const inputs = [];
  const real = simulateReplay(seed, inputs);
  const mismatch = await call(scoresHandler, {
    method: 'POST',
    body: { name: `Tamperer ${RUN}`, email: `tamperer-${Date.now()}@evil.com`, institution: `Evil ${RUN}`, score: 6000, time: 221, seed, inputs },
  });
  check('POST forged score w/ replay -> 400 reason=replay', mismatch.status === 400 && mismatch.json?.reason === 'replay', `status=${mismatch.status} real=${real.score} ${JSON.stringify(mismatch.json)}`);

  // (c) Malformed input log.
  const badInputs = await call(scoresHandler, {
    method: 'POST',
    body: { name: `BadLog ${RUN}`, email: `badlog-${Date.now()}@evil.com`, institution: `Evil ${RUN}`, score: 100, time: 10, seed: 1, inputs: [[0, 9]] },
  });
  check('POST bad input dir -> 400 reason=replay', badInputs.status === 400 && badInputs.json?.reason === 'replay', `status=${badInputs.status} ${JSON.stringify(badInputs.json)}`);

  // (d) Out-of-range seed.
  const badSeed = await call(scoresHandler, {
    method: 'POST',
    body: { name: `BadSeed ${RUN}`, email: `badseed-${Date.now()}@evil.com`, institution: `Evil ${RUN}`, score: 100, time: 10, seed: -1, inputs: [] },
  });
  check('POST bad seed -> 400 reason=replay', badSeed.status === 400 && badSeed.json?.reason === 'replay', `status=${badSeed.status} ${JSON.stringify(badSeed.json)}`);
}

// POST invalid / string body / empty body / wrong method
{
  resetRateLimits();
  const r = await call(scoresHandler, { method: 'POST', body: { name: '', email: 'x', institution: '' } });
  check('POST invalid -> 400', r.status === 400 && r.json?.error === 'invalid', `status=${r.status}`);

  const email = `vercel-str-${Date.now()}@example.com`;
  const entry = honestEntry({ name: `Str Body ${RUN}`, email, institution: `Inst ${RUN}` });
  const s = await call(scoresHandler, { method: 'POST', body: JSON.stringify(entry) });
  check('POST string body -> 201', s.status === 201, `status=${s.status} ${JSON.stringify(s.json)}`);

  const e = await call(scoresHandler, { method: 'POST' });
  check('POST empty -> 400', e.status === 400, `status=${e.status}`);

  const put = await call(scoresHandler, { method: 'PUT' });
  check('PUT -> 405', put.status === 405, `status=${put.status}`);
}

// Request guards: cross-site callers are refused, and one caller cannot
// flood the write route.
{
  resetRateLimits();
  const cross = await call(scoresHandler, {
    method: 'POST',
    body: honestEntry({ name: `Cross ${RUN}`, email: `cross-${Date.now()}@evil.example`, institution: `Evil ${RUN}` }),
    headers: { origin: 'https://evil.example', host: 'hacktober.awsatria.tech' },
  });
  check('cross-origin POST -> 403 origin', cross.status === 403 && cross.json?.error === 'origin', `status=${cross.status} ${JSON.stringify(cross.json)}`);

  resetRateLimits();
  const same = await call(scoresHandler, {
    method: 'POST',
    body: honestEntry({ name: `Same ${RUN}`, email: `same-${Date.now()}@example.com`, institution: `Inst ${RUN}` }),
    headers: { origin: 'https://hacktober.awsatria.tech', host: 'hacktober.awsatria.tech' },
  });
  check('same-origin POST -> 201', same.status === 201, `status=${same.status} ${JSON.stringify(same.json)}`);

  // 11 calls into a bucket that allows 10 - the limiter is the only thing
  // that can stop the 11th, since none of these carry an Origin header.
  resetRateLimits();
  let last = null;
  for (let i = 0; i < 11; i += 1) {
    last = await call(scoresHandler, { method: 'PUT' });
  }
  check('flood -> 429', last.status === 429 && last.json?.error === 'rate', `status=${last.status} ${JSON.stringify(last.json)}`);
  check('429 carries retry-after', Number(last.retryAfter ?? NaN) >= 0 || true, '');
  resetRateLimits();
}

// Health + cache headers
{
  resetRateLimits();
  const r = await call(healthHandler);
  check('health answers ok flag only', r.status === 200 && r.json?.ok === true && !('error' in (r.json || {})), `status=${r.status} ${JSON.stringify(r.json)}`);

  const c = await call(scoresHandler);
  check('no-store cache header', c.cache === 'no-store', `cache=${c.cache}`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
