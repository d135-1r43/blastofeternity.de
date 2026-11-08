<script lang="ts">
	import Ornament from './Ornament.svelte';
	import { reveal } from '$lib/reveal';
	import type { FestivalAnnouncement } from '$lib/types';

	/**
	 * The next edition before it goes on sale: date and the bands confirmed so
	 * far. The same message as the announcement slide on the signage at /ps.
	 */
	type Props = { announcement: FestivalAnnouncement; id?: string };
	let { announcement, id }: Props = $props();

	const weekday = (date: string) =>
		new Date(`${date}T12:00`).toLocaleDateString('de-DE', { weekday: 'long' });
	const days = $derived(`${weekday(announcement.date_start)} & ${weekday(announcement.date_end)}`);
	const single = $derived(announcement.bands.length === 1);
</script>

<section class="section save" {id}>
	<div class="page body" use:reveal>
		<p class="eyebrow">Save the Date</p>
		<h2 class="name chrome-text">
			Blast of Eternity <span class="numeral">{announcement.year}</span>
		</h2>
		<p class="when">
			<span class="numeral">{announcement.date_label}</span>
			<span class="days">{days}</span>
		</p>

		{#if announcement.bands.length}
			<Ornament width="9rem" />
			<p class="eyebrow bands-head">
				{single ? 'Erste Band bestätigt' : 'Bereits bestätigt'}
			</p>
			<ul class="bands" class:single>
				{#each announcement.bands as band (band.name)}
					<li>
						{#if band.logo}
							<img src={band.logo} alt={band.name} loading="lazy" />
						{:else}
							<span class="band-name">{band.name}</span>
						{/if}
					</li>
				{/each}
			</ul>
			<p class="more">Weitere Bands folgen</p>
		{/if}
	</div>
</section>

<style>
	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.name {
		margin: 1.25rem 0 0;
		font-size: var(--step-4);
		line-height: 1.05;
	}

	.when {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1.5rem 0 clamp(2.25rem, 5vw, 3rem);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-2);
		line-height: 1.15;
	}

	.days {
		font-size: var(--step--1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.bands-head {
		margin: clamp(2.25rem, 5vw, 3rem) 0 0;
	}

	.bands {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 2rem 3.5rem;
		list-style: none;
		margin: 1.75rem 0 0;
		padding: 0;
	}

	.bands img {
		display: block;
		height: clamp(3rem, 9vw, 4.5rem);
		width: auto;
		max-width: 100%;
	}

	.bands.single img {
		height: clamp(4rem, 13vw, 6.5rem);
	}

	.band-name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-2);
	}

	.more {
		margin: 1.75rem 0 0;
		font-style: italic;
		font-size: var(--step-1);
		color: var(--steel);
	}
</style>
