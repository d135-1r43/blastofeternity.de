<script lang="ts">
	import Figure from '$lib/components/Figure.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const { concerts, archive, photos } = $derived(data);
	const [plateAmp, plateHeadbang] = $derived(photos);
</script>

<svelte:head>
	<title>Clubkonzerte — Blast of Eternity</title>
	<meta
		name="description"
		content="Anstehende Clubkonzerte des CVJM Jugendkultur & Musik e. V. in Heilbronn — und ein Archiv aller Shows seit 2016."
	/>
</svelte:head>

<PageHead eyebrow="Das ganze Jahr" title="Clubkonzerte" photo={plateHeadbang}>
	Zwischen den Festivals holen wir Bands in kleine Räume: ein paar hundert Leute, kurze Wege, nichts
	dazwischen.
</PageHead>

<!-- =========================================================== upcoming -->
<section class="section">
	<div class="page">
		<SectionHead eyebrow="Anstehend" title="Nächste Konzerte" />

		{#if concerts.length}
			{#each concerts as concert (concert.id)}
				<article class="concert">
					<div class="concert-media" use:reveal>
						<Figure photo={plateAmp} sizes="(max-width: 62rem) 100vw, 40vw" showCaption={false} />
					</div>

					<div class="concert-text" use:reveal={100}>
						<p class="date numeral">{concert.date_label}</p>
						<h3>{concert.title}</h3>
						{#if concert.subtitle}<p class="subtitle">{concert.subtitle}</p>{/if}
						<p class="venue eyebrow eyebrow--tight">
							{concert.venue}, {concert.city}
							{#if concert.support.length}
								<span class="support">mit {concert.support.join(', ')}</span>
							{/if}
						</p>

						<div class="body">
							{#each concert.description as paragraph}
								<p>{paragraph}</p>
							{/each}
						</div>

						{#if concert.quote}
							<blockquote>
								<p>{concert.quote.text}</p>
								<cite>{concert.quote.source}</cite>
							</blockquote>
						{/if}

						{#if concert.tickets_url}
							<div class="actions">
								<a
									class="action action--ticket"
									href={concert.tickets_url}
									rel="noopener"
									target="_blank">Tickets</a
								>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		{:else}
			<p class="empty dim">
				Aktuell ist kein Clubkonzert angekündigt. Sobald ein Termin steht, findest du ihn hier.
			</p>
		{/if}
	</div>
</section>

<!-- ============================================================= archiv -->
<section class="section archive">
	<div class="page">
		<SectionHead eyebrow="Was war" title="Konzert-Archiv">
			Jede Show, die wir seit 2016 veranstaltet haben.
		</SectionHead>

		<div class="shows">
			{#each archive as show (show.id)}
				<details use:reveal>
					<summary>
						<span class="show-date numeral">{show.date_label}</span>
						<span class="show-title">{show.title}</span>
						{#if show.city}<span class="show-city">{show.city}</span>{/if}
						<span class="marker" aria-hidden="true"></span>
					</summary>
					<div class="show-body">
						{#if show.lineup.length}
							<p class="lineup">
								{#each show.lineup as name, i}<span class="act">{name}</span
									>{#if i < show.lineup.length - 1}<span class="dot">·</span>{/if}{/each}
							</p>
						{/if}
						{#each show.description as paragraph}
							<p>{paragraph}</p>
						{/each}
						{#if show.note}
							<p class="note">{show.note}</p>
						{/if}
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.concert {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		align-items: start;
	}

	@media (min-width: 62rem) {
		.concert {
			grid-template-columns: 0.85fr 1.15fr;
		}

		.concert-media {
			position: sticky;
			top: 7rem;
		}
	}

	.date {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.concert-text h3 {
		margin: 1rem 0 0;
		font-size: var(--step-4);
	}

	.subtitle {
		margin: 0.7rem 0 0;
		font-style: italic;
		font-size: var(--step-1);
		color: var(--silver-dim);
	}

	.venue {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		margin: 1.5rem 0 2rem;
		padding-bottom: 1.75rem;
		border-bottom: 1px solid var(--hairline);
		color: var(--steel);
	}

	.support::before {
		content: '· ';
	}

	.body {
		max-width: var(--measure);
		color: var(--silver-dim);
	}

	blockquote {
		max-width: var(--measure);
		margin: 2.5rem 0;
		padding-left: 1.75rem;
		border-left: 1px solid var(--hairline-strong);
	}

	blockquote p {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-1);
		line-height: 1.4;
		color: var(--silver);
	}

	cite {
		display: block;
		margin-top: 0.9rem;
		font-style: normal;
		font-size: var(--step--1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		font-family: var(--font-display);
		color: var(--steel);
	}

	.actions {
		margin-top: 2.5rem;
	}

	.empty {
		font-style: italic;
	}

	/* ------------------------------------------------------------- archiv */

	details {
		border-bottom: 1px solid var(--hairline);
	}

	summary {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.35rem 1.5rem;
		align-items: baseline;
		padding-block: clamp(1.1rem, 2.5vw, 1.5rem);
		cursor: pointer;
		list-style: none;
		transition: color 0.3s var(--ease);
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		color: #fff;
	}

	@media (min-width: 48rem) {
		summary {
			grid-template-columns: 11rem 1fr auto auto;
		}
	}

	.show-date {
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.show-title {
		font-family: var(--font-display);
		font-size: var(--step-1);
		line-height: 1.3;
	}

	.show-city {
		font-style: italic;
		font-size: var(--step--1);
		color: var(--steel);
	}

	.marker {
		position: relative;
		width: 0.85rem;
		height: 0.85rem;
		align-self: center;
		justify-self: end;
	}

	.marker::before,
	.marker::after {
		content: '';
		position: absolute;
		inset: 50% 0 auto;
		height: 1px;
		background: var(--silver-dim);
		transition: transform 0.35s var(--ease);
	}

	.marker::after {
		rotate: 90deg;
	}

	details[open] .marker::after {
		transform: scaleX(0);
	}

	.show-body {
		max-width: var(--measure);
		padding-bottom: clamp(1.75rem, 4vw, 2.5rem);
		color: var(--silver-dim);
	}

	.lineup {
		font-family: var(--font-display);
		color: var(--silver);
		line-height: 1.9;
	}

	.dot {
		margin-inline: 0.6em;
		color: var(--steel);
	}

	.note {
		font-style: italic;
		font-size: var(--step--1);
		color: var(--steel);
	}
</style>
