<script lang="ts">
	import Ornament from '$lib/components/Ornament.svelte';
	import type { FestivalAnnouncement } from '$lib/types';

	/**
	 * Save the date for the next edition, with the bands confirmed so far.
	 * Set like the festival poster: centred, Roman capitals, one ornament.
	 */
	type Props = { announcement: FestivalAnnouncement };
	let { announcement }: Props = $props();

	const weekday = (date: string) =>
		new Date(`${date}T12:00`).toLocaleDateString('de-DE', { weekday: 'long' });
	const days = $derived(`${weekday(announcement.date_start)} & ${weekday(announcement.date_end)}`);
	const single = $derived(announcement.bands.length === 1);
</script>

<div class="slide">
	<div class="backdrop" aria-hidden="true">
		<img src="/images/crowd-2200.jpg" alt="" />
	</div>

	<main class="body">
		<p class="eyebrow cue">Save the Date</p>
		<h1 class="name chrome-text">
			Blast of Eternity <span class="numeral">{announcement.year}</span>
		</h1>
		<p class="when">
			<span class="numeral">{announcement.date_label}</span>
			<span class="days">{days}</span>
		</p>

		{#if announcement.bands.length}
			<Ornament width="16em" />
			<p class="eyebrow bands-head">
				{single ? 'Erste Band bestätigt' : 'Bereits bestätigt'}
			</p>
			<ul class="bands" class:single>
				{#each announcement.bands as band (band.name)}
					<li>
						{#if band.logo}
							<img src={band.logo} alt={band.name} />
						{:else}
							<span class="band-name">{band.name}</span>
						{/if}
					</li>
				{/each}
			</ul>
			<p class="more">Weitere Bands folgen</p>
		{/if}
	</main>
</div>

<style>
	.slide {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: var(--bar-height) 1fr;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.backdrop img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(0.6) brightness(0.3) contrast(1.1);
	}

	/* a pool of shade behind the centred type */
	.backdrop::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(60% 70% at 50% 55%, rgb(5 5 6 / 70%), rgb(5 5 6 / 35%) 100%);
	}

	.body {
		position: relative;
		grid-row: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 3.2em 4em;
		text-align: center;
	}

	.cue {
		font-size: 1.3em;
		color: var(--silver);
		margin-bottom: 1em;
	}

	.name {
		font-size: 6em;
		line-height: 1;
		letter-spacing: 0.01em;
		padding-bottom: 0.08em;
		filter: drop-shadow(0 0.04em 0.12em rgb(0 0 0 / 60%));
	}

	.when {
		display: flex;
		flex-direction: column;
		gap: 0.35em;
		margin: 0.7em 0 1.6em;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 2.4em;
		line-height: 1.1;
	}

	.days {
		font-size: 0.55em;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.bands-head {
		margin-top: 1.6em;
		font-size: 1.1em;
	}

	.bands {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 2em 4em;
		list-style: none;
		margin: 1.2em 0 0;
		padding: 0;
	}

	.bands img {
		height: 4.5em;
		width: auto;
	}

	.bands.single img {
		height: 6em;
	}

	.band-name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 3em;
	}

	.more {
		margin: 1.4em 0 0;
		font-style: italic;
		font-size: 1.4em;
		color: var(--steel);
	}
</style>
