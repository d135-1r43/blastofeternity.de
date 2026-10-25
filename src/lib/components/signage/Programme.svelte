<script lang="ts">
	import { fade } from 'svelte/transition';
	import Ornament from '$lib/components/Ornament.svelte';
	import {
		clock,
		countdown,
		dayAfter,
		relativeDay,
		type FestivalDay,
		type Moment,
		type TimedSlot
	} from '$lib/signage';
	import type { Band, Festival, Site } from '$lib/types';

	/** The running order slide: who is on stage, who is next, what is still to come. */
	type Props = {
		festival: Festival;
		site: Site;
		days: FestivalDay[];
		now: Date;
		moment: Moment;
	};
	let { festival, site, days, now, moment }: Props = $props();

	/** The band whose photograph fills the screen. */
	const featured = $derived.by((): Band | null => {
		if (moment.mode === 'live') return moment.current.band;
		if (moment.mode === 'soon') return moment.next.band;
		return null;
	});

	const backdrop = $derived(
		featured
			? `/images/signage/${featured.id}.jpg`
			: moment.mode === 'over'
				? '/images/crowd-2200.jpg'
				: '/images/stage-2200.jpg'
	);

	/** Whatever the main area isn't showing, still to come today. */
	const following = $derived.by((): TimedSlot[] => {
		if (moment.mode === 'live') return moment.later;
		if (moment.mode === 'soon') return moment.later;
		return [];
	});

	/** After the last band of a day: what the next day brings. */
	const tomorrow = $derived(moment.mode !== 'over' ? dayAfter(days, moment.day) : null);

	const progress = $derived.by(() => {
		if (moment.mode !== 'live') return 0;
		const { start, end } = moment.current;
		return Math.min(1, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime()));
	});

	const HOUR = 60 * 60_000;

	/** Where to crop a band photo; faces sit in the upper part of most of them. */
	const focus = (band: Band | null) => band?.image_focus ?? 'center 20%';

	const meta = (band: Band | null) => [band?.genre, band?.origin].filter(Boolean).join(' · ');
</script>

