<script lang="ts">
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Seo from '$lib/components/Seo.svelte';
	import AnnouncementSlide from '$lib/components/signage/AnnouncementSlide.svelte';
	import ConcertSlide from '$lib/components/signage/ConcertSlide.svelte';
	import PartnersSlide from '$lib/components/signage/PartnersSlide.svelte';
	import Programme from '$lib/components/signage/Programme.svelte';
	import { buildDays, clock, momentAt, presets } from '$lib/signage';

	/**
	 * Public signage for the screens in the venue. A slideshow: the running order
	 * — who is on stage, who is next, what is still to come — alternates with
	 * promo slides. Runs full-screen and unattended.
	 *
	 * Append `?debug` to get a panel for jumping to any moment of the festival,
	 * running the clock faster and picking slides; `?t=2026-11-06T19:30` starts
	 * at that time, `?slide=<id>` holds one slide.
	 */

	let { data } = $props();
	const { festival, site, promos, announcements, partners } = $derived(data);
	const days = $derived(buildDays(festival));

	/* ----------------------------------------------------------- the clock */

	// Nothing is rendered until the browser knows the time — the prerendered
	// HTML would otherwise show whatever was true when the site was built.
	let now = $state<Date | null>(null);

	let debug = $state(false);
	let panelOpen = $state(true);
	/** Virtual time at the moment `anchor` was taken. `null` follows the real clock. */
	let base = $state<number | null>(null);
	let anchor = 0;
	let speed = $state(1);

	function read(): Date {
		if (base === null) return new Date();
		return new Date(base + (Date.now() - anchor) * speed);
	}

	function jump(to: Date | null) {
		base = to ? to.getTime() : null;
		anchor = Date.now();
		now = read();
		const url = new URL(window.location.href);
		if (to) url.searchParams.set('t', toInput(to));
		else url.searchParams.delete('t');
		history.replaceState(history.state, '', url);
	}

	function setSpeed(value: number) {
		// re-anchor so the change applies from the current virtual moment
		if (base !== null) {
			base = read().getTime();
			anchor = Date.now();
		}
		speed = value;
	}

	// Runs once on mount; `untrack` keeps `jump()` from re-running it.
	$effect(() =>
		untrack(() => {
			const params = new URLSearchParams(window.location.search);
			const t = params.get('t');
			debug = params.has('debug') || t !== null;
			if (t && !Number.isNaN(new Date(t).getTime())) {
				base = new Date(t).getTime();
				anchor = Date.now();
			}
			held = params.get('slide');
			now = read();
			const tick = setInterval(() => {
				now = read();
				advance();
			}, 250);
			return () => clearInterval(tick);
		})
	);

	/* ------------------------------------------------------ what to show */

	const moment = $derived(now ? momentAt(days, now) : null);

	/* ------------------------------------------------------------ slides */

	/** How long each kind of slide stays up, in seconds of real time. */
	const PROGRAMME_SECONDS = 40;
	const PROMO_SECONDS = 15;

	type Promo = (typeof promos)[number];
	type Announcement = (typeof announcements)[number];
	type Slide = {
		id: string;
		label: string;
		seconds: number;
		promo?: Promo;
		announcement?: Announcement;
		partners?: boolean;
	};

	/**
	 * The running order comes back between every promo, so nobody waits long
	 * for it. A concert or announced festival drops out of the rotation the day
	 * after it took place.
	 * New kinds of slides go in here.
	 */
	const slides = $derived.by((): Slide[] => {
		const programme: Slide = {
			id: 'programme',
			label: 'Running Order',
			seconds: PROGRAMME_SECONDS
		};
		const ahead = (date: string) => !!now && new Date(`${date}T23:59`) > now;
		const others: Slide[] = [
			...promos
				.filter((p) => ahead(p.concert.date))
				.map((promo) => ({
					id: promo.concert.id,
					label: promo.concert.title,
					seconds: PROMO_SECONDS,
					promo
				})),
			...announcements
				.filter((a) => ahead(a.date_end))
				.map((announcement) => ({
					id: announcement.id,
					label: announcement.title,
					seconds: PROMO_SECONDS,
					announcement
				})),
			...(partners.length
				? [{ id: 'partner', label: 'Partner', seconds: PROMO_SECONDS, partners: true }]
				: [])
		];
		if (!others.length) return [programme];
		return others.flatMap((other) => [programme, other]);
	});

	let position = $state(0);
	let shownSince = Date.now();
	/** A slide id to hold instead of rotating. */
	let held = $state<string | null>(null);

	const slide = $derived(
		(held && slides.find((s) => s.id === held)) || slides[position % slides.length]
	);

	function advance() {
		if (held || Date.now() - shownSince < slide.seconds * 1000) return;
		position = (position + 1) % slides.length;
		shownSince = Date.now();
	}

	function hold(id: string | null) {
		held = id;
		shownSince = Date.now();
		const url = new URL(window.location.href);
		if (id) url.searchParams.set('slide', id);
		else url.searchParams.delete('slide');
		history.replaceState(history.state, '', url);
	}

	/* ------------------------------------------------------- the display */

	// Keep the screen awake, and let a double click or `f` toggle full screen.
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
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)
			return;
		if (event.key === 'f') toggleFullscreen();
		if (event.key === 'd' && debug) panelOpen = !panelOpen;
		if (event.key === 's' && debug) {
			hold(null);
			position = (position + 1) % slides.length;
		}
	}

	/* --------------------------------------------------------- debug panel */

	const toInput = (d: Date) => {
		const p = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
	};

	const presetGroups = $derived(presets(days));
