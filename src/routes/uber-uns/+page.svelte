<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Ornament from '$lib/components/Ornament.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const { about, photos } = $derived(data);
	const [plateHands, plateReach] = $derived(photos);
</script>

<Seo site={data.site} title={about.title} description={about.lead} image="/og/about.jpg" />

<PageHead eyebrow="Wer wir sind" title={about.title} photo={plateReach}>
	{about.lead}
</PageHead>

<section class="section">
	<div class="page columns">
		<div class="text prose" use:reveal>
			{#each about.body as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>

		<aside class="facts" use:reveal={120}>
			<h2 class="eyebrow">In Zahlen</h2>
			<dl>
				{#each about.facts as fact (fact.label)}
					<div>
						<dt>{fact.label}</dt>
						<dd>{fact.value}</dd>
					</div>
				{/each}
			</dl>
		</aside>
	</div>
</section>

<!-- The motto is the association's own line. Given room, it does the work of
     a manifesto — so it gets a page-width setting and nothing else. -->
<section class="section motto-block" use:reveal>
	<div class="page">
		<Ornament width="11rem" />
		<blockquote>
			{#each about.pull_quote.split(' ') as word}
				<span>{word}</span>
			{/each}
		</blockquote>
		<Ornament width="11rem" />
	</div>
</section>

<div class="page">
	<Figure photo={plateHands} sizes="(max-width: 78rem) 100vw, 78rem" />
</div>

<div class="section"></div>

<style>
	.columns {
		display: grid;
		gap: clamp(2.5rem, 6vw, 4.5rem);
	}

	@media (min-width: 55rem) {
		.columns {
			grid-template-columns: 1.5fr 1fr;
		}
	}

	.text {
		font-size: var(--step-1);
		line-height: 1.62;
	}

	.facts {
		align-self: start;
		padding: clamp(1.5rem, 3vw, 2rem);
		border: 1px solid var(--hairline);
		background: var(--ink-raised);
	}

	.facts dl {
		margin: 1.5rem 0 0;
	}

	.facts div + div {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--hairline);
	}

	.facts dt {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--steel);
	}

	.facts dd {
		margin: 0.5rem 0 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-2);
		color: var(--silver);
	}

	.motto-block {
		border-block: 1px solid var(--hairline);
		background: var(--ink-sunk);
		text-align: center;
	}

	blockquote {
		margin: clamp(2.5rem, 6vw, 4rem) 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.2em 0.6em;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-5);
		line-height: 1.05;
		letter-spacing: 0.01em;
	}

	blockquote span {
		background: var(--chrome);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
</style>
