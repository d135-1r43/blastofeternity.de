import { getPages } from '$lib/content';

export async function load() {
	const pages = await getPages();
	return { imprint: pages.imprint };
}
