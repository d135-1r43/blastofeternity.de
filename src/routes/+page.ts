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
		Promise.all([
			getPhotosById('crowd', 'guitar', 'headbang', 'stage'),
			getPhotosById('hands', 'stagedive')
		])
	]);

	const [heroPhotos, plates] = photos;

	return {
		festival,
		concert: concerts[0] ?? null,
		podcast,
		pages,
		heroPhotos,
		plates
	};
}
