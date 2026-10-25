<script lang="ts">
	import Ornament from './Ornament.svelte';
	import Wordmark from './Wordmark.svelte';
	import type { Partner, Site } from '$lib/types';

	type Props = { site: Site; partners: Partner[] };
	let { site, partners }: Props = $props();

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

		{#if partners.length}
			<section class="partners">
				<h2 class="eyebrow">Partner, Unterstützer und Sponsoren</h2>
				<ul>
					{#each partners as partner (partner.id)}
						<li>
							{#if partner.logo}
								<a href={partner.url} rel="noopener" target="_blank" title={partner.name}>
									<img src={partner.logo} alt={partner.name} loading="lazy" />
								</a>
							{:else}
								<a class="link" href={partner.url} rel="noopener" target="_blank">
									{partner.name}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/if}

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

	/* The logos are drawn in the footer's silver, like everything else on the
	   site; colour stays with the photographs. Full strength on hover. */
	.partners {
		margin-top: clamp(3rem, 6vw, 4.5rem);
		padding-top: clamp(2.5rem, 5vw, 3.5rem);
		border-top: 1px solid var(--hairline);
		text-align: center;
	}

	.partners ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 2rem clamp(2rem, 4vw, 3.25rem);
		margin-top: 1.75rem;
	}

	.partners a {
		display: block;
	}

	/* A fixed height, because SVGs without a width and height of their own
	   would otherwise collapse to nothing. */
	.partners img {
		width: auto;
		height: 2.75rem;
		max-width: 10.5rem;
		object-fit: contain;
		filter: brightness(0) invert(1);
		opacity: 0.6;
		transition: opacity 0.3s var(--ease);
	}

	.partners a:hover img,
	.partners a:focus-visible img {
		opacity: 1;
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
