import { getPhotosById, getPodcast } from '$lib/content';

export async function load() {
	const [podcast, photos] = await Promise.all([getPodcast(), getPhotosById('stagedive')]);
	return { podcast, photo: photos[0] };
}
