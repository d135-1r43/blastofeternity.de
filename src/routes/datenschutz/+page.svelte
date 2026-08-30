<script lang="ts">
	import PageHead from '$lib/components/PageHead.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const { privacy } = $derived(data);
</script>

<svelte:head>
	<title>Datenschutzerklärung — Blast of Eternity</title>
	<meta name="description" content="Datenschutzerklärung von blastofeternity.de." />
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHead eyebrow="Rechtliches" title={privacy.title} />

<section class="section">
	<div class="page">
		<div class="prose legal">
			{#each privacy.sections as section (section.id)}
				<section use:reveal>
					{#if section.level === 2}
						<h2>{section.heading}</h2>
					{:else}
						<h3>{section.heading}</h3>
					{/if}
					{#each section.body as paragraph}
						<p>{paragraph}</p>
					{/each}
				</section>
			{/each}
		</div>
	</div>
</section>

<style>
	.legal > :global(section) {
		margin-top: 2.25rem;
	}

	.legal :global(h2) {
		margin: clamp(3rem, 7vw, 4.5rem) 0 1.25rem;
		line-height: 1.2;
		padding-top: 1.75rem;
		border-top: 1px solid var(--hairline);
		font-size: var(--step-2);
	}

	.legal :global(section:first-child h2) {
		margin-top: 0;
		padding-top: 0;
		border-top: 0;
	}

	.legal :global(h3) {
		margin-bottom: 0.9rem;
		line-height: 1.5;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-0);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.legal :global(p) {
		font-size: calc(var(--step-0) * 0.92);
		line-height: 1.75;
		color: var(--silver-dim);
	}
</style>
