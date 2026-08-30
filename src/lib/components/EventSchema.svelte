<script lang="ts">
	import type { Festival, Site } from '$lib/types';

	/**
	 * schema.org MusicEvent for the festival, so search engines and calendars
	 * pick up the dates, venue and ticket link rather than guessing at them.
	 */
	type Props = { festival: Festival; site: Site };
	let { festival, site }: Props = $props();

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'MusicEvent',
		name: festival.title,
		startDate: festival.date_start,
		endDate: festival.date_end,
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		url: `${site.url}/boe/`,
		image: `${site.url}/images/crowd-1400.jpg`,
		location: {
			'@type': 'MusicVenue',
			name: festival.venue.name,
			url: festival.venue.url,
			address: {
				'@type': 'PostalAddress',
				streetAddress: festival.venue.street,
				postalCode: festival.venue.postal_code,
				addressLocality: festival.venue.city,
				addressCountry: 'DE'
			}
		},
		organizer: {
			'@type': 'Organization',
			name: site.organisation.name,
			url: site.url,
			email: site.organisation.email
		},
		performer: festival.lineup.map((band) => ({ '@type': 'MusicGroup', name: band.name })),
		offers: festival.tickets.prices.map((price) => ({
			'@type': 'Offer',
			name: price.label,
			price: price.amount,
			priceCurrency: price.currency,
			url: festival.tickets.url,
			availability: 'https://schema.org/InStock'
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>
