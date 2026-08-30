<script lang="ts">
	import PageHead from '$lib/components/PageHead.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const { podcast, photo } = $derived(data);
</script>

<svelte:head>
	<title>Podcast — Blast of Eternity</title>
	<meta name="description" content={podcast.description} />
</svelte:head>

<PageHead eyebrow="Zum Nachhören" title="Podcast" {photo}>
	{podcast.description}
</PageHead>

<!-- ========================================================== platforms -->
<section class="section section--tight">
	<div class="page">
		<h2 class="eyebrow">Wo es den Podcast gibt</h2>
		<ul class="platforms" use:reveal>
			{#each podcast.platforms as platform (platform.url)}
				<li>
					<a href={platform.url} rel="noopener" target="_blank">
						<span>{platform.name}</span>
						<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
							<path
								d="M4 12 12 4M6 4h6v6"
								fill="none"
								stroke="currentColor"
								stroke-linecap="square"
							/>
						</svg>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- =========================================================== episodes -->
<section class="section">
	<div class="page">
		<SectionHead eyebrow="{podcast.episodes.length} Folgen" title="Alle Episoden" />

		<ol class="episodes">
			{#each podcast.episodes as episode (episode.id)}
				<li use:reveal>
					<article>
						<p class="number numeral" aria-hidden="true">
							{String(episode.number).padStart(2, '0')}
						</p>
						<div>
							<h3>
								<span class="visually-hidden">Episode {episode.number} —</span>
								{episode.title}
							</h3>
							<p class="meta">
								<span class="numeral">{episode.date_label}</span>
								{#if episode.guest}<span class="guest">Zu Gast: {episode.guest}</span>{/if}
							</p>
							<p class="desc">{episode.description}</p>
						</div>
					</article>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.platforms {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		margin: 1.5rem 0 0;
		padding: 0;
	}

	.platforms a {
		display: inline-flex;
		align-items: center;
		gap: 0.75em;
		padding: 0.85em 1.5em;
		border: 1px solid var(--hairline);
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--silver-dim);
		transition:
			color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.platforms a:hover,
	.platforms a:focus-visible {
		color: var(--silver);
		border-color: var(--hairline-strong);
	}

	.platforms svg {
		width: 0.9em;
		height: 0.9em;
	}

	.episodes {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.episodes li {
		border-bottom: 1px solid var(--hairline);
	}

	article {
		display: grid;
		gap: 0.5rem 2rem;
		padding-block: clamp(1.75rem, 4vw, 2.5rem);
	}

	@media (min-width: 45rem) {
		article {
			grid-template-columns: 5rem 1fr;
		}
	}

	.number {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-2);
		line-height: 1.2;
		color: var(--steel);
	}

	h3 {
		font-size: var(--step-2);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.25rem;
		margin: 0.9rem 0 1.1rem;
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--steel);
	}

	.guest::before {
		content: '· ';
	}

	.desc {
		max-width: var(--measure);
		margin: 0;
		color: var(--silver-dim);
	}
</style>
