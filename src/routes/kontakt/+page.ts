import { getPhotosById } from '$lib/content';

export async function load() {
	const photos = await getPhotosById('reach');
	return { photo: photos[0] };
}
