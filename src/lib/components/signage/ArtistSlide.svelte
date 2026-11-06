<script lang="ts">
	import { relativeDay, type FestivalDay } from '$lib/signage';

	/**
	 * Credits Anna Jäger-Hauer (Linestyle Artwork), who made this year's festival
	 * artwork, and points to her interview in the side programme until it is
	 * over. Her gold logo is the one warm colour on the screen.
	 */
	type Props = {
		year: number;
		days: FestivalDay[];
		now: Date;
		/** SVG markup of a QR code for her gallery, made at build time. */
		qr: string;
	};
	let { year, days, now, qr }: Props = $props();

	/** Matches her side programme item, whatever else its title says. */
	const ARTIST = /jäger-hauer/i;

	const interview = $derived.by(() => {
		for (const day of days) {
			const item = day.side.find((s) => ARTIST.test(s.name) && s.end > now);
			if (!item) continue;
			const where = item.place ? ` · ${item.place}` : '';
			return item.start <= now
				? `Jetzt${where}`
				: `${relativeDay(day, now)} · ${item.time} Uhr${where}`;
		}
		return null;
	});
</script>

<div class="slide">
	<div class="backdrop" aria-hidden="true">
		<img src="/images/signage/linestyle-anna.jpg" alt="" />
	</div>

	<div class="body">
		<main class="text">
			<p class="eyebrow cue">Festival-Artwork {year}</p>
			<img
				class="logo"
				src="/images/signage/linestyle-logo.png"
				alt="Linestyle Artwork – The art of Anna Jäger-Hauer"
				width="1920"
				height="595"
			/>
			<p class="lead">
				Das Artwork des diesjährigen Blast of Eternity stammt von Anna&nbsp;Jäger-Hauer. Sie malt
				fantastische Welten in Öl, Acryl, Tusche und Bleistift.
			</p>

			<div class="details">
				<div>
					{#if interview}
						<p class="interview">
							<span class="what">Interview mit Anna</span>
							<span class="when numeral">{interview}</span>
						</p>
					{/if}
					<ul class="links">
						<li>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-label="Instagram"
								><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path
									d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
								/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
							>
							@linestyle_artwork
						</li>
						<li>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-label="Web"
								><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path
									d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
								/></svg
							>
							linestyle-artwork.de
						</li>
					</ul>
				</div>

				<div class="qr-block">
					<!-- trusted: drawn by the build from a fixed URL -->
					<div class="qr">{@html qr}</div>
					<p class="qr-label">Galerie</p>
				</div>
			</div>
		</main>

		<img class="portrait" src="/images/signage/linestyle-anna.jpg" alt="Anna Jäger-Hauer" />
	</div>
</div>

<style>
	.slide {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: var(--bar-height) 1fr;
		/* the gold of her logo */
		--gold: #d6b21f;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.backdrop img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.25);
		filter: blur(2.5em) brightness(0.32) saturate(0.7);
	}

	.body {
		position: relative;
		grid-row: 2;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 4em;
		align-items: end;
		padding: 0 3.2em 3.2em;
		min-height: 0;
	}

	.text {
		max-width: 56em;
	}

	.cue {
		font-size: 1.15em;
		color: var(--silver);
		margin-bottom: 1.2em;
	}

	.logo {
		display: block;
		width: 44em;
		max-width: 100%;
		height: auto;
		/* the artwork has generous empty margins of its own */
		margin: -1em 0 -1em -2em;
		filter: drop-shadow(0 0.1em 0.5em rgb(0 0 0 / 60%));
	}

	.lead {
		margin: 1.4em 0 0;
		max-width: 34em;
		font-size: 1.6em;
		line-height: 1.35;
		color: var(--silver);
	}

	.details {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 3em;
		align-items: end;
		margin-top: 2.2em;
		padding-top: 2em;
		border-top: 1px solid var(--hairline-strong);
	}

	.interview {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		margin: 0 0 1.2em;
		font-family: var(--font-display);
		font-weight: 600;
		line-height: 1.2;
	}

	.what {
		font-size: 1.6em;
	}

	.when {
		font-size: 1.25em;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.links li {
		display: flex;
		align-items: center;
		gap: 0.6em;
		font-size: 1.3em;
		color: var(--silver-dim);
	}

	.links svg {
		width: 1em;
		height: 1em;
		flex: none;
		opacity: 0.6;
	}

	/* ----------------------------------------------------------- portrait */

	.portrait {
		height: 33em;
		width: auto;
		border: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		outline: 1px solid color-mix(in srgb, var(--gold) 25%, transparent);
		outline-offset: 0.6em;
		box-shadow: 0 1.5em 4em rgb(0 0 0 / 60%);
	}

	/* ------------------------------------------------------------------ qr */

	.qr-block {
		display: grid;
		grid-template-columns: 9em auto;
		gap: 1.4em;
		align-items: end;
	}

	/* Dark modules on a light tile, quiet zone included: inverted codes are
	   not read by every phone camera. */
	.qr {
		padding: 0.9em;
		background: var(--silver);
	}

	.qr :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	.qr-block p {
		margin: 0;
	}

	.qr-label {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.8em;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
