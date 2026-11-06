<script lang="ts">
	import { untrack } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';

	/**
	 * Slides for the Impuls: a quiet opener, the words of a song, then its
	 * video full screen. Driven by hand — arrow keys, page up/down (what a
	 * presenter clicker sends) or the space bar. `f` or a double click toggles
	 * full screen. `#text` or `#video` opens on that slide.
	 */

	let { data } = $props();
	const { site } = $derived(data);

	const SONG = {
		title: 'Herr, ich komme zu dir',
		credit: 'Albert Frey',
		youtube: 'CexN15gu6x4',
		/** Each part once; the video carries the repeats. */
		verse: [
			[
				'Herr, ich komme zu dir',
				'Und ich steh’ vor dir, so wie ich bin',
				'Alles was mich bewegt lege ich vor dich hin',
				'Herr, ich komme zu dir',
				'Und ich schütte mein Herz bei dir aus',
				'Was mich hindert ganz bei dir zu sein räume aus!'
			],
			[
				'Meine Sorgen sind dir nicht verborgen',
				'Du wirst sorgen für mich',
				'Voll Vertrauen will ich auf dich schauen',
				'Herr, ich baue auf dich!'
			]
		],
		chorus: [
			'Gib mir ein neues ungeteiltes Herz',
			'Lege ein neues Lied in meinen Mund',
			'Fülle mich neu mit deinem Geist',
			'Denn du bewirkst dein Lob in mir'
		]
	};

	const SLIDES = ['start', 'text', 'video'] as const;
	let index = $state(0);
	const current = $derived(SLIDES[index]);

	function go(to: number) {
		index = Math.max(0, Math.min(SLIDES.length - 1, to));
		const hash = index ? `#${SLIDES[index]}` : window.location.pathname;
		history.replaceState(history.state, '', hash);
	}

	/* -------------------------------------------------------------- video */

	let frame = $state<HTMLIFrameElement>();

	// The YouTube player takes commands over postMessage once `enablejsapi` is set.
	function player(func: 'playVideo' | 'pauseVideo') {
		frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
	}

	const sync = () => player(current === 'video' ? 'playVideo' : 'pauseVideo');

	$effect(sync);

	// A click into the player moves keyboard focus into its frame, where the
	// arrow keys would no longer reach this page. Take focus straight back.
	$effect(() => {
		const onBlur = () => setTimeout(() => window.focus(), 0);
		window.addEventListener('blur', onBlur);
		return () => window.removeEventListener('blur', onBlur);
	});

	$effect(() =>
		untrack(() => {
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

<Seo {site} title={SONG.title} description="Liedtext und Video für den Impuls." noindex />

<svelte:window onkeydown={onKey} />

<div class="stage" ondblclick={toggleFullscreen} role="presentation">
	<!-- Mounted from the start so the video has loaded by the time it is needed. -->
	<iframe
		bind:this={frame}
		class="video"
		class:shown={current === 'video'}
		src="https://www.youtube-nocookie.com/embed/{SONG.youtube}?enablejsapi=1&rel=0&playsinline=1&iv_load_policy=3"
		title={SONG.title}
		allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
		allowfullscreen
		tabindex="-1"
		onload={() => setTimeout(sync, 500)}
	></iframe>

	<div class="start" class:shown={current === 'start'} aria-hidden={current !== 'start'}>
		<img class="sky" src="/images/signage/impuls-kreuz.jpg" alt="" />
		<div class="start-text">
			<img class="logo" src="/logo-boe.png" alt="Blast of Eternity" width="1600" height="668" />
			<hr class="rule--chrome" />
			<p class="impuls">Impuls</p>
		</div>
	</div>

	<div class="text" class:shown={current === 'text'} aria-hidden={current !== 'text'}>
		<header class="head">
			<img class="logo" src="/logo-boe.png" alt="Blast of Eternity" width="1600" height="668" />
			<div class="title">
				<p class="eyebrow cue">Impuls</p>
				<h1>{SONG.title}</h1>
				<p class="credit">{SONG.credit}</p>
			</div>
		</header>

		<div class="lyrics">
			<div class="column">
				{#each SONG.verse as stanza, i (i)}
					<p class="stanza">
						{#each stanza as line, j (j)}<span>{line}</span>{/each}
					</p>
				{/each}
			</div>
			<div class="column">
				<p class="stanza chorus">
					{#each SONG.chorus as line, j (j)}<span>{line}</span>{/each}
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* Sized in `em` off one base that follows the screen, like /ps. */
	.stage {
		position: fixed;
		inset: 0;
		overflow: hidden;
		font-size: min(1.15vw, 2.05vh);
		background: #000;
		cursor: none;
	}

	.video,
	.start,
	.text {
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

	.video {
		width: 100%;
		height: 100%;
		border: 0;
		cursor: auto;
	}

	/* ------------------------------------------------------------- start */

	.start {
		overflow: hidden;
		background: var(--ink-sunk);
	}

	/* The cross sits right of centre; keep it in frame on any aspect ratio. */
	.sky {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 64% 60%;
		filter: brightness(0.82) saturate(0.55);
		transform-origin: 64% 55%;
		animation: drift 90s linear infinite alternate;
	}

	@keyframes drift {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.08);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sky {
			animation: none;
		}
	}

	/* Sits in the dark of the clouds, top left, away from the cross. */
	.start-text {
		position: absolute;
		top: 16%;
		left: 9%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2.2em;
		width: 22em;
	}

	.start-text .logo {
		height: 5.4em;
		opacity: 0.85;
	}

	.start-text hr {
		width: 100%;
		margin: 0;
		opacity: 0.6;
	}

	.impuls {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 2.4em;
		letter-spacing: 0.42em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	/* -------------------------------------------------------------- text */

	.text {
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 2.5em;
		padding: 2.2em 4em 3em;
		background:
			radial-gradient(ellipse 70% 55% at 50% 0%, rgb(193 18 31 / 14%), transparent 70%),
			var(--ink-sunk);
	}

	.head {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: start;
	}

	.logo {
		height: 4.6em;
		width: auto;
	}

	.title {
		text-align: center;
	}

	.cue {
		font-size: 1.1em;
		color: var(--ember-text);
		margin-bottom: 0.6em;
	}

	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 3em;
		line-height: 1.1;
		letter-spacing: 0.03em;
		color: var(--silver);
	}

	.credit {
		margin: 0.7em 0 0;
		font-family: var(--font-display);
		font-size: 1.1em;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--steel);
	}

	.lyrics {
		display: grid;
		grid-template-columns: auto auto;
		justify-content: center;
		align-content: center;
		align-items: center;
		gap: 5.5em;
		min-height: 0;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 1.6em;
	}

	.stanza {
		display: flex;
		flex-direction: column;
		margin: 0;
		font-family: var(--font-body);
		font-size: 2.1em;
		line-height: 1.34;
		white-space: nowrap;
		color: var(--silver);
	}

	.chorus {
		padding-left: 0.9em;
		border-left: 2px solid var(--ember);
	}
</style>
