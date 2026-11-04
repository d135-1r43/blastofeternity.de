<script module lang="ts">
	import type { LuxPhoto } from '$lib/types';

	/**
	 * What the next appearance will show, picked one appearance ahead so its
	 * photos are already loaded — Directus takes a few seconds to scale a
	 * photo the first time it is asked for that size.
	 */
	let upcoming: LuxPhoto[] | null = null;

	const src = (photo: LuxPhoto, frames: number) =>
		`${photo.url}?width=${frames === 1 ? 2400 : 1400}&quality=80&fit=inside&format=auto&withoutEnlargement=true`;

	/** `count` random photos from `pool`, preferring ones not in `avoid`. */
	function draw(pool: LuxPhoto[], count: number, avoid: Set<string>): LuxPhoto[] {
		const fresh = pool.filter((p) => !avoid.has(p.id));
		const from = fresh.length >= count ? fresh : pool;
		const shuffled = [...from].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	}

	/**
	 * A landscape photo full bleed, or three portrait ones side by side — three
	 * 2:3 frames make almost exactly a 16:9 screen. Weighted by how many photos
	 * there are of each, so every photo has about the same chance to be seen.
	 */
	function choose(photos: LuxPhoto[], avoid: LuxPhoto[]): LuxPhoto[] {
		const landscape = photos.filter((p) => p.width > p.height);
		const portrait = photos.filter((p) => p.width <= p.height);
		const triptych =
			portrait.length >= 3 &&
			(!landscape.length || Math.random() < portrait.length / photos.length);
		const ids = new Set(avoid.map((p) => p.id));
		return triptych ? draw(portrait, 3, ids) : draw(landscape, 1, ids);
	}

	function preload(photos: LuxPhoto[], avoid: LuxPhoto[]) {
		upcoming = choose(photos, avoid);
		for (const photo of upcoming) new Image().src = src(photo, upcoming.length);
	}

	/** Picks and loads the photos for the first appearance; the signage calls it on start. */
	export function prepareLux(photos: LuxPhoto[]) {
		if (!upcoming && photos.length) preload(photos, []);
	}

	/** Where the Ken Burns zoom heads — one of the corners or the middle, at random. */
	const ORIGINS = ['20% 30%', '80% 30%', '25% 70%', '75% 70%', '50% 40%'];
	const origin = () => ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
</script>

<script lang="ts">
	import { onMount, untrack } from 'svelte';

	/**
	 * Advertises Lux in Tenebris, the club's concert photography. Each time the
	 * slide comes up it shows other photos from the gallery — one landscape or
	 * three portrait — slowly zooming, each with the band and the show it was
	 * taken at.
	 */
	type Props = {
		photos: LuxPhoto[];
		/** SVG markup of a QR code for lux-in-tenebris.de, made at build time. */
		qr: string;
	};
	let { photos, qr }: Props = $props();

	// Chosen once per mount — the page remounts the slide on every appearance.
	const shown = untrack(() => upcoming ?? choose(photos, []));
	const frames = shown.map((photo, i) => ({
		photo,
		origin: origin(),
		// staggered, so the three frames of a triptych don't move in lockstep
		delay: `${-i * 2.5}s`
	}));
	const single = frames.length === 1;

	onMount(() => preload(photos, shown));
</script>

