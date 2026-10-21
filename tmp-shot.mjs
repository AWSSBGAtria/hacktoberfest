import { chromium } from 'playwright-core';
import fs from 'node:fs';

const url = process.argv[2];
const out = process.argv[3];
const width = Number(process.argv[4] || 1440);

// playwright-core ships no browsers of its own; point it at the newest
// chromium in the shared ms-playwright cache (layout of the dir differs by
// version, so find the binary rather than assume it).
const cache = `${process.env.HOME}/.cache/ms-playwright`;
const exe = fs
  .readdirSync(cache)
  .filter((d) => d.startsWith('chromium-'))
  .sort()
  .pop();
const binary = fs
  .readdirSync(`${cache}/${exe}`)
  .filter((d) => d.startsWith('chrome-linux'))
  .map((d) => `${cache}/${exe}/${d}/chrome`)
  .find((p) => fs.existsSync(p));

const browser = await chromium.launch({ executablePath: binary });
const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
// Force every scroll-reveal open so the full page is captured in one shot.
await page.evaluate(() =>
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
);
await page.waitForTimeout(700);
await page.screenshot({ path: out, fullPage: true });

console.log('title:', await page.title());
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
