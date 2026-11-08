import { getLatestFestival } from '$lib/content';

export async function load() {
	// The good-night slide says when the festival carries on.
	return { festival: await getLatestFestival() };
}
