import QRCode from 'qrcode';
import {
	getLatestFestival,
	getFestivalAnnouncements,
	getLuxPhotos,
	getPartners,
	getUpcomingConcerts
} from '$lib/content';

const LUX_URL = 'https://lux-in-tenebris.de/';
/** Anna Jäger-Hauer, who made this year's festival artwork. */
const ARTIST_URL = 'https://linestyle-artwork.de/';

export async function load() {
	const [festival, concerts, announcements, partners, luxPhotos] = await Promise.all([
		getLatestFestival(),
		getUpcomingConcerts(),
		getFestivalAnnouncements(),
		getPartners(),
		getLuxPhotos()
	]);

	// Every upcoming concert with a ticket shop gets a promo slide. The QR code is
	// drawn here, at build time, so the screen needs no extra JavaScript for it.
	const promos = await Promise.all(
		concerts
			.filter((c) => c.tickets_url)
			.map(async (concert) => ({
				concert,
				qr: await QRCode.toString(concert.tickets_url!, {
					type: 'svg',
					margin: 0,
					errorCorrectionLevel: 'M',
					color: { dark: '#08080a', light: '#0000' }
				})
			}))
	);

	const qr = (url: string) =>
		QRCode.toString(url, {
			type: 'svg',
			margin: 0,
			errorCorrectionLevel: 'M',
			color: { dark: '#08080a', light: '#0000' }
		});
	const [luxQr, artistQr] = await Promise.all([qr(LUX_URL), qr(ARTIST_URL)]);

	// This year's festival photos get a slide of their own, as a look back at the
	// night before, and stay out of the random Lux in Tenebris pool.
	const isRecap = (p: (typeof luxPhotos)[number]) =>
		p.festival.startsWith(`Blast of Eternity ${festival.year}`);
	const recap = luxPhotos.filter(isRecap);

	return {
		festival,
		recap,
		promos,
		announcements,
		partners,
		lux: { photos: luxPhotos.filter((p) => !isRecap(p)), qr: luxQr },
		artist: { qr: artistQr }
	};
}
