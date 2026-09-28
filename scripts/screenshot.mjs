import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:4173';
// SHOTS_DIR lets you capture into a side-by-side set (e.g. baseline vs after).
const OUT = new URL(`../${process.env.SHOTS_DIR || '.tmp-shots'}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/build', name: 'build' },
  { path: '/day', name: 'day' },
  { path: '/venue', name: 'venue' },
  { path: '/community', name: 'community' },
];

// Full-page capture stitches the viewport down the document, so a sticky
// header repeats in the middle of the image. Park it for review shots only.
const REST = `header.site-header, .site-header { position: static !important; }`;

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = 400;
    const max = document.body.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, max);
    await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();

for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  for (const t of targets) {
    await page.goto(`${BASE}${t.path}`, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    await page.addStyleTag({ content: REST });
    await page.screenshot({ path: `${OUT}/${t.name}-${vp.name}.png`, fullPage: true });
    console.log(`shot: ${t.name}-${vp.name}`);
  }
  await page.close();
}

// Mid-navigation frame: click a nav link and grab a screenshot ~120ms in,
// to check nothing "sticks" or flashes during the route swap.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.click('header nav a[href="/build"]');
  await page.waitForTimeout(120);
  await page.screenshot({ path: `${OUT}/mid-nav-transition.png` });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/post-nav-settled.png` });
  await page.close();
}

// Venue map pin close-up
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/venue`, { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const map = page.locator('.venue-map');
  await map.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await map.screenshot({ path: `${OUT}/venue-map.png` });
  await page.close();
}

await browser.close();
console.log('done');
