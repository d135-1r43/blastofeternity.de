<script lang="ts">
	import type { Image } from '$lib/types';
	import { reveal } from '$lib/reveal';

	type Props = {
		photo: Image;
		/** `bleed` runs edge to edge; `plate` sits inside the page grid. */
		variant?: 'bleed' | 'plate';
		sizes?: string;
		priority?: boolean;
		/** Extra darkening, 0–1, for photos that sit behind text. */
		dim?: number;
	};

	let { photo, variant = 'plate', sizes = '100vw', priority = false, dim = 0 }: Props = $props();

	const srcset = $derived(photo.widths.map((w) => `${photo.src}-${w}.jpg ${w}w`).join(', '));
	const fallback = $derived(`${photo.src}-${photo.widths[photo.widths.length - 1]}.jpg`);
</script>

<figure class="figure figure--{variant}" use:reveal>
	<div class="frame" style:--dim={dim}>
		<img
			src={fallback}
			{srcset}
			{sizes}
			width={photo.width}
			height={photo.height}
			alt={photo.alt}
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
			decoding={priority ? 'sync' : 'async'}
		/>
	</div>
</figure>

<style>
	.figure {
		margin: 0;
	}

	.frame {
		position: relative;
		overflow: hidden;
		background: var(--ink-sunk);
	}

	.frame::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--ink);
		opacity: var(--dim, 0);
		pointer-events: none;
	}

	img {
		width: 100%;
		height: auto;
	}

	.figure--bleed {
		width: 100vw;
		margin-inline: calc(50% - 50vw);
	}

	.figure--bleed .frame {
		max-height: 78vh;
	}

	.figure--bleed img {
		height: 78vh;
		object-fit: cover;
	}

	@media (max-width: 40rem) {
		.figure--bleed .frame {
			max-height: 62vh;
		}

		.figure--bleed img {
			height: 62vh;
		}
	}
</style>