</script>

<Seo
	{site}
	title="Signage"
	description="Running Order des Blast of Eternity Festival {festival.year} für die Bildschirme vor Ort."
	noindex
/>

<svelte:window onkeydown={onKey} />

<div class="signage" class:debug ondblclick={toggleFullscreen} role="presentation">
	{#if now && moment}
		{#key slide.id}
			<div class="slide-frame" transition:fade={{ duration: 1200 }}>
				{#if slide.promo}
					<ConcertSlide concert={slide.promo.concert} qr={slide.promo.qr} />
				{:else if slide.announcement}
					<AnnouncementSlide announcement={slide.announcement} />
				{:else if slide.partners}
					<PartnersSlide {partners} />
				{:else}
					<Programme {festival} {site} {days} {now} {moment} />
				{/if}
			</div>
		{/key}
	{/if}

	<header class="bar">
		<img class="logo" src="/logo-boe.png" alt="Blast of Eternity" width="1600" height="668" />
		{#if now}
			<p class="eyebrow where">
				{#if slide.id === 'programme'}
					{moment && moment.mode !== 'over' ? `${moment.day.label} · ` : ''}{festival.venue.name}
				{/if}
			</p>
			<p class="clock numeral" aria-label="Uhrzeit">{clock(now)}</p>
		{/if}
	</header>
</div>

{#if debug && now}
	<div class="debug-panel" class:closed={!panelOpen}>
		<div class="debug-head">
			<strong>Debug</strong>
			<span class="numeral">
				{now.toLocaleString('de-DE', {
					weekday: 'short',
					day: '2-digit',
					month: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				})}
			</span>
			<span class="dim">{base === null ? 'Echtzeit' : `simuliert · ${speed}×`}</span>
			<button type="button" onclick={() => (panelOpen = !panelOpen)}
				>{panelOpen ? 'Einklappen' : 'Aufklappen'}</button
			>
		</div>
		{#if panelOpen}
			<div class="debug-controls">
				<label>
					Zeitpunkt
					<input
						type="datetime-local"
						value={toInput(now)}
						onchange={(e) => {
							const value = e.currentTarget.value;
							if (value) jump(new Date(value));
						}}
					/>
				</label>
				<label>
					Tempo
					<select value={speed} onchange={(e) => setSpeed(Number(e.currentTarget.value))}>
						<option value={1}>1×</option>
						<option value={10}>10×</option>
						<option value={60}>60× (1 Min/s)</option>
						<option value={300}>300× (5 Min/s)</option>
					</select>
				</label>
				<button type="button" onclick={() => jump(null)}>Echtzeit</button>
			</div>
			<div class="debug-controls">
				Folie
				{#each [...new Map(slides.map((s) => [s.id, s])).values()] as s (s.id)}
					<button type="button" class:active={held === s.id} onclick={() => hold(s.id)}>
						{s.label}
					</button>
				{/each}
				<button type="button" class:active={!held} onclick={() => hold(null)}>
					Automatisch ({slides.map((s) => `${s.seconds}s`).join(' / ')})
				</button>
			</div>
			<div class="debug-presets">
				{#each presetGroups as group (group.day)}
					<div>
						<p>{group.day}</p>
						{#each group.items as item (item.label + item.time.getTime())}
							<button
								type="button"
								onclick={() => jump(item.time)}
								title={item.time.toLocaleString('de-DE')}
							>
								<span class="numeral">{clock(item.time)}</span>
								{item.label}
							</button>
						{/each}
					</div>
				{/each}
			</div>
			<p class="debug-hint">
				<kbd>s</kbd> nächste Folie · <kbd>d</kbd> Panel ein/aus · <kbd>f</kbd> oder Doppelklick:
				Vollbild · Set-Enden ohne
				<code>end</code> in der Running Order sind geschätzt
			</p>
		{/if}
	</div>
{/if}

<style>
	/* Everything is sized in `em` off one base that follows the screen, so the
	   layout is the same on a 1080p TV, a 4K panel or a laptop preview. */
	.signage {
		position: fixed;
		inset: 0;
		overflow: hidden;
		font-size: min(1.15vw, 2.05vh);
		/* slides leave this much room for the bar on top of them */
		--bar-height: 9.5em;
		background: var(--ink-sunk);
		cursor: none;
	}

	.signage.debug {
		cursor: auto;
	}

	/* ----------------------------------------------------------------- bar */

	/* Slides are stacked so the outgoing one fades over the incoming one. */
	.slide-frame {
		position: absolute;
		inset: 0;
	}

	.bar {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 2em;
		padding: 2.2em 3.2em 0;
	}

	.logo {
		height: 4.6em;
		width: auto;
	}

	.where {
		font-size: 1em;
		color: var(--silver-dim);
	}

	.clock {
		justify-self: end;
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 3.4em;
		line-height: 1;
		letter-spacing: 0.04em;
	}

	/* --------------------------------------------------------- debug panel */

	.debug-panel {
		position: fixed;
		top: 1rem;
		left: 50%;
		translate: -50% 0;
		z-index: 10;
		width: min(64rem, calc(100vw - 2rem));
		max-height: calc(100vh - 2rem);
		overflow: auto;
		padding: 0.9rem 1.1rem;
		background: rgb(16 16 20 / 94%);
		border: 1px solid var(--hairline-strong);
		font-family: system-ui, sans-serif;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--silver);
		backdrop-filter: blur(6px);
	}

	.debug-head,
	.debug-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1rem;
	}

	.debug-head button {
		margin-left: auto;
	}

	.debug-controls {
		margin-top: 0.8rem;
	}

	.debug-controls label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.debug-panel button,
	.debug-panel input,
	.debug-panel select {
		font: inherit;
		color: var(--silver);
		background: rgb(231 232 236 / 6%);
		border: 1px solid var(--hairline-strong);
		padding: 0.3rem 0.6rem;
		cursor: pointer;
	}

	.debug-panel button.active {
		border-color: var(--silver);
		background: rgb(231 232 236 / 22%);
	}

	.debug-panel button:hover {
		background: rgb(231 232 236 / 16%);
	}

	.debug-presets {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
		margin-top: 0.9rem;
	}

	.debug-presets > div {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.debug-presets p {
		margin: 0 0 0.2rem;
		font-weight: 600;
		color: var(--silver-dim);
	}

	.debug-presets button {
		display: flex;
		gap: 0.6rem;
		text-align: left;
	}

	.debug-hint {
		margin: 0.9rem 0 0;
		color: var(--steel);
	}

	.debug-hint kbd,
	.debug-hint code {
		font-family: ui-monospace, monospace;
		padding: 0 0.25em;
		border: 1px solid var(--hairline);
	}
</style>
