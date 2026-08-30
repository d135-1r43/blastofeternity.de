<script lang="ts">
	/**
	 * A click-to-load YouTube embed.
	 *
	 * Nothing is requested from YouTube until someone presses play, so the page
	 * loads without handing visitor data to a third party. The placeholder is one
	 * of our own photographs rather than a YouTube thumbnail, for the same reason.
	 */
	type Props = {
		video: string;
		title: string;
		poster?: string | null;
		posterAlt?: string;
	};

	let { video, title, poster = null, posterAlt = '' }: Props = $props();

	let playing = $state(false);

	const src = $derived(
		`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&rel=0&modestbranding=1`
	);
</script>

<div class="video">
	{#if playing}
		<iframe
			{src}
			{title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	{:else}
		<button type="button" onclick={() => (playing = true)}>
			<span class="visually-hidden">{title} abspielen — lädt ein Video von YouTube</span>
			{#if poster}
				<img src={poster} alt={posterAlt} loading="lazy" />
			{/if}
			<span class="scrim"></span>
			<span class="play" aria-hidden="true">
				<svg viewBox="0 0 44 44" focusable="false">
					<circle cx="22" cy="22" r="21" fill="none" stroke="currentColor" />
					<path d="M18 14.5 30 22l-12 7.5z" fill="currentColor" />
				</svg>
			</span>
			<span class="note" aria-hidden="true">Lädt YouTube</span>
		</button>
	{/if}
</div>

<style>
	.video {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--ink-sunk);
		border: 1px solid var(--hairline);
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 0;
		display: block;
	}

	button {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		color: var(--silver);
		cursor: pointer;
		font: inherit;
		overflow: hidden;
	}

	img,
	.scrim {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
		filter: grayscale(0.4) brightness(0.9);
		transition:
			scale 1.2s var(--ease),
			filter 0.6s var(--ease);
	}

	.scrim {
		background: linear-gradient(rgb(8 8 10 / 30%), rgb(8 8 10 / 68%));
	}

	.play {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: clamp(2.75rem, 5.5vw, 4rem);
		opacity: 0.9;
		transition:
			opacity 0.3s var(--ease),
			scale 0.5s var(--ease);
	}

	.play svg {
		width: 100%;
		height: auto;
		display: block;
	}

	/* The only chrome on the placeholder: a warning that pressing play is what
	   hands the visitor over to YouTube. */
	.note {
		position: absolute;
		left: 1.25rem;
		bottom: 1rem;
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	button:hover img,
	button:focus-visible img {
		scale: 1.03;
		filter: grayscale(0) brightness(1);
	}

	button:hover .play,
	button:focus-visible .play {
		opacity: 1;
		scale: 1.08;
	}

	@media (max-width: 30rem) {
		.note {
			display: none;
		}
	}
</style>
