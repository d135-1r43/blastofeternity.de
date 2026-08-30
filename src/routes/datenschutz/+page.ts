import { getPrivacy } from '$lib/content';

export async function load() {
	return { privacy: await getPrivacy() };
}
