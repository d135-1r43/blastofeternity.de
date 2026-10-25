<script lang="ts">
	import type { Concert } from '$lib/types';

	/**
	 * Promotes an upcoming club concert, with a QR code that leads straight to
	 * the ticket shop. The flyer is the picture; blurred, it is also the ground.
	 */
	type Props = {
		concert: Concert;
		/** SVG markup of a QR code for `concert.tickets_url`, made at build time. */
		qr: string;
	};
	let { concert, qr }: Props = $props();

	const flyer = $derived(
		concert.image ? `${concert.image.src}-${concert.image.widths.at(-1)}.jpg` : null
	);
	const weekday = $derived(
		new Date(`${concert.date}T12:00`).toLocaleDateString('de-DE', { weekday: 'long' })
	);
</script>

<div class="slide">
	{#if flyer}
		<div class="backdrop" aria-hidden="true">
			<img src={flyer} alt="" />
		</div>
	{/if}

	<div class="body">
		<main class="text">
			<p class="eyebrow cue">Clubkonzert · {concert.city}</p>
			<h1 class="name chrome-text">{concert.title}</h1>
			{#if concert.subtitle}<p class="meta">{concert.subtitle}</p>{/if}
			{#if concert.support.length}
				<p class="support">mit {concert.support.join(', ')}</p>
			{/if}

			<div class="details">
				<div>
					<p class="when">
						<span class="numeral">{weekday}, {concert.date_label}</span>
						<span class="venue">{concert.venue}, {concert.city}</span>
					</p>

					{#if concert.quote}
						<blockquote>
							<p>„{concert.quote.text}“</p>
							<cite>{concert.quote.source}</cite>
						</blockquote>
					{/if}
				</div>

				<div class="qr-block">
					<!-- trusted: drawn by the build from our own ticket URL -->
					<div class="qr">{@html qr}</div>
					<p class="qr-label">Tickets</p>
				</div>
			</div>
		</main>

		{#if flyer && concert.image}
			<img class="flyer" src={flyer} alt={concert.image.alt} />
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
		filter: blur(2.5em) brightness(0.4) saturate(0.8);
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

	.name {
		font-size: 6em;
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

	.support {
		margin: 0.5em 0 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 2em;
	}

	.details {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 3em;
		align-items: end;
		margin-top: 2.4em;
		padding-top: 2em;
		border-top: 1px solid var(--hairline-strong);
	}

	.when {
		display: flex;
		flex-direction: column;
		gap: 0.4em;
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.6em;
		line-height: 1.2;
	}

	.venue {
		font-size: 0.8em;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	blockquote {
		margin: 1.8em 0 0;
		max-width: 36em;
	}

	blockquote p {
		margin: 0;
		font-style: italic;
		font-size: 1.4em;
		line-height: 1.35;
	}

	cite {
		display: block;
		margin-top: 0.6em;
		font-style: normal;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.95em;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--steel);
	}

	/* -------------------------------------------------------------- tickets */

	.flyer {
		height: 33em;
		width: auto;
		border: 1px solid var(--hairline);
		box-shadow: 0 1.5em 4em rgb(0 0 0 / 60%);
	}

	.qr-block {
		display: grid;
		grid-template-columns: 11em auto;
		gap: 1.4em;
		align-items: end;
	}

	/* Dark modules on a light tile, quiet zone included: inverted codes are
	   not read by every phone camera. */
	.qr {
		padding: 1em;
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
