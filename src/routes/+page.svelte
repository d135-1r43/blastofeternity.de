<script lang="ts">
	import EventSchema from '$lib/components/EventSchema.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Lineup from '$lib/components/Lineup.svelte';
	import Ornament from '$lib/components/Ornament.svelte';
	import VideoEmbed from '$lib/components/VideoEmbed.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();

	const { festival, concert, podcast, pages, heroPhotos, plates } = $derived(data);
	const [plateHands, plateDive] = $derived(plates);
</script>

<svelte:head>
	<title>Blast of Eternity — Metal-Festival & Clubkonzerte in Heilbronn</title>
	<meta
		name="description"
		content="Blast of Eternity {festival.year}: {festival.date_label} in der {festival.venue
			.name}. Dazu Clubkonzerte über das ganze Jahr. Veranstaltet vom CVJM Jugendkultur & Musik e. V."
	/>
	<meta property="og:title" content="Blast of Eternity {festival.year}" />
	<meta property="og:image" content="{data.site.url}/images/crowd-1400.jpg" />
</svelte:head>

<EventSchema {festival} site={data.site} />

<Hero {festival} photos={heroPhotos} />

<!-- ============================================================ line-up -->
<section class="section" id="festival">
	<div class="page">
		<header class="poster-head" use:reveal>
			<p class="eyebrow">Das Festival · {festival.date_short}</p>
			<Ornament width="9rem" />
		</header>

		<Lineup bands={festival.lineup} linkTo={(band) => `/boe#${band.id}`} />

		<div class="poster-foot" use:reveal>
			<Ornament width="9rem" />
			<dl class="prices">
				{#each festival.tickets.prices as price (price.label)}
					<div>
						<dt>{price.label}</dt>
						<dd class="numeral">{price.amount}&thinsp;€</dd>
					</div>
				{/each}
			</dl>
			<p class="fine dim">{festival.tickets.note}</p>
			<div class="actions center">
				<a class="action action--ticket" href={festival.tickets.url} rel="noopener" target="_blank">
					Tickets sichern
				</a>
				<a class="action" href="/boe">Bands, FAQ &amp; Anfahrt</a>
			</div>
		</div>
	</div>
</section>

<Figure photo={plateHands} variant="bleed" sizes="100vw" dim={0.15} />

<!-- ============================================================ clubshows -->
{#if concert}
	<section class="section">
		<div class="page split">
			<div class="split-text" use:reveal>
				<p class="eyebrow">Clubkonzerte</p>
				<p class="when numeral">{concert.date_label}</p>
				<h2>{concert.title}</h2>
				{#if concert.subtitle}<p class="subtitle">{concert.subtitle}</p>{/if}
				<p class="venue eyebrow eyebrow--tight">{concert.venue}, {concert.city}</p>
				<p class="excerpt">{concert.description[0]}</p>
				<div class="actions">
					<a class="action" href="/konzerte">Mehr erfahren</a>
					{#if concert.tickets_url}
						<a
							class="action action--ticket"
							href={concert.tickets_url}
							rel="noopener"
							target="_blank">Tickets</a
						>
					{/if}
				</div>
			</div>

			{#if concert.image}
				<div class="split-media" use:reveal={120}>
					<Figure photo={concert.image} sizes="(max-width: 60rem) min(100vw, 22rem), 26vw" />
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- ============================================================ aftermovie -->
<section class="section section--tight aftermovie">
	<div class="page">
		<header class="centered" use:reveal>
			<p class="eyebrow">{pages.home.aftermovie.title}</p>
			<p class="caption">{pages.home.aftermovie.caption}</p>
		</header>
		<div class="movie" use:reveal>
			<VideoEmbed
				video={pages.home.aftermovie.video}
				title={pages.home.aftermovie.title}
				poster="{plateDive.src}-1400.jpg"
				posterAlt=""
			/>
		</div>
	</div>
</section>

<!-- ============================================================ podcast -->
<section class="section section--tight strip">
	<div class="page strip-inner" use:reveal>
		<div>
			<p class="eyebrow">Podcast</p>
			<p class="strip-text">{podcast.description}</p>
		</div>
		<a class="action" href="/podcast">Alle Episoden</a>
	</div>
</section>

<style>
	.poster-head {
		text-align: center;
		margin-bottom: clamp(2.5rem, 6vw, 4rem);
	}

	.poster-head .eyebrow {
		margin-bottom: 1.75rem;
	}

	.poster-foot {
		margin-top: clamp(3rem, 7vw, 4.5rem);
		text-align: center;
	}

	.prices {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0 clamp(2rem, 6vw, 4.5rem);
		margin: 2.25rem 0 0.75rem;
	}

	.prices div {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.prices dt {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.prices dd {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-2);
		color: var(--silver);
	}

	.fine {
		font-size: var(--step--1);
		font-style: italic;
	}

	.actions.center {
		justify-content: center;
		margin-top: 2.25rem;
	}

	.split-media {
		max-width: 22rem;
		justify-self: center;
	}

	.split-media :global(.frame) {
		border: 1px solid var(--hairline);
	}

	/* -------------------------------------------------------------- split */

	.split {
		display: grid;
		gap: clamp(2.5rem, 6vw, 5rem);
		grid-template-columns: 1fr;
		align-items: center;
	}

	@media (min-width: 60rem) {
		.split {
			grid-template-columns: 1fr 1fr;
		}
	}

	.split-text .when {
		margin: 1.25rem 0 0.5rem;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	.split-text h2 {
		font-size: var(--step-3);
	}

	.subtitle {
		margin: 0.6rem 0 0;
		font-style: italic;
		font-size: var(--step-1);
		color: var(--silver-dim);
	}

	.venue {
		margin: 1.25rem 0 1.75rem;
		color: var(--steel);
	}

	.excerpt {
		max-width: 34rem;
		margin-bottom: 2rem;
	}

	/* --------------------------------------------------------- aftermovie */

	.centered {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.caption {
		margin: 1rem 0 0;
		font-style: italic;
		color: var(--silver-dim);
	}

	.movie {
		max-width: 56rem;
		margin-inline: auto;
	}

	/* -------------------------------------------------------------- strip */

	.strip {
		border-top: 1px solid var(--hairline);
		background: var(--ink-raised);
	}

	.strip-inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.strip-text {
		max-width: 44rem;
		margin: 1rem 0 0;
		color: var(--silver-dim);
	}
</style>
