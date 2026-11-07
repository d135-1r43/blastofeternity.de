<script lang="ts">
	import { untrack } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ArtistSlide from '$lib/components/signage/ArtistSlide.svelte';
	import { buildDays } from '$lib/signage';

	/**
	 * Slides for the interview with Anna Jäger-Hauer: the Linestyle Artwork
	 * slide from the signage, then this year's festival artwork on its own.
	 * Driven by hand like /lied — arrow keys, page up/down (what a presenter
	 * clicker sends) or the space bar. `f` or a double click toggles full
	 * screen. A slide's id as the hash (`#artwork`) opens on it.
	 */

	let { data } = $props();
	const { site, festival, qr } = $derived(data);
	const days = $derived(buildDays(festival));

	const SLIDES = ['anna', 'artwork'] as const;
	let index = $state(0);
	const current = $derived(SLIDES[index]);

	// The artist slide says when the interview is; nothing renders before the
	// browser knows the time, so the prerendered page never shows a stale one.
	let now = $state<Date | null>(null);

	function go(to: number) {
		index = Math.max(0, Math.min(SLIDES.length - 1, to));
		now = new Date();
		const hash = index ? `#${SLIDES[index]}` : window.location.pathname;
		history.replaceState(history.state, '', hash);
	}

	$effect(() =>
		untrack(() => {
			now = new Date();
			const at = SLIDES.indexOf(window.location.hash.slice(1) as (typeof SLIDES)[number]);
			if (at > 0) index = at;
		})
	);

	/* ------------------------------------------------------- the display */

	$effect(() => {
		let lock: WakeLockSentinel | null = null;
		const acquire = async () => {
			try {
				lock = await navigator.wakeLock?.request('screen');
			} catch {
				// not supported or not allowed — the display's own settings apply
			}
		};
		const onVisible = () => document.visibilityState === 'visible' && acquire();
		acquire();
		document.addEventListener('visibilitychange', onVisible);
		return () => {
			document.removeEventListener('visibilitychange', onVisible);
			lock?.release();
		};
	});

	function toggleFullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else document.documentElement.requestFullscreen?.().catch(() => {});
	}

	function onKey(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
			case 'PageDown':
			case ' ':
				go(index + 1);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
			case 'PageUp':
				go(index - 1);
				break;
			case 'Home':
				go(0);
				break;
			case 'End':
				go(SLIDES.length - 1);
				break;
			case 'f':
				toggleFullscreen();
				break;
			default:
				return;
		}
		event.preventDefault();
	}
</script>

<Seo
	{site}
	title="Linestyle Artwork"
	description="Folien für das Interview mit Anna Jäger-Hauer."
	noindex
/>

<svelte:window onkeydown={onKey} />

<div class="stage" ondblclick={toggleFullscreen} role="presentation">
	<div class="layer" class:shown={current === 'anna'} aria-hidden={current !== 'anna'}>
		{#if now}
			<ArtistSlide year={festival.year} {days} {now} {qr} />
		{/if}
	</div>

	<div
		class="layer artwork"
		class:shown={current === 'artwork'}
		aria-hidden={current !== 'artwork'}
	>
		<img
			src="/images/signage/festival-artwork-2026.jpg"
			alt="Festival-Artwork {festival.year} von Anna Jäger-Hauer"
			width="1139"
			height="2160"
		/>
	</div>
</div>

<style>
	/* Sized in `em` off one base that follows the screen, like /ps. */
	.stage {
		position: fixed;
		inset: 0;
		overflow: hidden;
		font-size: min(1.15vw, 2.05vh);
		/* no bar on top here, just a margin */
		--bar-height: 3.2em;
		background: #000;
		cursor: none;
	}

	.layer {
		position: absolute;
		inset: 0;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 900ms var(--ease),
			visibility 0s 900ms;
	}

	.shown {
		opacity: 1;
		visibility: visible;
		transition: opacity 900ms var(--ease);
	}

	/* Portrait on a landscape screen: full height, black either side. */
	.artwork {
		background: #000;
	}

	.artwork img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
