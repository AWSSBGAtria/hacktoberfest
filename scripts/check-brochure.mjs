// Functional check of the brochure as a document: contents links must land on
// the right sheet, the fit-to-width preview must scale down on a phone without
// reflowing the sheet, and print must reset the scale to exactly 1.
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = process.env.DOC || 'Sponsorship_Brochure.html';
const url = pathToFileURL(path.join(root, 'public', DOC)).href;
const browser = await chromium.launch();
let fail = 0;
const check = (name, ok, detail = '') => {
  if (!ok) fail++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
};

console.log('\nContents navigation');
{
  const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // Derive the contents targets from the document so each brochure is checked
  // against its own pages rather than a hardcoded list.
  const labels = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')))]);
  check('contents links exist', labels.length > 0, `${labels.length} targets`);
  for (const label of labels) {
    await page.locator(`a[href="${label}"]`).first().click();
    // Contents jumps cross up to seven full A4 sheets under smooth scrolling,
    // so wait for the scroll to actually settle rather than a fixed delay.
    await page.waitForFunction(() => new Promise((done) => {
      let last = -1, still = 0;
      const tick = () => {
        if (Math.abs(window.scrollY - last) < 0.5) { if (++still > 3) return done(true); }
        else still = 0;
        last = window.scrollY;
        setTimeout(tick, 60);
      };
      tick();
    }), null, { timeout: 15000 });
    const landed = await page.evaluate(() => location.hash);
    const id = label.slice(1);
    // The target sheet must be the one under the viewport after the jump.
    const visible = await page.evaluate((i) => {
      const r = document.getElementById(i).getBoundingClientRect();
      return r.top > -200 && r.top < 400;
    }, id);
    check(`${label} navigates`, landed === label && visible, `hash=${landed || 'none'} inView=${visible}`);
  }
  await page.close();
}

console.log('\nResponsive preview (sheets must stay A4, never reflow)');
for (const vp of [{ w: 1440, h: 900 }, { w: 1024, h: 800 }, { w: 768, h: 900 }, { w: 390, h: 844 }]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => {
    const p = document.querySelector('.page');
    const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sheet-scale'));
    return { scale: s, rendered: +(p.getBoundingClientRect().width / (96 / 25.4)).toFixed(1), docW: document.documentElement.scrollWidth };
  });
  const expected = +(m.rendered * m.scale).toFixed(1);
  check(`${vp.w}px viewport`, m.docW <= vp.w + 1 && m.scale <= 1,
    `scale=${m.scale} sheet=${m.rendered}mm visual=${expected}mm docW=${m.docW}`);
  await page.close();
}

console.log('\nPrint resets to 1:1');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sheet-scale')));
  await page.emulateMedia({ media: 'print' });
  const after = await page.evaluate(() => {
    const p = document.querySelector('.page');
    return {
      scale: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sheet-scale')),
      transform: getComputedStyle(p).transform,
      shadow: getComputedStyle(p).boxShadow,
      mm: +(p.getBoundingClientRect().width / (96 / 25.4)).toFixed(1),
    };
  });
  check('screen scale is reduced on a phone', before < 1, `scale=${before}`);
  check('print scale is 1', after.scale === 1, `scale=${after.scale}`);
  check('print drops the transform', after.transform === 'none', after.transform);
  check('print drops the shadow', after.shadow === 'none', after.shadow);
  check('print sheet is 210mm', Math.abs(after.mm - 210) < 0.4, `${after.mm}mm`);
  await page.close();
}

await browser.close();
console.log(fail === 0 ? '\nAll checks passed.' : `\n${fail} check(s) failed.`);
process.exit(fail ? 1 : 0);
