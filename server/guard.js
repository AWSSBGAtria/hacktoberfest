// Shared /api/ request guard: same-origin enforcement plus in-memory rate
// limiting. Used by BOTH the event-day Express server (server/index.js) and
// the Vercel functions (api/*.js) so the two platforms cannot drift - the
// same reason server/store.js exists.
//
// Why an origin check and not a key: this is a public event site, so any
// secret shipped to the browser is readable by whoever opens devtools. The
// origin check is browser-level defence in depth - it stops a hostile page
// from scripting the API from a visitor's browser, and stops casual cross-
// site scraping. curl can still spoof the header, which is fine: the write
// endpoint does not trust the client for anything that matters (the server
// re-simulates every run, see store.createScore).
//
// Rate limits are per-IP and in-memory. That is exact for the single-process
// Express server on event day, and best-effort on Vercel, where each function
// instance holds its own buckets - still enough to blunt a flood, since a
// client usually lands on one instance for a burst of requests.

const WINDOW_MS = 60_000;
const MAX_BUCKETS = 10_000;

// bucket -> { count, reset }
const buckets = new Map();

function header(req, name) {
  const h = req?.headers;
  if (!h) return null;
  const value = h[name] ?? h[name.toLowerCase()];
  return typeof value === 'string' ? value : null;
}

/** Origin/Referer host, or null when the request carries neither. */
function sourceHost(req) {
  const raw = header(req, 'origin') || header(req, 'referer');
  if (!raw) return null;
  try {
    return new URL(raw).host;
  } catch {
    return undefined; // present but unparseable ("null", garbage) -> reject
  }
}

/**
 * Cross-origin requests are refused unless their host is explicitly allowed.
 * A same-origin request always passes, so any deploy domain works without
 * configuration; ALLOWED_ORIGINS only ever adds hosts (comma separated).
 */
export function originAllowed(req) {
  const host = sourceHost(req);
  if (host === null) return true; // no Origin/Referer: not a cross-site browser call
  if (host === undefined) return false;
  if (host === (req?.headers?.host || '')) return true;
  const allow = process.env.ALLOWED_ORIGINS || '';
  return allow
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(host);
}

/**
 * Best-effort caller identity. Express fills in req.ip (see trust proxy in
 * server/index.js); Vercel's plain Node req does not, so fall back to the
 * platform's X-Forwarded-For, which it overwrites rather than forwards.
 */
export function clientIp(req) {
  if (typeof req?.ip === 'string' && req.ip) return req.ip;
  const xff = header(req, 'x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req?.socket?.remoteAddress || 'unknown';
}

function prune(now) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, b] of buckets) {
    if (now >= b.reset) buckets.delete(key);
  }
}

/** Fixed-window counter: `limit` calls per caller per bucket per minute. */
export function rateLimit(key, limit) {
  const now = Date.now();
  prune(now);
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.reset) {
    bucket = { count: 0, reset: now + WINDOW_MS };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    retryAfter: Math.max(1, Math.ceil((bucket.reset - now) / 1000)),
  };
}

/** Test hook: the harness needs a clean slate between cases. */
export function resetRateLimits() {
  buckets.clear();
}

/**
 * One call for every /api/ entry point. Returns null when the request may
 * proceed, or { status, body, headers } to answer it and stop.
 */
export function guardRequest(req, bucket, limit) {
  if (!originAllowed(req)) {
    return { status: 403, body: { error: 'origin' } };
  }
  const rl = rateLimit(`${bucket}|${clientIp(req)}`, limit);
  if (!rl.ok) {
    return {
      status: 429,
      body: { error: 'rate' },
      headers: { 'retry-after': String(rl.retryAfter) },
    };
  }
  return null;
}
