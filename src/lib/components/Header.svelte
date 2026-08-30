<script lang="ts">
	import { page } from '$app/state';
	import type { Site } from '$lib/types';

	type Props = { site: Site; overlay?: boolean };
	let { site, overlay = false }: Props = $props();

	let open = $state(false);
	let scrolled = $state(false);

	const isCurrent = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	$effect(() => {
		// Close the mobile menu whenever navigation lands somewhere new.
		page.url.pathname;
		open = false;
	});

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 24);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

<header class="masthead" class:overlay class:scrolled class:open>
	<div class="page inner">
		<a class="wordmark" href="/">
			Blast of Eternity
			<span class="visually-hidden">— Startseite</span>
		</a>

		<button
			class="toggle"
			type="button"
			aria-expanded={open}
			aria-controls="site-nav"
			onclick={() => (open = !open)}
		>
			{open ? 'Schließen' : 'Menü'}
		</button>

		<nav id="site-nav" aria-label="Hauptnavigation">
			<ul>
				{#each site.navigation as item (item.href)}
					<li>
						<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	.masthead {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--ink);
		border-bottom: 1px solid var(--hairline);
		transition:
			background-color 0.4s var(--ease),
			border-color 0.4s var(--ease);
	}

	/* Over the hero the masthead floats, invisible until you start scrolling. */
	.masthead.overlay {
		position: fixed;
		inset: 0 0 auto;
		background: transparent;
		border-bottom-color: transparent;
	}

	.masthead.overlay:not(.scrolled):not(.open) .wordmark,
	.masthead.overlay:not(.scrolled):not(.open) nav a,
	.masthead.overlay:not(.scrolled):not(.open) .toggle {
		text-shadow: 0 1px 10px rgb(8 8 10 / 90%);
	}

	.masthead.overlay.scrolled,
	.masthead.overlay.open {
		background: rgb(8 8 10 / 92%);
		border-bottom-color: var(--hairline);
		backdrop-filter: blur(10px);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		min-height: 4.5rem;
	}

	.wordmark {
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.3em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--silver);
		white-space: nowrap;
	}

	nav ul {
		display: flex;
		gap: clamp(1.25rem, 2.6vw, 2.5rem);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	nav a {
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--silver-dim);
		padding-block: 0.4em;
		border-bottom: 1px solid transparent;
		transition:
			color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	nav a:hover,
	nav a:focus-visible {
		color: var(--silver);
	}

	nav a[aria-current='page'] {
		color: var(--silver);
		border-bottom-color: var(--hairline-strong);
	}

	.toggle {
		display: none;
		border: 0;
		background: none;
		padding: 0.5rem 0;
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--silver);
		cursor: pointer;
	}

	@media (max-width: 52rem) {
		.toggle {
			display: block;
		}

		nav {
			position: absolute;
			left: 0;
			right: 0;
			top: 100%;
			display: none;
			background: rgb(8 8 10 / 97%);
			border-bottom: 1px solid var(--hairline);
			backdrop-filter: blur(10px);
		}

		.open nav {
			display: block;
		}

		nav ul {
			flex-direction: column;
			gap: 0;
			padding: 0.5rem var(--gutter) 1.5rem;
		}

		nav li + li {
			border-top: 1px solid var(--hairline);
		}

		nav a {
			display: block;
			padding: 1rem 0;
			border-bottom: 0;
			font-size: var(--step-0);
			letter-spacing: 0.2em;
		}
	}
</style>
