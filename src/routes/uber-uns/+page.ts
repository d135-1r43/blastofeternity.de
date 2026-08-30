import { getPages, getPhotosById } from '$lib/content';

export async function load() {
	const [pages, photos] = await Promise.all([getPages(), getPhotosById('hands', 'reach')]);
	return { about: pages.about, photos };
}
