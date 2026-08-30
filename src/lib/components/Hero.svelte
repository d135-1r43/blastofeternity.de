<script lang="ts">
	import Ornament from './Ornament.svelte';
	import type { Festival, Photo } from '$lib/types';

	type Props = { festival: Festival; photo: Photo };
	let { festival, photo }: Props = $props();

	const srcset = $derived(photo.widths.map((w) => `${photo.src}-${w}.jpg ${w}w`).join(', '));
</script>

<section class="hero">
	<div class="backdrop">
		<img
			src="{photo.src}-{photo.widths[photo.widths.length - 1]}.jpg"
			{srcset}
			sizes="100vw"
			width={photo.width}
			height={photo.height}
			alt=""
			fetchpriority="high"
		/>
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
	.backdrop img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.backdrop img {
		object-fit: cover;
		object-position: center 42%;
		filter: grayscale(0.3) contrast(1.05);
	}

	/* The photograph stays bright; only the type is protected.
	   Layer 1 is a soft pool of shade behind the wordmark, layer 2 anchors the
	   top and sinks the bottom into the page, layer 3 is a gentle edge vignette.
	   These stack multiplicatively, so each one is kept deliberately light. */
	.scrim {
		position: absolute;
		inset: 0;
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
		text-align: center;
	}

	.presenter {
		margin: 0 0 clamp(1.75rem, 4vw, 2.75rem);
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.3em;
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
		text-shadow: 0 1px 14px rgb(8 8 10 / 85%);
		animation: rise 1.2s var(--ease) 0.35s both;
	}

	.date {
		font-size: var(--step-1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--silver);
	}

	.where {
		font-size: var(--step--1);
		letter-spacing: 0.28em;
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
