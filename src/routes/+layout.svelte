<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { data, children } = $props();

	// The home page opens with a full-bleed photograph; the masthead floats over it.
	const overlay = $derived(page.url.pathname === '/');
	// The festival signage at /ps and the song slides at /lied fill a screen on their own.
	const signage = $derived(['/ps/', '/lied/'].some((p) => page.url.pathname.startsWith(p)));
</script>

{#if signage}
	{@render children()}
{:else}
	<a class="skip-link" href="#inhalt">Zum Inhalt</a>

	<Header site={data.site} {overlay} />

	<main id="inhalt">
		{@render children()}
	</main>

	<Footer site={data.site} partners={data.partners} />
{/if}

<style>
	main {
		display: block;
	}
</style>
