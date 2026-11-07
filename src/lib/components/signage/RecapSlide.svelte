<script module lang="ts">
	import type { LuxPhoto } from '$lib/types';

	/** How many times the slide has come up; picks the next photo in turn. */
	let appearances = 0;

	const src = (photo: LuxPhoto) =>
		`${photo.url}?width=2400&quality=80&fit=inside&format=auto&withoutEnlargement=true`;

	/** Loads every recap photo ahead of time, so none of them comes up blank. */
	export function prepareRecap(photos: LuxPhoto[]) {
		for (const photo of photos) new Image().src = src(photo);
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';

	/**
	 * A look back at the night before: one of this year's festival photos from
	 * Lux in Tenebris, full bleed and slowly zooming. Each time the slide comes
	 * up it shows the next photo in turn, so they take turns rotation by rotation.
	 */
	type Props = { photos: LuxPhoto[] };
	let { photos }: Props = $props();

	// Chosen once per mount — the page remounts the slide on every appearance.
	const photo = untrack(() => photos[appearances++ % photos.length]);
</script>

<div class="slide">
	<img class="photo" src={src(photo)} alt="{photo.band} live beim Blast of Eternity" />
	<div class="shade" aria-hidden="true"></div>

	<div class="body">
		<p class="eyebrow cue">Rückblick auf gestern</p>
		<h2 class="band">{photo.band}</h2>
	</div>
</div>

<style>
	.slide {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: var(--bar-height) 1fr;
		overflow: hidden;
		background: #000;
	}

	.photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform-origin: 50% 40%;
		animation: ken-burns 22s linear both;
	}

	/* a little longer than the slide is up, so it never comes to a stop */
	@keyframes ken-burns {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.12);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.photo {
			animation: none;
		}
	}

	/* dark enough for the bar on top and the text bottom left */
	.shade {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(to bottom, rgb(0 0 0 / 55%), transparent 18%),
			linear-gradient(to top, rgb(0 0 0 / 85%), rgb(0 0 0 / 35%) 22%, transparent 40%);
	}

	.body {
		position: relative;
		grid-row: 2;
		align-self: end;
		padding: 0 3.2em 3em;
		text-shadow: 0 0.05em 0.4em rgb(0 0 0 / 70%);
	}

	.cue {
		margin: 0 0 0.6em;
		font-size: 1.15em;
		color: var(--silver-dim);
	}

	.band {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 4.4em;
		line-height: 1;
		letter-spacing: 0.02em;
		color: var(--silver);
	}
</style>
