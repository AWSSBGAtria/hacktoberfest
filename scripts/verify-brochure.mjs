// A4 verification for public/Sponsorship_Brochure.html.
// Loads the file, measures every sheet against a real A4 box, reports any
// content that overflows, and writes a PDF exactly as Ctrl+P would.
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = process.env.DOC || 'Sponsorship_Brochure.html';
const target = pathToFileURL(path.join(root, 'public', DOC)).href;
const out = path.join(root, '.impeccable', 'review', path.basename(DOC, '.html'));
fs.mkdirSync(out, { recursive: true });

const A4 = { w: 210, h: 297 }; // mm

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
await page.goto(target, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// 1. Geometry: every sheet must be exactly A4, with nothing spilling past it.
const report = await page.evaluate((A4) => {
  const MM = 96 / 25.4;
  return [...document.querySelectorAll('.page')].map((p, i) => {
    const box = p.getBoundingClientRect();
    const body = p.querySelector('.page__body');
    // Any descendant whose bottom edge passes the sheet's padding box.
    const padBottom = parseFloat(getComputedStyle(p).paddingBottom);
    const limit = box.height - padBottom;
    let worst = 0;
    let culprit = '';
    for (const el of p.querySelectorAll('*')) {
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue;
      const r = el.getBoundingClientRect();
      if (!r.height) continue;
      const over = r.bottom - box.top - limit;
      if (over > worst) { worst = over; culprit = el.className || el.tagName; }
    }
    return {
      page: i + 1,
      cls: p.className,
      wmm: +(box.width / MM).toFixed(2),
      hmm: +(box.height / MM).toFixed(2),
      overflowMm: +(worst / MM).toFixed(2),
      culprit: String(culprit).slice(0, 60),
      bodyScroll: body ? body.scrollHeight - body.clientHeight : 0,
    };
  });
}, A4);

console.log('\nA4 sheet report  (target 210 x 297 mm)');
console.log('─'.repeat(78));
let bad = 0;
for (const r of report) {
  const geomOk = Math.abs(r.wmm - A4.w) < 0.4 && Math.abs(r.hmm - A4.h) < 0.4;
  const fitOk = r.overflowMm <= 0.4 && r.bodyScroll <= 1;
  if (!geomOk || !fitOk) bad++;
  console.log(
    `P${String(r.page).padStart(2)}  ${String(r.wmm).padStart(6)} x ${String(r.hmm).padStart(6)} mm` +
    `  geom ${geomOk ? 'OK ' : 'BAD'}   overflow ${String(r.overflowMm).padStart(6)} mm` +
    `  ${fitOk ? 'fits' : 'OVERFLOW -> ' + r.culprit}`
  );
}
console.log('─'.repeat(78));
console.log(bad === 0 ? 'All sheets are A4 and fit.' : `${bad} sheet(s) need work.`);

// 2. The real artifact: print to PDF with zero margins, exactly what Ctrl+P emits.
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: path.join(out, 'brochure.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  preferCSSPageSize: true,
});
const pdf = fs.readFileSync(path.join(out, 'brochure.pdf'));
const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`\nbrochure.pdf written — ${pages} pages, ${(pdf.length / 1024).toFixed(0)} KB`);
if (pages !== report.length) {
  console.log(`WARNING: PDF has ${pages} pages but the document has ${report.length} sheets.`);
}

// 3. Screenshots of each sheet, for visual review.
await page.emulateMedia({ media: 'screen' });
await page.setViewportSize({ width: 900, height: 1300 });
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(400);
const shots = process.env.SHOTS_ALL ? [...report.keys()].map((i) => i) : [0, 1, 2, 3, 4, 5, 6, 7];
for (const i of shots) {
  const el = page.locator('.page').nth(i);
  await el.screenshot({ path: path.join(out, `p${String(i + 1).padStart(2, '0')}.png`) });
}
console.log(`Screenshots -> ${path.relative(root, out)}/p01..p08.png`);

await browser.close();
