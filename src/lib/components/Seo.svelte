<script lang="ts">
	import { page } from '$app/state';
	import type { Site } from '$lib/types';

	/**
	 * Per-page title, description, canonical URL and social card.
	 *
	 * Every route sets one of these. Without it a shared link — which for a
	 * festival mostly means a link pasted into WhatsApp or Instagram — renders
	 * as a bare grey box with no picture and the wrong title.
	 */
	type Props = {
		site: Site;
		title: string;
		description: string;
		/** Absolute path to a 1200×630 card under /og. */
		image?: string;
		/** Legal pages: keep them out of the index. */
		noindex?: boolean;
	};

	let { site, title, description, image = '/og/default.jpg', noindex = false }: Props = $props();

	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const imageUrl = $derived(new URL(image, site.url).href);
	const fullTitle = $derived(title === site.title ? site.title : `${title} — ${site.title}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.title} />
	<meta property="og:locale" content="de_DE" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={fullTitle} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
