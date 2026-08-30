<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { data, children } = $props();

	// The home page opens with a full-bleed photograph; the masthead floats over it.
	const overlay = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<meta property="og:site_name" content={data.site.title} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="de_DE" />
</svelte:head>

<a class="skip-link" href="#inhalt">Zum Inhalt</a>

<Header site={data.site} {overlay} />

<main id="inhalt">
	{@render children()}
</main>

<Footer site={data.site} />

<style>
	main {
		display: block;
	}
</style>