<div class="slide">
	<div class="frames" class:single>
		{#each frames as { photo, origin, delay } (photo.id)}
			<figure class="frame">
				<img
					src={src(photo, frames.length)}
					alt="{photo.band} live"
					style:transform-origin={origin}
					style:animation-delay={delay}
				/>
				<figcaption class="caption">
					<span class="band">{photo.band}</span>
					<span class="where">{photo.festival} · {photo.year}</span>
				</figcaption>
			</figure>
		{/each}
	</div>
	<div class="shade" aria-hidden="true"></div>

	<div class="body">
		<main class="brand">
			<h1 class="wordmark">LUX<span>☩</span>IN<span>☩</span>TENEBRIS</h1>
			<p class="cue">Konzertfotografie im CVJM Jugendkultur &amp; Musik e.V.</p>
		</main>

		<div class="follow">
			<ul class="links">
				<li>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-label="Instagram"
						><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path
							d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
						/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
					>
					@lux.in.tenebris.fotografie
				</li>
				<li>
					<svg viewBox="0 0 75 75" aria-label="Pixelfed"
						><g transform="translate(12.5,12.5)" fill="currentColor" fill-rule="evenodd"
							><path
								d="M 25,50 C 11.192881,50 0,38.807119 0,25 0,11.192881 11.192881,0 25,0 38.807119,0 50,11.192881 50,25 50,38.807119 38.807119,50 25,50 Z M 23.015316,30.458015 h 4.586148 c 4.320335,0 7.822658,-3.409518 7.822658,-7.615371 0,-4.205853 -3.502323,-7.615371 -7.822658,-7.615371 h -6.619172 c -2.492501,0 -4.513072,1.967029 -4.513072,4.393483 v 17.100022 z"
							/></g
						></svg
					>
					pixelfed.de/luxintenebris
				</li>
				<li>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-label="Web"
						><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path
							d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
						/></svg
					>
					lux-in-tenebris.de
				</li>
			</ul>

			<!-- trusted: drawn by the build from our own URL -->
			<div class="qr">{@html qr}</div>
		</div>
	</div>
</div>

<style>
	/* The photo is the advert; the type stays small and out of its way. Set in
	   Bebas Neue Pro like lux-in-tenebris.de — the /ps page loads the kit. */
	.slide {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: var(--bar-height) 1fr;
		overflow: hidden;
		background: #000;
		font-family: 'bebas-neue-pro', var(--font-display), sans-serif;
		color: #fff;
	}

	/* ---------------------------------------------------------------- frames */

	.frames {
		position: absolute;
		inset: 0;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		gap: 0.6em;
	}

	.frame {
		position: relative;
		margin: 0;
		overflow: hidden;
	}

	.frame img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		animation: ken-burns 22s linear both;
	}

	/* a little longer than the slide is up, so it never comes to a stop */
	@keyframes ken-burns {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.14);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.frame img {
			animation: none;
		}
	}

	/* Just enough dark for the bar and the strip of text at the bottom. */
	.shade {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 35% 30% at 100% 0%, rgb(0 0 0 / 65%), transparent),
			linear-gradient(to bottom, rgb(0 0 0 / 55%), transparent 18%),
			linear-gradient(to top, rgb(0 0 0 / 80%), rgb(0 0 0 / 35%) 18%, transparent 32%);
	}

	.body {
		position: relative;
		grid-row: 2;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 3em;
		align-items: end;
		padding: 0 3.2em 2.6em;
		min-height: 0;
		text-shadow: 0 0.05em 0.4em rgb(0 0 0 / 70%);
	}

	/* the wordmark from lux-in-tenebris.de: hairline weight, wide tracking */
	.wordmark {
		margin: 0;
		font-family: inherit;
		font-weight: 200;
		font-size: 2.6em;
		line-height: 1;
		letter-spacing: 0.35em;
		white-space: nowrap;
		background: none;
		-webkit-text-fill-color: currentColor;
	}

	.wordmark span {
		margin: 0 0.15em;
		color: rgb(255 255 255 / 30%);
	}

	.cue {
		margin: 0.7em 0 0;
		font-weight: 400;
		font-size: 1.15em;
		letter-spacing: 0.2em;
		color: rgb(255 255 255 / 70%);
	}

	.follow {
		display: flex;
		align-items: end;
		gap: 1.4em;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 0.15em;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.links li {
		display: flex;
		align-items: center;
		gap: 0.6em;
		font-weight: 300;
		font-size: 1.15em;
		line-height: 1.2;
		letter-spacing: 0.08em;
	}

	.links svg {
		width: 1em;
		height: 1em;
		flex: none;
		opacity: 0.5;
	}

	/* Dark modules on a light tile, quiet zone included: inverted codes are
	   not read by every phone camera. */
	.qr {
		width: 5.5em;
		padding: 0.55em;
		background: var(--silver);
	}

	.qr :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	/* --------------------------------------------------------- photo credit */

	/* top right, under the clock — the photo's own caption */
	/* top right of each frame, under the bar — the photo's own caption */
	.caption {
		position: absolute;
		top: var(--bar-height);
		right: 1.6em;
		z-index: 1;
		max-width: calc(100% - 3.2em);
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: 0.15em;
		text-align: right;
		text-shadow: 0 0.05em 0.4em rgb(0 0 0 / 80%);
	}

	/* a single photo lines its caption up with the clock */
	.single .caption {
		right: 3.2em;
	}

	.band {
		font-weight: 500;
		font-size: 1.6em;
		letter-spacing: 0.08em;
		line-height: 1.1;
	}

	.where {
		font-weight: 400;
		font-size: 1em;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 75%);
	}
</style>
