import {
	getFestival,
	getPages,
	getPhotosById,
	getPodcast,
	getUpcomingConcerts
} from '$lib/content';

export async function load() {
	const [festival, concerts, podcast, pages, photos] = await Promise.all([
		getFestival(),
		getUpcomingConcerts(),
		getPodcast(),
		getPages(),
		getPhotosById('crowd', 'hands', 'amp', 'stagedive')
	]);

	const [hero, ...plates] = photos;

	return {
		festival,
		concert: concerts[0] ?? null,
		podcast,
		pages,
		hero,
		plates
	};
}
