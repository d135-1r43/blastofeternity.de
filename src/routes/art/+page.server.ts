import QRCode from 'qrcode';
import { getLatestFestival } from '$lib/content';

/** Anna Jäger-Hauer, who made this year's festival artwork. */
const ARTIST_URL = 'https://linestyle-artwork.de/';

export async function load() {
	const [festival, qr] = await Promise.all([
		getLatestFestival(),
		// The same QR code as on /ps, drawn at build time.
		QRCode.toString(ARTIST_URL, {
			type: 'svg',
			margin: 0,
			errorCorrectionLevel: 'M',
			color: { dark: '#08080a', light: '#0000' }
		})
	]);
	return { festival, qr };
}
