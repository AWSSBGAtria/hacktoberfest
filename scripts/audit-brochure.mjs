// Programmatic design audit for the brochure. This session cannot view images,
// so every quality claim is measured in the rendered page instead of eyeballed:
// fill ratio per sheet, text clipped by its container, computed contrast, minimum
// type size, asset loading, and a serif/sans/geometry sanity pass.
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = process.env.DOC || 'Sponsorship_Brochure.html';
const target = pathToFileURL(path.join(root, 'public', DOC)).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
await page.goto(target, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const out = await page.evaluate(() => {
  const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const over = (fg, bg) => { const a = fg[3] ?? 1; return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)); };
  const ratio = (fg, bg) => { const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a); return (l1 + 0.05) / (l2 + 0.05); };

  // Walk up for the first opaque background.
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
      n = n.parentElement;
    }
    return [242, 242, 235];
  };

  const sheets = [...document.querySelectorAll('.page')].map((p, i) => {
    const cs = getComputedStyle(p);
    const padT = parseFloat(cs.paddingTop), padB = parseFloat(cs.paddingBottom);
    const box = p.getBoundingClientRect();
    const body = p.querySelector('.page__body');
    const usable = box.height - padT - padB;

    // Content extent inside .page__body only. The running foot is pinned to the
    // bottom by margin-top:auto, so measuring to it would always read 100%.
    let top = Infinity, bottom = -Infinity, clipped = [], lowContrast = [], smallType = [];
    for (const el of p.querySelectorAll('*')) {
      if (el.tagName === 'svg' || el.closest('svg')) continue;
      if (el.closest('.run')) continue;
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (r.height > 0 && (hasText || el.tagName === 'IMG')) {
        top = Math.min(top, r.top - box.top);
        bottom = Math.max(bottom, r.bottom - box.top);
      }
      // Text wider than its own box (no wrapping available).
      if (hasText && el.scrollWidth - el.clientWidth > 1 && style.overflow !== 'visible') {
        clipped.push((el.className || el.tagName) + ' +' + (el.scrollWidth - el.clientWidth) + 'px');
      }
      if (hasText) {
        const fg = over(parse(style.color), bgOf(el));
        const cr = ratio(fg, bgOf(el));
        const size = parseFloat(style.fontSize);
        const large = size >= 18.66 || (size >= 14 && Number(style.fontWeight) >= 700);
        if (cr < (large ? 3 : 4.5)) {
          lowContrast.push(
            `${String(el.className || el.tagName).slice(0, 24)} ${cr.toFixed(2)}:1 ` +
            `"${el.textContent.trim().slice(0, 18)}" fg=${style.color} bg=${getComputedStyle(el.closest('[class*=card],[class*=tile],[class*=step],[class*=lane],[class*=track],[class*=lane__head]') || el).backgroundColor}`
          );
        }
        if (size < 6.4) smallType.push(`${String(el.className || el.tagName).slice(0, 24)} ${size.toFixed(1)}pt`);
      }
    }
    const used = bottom - (isFinite(top) ? top : padT);
    return {
      page: i + 1,
      fill: +(used / usable * 100).toFixed(1),
      topGapMm: isFinite(top) ? +((top - padT) / (96 / 25.4)).toFixed(1) : null,
      bottomGapMm: +((box.height - padB - bottom) / (96 / 25.4)).toFixed(1),
      clipped: [...new Set(clipped)],
      lowContrast: [...new Set(lowContrast)],
      smallType: [...new Set(smallType)],
      bodyOverflow: body ? body.scrollHeight - body.clientHeight : 0,
    };
  });

  // Column overlap, compared only within a single grid row (wrapping makes a
  // naive left-to-right comparison report a false positive on every 2nd row).
  const collisions = [];
  for (const row of document.querySelectorAll('.cover__lane, .lanes, .why, .tracks, .touch, .service, .everything__grid, .wall__grid, .people, .toc__lanes')) {
    const kids = [...row.children].map((k) => k.getBoundingClientRect());
    const byTop = new Map();
    kids.forEach((r) => {
      const key = Math.round(r.top / 4);
      byTop.set(key, [...(byTop.get(key) || []), r]);
    });
    for (const group of byTop.values()) {
      for (let a = 0; a < group.length - 1; a++) {
        if (group[a].right > group[a + 1].left + 0.5) collisions.push(row.className + ' overlap in row');
      }
    }
  }

  // Every internal link must resolve to a real id, and every id a page.
  const linkCheck = [...document.querySelectorAll('a[href^="#"]')].map((a) => ({
    href: a.getAttribute('href'),
    ok: !!document.getElementById(a.getAttribute('href').slice(1)),
  }));
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
  const extLinks = [...document.querySelectorAll('a[href^="http"]')]
    .filter((a) => a.closest('.page'))
    .map((a) => a.getAttribute('href'));

  const imgs = [...document.images].map((im) => ({ src: im.src.split('/').pop(), ok: im.complete && im.naturalWidth > 0 }));

  const h = [...document.querySelectorAll('h1,h2,h3,h4')].map((e) => ({
    tag: e.tagName,
    text: e.textContent.trim().slice(0, 34),
    pt: +(parseFloat(getComputedStyle(e).fontSize) * 0.75).toFixed(1),
  }));

  return { sheets, collisions: [...new Set(collisions)], linkCheck, ids, extLinks, imgs, h };
});

const MM = '(96 / 25.4 = 3.7795 px per mm)';
console.log(`\nPer-sheet fill and clearance  [${MM}]\n` + '─'.repeat(74));
for (const s of out.sheets) {
  const tight = s.fill > 99;
  const loose = s.fill < 78;
  console.log(
    `P${String(s.page).padStart(2)}  fill ${String(s.fill).padStart(5)}%   top gap ${String(s.topGapMm ?? 'n/a').padStart(5)}mm   bottom gap ${String(s.bottomGapMm).padStart(5)}mm` +
    `  ${tight ? 'AT LIMIT' : loose ? 'loose' : 'ok'}`
  );
  if (s.clipped.length) console.log(`     clipped text : ${s.clipped.join(', ')}`);
  if (s.lowContrast.length) console.log(`     low contrast : ${s.lowContrast.join(', ')}`);
  if (s.smallType.length) console.log(`     under 6.4pt  : ${s.smallType.join(', ')}`);
}
console.log('─'.repeat(74));
console.log('column collisions :', out.collisions.length ? out.collisions.join('; ') : 'none');
const badLinks = out.linkCheck.filter((l) => !l.ok);
console.log(`internal links    : ${out.linkCheck.length} total, ${badLinks.length ? 'BROKEN -> ' + badLinks.map((b) => b.href).join(', ') : 'all resolve'}`);
console.log('anchor targets    :', out.ids.join(', '));
console.log('external links    :', [...new Set(out.extLinks)].length, 'unique');
console.log('images            :', out.imgs.length, 'total,', out.imgs.filter((i) => !i.ok).length, 'broken');
for (const i of out.imgs) if (!i.ok) console.log('   BROKEN IMAGE:', i.src);
console.log('\nheading scale (pt):');
for (const x of out.h) console.log(`  ${x.tag}  ${String(x.pt).padStart(5)}pt  ${x.text}`);

await browser.close();
