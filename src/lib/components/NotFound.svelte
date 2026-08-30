<script lang="ts">
	import Ornament from './Ornament.svelte';

	/**
	 * Shared by the runtime error page and the prerendered /404 route, so the
	 * two never drift apart.
	 */
	type Props = { status?: number; message?: string | null };
	let { status = 404, message = null }: Props = $props();

	const isMissing = $derived(status === 404);
	const heading = $derived(isMissing ? 'Seite nicht gefunden' : 'Da ist etwas schiefgelaufen');
	const lead = $derived(
		isMissing
			? 'Diese Seite gibt es nicht — oder nicht mehr. Vielleicht führt einer dieser Wege weiter.'
			: 'Die Seite konnte nicht geladen werden. Versuche es später noch einmal, oder schreib uns, wenn es bleibt.'
	);
</script>

<section class="error">
	<div class="page inner">
		<Ornament width="12rem" />

		<p class="code numeral">{status}</p>
		<h1>{heading}</h1>
		<p class="lead">{lead}</p>

		{#if !isMissing && message}
			<p class="detail">{message}</p>
		{/if}

		<div class="actions">
			<a class="action action--primary" href="/">Zur Startseite</a>
			<a class="action" href="/boe">Festival {new Date().getFullYear()}</a>
			<a class="action" href="/konzerte">Clubkonzerte</a>
		</div>
	</div>
</section>

<style>
	.error {
		display: grid;
		place-items: center;
		min-height: 68svh;
		padding-block: clamp(4rem, 12vh, 8rem);
		text-align: center;
	}

	.code {
		margin: 2rem 0 0.75rem;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
		letter-spacing: 0.3em;
		color: var(--steel);
	}

	h1 {
		font-size: var(--step-3);
	}

	.lead {
		max-width: 34rem;
		margin: 1.5rem auto 0;
		color: var(--silver-dim);
	}

	.detail {
		margin-top: 1rem;
		font-style: italic;
		font-size: var(--step--1);
		color: var(--steel);
	}

	.actions {
		justify-content: center;
		margin-top: clamp(2.5rem, 5vw, 3.5rem);
	}
</style>
