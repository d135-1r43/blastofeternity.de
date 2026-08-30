/**
 * Renders the 1200×630 social cards in static/og.
 *
 * The cards are drawn with the site's own wordmark, typeface and scrim rather
 * than cropped out of a photograph, so a link shared into WhatsApp or Instagram
 * looks like the site. The results are committed; re-run this only when the
 * photographs or the wording change:
 *
 *   pnpm og
 *
 * Everything is inlined from static/, so no dev server has to be running — a
 * font loaded over http from an about:blank document would fail CORS anyway.
 * Needs a local Chrome; override the path with CHROME=/path/to/chrome.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const STATIC = new URL('../static/', import.meta.url);
const OUT = new URL('../static/og/', import.meta.url);

const dataUri = async (path, mime) =>
	`data:${mime};base64,${(await readFile(new URL(path, STATIC))).toString('base64')}`;

/** photo: a base name under static/images. label: the line under the wordmark. */
const CARDS = [
	{ name: 'default', photo: 'crowd', label: 'Metal-Festival &amp; Clubkonzerte · Heilbronn' },
	{ name: 'home', photo: 'crowd', label: '6. &amp; 7. November 2026 · Maschinenfabrik Heilbronn' },
	{ name: 'festival', photo: 'stage', label: 'Festival 2026 · 6. &amp; 7. November · Heilbronn' },
	{ name: 'konzerte', photo: 'amp', label: 'Clubkonzerte' },
	{ name: 'podcast', photo: 'stagedive', label: 'Der Podcast' },
	{ name: 'about', photo: 'hands', label: 'Über uns' },
	{ name: 'kontakt', photo: 'guitar', label: 'Kontakt' }
];

const font = await dataUri('fonts/cinzel-normal-latin.woff2', 'font/woff2');
const logo = await dataUri('logo-boe.png', 'image/png');

const card = (bg, label) => `
<!doctype html><meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Cinzel'; font-style: normal; font-weight: 400 700;
    src: url('${font}') format('woff2');
  }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #08080a; }
  .card { position: relative; width: 1200px; height: 630px; display: grid; place-items: center; }
  img.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
           object-position: center 42%; filter: grayscale(.35) contrast(1.05) brightness(.85); }
  .scrim { position: absolute; inset: 0; background:
      radial-gradient(58% 66% at 50% 46%, rgba(8,8,10,.72) 0%, rgba(8,8,10,.42) 55%, transparent 85%),
      linear-gradient(rgba(8,8,10,.55) 0%, rgba(8,8,10,.12) 38%, rgba(8,8,10,.6) 100%); }
  .inner { position: relative; text-align: center; padding: 0 80px; }
  .mark { width: 620px; filter: drop-shadow(0 2px 22px rgba(0,0,0,.9)); }
  .label { margin-top: 34px; font-family: 'Cinzel', serif; font-weight: 600; font-size: 26px;
           letter-spacing: .16em; text-transform: uppercase; color: #e7e8ec;
           text-shadow: 0 1px 14px rgba(8,8,10,.95); }
  .rule { width: 190px; height: 1px; margin: 30px auto 0;
          background: linear-gradient(90deg, transparent, rgba(231,232,236,.55), transparent); }
</style>
<div class="card">
  <img class="bg" src="${bg}">
  <div class="scrim"></div>
  <div class="inner">
    <img class="mark" src="${logo}">
    <div class="label">${label}</div>
    <div class="rule"></div>
  </div>
</div>`;

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

for (const c of CARDS) {
	const bg = await dataUri(`images/${c.photo}-1400.jpg`, 'image/jpeg');
	await page.setContent(card(bg, c.label), { waitUntil: 'load' });
	await page.evaluate(async () => {
		await document.fonts.load('600 26px Cinzel');
		await document.fonts.ready;
		await Promise.all(
			[...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {})))
		);
	});
	const buf = await page.screenshot({ type: 'jpeg', quality: 82 });
	await writeFile(new URL(`${c.name}.jpg`, OUT), buf);
	console.log(`static/og/${c.name}.jpg  ${(buf.length / 1024).toFixed(0)} KB`);
}

await browser.close();
