import {
	getFestival,
	getFestivalAnnouncements,
	getPages,
	getPhotosById,
	getPodcast,
	getUpcomingConcerts
} from '$lib/content';
import type { HeroSlide } from '$lib/types';

/** A Directus asset scaled to `width`, never past its own size. */
const directusAsset = (url: string, width: number) =>
	`${url}?width=${width}&quality=75&fit=inside&format=auto&withoutEnlargement=true`;

export async function load() {
	const [festival, announcements, concerts, podcast, pages, photos] = await Promise.all([
		getFestival(),
		getFestivalAnnouncements(),
		getUpcomingConcerts(),
		getPodcast(),
		getPages(),
		Promise.all([
			getPhotosById('crowd', 'guitar', 'headbang', 'stage'),
			getPhotosById('hands', 'stagedive')
		])
	]);

	const [festivalPhotos, plates] = photos;

	// While a festival is on sale the hero cycles through the festival photos;
	// between editions it shows one picture from the last one and says thank you.
	const { image } = pages.home.thanks;
	// Never ask Directus for more than the original: past it, it answers with a
	// broken AVIF instead of the full-size image.
	const directusWidths = [...[800, 1400, 1800].filter((w) => w < image.width), image.width];
	const heroPhotos: HeroSlide[] = festival
		? festivalPhotos.map((p) => ({
				id: p.id,
				src: `${p.src}-${p.widths[p.widths.length - 1]}.jpg`,
				srcset: p.widths.map((w) => `${p.src}-${w}.jpg ${w}w`).join(', '),
				width: p.width,
				height: p.height
			}))
		: [
				{
					id: 'thanks',
					src: directusAsset(image.url, 1800),
					srcset: directusWidths.map((w) => `${directusAsset(image.url, w)} ${w}w`).join(', '),
					width: image.width,
					height: image.height,
					position: image.position
				}
			];

	return {
		festival,
		announcement: announcements[0] ?? null,
		concert: concerts[0] ?? null,
		podcast,
		pages,
		heroPhotos,
		plates
	};
}
