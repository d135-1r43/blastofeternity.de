<script lang="ts">
	import Ornament from './Ornament.svelte';
	import type { Festival, Photo } from '$lib/types';

	type Props = {
		festival: Festival;
		/** Cross-faded behind the wordmark. The first one loads with the page. */
		photos: Photo[];
	};
	let { festival, photos }: Props = $props();

	const SLIDE_MS = 14000;

	let index = $state(0);
	/**
	 * The slide being faded away from. It is held fully opaque underneath the
	 * incoming one, so the dissolve never lets the ink ground show through —
	 * fading both layers at once would dim the picture halfway through.
	 */
	let previous = $state(-1);
	/**
	 * How many slides exist in the DOM. Only the first loads with the page; each
	 * following one is mounted a beat before it is needed, so a visitor who
	 * scrolls straight past the hero never downloads the whole set.
	 */
	let mounted = $state(1);
	let reduced = $state(false);

	const visible = $derived(photos.slice(0, mounted));
	const srcsetFor = (p: Photo) => p.widths.map((w) => `${p.src}-${w}.jpg ${w}w`).join(', ');
	const largest = (p: Photo) => `${p.src}-${p.widths[p.widths.length - 1]}.jpg`;

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced || photos.length < 2) return;

		// bring in the second slide once the page has settled
		const warm = setTimeout(() => (mounted = Math.min(2, photos.length)), 1500);
		const tick = setInterval(() => {
			previous = index;
			index = (index + 1) % photos.length;
			// keep exactly one slide ahead of the one on screen
			mounted = Math.max(mounted, Math.min(index + 2, photos.length));
		}, SLIDE_MS);
		return () => {
			clearTimeout(warm);
			clearInterval(tick);
		};
	});
</script>

