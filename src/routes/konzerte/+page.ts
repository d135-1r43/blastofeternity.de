import { getConcertArchive, getPhotosById, getUpcomingConcerts } from '$lib/content';

export async function load() {
	const [concerts, archive, photos] = await Promise.all([
		getUpcomingConcerts(),
		getConcertArchive(),
		getPhotosById('headbang')
	]);

	return { concerts, archive, photos };
}
