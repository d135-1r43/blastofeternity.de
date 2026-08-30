<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Photo } from '$lib/types';

	/**
	 * The opening of every interior page: a photograph sunk almost to black, with
	 * the title sitting in it. Same gesture as the home hero, half the height.
	 */
	type Props = {
		eyebrow: string;
		title: string;
		photo?: Photo | null;
		meta?: Snippet;
		children?: Snippet;
	};

	let { eyebrow, title, photo = null, meta, children }: Props = $props();

	const srcset = $derived(
		photo ? photo.widths.map((w) => `${photo.src}-${w}.jpg ${w}w`).join(', ') : ''
	);
</script>

<header class="head" class:has-photo={!!photo}>
	{#if photo}
		<div class="backdrop">
			<img
				src="{photo.src}-{photo.widths[photo.widths.length - 1]}.jpg"
				{srcset}
				sizes="100vw"
				width={photo.width}
				height={photo.height}
				alt=""
				fetchpriority="high"
			/>
			<div class="scrim"></div>
		</div>
	{/if}

	<div class="page inner">
		<p class="eyebrow">{eyebrow}</p>
		<h1>{title}</h1>
		{#if meta}
			<div class="meta">{@render meta()}</div>
		{/if}
		{#if children}
			<div class="lead prose">{@render children()}</div>
		{/if}
	</div>
</header>

<style>
	.head {
		position: relative;
		padding-block: clamp(3.5rem, 9vw, 6rem) clamp(3rem, 7vw, 5rem);
		border-bottom: 1px solid var(--hairline);
		overflow: hidden;
	}

	.has-photo {
		padding-block: clamp(6rem, 16vw, 11rem) clamp(4rem, 9vw, 7rem);
	}

	.backdrop,
	.backdrop img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.backdrop img {
		object-fit: cover;
		object-position: center 45%;
		filter: grayscale(0.5) contrast(1.05);
	}

	.scrim {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(110% 100% at 25% 45%, rgb(8 8 10 / 55%), rgb(8 8 10 / 92%) 75%),
			linear-gradient(rgb(8 8 10 / 88%), rgb(8 8 10 / 72%) 45%, var(--ink) 100%);
	}

	.inner {
		position: relative;
	}

	h1 {
		margin-top: 1.25rem;
		font-size: var(--step-4);
	}

	.meta {
		margin-top: clamp(1.5rem, 3vw, 2rem);
	}

	.lead {
		margin-top: clamp(1.5rem, 3vw, 2rem);
		font-size: var(--step-1);
		line-height: 1.55;
		color: var(--silver-dim);
	}

	@media (prefers-reduced-motion: no-preference) {
		.inner > :global(*) {
			animation: rise 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
		}

		.inner > :global(*:nth-child(2)) {
			animation-delay: 0.08s;
		}

		.inner > :global(*:nth-child(3)) {
			animation-delay: 0.16s;
		}

		.inner > :global(*:nth-child(4)) {
			animation-delay: 0.24s;
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
