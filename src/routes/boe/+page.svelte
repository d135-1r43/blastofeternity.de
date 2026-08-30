<script lang="ts">
	import EventSchema from '$lib/components/EventSchema.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Lineup from '$lib/components/Lineup.svelte';
	import Ornament from '$lib/components/Ornament.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import SectionHead from '$lib/components/SectionHead.svelte';
	import VideoEmbed from '$lib/components/VideoEmbed.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const { festival, archive, photos } = $derived(data);
	const [plateStage, plateGuitar] = $derived(photos);
</script>

<svelte:head>
	<title>Blast of Eternity Festival {festival.year} — Line-up, Tickets, Anfahrt</title>
	<meta
		name="description"
		content="{festival.date_label}, {festival.venue
			.name}. Line-up, Running Order, Tickets, FAQ und Anfahrt zum Blast of Eternity {festival.year}."
	/>
</svelte:head>

<EventSchema {festival} site={data.site} />

<PageHead eyebrow="Festival" title="Blast of Eternity {festival.year}" photo={plateStage}>
	{#snippet meta()}
		<p class="dates">{festival.date_label}</p>
		<p class="place eyebrow eyebrow--tight">
			{festival.venue.name} · {festival.venue.street}
		</p>
	{/snippet}
</PageHead>

<!-- ============================================================ tickets -->
<section class="section section--tight">
	<div class="page tickets" use:reveal>
		<dl class="prices">
			{#each festival.tickets.prices as price (price.label)}
				<div>
					<dt>{price.label}</dt>
					<dd class="numeral">{price.amount}&thinsp;€</dd>
				</div>
			{/each}
		</dl>
		<div class="ticket-side">
			<p class="fine dim">{festival.tickets.note}</p>
			<a class="action action--ticket" href={festival.tickets.url} rel="noopener" target="_blank">
				Tickets bei {festival.tickets.provider}
			</a>
		</div>
	</div>
</section>

<!-- ============================================================ line-up -->
<section class="section poster">
	<div class="page">
		<header class="poster-head" use:reveal>
			<p class="eyebrow">Line-up</p>
			<Ornament width="9rem" />
		</header>
		<Lineup bands={festival.lineup} linkTo={(band) => `#${band.id}`} />
		<div class="poster-foot" use:reveal><Ornament width="9rem" /></div>
	</div>
</section>

<!-- ====================================================== running order -->
<section class="section section--tight">
	<div class="page">
		<SectionHead eyebrow="Ablauf" title="Running Order" id="running-order" />
		{#if festival.running_order.length}
			<ol class="order">
				{#each festival.running_order as slot (slot.day + slot.time + slot.band)}
					<li>
						<span class="eyebrow eyebrow--tight">{slot.day}</span>
						<span class="numeral time">{slot.time}</span>
						<span class="band">{slot.band}</span>
					</li>
				{/each}
			</ol>
		{:else}
			<p class="tba" use:reveal>
				<span class="tba-mark">t.&thinsp;b.&thinsp;a.</span>
				<span class="dim">{festival.running_order_note}</span>
			</p>
		{/if}
	</div>
</section>

<Figure photo={plateGuitar} variant="bleed" sizes="100vw" dim={0.2} />

<!-- ============================================================== bands -->
<section class="section" id="bands">
	<div class="page">
		<SectionHead eyebrow="Wer spielt" title="Die Bands" />

		<div class="bands">
			{#each festival.lineup as band, i (band.id)}
				<article class="band" id={band.id} use:reveal>
					<div class="band-media">
						{#if band.video}
							<VideoEmbed
								video={band.video}
								title={band.name}
								poster={band.image}
								posterAlt="Bandfoto {band.name}"
							/>
						{:else if band.image}
							<img src={band.image} alt="Bandfoto {band.name}" loading="lazy" />
						{/if}
					</div>
					<div class="band-text">
						<p class="eyebrow numeral">{String(i + 1).padStart(2, '0')}</p>
						<h3>{band.name}</h3>
						<p class="band-meta">
							{#if band.origin}<span class="origin">{band.origin}</span>{/if}
							<span class="genre">{band.genre}</span>
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ================================================================ faq -->
<section class="section" id="faq">
	<div class="page">
		<SectionHead eyebrow="Gut zu wissen" title="Häufige Fragen" />
		<div class="faq">
			{#each festival.faq as item (item.id)}
				<details use:reveal>
					<summary>
						<span>{item.question}</span>
						<span class="marker" aria-hidden="true"></span>
					</summary>
					<div class="answer">
						{#each item.answer as paragraph}
							<p>{paragraph}</p>
						{/each}
						{#if item.bank}
							<dl class="bank">
								<div>
									<dt>Kontoinhaber</dt>
									<dd>{data.site.bank.holder}</dd>
								</div>
								<div>
									<dt>Bank</dt>
									<dd>{data.site.bank.bank}</dd>
								</div>
								<div>
									<dt>IBAN</dt>
									<dd class="numeral">{data.site.bank.iban}</dd>
								</div>
								<div>
									<dt>BIC</dt>
									<dd class="numeral">{data.site.bank.bic}</dd>
								</div>
							</dl>
						{/if}
						{#if item.link}
							<p>
								<a
									class="link"
									href={item.link.url}
									rel={item.link.url.startsWith('http') ? 'noopener' : undefined}
									target={item.link.url.startsWith('http') ? '_blank' : undefined}
								>
									{item.link.label}
								</a>
							</p>
						{/if}
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>

<!-- ============================================================ anfahrt -->
<section class="section" id="anfahrt">
	<div class="page">
		<SectionHead eyebrow="Hinkommen" title="Anfahrt" />
		<div class="travel">
			<div class="travel-text prose" use:reveal>
				{#each festival.travel.body as paragraph}
					<p>{paragraph}</p>
				{/each}
				<p>
					<a class="link" href={festival.travel.link.url} rel="noopener" target="_blank">
						{festival.travel.link.label}
					</a>
				</p>
			</div>
			<aside class="travel-address" use:reveal={120}>
				<h3 class="eyebrow">Adresse</h3>
				<address>
					{festival.venue.legal_name ?? festival.venue.name}<br />
					{festival.venue.street}<br />
					{festival.venue.postal_code}
					{festival.venue.city}
				</address>
				<p>
					<a class="link" href={festival.travel.map_url} rel="noopener" target="_blank">
						Auf der Karte ansehen
					</a>
				</p>
			</aside>
		</div>
	</div>
</section>

<!-- ============================================================= archiv -->
<section class="section archive" id="archiv">
	<div class="page">
		<SectionHead eyebrow="Seit 2011" title="BoE-Archiv">
			Wer schon alles beim Blast of Eternity zu Gast war.
		</SectionHead>

		<div class="years">
			{#each archive as edition (edition.id)}
				<details use:reveal>
					<summary>
						<span class="year numeral">{edition.year}</span>
						<span class="summary-meta">
							<span class="summary-date">{edition.date_label}</span>
							{#if edition.city}<span class="summary-city">{edition.city}</span>{/if}
						</span>
						<span class="marker" aria-hidden="true"></span>
					</summary>
					<div class="edition">
						<div class="edition-text">
							{#if edition.lineup.length}
								<h3 class="eyebrow">Line-up</h3>
								<ul class="edition-lineup">
									{#each edition.lineup as name}
										<li>{name}</li>
									{/each}
								</ul>
							{/if}
							{#if edition.note}
								<p class="note">{edition.note}</p>
							{/if}
						</div>
						{#if edition.poster}
							<img
								class="poster-img"
								src={edition.poster}
								alt="Plakat des Blast of Eternity {edition.year}"
								loading="lazy"
							/>
						{/if}
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.dates {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-1);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.place {
		margin: 0.9rem 0 0;
		color: var(--steel);
	}

	/* ------------------------------------------------------------ tickets */

	.tickets {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 2.5rem;
		padding-block: clamp(2rem, 4vw, 2.75rem);
		border-block: 1px solid var(--hairline);
	}

	.prices {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem clamp(2rem, 5vw, 3.5rem);
		margin: 0;
	}

	.prices div {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.prices dt {
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.prices dd {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-2);
	}

	.ticket-side {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.fine {
		margin: 0;
		font-size: var(--step--1);
		font-style: italic;
	}

	/* ------------------------------------------------------------- poster */

	.poster {
		border-bottom: 1px solid var(--hairline);
	}

	.poster-head {
		text-align: center;
		margin-bottom: clamp(2.5rem, 6vw, 3.5rem);
	}

	.poster-head .eyebrow {
		margin-bottom: 1.5rem;
	}

	.poster-foot {
		margin-top: clamp(2.5rem, 6vw, 3.5rem);
	}

	/* ------------------------------------------------------ running order */

	.order {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.order li {
		display: grid;
		grid-template-columns: 6rem 5rem 1fr;
		gap: 1rem;
		align-items: baseline;
		padding-block: 1rem;
		border-bottom: 1px solid var(--hairline);
	}

	.order .time {
		font-family: var(--font-display);
	}

	.order .band {
		font-family: var(--font-display);
		font-size: var(--step-1);
	}

	.tba {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: var(--measure);
	}

	.tba-mark {
		font-family: var(--font-display);
		font-size: var(--step-3);
		letter-spacing: 0.1em;
		color: var(--steel);
	}

	/* -------------------------------------------------------------- bands */

	.bands {
		display: flex;
		flex-direction: column;
		gap: clamp(3.5rem, 8vw, 6rem);
	}

	.band {
		display: grid;
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: center;
	}

	@media (min-width: 55rem) {
		.band {
			grid-template-columns: 1.35fr 1fr;
		}

		.band:nth-child(even) .band-media {
			order: 2;
		}
	}

	.band-media img {
		width: 100%;
		height: auto;
		border: 1px solid var(--hairline);
	}

	.band-text .eyebrow {
		color: var(--steel);
	}

	.band-text h3 {
		margin: 0.9rem 0 0;
		font-size: var(--step-3);
	}

	.band-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem 1.25rem;
		margin: 1.1rem 0 0;
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.origin {
		color: var(--silver-dim);
		padding-right: 1.25rem;
		border-right: 1px solid var(--hairline-strong);
	}

	.genre {
		color: var(--steel);
	}

	/* ---------------------------------------------------- details (shared) */

	details {
		border-bottom: 1px solid var(--hairline);
	}

	summary {
		display: flex;
		align-items: baseline;
		gap: 1.25rem;
		padding-block: clamp(1.1rem, 2.5vw, 1.6rem);
		cursor: pointer;
		list-style: none;
		font-family: var(--font-display);
		font-size: var(--step-1);
		line-height: 1.3;
		transition: color 0.3s var(--ease);
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		color: #fff;
	}

	.marker {
		flex: none;
		position: relative;
		width: 0.85rem;
		height: 0.85rem;
		margin-left: auto;
		align-self: center;
	}

	.marker::before,
	.marker::after {
		content: '';
		position: absolute;
		inset: 50% 0 auto;
		height: 1px;
		background: var(--silver-dim);
		transition: transform 0.35s var(--ease);
	}

	.marker::after {
		rotate: 90deg;
	}

	details[open] .marker::after {
		transform: scaleX(0);
	}

	.answer,
	.edition {
		padding-bottom: clamp(1.75rem, 4vw, 2.5rem);
		max-width: var(--measure);
		color: var(--silver-dim);
	}

	.bank {
		display: grid;
		gap: 0.5rem;
		margin: 1.5rem 0;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--hairline);
		background: var(--ink-raised);
		font-size: var(--step--1);
	}

	.bank div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
	}

	.bank dt {
		flex: none;
		width: 8rem;
		font-family: var(--font-display);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--steel);
	}

	.bank dd {
		margin: 0;
		color: var(--silver);
	}

	/* ------------------------------------------------------------ anfahrt */

	.travel {
		display: grid;
		gap: clamp(2.5rem, 6vw, 4rem);
	}

	@media (min-width: 55rem) {
		.travel {
			grid-template-columns: 1.4fr 1fr;
		}
	}

	.travel-address {
		padding: clamp(1.5rem, 3vw, 2rem);
		border: 1px solid var(--hairline);
		background: var(--ink-raised);
	}

	.travel-address address {
		margin: 1.25rem 0 1.5rem;
		font-style: normal;
		line-height: 1.8;
	}

	/* ------------------------------------------------------------- archiv */

	.year {
		font-size: var(--step-2);
		min-width: 4.5rem;
	}

	.summary-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
		font-family: var(--font-body);
		font-size: var(--step-0);
		font-style: italic;
		color: var(--silver-dim);
	}

	.summary-city::before {
		content: '· ';
		color: var(--steel);
	}

	.edition {
		display: grid;
		gap: 2rem;
		max-width: none;
	}

	@media (min-width: 45rem) {
		.edition {
			grid-template-columns: 1fr auto;
			align-items: start;
		}
	}

	.edition-lineup {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		font-family: var(--font-display);
		font-size: var(--step-0);
		line-height: 2;
		color: var(--silver);
	}

	.note {
		margin-top: 1.5rem;
		font-style: italic;
		font-size: var(--step--1);
	}

	.poster-img {
		width: min(20rem, 100%);
		height: auto;
		border: 1px solid var(--hairline);
	}
</style>
