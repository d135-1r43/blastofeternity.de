<script lang="ts">
	/**
	 * A quiet pointer to the festival merch: the shirt front and back, and a
	 * short price list. Deliberately understated — no call to action, no QR.
	 */
	type Props = { year: number };
	let { year }: Props = $props();

	const items = [
		{ name: 'Shirt', sizes: 'M bis 3XL', price: '20' },
		{ name: 'Zipper', sizes: 'S bis 2XL', price: '50' }
	];
</script>

<div class="slide">
	<div class="body">
		<main class="text">
			<p class="eyebrow cue">Merch</p>
			<h2 class="title">Blast of Eternity {year}</h2>

			<ul class="items">
				{#each items as item (item.name)}
					<li>
						<span class="name">{item.name}</span>
						<span class="sizes">{item.sizes}</span>
						<span class="price numeral">{item.price}&nbsp;€</span>
					</li>
				{/each}
			</ul>

			<p class="where">Am Merchstand</p>
		</main>

		<div class="photos">
			<img src="/images/signage/merch-shirt-front.jpg" alt="Festival-Shirt {year}, Vorderseite" />
			<img src="/images/signage/merch-shirt-back.jpg" alt="Festival-Shirt {year}, Rückseite" />
		</div>
	</div>
</div>

<style>
	.slide {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: var(--bar-height) 1fr;
		background: var(--ink-sunk);
	}

	.body {
		grid-row: 2;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 5em;
		align-items: end;
		padding: 0 3.2em 3.2em;
		min-height: 0;
	}

	.text {
		width: 36em;
	}

	.cue {
		font-size: 1.15em;
		color: var(--steel);
		margin-bottom: 1em;
	}

	.title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 3.2em;
		line-height: 1.1;
		letter-spacing: 0.02em;
		color: var(--silver);
	}

	.items {
		list-style: none;
		margin: 2.4em 0 0;
		padding: 0;
		border-top: 1px solid var(--hairline);
	}

	.items li {
		display: grid;
		grid-template-columns: 7em 1fr auto;
		align-items: baseline;
		gap: 1.5em;
		padding: 0.9em 0;
		border-bottom: 1px solid var(--hairline);
	}

	.name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.6em;
		color: var(--silver);
	}

	.sizes {
		white-space: nowrap;
		font-size: 1.25em;
		color: var(--steel);
	}

	.price {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.6em;
		color: var(--silver-dim);
	}

	.where {
		margin: 1.6em 0 0;
		font-size: 1.25em;
		color: var(--steel);
	}

	/* -------------------------------------------------------------- photos */

	.photos {
		display: flex;
		gap: 1.6em;
		height: 100%;
		max-height: 42em;
		justify-content: flex-end;
		align-self: end;
		min-height: 0;
		min-width: 0;
	}

	/* on narrower screens the photos give way sideways, cropped, never the text */
	.photos img {
		flex: 0 1 auto;
		min-width: 0;
		height: 100%;
		width: auto;
		aspect-ratio: 2410 / 3600;
		object-fit: cover;
		border: 1px solid var(--hairline-strong);
		filter: brightness(0.92) saturate(0.85);
	}
</style>
