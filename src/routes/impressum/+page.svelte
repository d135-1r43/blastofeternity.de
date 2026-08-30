<script lang="ts">
	import PageHead from '$lib/components/PageHead.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const { imprint } = $derived(data);
</script>

<svelte:head>
	<title>Impressum — Blast of Eternity</title>
	<meta
		name="description"
		content="Impressum des CVJM Jugendkultur & Musik e. V., Veranstalter des Blast of Eternity."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHead eyebrow="Rechtliches" title={imprint.title} />

<section class="section">
	<div class="page">
		<div class="prose legal">
			{#each imprint.sections as section}
				<section use:reveal>
					<h2 class="eyebrow">{section.heading}</h2>
					{#each section.body as line}
						<p>{line}</p>
					{/each}
				</section>
			{/each}
		</div>
	</div>
</section>

<style>
	.legal > :global(section + section) {
		margin-top: clamp(2.25rem, 5vw, 3rem);
	}

	.legal :global(h2) {
		margin-bottom: 1rem;
	}

	.legal :global(p) {
		margin-bottom: 0.4em;
		color: var(--silver-dim);
	}

	.legal :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
