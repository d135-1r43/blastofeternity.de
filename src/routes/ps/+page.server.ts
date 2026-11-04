import QRCode from 'qrcode';
import {
	getFestival,
	getFestivalAnnouncements,
	getLuxPhotos,
	getPartners,
	getUpcomingConcerts
} from '$lib/content';

const LUX_URL = 'https://lux-in-tenebris.de/';

export async function load() {
	const [festival, concerts, announcements, partners, luxPhotos] = await Promise.all([
		getFestival(),
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

	const luxQr = await QRCode.toString(LUX_URL, {
		type: 'svg',
		margin: 0,
		errorCorrectionLevel: 'M',
		color: { dark: '#08080a', light: '#0000' }
	});

	return { festival, promos, announcements, partners, lux: { photos: luxPhotos, qr: luxQr } };
}
