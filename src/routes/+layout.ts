import { getSite } from '$lib/content';

// Everything is content the build knows about, so the whole site prerenders.
export const prerender = true;
export const trailingSlash = 'always';

export async function load() {
	return { site: await getSite() };
}
