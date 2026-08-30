<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/reveal';

	type Props = {
		eyebrow?: string | null;
		title: string;
		align?: 'start' | 'center';
		id?: string;
		children?: Snippet;
	};

	let { eyebrow = null, title, align = 'start', id, children }: Props = $props();
</script>

<header class="head head--{align}" use:reveal>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}
	<h2 {id}>{title}</h2>
	{#if children}
		<div class="sub">{@render children()}</div>
	{/if}
	<hr class="rule" />
</header>

<style>
	.head {
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.head--center {
		text-align: center;
	}

	h2 {
		font-size: var(--step-3);
		margin-top: 1.1rem;
	}

	.sub {
		margin-top: 1rem;
		max-width: var(--measure);
		color: var(--silver-dim);
	}

	.head--center .sub {
		margin-inline: auto;
	}

	.rule {
		margin-top: clamp(1.5rem, 3vw, 2.25rem);
	}
</style>
