// Confirm each sheet prints as exactly one A4 page, with no blank spill pages.
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const DOC = process.env.DOC || 'Sponsorship_Brochure.html';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(path.join(process.cwd(), 'public', DOC)).href, { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
const sheets = await p.evaluate(() => document.querySelectorAll('.page').length);
const out = `/tmp/kilo/${path.basename(DOC, '.html')}.pdf`;
await p.pdf({ path: out, format: 'A4', printBackground: true });
const buf = fs.readFileSync(out);
const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`${DOC}\n  sheets in markup : ${sheets}\n  PDF pages        : ${pages}\n  ${sheets === pages ? 'PASS  one page per sheet' : 'FAIL  pagination mismatch'}`);
await b.close();
process.exit(sheets === pages ? 0 : 1);