<section class="hero">
	<div class="backdrop">
		{#each visible as slide, i (slide.id)}
			<img
				class="slide"
				class:active={i === index}
				class:holding={i === previous}
				style:z-index={i === index ? 2 : i === previous ? 1 : 0}
				src={largest(slide)}
				srcset={srcsetFor(slide)}
				sizes="100vw"
				width={slide.width}
				height={slide.height}
				alt=""
				loading={i === 0 ? 'eager' : 'lazy'}
				fetchpriority={i === 0 ? 'high' : 'low'}
			/>
		{/each}
		<div class="scrim"></div>
	</div>

	<div class="page content">
		<p class="presenter">CVJM Jugendkultur &amp; Musik e.&thinsp;V. präsentiert</p>

		<!--
		  The wordmark, with a specular highlight that travels across the
		  letterforms once on load — light moving over polished metal.
		-->
		<h1 class="mark">
			<span class="visually-hidden">Blast of Eternity</span>
			<img src="/logo-boe.png" alt="" width="1600" height="668" fetchpriority="high" />
			<span class="sheen" aria-hidden="true"></span>
		</h1>

		<Ornament width="13rem" />

		<p class="when">
			<span class="date">{festival.date_label}</span>
			<span class="where">{festival.venue.name}</span>
		</p>

		<div class="actions">
			<a class="action" href="/boe">Line-up &amp; Infos</a>
			<a class="action action--ticket" href={festival.tickets.url} rel="noopener" target="_blank">
				Tickets ab {festival.tickets.prices[0].amount}&thinsp;€
			</a>
		</div>
	</div>

	<a class="cue" href="#festival" aria-label="Weiter zum Line-up">
		<span class="cue-line"></span>
	</a>
</section>

<style>
	.hero {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 100svh;
		padding-block: 8rem 6rem;
		overflow: hidden;
		background: var(--ink-sunk);
	}

	.backdrop,
	.backdrop .slide {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* Contain the slides' z-index so it orders them against each other only. */
	.backdrop {
		z-index: 0;
		isolation: isolate;
	}

	/* Slides cross-fade; the active one drifts and scales very slowly so the
	   hero breathes without ever calling attention to the movement. */
	.slide {
		object-fit: cover;
		object-position: center 42%;
		filter: grayscale(0.3) contrast(1.05);
		opacity: 0;
		transform: scale(1.06);
		/* linear, because two eased opacity curves crossing would read as a dip */
		transition: opacity 4.5s linear;
		will-change: opacity, transform;
	}

	/* The outgoing slide stays opaque under the incoming one until the fade is
	   over, then drops out of sight behind it. */
	.slide.holding {
		opacity: 1;
		transition: none;
	}

	.slide.active {
		opacity: 1;
	}

	/* Both the incoming and the outgoing slide keep drifting, so nothing freezes
	   mid-dissolve. 19s covers the 14s hold plus the 4.5s fade. */
	.slide.active,
	.slide.holding {
		animation: drift 19s linear both;
	}

	/* alternate the direction so a loop never feels mechanical */
	.slide:nth-child(even).active,
	.slide:nth-child(even).holding {
		animation-name: drift-alt;
	}

	@keyframes drift {
		from {
			transform: scale(1.05) translate3d(0, 0, 0);
		}
		to {
			transform: scale(1.15) translate3d(-1.6%, -1.1%, 0);
		}
	}

	@keyframes drift-alt {
		from {
			transform: scale(1.15) translate3d(1.4%, -0.8%, 0);
		}
		to {
			transform: scale(1.05) translate3d(0, 0.6%, 0);
		}
	}

	/* The photograph stays bright; only the type is protected.
	   Layer 1 is a soft pool of shade behind the wordmark, layer 2 anchors the
	   top and sinks the bottom into the page, layer 3 is a gentle edge vignette.
	   These stack multiplicatively, so each one is kept deliberately light. */
	.scrim {
		position: absolute;
		inset: 0;
		z-index: 3;
		background:
			radial-gradient(
				56% 62% at 50% 44%,
				rgb(8 8 10 / 60%) 0%,
				rgb(8 8 10 / 38%) 48%,
				rgb(8 8 10 / 14%) 72%,
				transparent 88%
			),
			linear-gradient(
				rgb(8 8 10 / 60%) 0%,
				rgb(8 8 10 / 30%) 14%,
				rgb(8 8 10 / 5%) 36%,
				rgb(8 8 10 / 38%) 82%,
				var(--ink) 100%
			),
			radial-gradient(125% 105% at 50% 45%, transparent 55%, rgb(8 8 10 / 26%) 100%);
	}

	.content {
		position: relative;
		z-index: 2;
		text-align: center;
	}

	.presenter {
		margin: 0 0 clamp(1.75rem, 4vw, 2.75rem);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--silver);
		text-shadow: 0 1px 12px rgb(8 8 10 / 90%);
		animation: rise 1s var(--ease) both;
	}

	.mark {
		position: relative;
		width: min(46rem, 82vw);
		margin: 0 auto clamp(2rem, 5vw, 3.25rem);
		animation: rise 1.2s var(--ease) 0.1s both;
	}

	.mark img {
		width: 100%;
		height: auto;
		filter: drop-shadow(0 2px 20px rgb(0 0 0 / 85%)) drop-shadow(0 0 55px rgb(0 0 0 / 60%));
	}

	.sheen {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			104deg,
			transparent 42%,
			rgb(255 255 255 / 85%) 50%,
			transparent 58%
		);
		background-size: 260% 100%;
		background-repeat: no-repeat;
		mask-image: url('/logo-boe.png');
		mask-size: 100% 100%;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: url('/logo-boe.png');
		-webkit-mask-size: 100% 100%;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		animation: sheen 2.6s var(--ease) 1s both;
		pointer-events: none;
	}

	.when {
		margin: clamp(1.75rem, 4vw, 2.5rem) 0 clamp(2.25rem, 5vw, 3.25rem);
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		font-family: var(--font-display);
		font-weight: 600;
		text-shadow: 0 1px 14px rgb(8 8 10 / 85%);
		animation: rise 1.2s var(--ease) 0.35s both;
	}

	.date {
		font-size: var(--step-1);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--silver);
	}

	.where {
		font-size: var(--step--1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--silver);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		animation: rise 1.2s var(--ease) 0.5s both;
	}

	.cue {
		position: absolute;
		z-index: 2;
		bottom: 2.25rem;
		left: 50%;
		translate: -50% 0;
		display: block;
		width: 1.5rem;
		height: 3.5rem;
		animation: rise 1.2s var(--ease) 0.9s both;
	}

	.cue-line {
		position: absolute;
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
		background: linear-gradient(var(--hairline-strong), transparent);
		overflow: hidden;
	}

	.cue-line::after {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 40%;
		background: var(--silver-dim);
		animation: trickle 2.6s var(--ease) infinite;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(1.5rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes sheen {
		from {
			background-position: 190% 0;
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		to {
			background-position: -90% 0;
			opacity: 0;
		}
	}

	@keyframes trickle {
		0% {
			transform: translateY(-100%);
		}
		60%,
		100% {
			transform: translateY(250%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.presenter,
		.mark,
		.when,
		.actions,
		.cue {
			animation: none;
		}

		.sheen {
			display: none;
		}

		.slide,
		.slide.active,
		.slide.holding {
			animation: none;
			transition: none;
			transform: none;
		}

		.cue-line::after {
			animation: none;
		}
	}

	@media (max-width: 40rem) {
		.hero {
			padding-block: 7rem 5rem;
		}
	}
</style>
