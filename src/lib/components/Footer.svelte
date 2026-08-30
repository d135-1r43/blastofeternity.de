<script lang="ts">
	import Ornament from './Ornament.svelte';
	import Wordmark from './Wordmark.svelte';
	import type { Site } from '$lib/types';

	type Props = { site: Site };
	let { site }: Props = $props();

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="page">
		<a class="footer-mark" href="/">
			<Wordmark height="clamp(2.75rem, 6vw, 3.75rem)" />
			<span class="visually-hidden">Blast of Eternity — Startseite</span>
		</a>

		<Ornament width="14rem" />

		<p class="motto">{site.tagline}</p>

		<!-- Johannes 1,5. `lang` so a screen reader does not read Latin as German. -->
		<p class="verse" lang={site.verse.lang}>{site.verse.text}</p>

		<div class="cols">
			<section>
				<h2 class="eyebrow">Veranstalter</h2>
				<address>
					{site.organisation.name}<br />
					{site.organisation.street}<br />
					{site.organisation.postal_code}
					{site.organisation.city}<br />
					<a class="link" href="mailto:{site.organisation.email}">{site.organisation.email}</a>
				</address>
			</section>

			<section>
				<h2 class="eyebrow">Folgen</h2>
				<ul>
					{#each site.socials as social (social.url)}
						<li>
							<a class="link" href={social.url} rel="me noopener" target="_blank">
								{social.platform}
							</a>
						</li>
					{/each}
					<li>
						<a class="link" href="/podcast">Podcast</a>
					</li>
				</ul>
			</section>

			<section>
				<h2 class="eyebrow">Seiten</h2>
				<ul>
					{#each site.navigation as item (item.href)}
						<li><a class="link" href={item.href}>{item.label}</a></li>
					{/each}
				</ul>
			</section>
		</div>

		<hr class="rule" />

		<div class="baseline">
			<p class="dim">© {year} {site.organisation.name}</p>
			<ul class="legal">
				{#each site.legal_navigation as item (item.href)}
					<li><a class="link" href={item.href}>{item.label}</a></li>
				{/each}
			</ul>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding-block: clamp(4rem, 9vh, 7rem) 3rem;
		border-top: 1px solid var(--hairline);
		background: var(--ink-sunk);
	}

	.footer-mark {
		display: flex;
		justify-content: center;
		margin-bottom: 2.25rem;
		color: var(--silver-dim);
		transition: color 0.3s var(--ease);
	}

	.footer-mark:hover,
	.footer-mark:focus-visible {
		color: var(--silver);
	}

	.motto {
		margin: 2rem 0 0;
		text-align: center;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step-1);
		letter-spacing: 0.12em;
		color: var(--silver-dim);
	}

	/* Set in the italic rather than the display face: against the Roman capitals
	   of the motto directly above, the contrast reads as a quieter, older voice. */
	.verse {
		margin: 1.1rem 0 clamp(3rem, 7vw, 5rem);
		text-align: center;
		font-style: italic;
		font-size: var(--step-0);
		letter-spacing: 0.02em;
		color: var(--steel);
		text-wrap: balance;
	}

	.cols {
		display: grid;
		gap: clamp(2.25rem, 5vw, 4rem);
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.cols h2 {
		margin-bottom: 1.1rem;
	}

	address {
		font-style: normal;
		line-height: 1.75;
		color: var(--silver-dim);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		line-height: 1.9;
		color: var(--silver-dim);
	}

	.rule {
		margin-top: clamp(3rem, 6vw, 4.5rem);
	}

	.baseline {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		justify-content: space-between;
		align-items: baseline;
		padding-top: 1.75rem;
		font-size: var(--step--1);
	}

	.legal {
		display: flex;
		gap: 1.75rem;
		line-height: 1.4;
	}
</style>