<div class="slide">
	<div class="backdrop" aria-hidden="true">
		{#key backdrop}
			<img
				src={backdrop}
				alt=""
				class:generic={!featured}
				style:--focus={focus(featured)}
				transition:fade={{ duration: 1800 }}
			/>
		{/key}
		<div class="scrim"></div>
	</div>

	<div class="body">
		{#key moment.mode === 'live' ? moment.current.time : moment.mode === 'soon' ? moment.next.time : moment.mode}
			<main class="hero" in:fade={{ duration: 900, delay: 400 }}>
				{#if moment.mode === 'live'}
					<p class="eyebrow cue">
						<span class="pulse" aria-hidden="true"></span>Jetzt auf der Bühne
					</p>
					<h1 class="name chrome-text">{moment.current.name}</h1>
					{#if meta(moment.current.band)}<p class="meta">{meta(moment.current.band)}</p>{/if}
					<div class="progress">
						<span class="numeral">{moment.current.time}</span>
						<span class="track"><span class="fill" style:--p={progress}></span></span>
						<span class="numeral">
							{moment.current.endKnown ? '' : 'ca. '}{clock(moment.current.end)}
						</span>
					</div>
				{:else if moment.mode === 'soon'}
					<p class="eyebrow cue">
						{moment.doorsOpen ? 'Einlass läuft · Gleich geht’s los' : 'Umbaupause · Als Nächstes'}
					</p>
					<h1 class="name chrome-text">{moment.next.name}</h1>
					{#if meta(moment.next.band)}<p class="meta">{meta(moment.next.band)}</p>{/if}
					<p class="countdown">
						<span class="numeral">{moment.next.time}</span>
						<span class="dim">{countdown(now, moment.next.start)}</span>
					</p>
				{:else if moment.mode === 'waiting'}
					<p class="eyebrow cue">{relativeDay(moment.day, now)} · {moment.day.label}</p>
					{#if moment.day.doors}
						<h1 class="name chrome-text">Einlass {moment.day.doors.time}</h1>
						<p class="countdown">
							{#if moment.day.doors.start.getTime() - now.getTime() < 12 * HOUR}
								<span class="dim">{countdown(now, moment.day.doors.start)}</span>
							{/if}
						</p>
					{:else}
						<h1 class="name chrome-text">Ab {moment.day.acts[0].time}</h1>
					{/if}
				{:else}
					<div class="farewell">
						<Ornament width="14em" />
						<h1 class="name chrome-text">Danke, dass ihr da wart</h1>
						<p class="meta">Blast of Eternity {festival.year} · Bis zum nächsten Jahr</p>
						<p class="verse" lang={site.verse.lang}>{site.verse.text}</p>
					</div>
				{/if}
			</main>
		{/key}

		{#if moment.mode === 'waiting'}
			<aside class="rail">
				<h2 class="eyebrow">Running Order</h2>
				<ol class="order">
					{#each moment.acts as act (act.time)}
						<li>
							<span class="numeral time">{act.time}</span><span class="act">{act.name}</span>
						</li>
					{/each}
				</ol>
			</aside>
		{:else if moment.mode === 'live' || moment.mode === 'soon'}
			<aside class="rail">
				{#if moment.mode === 'live' && moment.next}
					{@const next = moment.next}
					<h2 class="eyebrow">Als Nächstes</h2>
					<div class="next">
						{#if next.band}
							<img
								src="/images/signage/{next.band.id}.jpg"
								alt=""
								style:object-position={focus(next.band)}
							/>
						{/if}
						<div>
							<p class="next-time numeral">
								{next.time} <span class="dim">{countdown(now, next.start)}</span>
							</p>
							<p class="next-name">{next.name}</p>
							{#if meta(next.band)}<p class="next-meta">{meta(next.band)}</p>{/if}
						</div>
					</div>
				{/if}

				{#if following.length}
					<h2 class="eyebrow">Danach</h2>
					<ol class="order">
						{#each following as act (act.time)}
							<li>
								<span class="numeral time">{act.time}</span><span class="act">{act.name}</span>
							</li>
						{/each}
					</ol>
				{/if}

				{#if moment.mode === 'live' && !moment.next}
					{#if tomorrow}
						<h2 class="eyebrow">{relativeDay(tomorrow, now)} · {tomorrow.label}</h2>
						<ol class="order">
							{#if tomorrow.doors}
								<li class="doors">
									<span class="numeral time">{tomorrow.doors.time}</span><span class="act"
										>Einlass</span
									>
								</li>
							{/if}
							{#each tomorrow.acts as act (act.time)}
								<li>
									<span class="numeral time">{act.time}</span><span class="act">{act.name}</span>
								</li>
							{/each}
						</ol>
					{:else}
						<h2 class="eyebrow">Letzte Band</h2>
						<p class="closing">
							Danke, dass ihr beim Blast of Eternity {festival.year} dabei wart.
						</p>
					{/if}
				{/if}
			</aside>
		{/if}
	</div>
</div>

<style>
	.slide {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: var(--bar-height) 1fr;
	}

	/* ------------------------------------------------------------ backdrop */

	.backdrop,
	.backdrop img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.backdrop img {
		object-fit: cover;
		object-position: var(--focus);
		/* zoom towards the faces, never away from them */
		transform-origin: var(--focus);
		filter: grayscale(0.25) contrast(1.05);
		animation: drift 40s ease-in-out infinite alternate;
	}

	/* Festival photos rather than a band: they only set the mood. */
	.backdrop img.generic {
		filter: grayscale(0.5) brightness(0.45) contrast(1.1);
	}

	@keyframes drift {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.08);
		}
	}

	/* The photograph keeps its colour; the type sits on shade at the bottom
	   left and the rail on the right. */
	.scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				90deg,
				rgb(5 5 6 / 50%) 0%,
				transparent 40%,
				transparent 48%,
				rgb(5 5 6 / 72%) 68%,
				rgb(5 5 6 / 88%)
			),
			linear-gradient(
				180deg,
				rgb(5 5 6 / 70%) 0%,
				transparent 22%,
				transparent 42%,
				rgb(5 5 6 / 92%) 100%
			);
	}

	/* ---------------------------------------------------------------- body */

	.body {
		position: relative;
		grid-row: 2;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 30em;
		gap: 4em;
		align-items: end;
		padding: 0 3.2em 3.2em;
		min-height: 0;
	}

	.hero {
		grid-column: 1;
		grid-row: 1;
		align-self: end;
		max-width: 52em;
	}

	.cue {
		display: flex;
		align-items: center;
		gap: 0.8em;
		font-size: 1.15em;
		color: var(--silver);
		margin-bottom: 1.2em;
	}

	.pulse {
		width: 0.7em;
		height: 0.7em;
		border-radius: 50%;
		background: var(--ember-bright);
		box-shadow: 0 0 0.9em rgb(216 31 44 / 70%);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}

	.name {
		font-size: 7em;
		line-height: 1;
		letter-spacing: 0.01em;
		padding-bottom: 0.08em;
		filter: drop-shadow(0 0.04em 0.12em rgb(0 0 0 / 60%));
	}

	.meta {
		margin: 0.9em 0 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.35em;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.progress {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1.2em;
		margin-top: 2.4em;
		max-width: 36em;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.3em;
		color: var(--silver-dim);
	}

	.track {
		position: relative;
		height: 2px;
		background: var(--hairline-strong);
	}

	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		width: calc(var(--p) * 100%);
		background: var(--silver);
		transition: width 1s linear;
	}

	.countdown {
		display: flex;
		gap: 0.8em;
		align-items: baseline;
		margin: 1.4em 0 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 2.4em;
		line-height: 1;
	}

	.countdown .dim {
		font-size: 0.7em;
		letter-spacing: 0.06em;
	}

	.farewell {
		text-align: center;
		max-width: none;
	}

	.body:has(.farewell) {
		grid-template-columns: 1fr;
	}

	.hero:has(.farewell) {
		align-self: center;
		max-width: none;
	}

	.farewell .name {
		margin-top: 0.5em;
		font-size: 5.6em;
	}

	.verse {
		margin: 2.4em auto 0;
		max-width: 32em;
		font-style: italic;
		font-size: 1.4em;
		color: var(--steel);
	}

	/* ---------------------------------------------------------------- rail */

	.rail {
		grid-column: 2;
		grid-row: 1;
		align-self: end;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.rail h2 {
		font-size: 1em;
		padding-bottom: 0.2em;
	}

	.rail h2:not(:first-child) {
		margin-top: 1.8em;
	}

	.next {
		display: grid;
		gap: 1em;
	}

	.next img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		filter: grayscale(0.25);
		border: 1px solid var(--hairline);
	}

	.next p {
		margin: 0;
	}

	.next-time {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.3em;
	}

	.next-time .dim {
		margin-left: 0.6em;
		font-size: 0.8em;
		letter-spacing: 0.06em;
	}

	.next-name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 2.3em;
		line-height: 1.1;
		margin-top: 0.15em !important;
	}

	.next-meta {
		margin-top: 0.5em !important;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.95em;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--steel);
	}

	.order {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--hairline);
	}

	.order li {
		display: grid;
		grid-template-columns: 4.2em 1fr;
		gap: 1em;
		align-items: baseline;
		padding-block: 0.75em;
		border-bottom: 1px solid var(--hairline);
		font-family: var(--font-display);
		font-weight: 600;
	}

	.order .time {
		font-size: 1.15em;
		color: var(--silver-dim);
	}

	.order .act {
		font-size: 1.5em;
		line-height: 1.15;
	}

	.order li.doors .act {
		font-size: 1.1em;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--steel);
	}

	.closing {
		margin: 0;
		font-size: 1.4em;
		color: var(--silver-dim);
	}

	@media (prefers-reduced-motion: reduce) {
		.backdrop img,
		.pulse {
			animation: none;
		}
	}
</style>
