<script lang="ts">
	import type { Partner } from '$lib/types';

	/**
	 * Credits the people who make the festival possible. Logos keep their own
	 * colours, so each sits on a light tile; the tiles are the one bright
	 * thing on the screen.
	 */
	type Props = { partners: Partner[] };
	let { partners }: Props = $props();
</script>

<div class="slide">
	<div class="backdrop" aria-hidden="true">
		<img src="/images/hands-2200.jpg" alt="" />
	</div>

	<main class="body">
		<p class="eyebrow cue">Mit Dank an</p>
		<h1 class="name chrome-text">Partner, Unterstützer und Sponsoren</h1>
		<p class="lead">Ohne sie gäbe es das Blast of Eternity nicht.</p>

		<ul class="tiles">
			{#each partners as partner (partner.id)}
				<li>
					{#if partner.logo}
						<img src={partner.logo} alt={partner.name} />
					{:else}
						<span class="type">{partner.name}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</main>
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
		filter: grayscale(0.7) brightness(0.22) contrast(1.1);
	}

	.body {
		position: relative;
		grid-row: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 3.2em 4em;
		text-align: center;
	}

	.cue {
		font-size: 1.3em;
		color: var(--silver);
		margin-bottom: 1em;
	}

	.name {
		font-size: 3.8em;
		line-height: 1.05;
		padding-bottom: 0.08em;
		filter: drop-shadow(0 0.04em 0.12em rgb(0 0 0 / 60%));
	}

	.lead {
		margin: 0.8em 0 0;
		font-style: italic;
		font-size: 1.6em;
		color: var(--silver-dim);
	}

	/* wraps into centred rows, so any number of partners balances */
	.tiles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.4em;
		max-width: 80em;
		list-style: none;
		margin: 2.6em 0 0;
		padding: 0;
	}

	.tiles li {
		display: grid;
		place-items: center;
		width: 18.5em;
		height: 7.5em;
		padding: 1.2em 1.8em;
		background: var(--silver);
	}

	/* explicit, because a percentage of an auto-sized grid area is no limit */
	.tiles img {
		max-width: 100%;
		max-height: 4.8em;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	/* A partner without a logo: its name, set like a wordmark. */
	.type {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.3em;
		line-height: 1.2;
		letter-spacing: 0.04em;
		color: var(--ink);
		text-wrap: balance;
	}
</style>
