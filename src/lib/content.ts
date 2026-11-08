/**
 * The one place the site reads content from.
 *
 * Right now every accessor resolves a local JSON file, so `pnpm build` produces
 * a fully static site. When the content moves to Directus, replace the bodies of
 * these functions with SDK calls — the return types stay identical, so no page
 * or component needs to change:
 *
 *   const directus = createDirectus(env.DIRECTUS_URL).with(rest());
 *   export const getFestival = () =>
 *     directus.request(readItems('festivals', {
 *       filter: { state: { _eq: 'upcoming' } },
 *       fields: ['*', 'lineup.*', 'faq.*'],
 *       limit: 1
 *     })).then((rows) => rows[0]);
 *
 * The accessors are async already so that swap does not ripple outward.
 */

import concertArchiveJson from './content/concert-archive.json';
import concertsJson from './content/concerts.json';
import festivalAnnouncementsJson from './content/festival-announcements.json';
import festivalArchiveJson from './content/festival-archive.json';
import festivalsJson from './content/festivals.json';
import pagesJson from './content/pages.json';
import partnersJson from './content/partners.json';
import photosJson from './content/photos.json';
import podcastJson from './content/podcast.json';
import privacyJson from './content/privacy.json';
import siteJson from './content/site.json';
import type {
	ArchivedConcert,
	ArchivedFestival,
	Concert,
	Festival,
	FestivalAnnouncement,
	LuxPhoto,
	Pages,
	Partner,
	Photo,
	Podcast,
	Privacy,
	Site
} from './types';

const site = siteJson as Site;
const festivals = festivalsJson as unknown as Festival[];
const festivalAnnouncements = festivalAnnouncementsJson as FestivalAnnouncement[];
const festivalArchive = festivalArchiveJson as ArchivedFestival[];
const concerts = concertsJson as unknown as Concert[];
const concertArchive = concertArchiveJson as ArchivedConcert[];
const podcast = podcastJson as Podcast;
const partners = partnersJson as Partner[];
const photos = photosJson as Photo[];
const pages = pagesJson as Pages;
const privacy = privacyJson as Privacy;

const bySort = <T extends { sort: number }>(a: T, b: T) => a.sort - b.sort;

export async function getSite(): Promise<Site> {
	return site;
}

/**
 * The festival currently being sold, or `null` between editions — after one
 * has gone into the archive and before the next one goes on sale.
 */
export async function getFestival(): Promise<Festival | null> {
	return festivals.filter((f) => f.state === 'upcoming').sort(bySort)[0] ?? null;
}

/**
 * The most recent edition, sold or already over. The signage and the slides
 * for the festival weekend keep working with it after it has been archived.
 */
export async function getLatestFestival(): Promise<Festival> {
	return [...festivals].sort((a, b) => b.year - a.year)[0];
}

/** Editions that have a date but are not on sale yet. */
export async function getFestivalAnnouncements(): Promise<FestivalAnnouncement[]> {
	return festivalAnnouncements.filter((f) => f.status === 'published').sort(bySort);
}

export async function getFestivalArchive(): Promise<ArchivedFestival[]> {
	return [...festivalArchive].sort(bySort);
}

export async function getUpcomingConcerts(): Promise<Concert[]> {
	return concerts.filter((c) => c.state === 'upcoming').sort(bySort);
}

export async function getConcertArchive(): Promise<ArchivedConcert[]> {
	return [...concertArchive].sort(bySort);
}

export async function getPodcast(): Promise<Podcast> {
	return podcast;
}

export async function getPartners(): Promise<Partner[]> {
	return partners.filter((p) => p.status === 'published').sort(bySort);
}

export async function getPhotos(): Promise<Photo[]> {
	return [...photos].sort(bySort);
}

/** Photos by id, in the order given. Lets a page compose its own sequence. */
export async function getPhotosById(...ids: string[]): Promise<Photo[]> {
	return ids
		.map((id) => photos.find((p) => p.id === id))
		.filter((p): p is Photo => p !== undefined);
}

export async function getPages(): Promise<Pages> {
	return pages;
}

export async function getPrivacy(): Promise<Privacy> {
	return privacy;
}

/**
 * All photos from lux-in-tenebris.de, for the signage. Read at build time
 * from the gallery's own API — it sends no CORS headers, so the screen cannot
 * fetch it itself. A failed request leaves the slide out rather than the build.
 */
export async function getLuxPhotos(): Promise<LuxPhoto[]> {
	try {
		const res = await fetch('https://lux-in-tenebris.de/api/images?offset=0&limit=1000', {
			signal: AbortSignal.timeout(15_000)
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const { images } = (await res.json()) as { images: LuxPhoto[] };
		return images.map(({ id, url, width, height, band, festival, year }) => ({
			id,
			url,
			width,
			height,
			band,
			festival,
			year
		}));
	} catch (error) {
		console.warn(`Lux in Tenebris photos unavailable, slide skipped: ${error}`);
		return [];
	}
}
