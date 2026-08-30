import { getSite } from '$lib/content';

export const prerender = true;

/** Every route on the site. Static, because every route is. */
const paths = [
	'/',
	'/boe/',
	'/konzerte/',
	'/podcast/',
	'/uber-uns/',
	'/kontakt/',
	'/impressum/',
	'/datenschutz/'
];

export async function GET() {
	const site = await getSite();
	const today = new Date().toISOString().slice(0, 10);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
	.map(
		(path) => `	<url>
		<loc>${site.url}${path}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>${path === '/' || path === '/boe/' ? 'weekly' : 'monthly'}</changefreq>
		<priority>${path === '/' ? '1.0' : path === '/boe/' ? '0.9' : '0.6'}</priority>
	</url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
