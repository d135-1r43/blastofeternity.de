<script lang="ts">
	import type { Band } from '$lib/types';
	import { reveal } from '$lib/reveal';

	type Props = {
		bands: Band[];
		/** Turn each name into a link to its section further down the page. */
		linkTo?: (band: Band) => string | null;
	};

	let { bands, linkTo }: Props = $props();

	const tiers = $derived([1, 2, 3].map((t) => bands.filter((b) => b.tier === t)) as Band[][]);
</script>

<!--
  The line-up is set the way the festival sets its posters: centred Roman
  capitals, one band per line, size falling with the billing. It is the same
  object printed on paper and on screen, which is the whole point.
-->
<div class="lineup">
	{#each tiers as tier, i (i)}
		{#if tier.length}
			<ol class="tier tier--{i + 1}">
				{#each tier as band, j (band.id)}
					{@const href = linkTo?.(band)}
					<li use:reveal={i * 90 + j * 60}>
						{#if href}
							<a {href}>
								{band.name}{#if band.origin}<span class="origin">&nbsp;({band.origin})</span>{/if}
							</a>
						{:else}
							{band.name}{#if band.origin}<span class="origin">&nbsp;({band.origin})</span>{/if}
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	{/each}
</div>

<style>
	.lineup {
		text-align: center;
	}

	.tier {
		list-style: none;
		margin: 0;
		padding: 0;
		font-family: var(--font-display);
		line-height: 1.16;
		letter-spacing: 0.015em;
		color: var(--silver);
	}

	.tier li {
		text-wrap: balance;
	}

	/* Sized so the longest entry in each tier stays on one line at 360px and up:
	   a band name broken across two lines stops looking like a poster. */
	.tier--1 {
		font-size: clamp(1.75rem, 6.6vw, 4rem);
		line-height: 1.12;
	}

	.tier--2 {
		font-size: clamp(1.375rem, 5vw, 2.75rem);
		margin-top: 0.5em;
		color: #cdd0d7;
	}

	.tier--3 {
		font-size: clamp(1.0625rem, 3.9vw, 2rem);
		margin-top: 0.7em;
		color: #adb1ba;
	}

	/* The origin is set at full size, the way the printed posters set it, so the
	   line centres on the whole entry rather than leaving the name hanging left. */
	.origin {
		color: var(--steel);
		white-space: nowrap;
	}

	a {
		text-decoration: none;
		color: inherit;
		transition: color 0.3s var(--ease);
	}

	a:hover,
	a:focus-visible {
		color: #fff;
	}
</style>
