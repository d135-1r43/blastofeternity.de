/**
 * Content model.
 *
 * These types mirror the collections this site expects from a headless CMS.
 * Today the data lives in `src/lib/content/*.json`; the shapes are deliberately
 * Directus-flavoured (`id`, `status`, `sort`, snake_case fields, ISO dates) so
 * that swapping the JSON for API responses is a change in `content.ts` only.
 */

export type Link = {
	label: string;
	url: string;
};

export type NavItem = {
	label: string;
	href: string;
};

/* -------------------------------------------------------------- singleton: site */

export type Site = {
	id: 'site';
	title: string;
	tagline: string;
	presenter: string;
	description: string;
	url: string;
	locale: string;
	navigation: NavItem[];
	legal_navigation: NavItem[];
	socials: { platform: string; handle: string; url: string }[];
	organisation: {
		name: string;
		street: string;
		postal_code: string;
		city: string;
		country: string;
		email: string;
		press_email: string;
		phone: string;
		phone_label: string;
		board: string[];
		register_court: string;
		register_number: string;
	};
	bank: { holder: string; bank: string; bic: string; iban: string };
	contact: {
		intro: string;
		/** POST target for the contact form. `null` falls back to a mailto: draft. */
		form_endpoint: string | null;
		subjects: string[];
	};
};

/* --------------------------------------------------------- collection: festivals */

export type Band = {
	id: string;
	sort: number;
	/** Billing tier — 1 is top of the poster. Drives type size in the line-up. */
	tier: 1 | 2 | 3;
	name: string;
	origin: string | null;
	genre: string;
	image: string | null;
	/** YouTube video id. */
	video: string | null;
};

export type Venue = {
	name: string;
	legal_name?: string;
	street: string;
	postal_code: string;
	city: string;
	url: string;
};

export type FaqItem = {
	id: string;
	sort: number;
	question: string;
	answer: string[];
	link?: Link;
	/** Renders the association's bank details underneath the answer. */
	bank?: boolean;
};

export type RunningOrderSlot = {
	day: string;
	time: string;
	band: string;
};

export type Festival = {
	id: string;
	status: string;
	sort: number;
	state: 'upcoming' | 'past';
	year: number;
	slug: string;
	title: string;
	date_start: string;
	date_end: string;
	date_label: string;
	date_short: string;
	venue: Venue;
	poster: string | null;
	tickets: {
		url: string;
		provider: string;
		note: string;
		prices: { label: string; amount: number; currency: string }[];
	};
	running_order: RunningOrderSlot[];
	running_order_note: string;
	lineup: Band[];
	faq: FaqItem[];
	travel: { body: string[]; link: Link; map_url: string };
};

export type ArchivedFestival = {
	id: string;
	status: string;
	sort: number;
	year: number;
	date_label: string;
	title: string;
	city: string | null;
	venue: string | null;
	poster: string | null;
	lineup: string[];
	note: string | null;
};

/* ---------------------------------------------------------- collection: concerts */

export type Concert = {
	id: string;
	status: string;
	sort: number;
	state: 'upcoming' | 'past';
	date: string;
	date_label: string;
	title: string;
	subtitle: string | null;
	support: string[];
	venue: string;
	city: string;
	tickets_url: string | null;
	image: string | null;
	description: string[];
	quote?: { text: string; source: string };
};

export type ArchivedConcert = {
	id: string;
	status: string;
	sort: number;
	date: string;
	date_label: string;
	title: string;
	city: string | null;
	lineup: string[];
	description: string[];
	note: string | null;
};

/* ----------------------------------------------------------- singleton: podcast */

export type PodcastEpisode = {
	id: string;
	status: string;
	number: number;
	date: string;
	date_label: string;
	title: string;
	guest: string | null;
	description: string;
};

export type Podcast = {
	id: 'podcast';
	title: string;
	description: string;
	platforms: { name: string; url: string }[];
	episodes: PodcastEpisode[];
};

/* ------------------------------------------------------------ collection: photos */

export type Photo = {
	id: string;
	status: string;
	sort: number;
	/** Path without width suffix or extension, e.g. `/images/crowd`. */
	src: string;
	/** Rendered widths available on disk, ascending. */
	widths: number[];
	width: number;
	height: number;
	alt: string;
	caption: string;
	year: number;
};

/* ------------------------------------------------------------- singleton: pages */

export type Section = {
	heading: string;
	body: string[];
};

export type Pages = {
	home: {
		id: 'home';
		aftermovie: { title: string; video: string; caption: string };
		intro: string[];
	};
	about: {
		id: 'about';
		title: string;
		lead: string;
		body: string[];
		pull_quote: string;
		facts: { label: string; value: string }[];
	};
	imprint: {
		id: 'imprint';
		title: string;
		sections: Section[];
	};
};

export type Privacy = {
	id: 'privacy';
	title: string;
	updated: string;
	sections: { id: string; level: 2 | 3; heading: string; body: string[] }[];
};
