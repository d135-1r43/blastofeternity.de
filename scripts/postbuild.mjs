/**
 * Copies the prerendered /404 route to build/404.html.
 *
 * nginx (`error_page 404 /404.html`), Netlify and Cloudflare Pages all expect a
 * 404.html at the root. adapter-static can write one via its `fallback` option,
 * but that produces an empty SPA shell that stays blank without JavaScript —
 * so the route is prerendered properly and copied into place instead.
 */
import { copyFile } from 'node:fs/promises';

const from = new URL('../build/404/index.html', import.meta.url);
const to = new URL('../build/404.html', import.meta.url);

await copyFile(from, to);
console.log('build/404.html  <-  build/404/index.html');
