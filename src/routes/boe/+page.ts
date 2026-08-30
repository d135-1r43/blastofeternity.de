import { getFestival, getFestivalArchive, getPhotosById } from '$lib/content';

export async function load() {
	const [festival, archive, photos] = await Promise.all([
		getFestival(),
		getFestivalArchive(),
		getPhotosById('stage', 'guitar')
	]);

	return { festival, archive, photos };
}
