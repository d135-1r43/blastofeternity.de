import {
	getFestival,
	getFestivalAnnouncements,
	getFestivalArchive,
	getPhotosById
} from '$lib/content';

export async function load() {
	const [festival, announcements, archive, photos] = await Promise.all([
		getFestival(),
		getFestivalAnnouncements(),
		getFestivalArchive(),
		getPhotosById('stage', 'guitar')
	]);

	return { festival, announcement: announcements[0] ?? null, archive, photos };
}
