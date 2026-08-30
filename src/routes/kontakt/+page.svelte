<script lang="ts">
	import { untrack } from 'svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import { reveal } from '$lib/reveal';

	let { data } = $props();
	const site = $derived(data.site);

	let name = $state('');
	let email = $state('');
	let subject = $state(untrack(() => data.site.contact.subjects[0]));
	let message = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'failed'>('idle');

	const mailto = $derived(
		`mailto:${site.organisation.email}` +
			`?subject=${encodeURIComponent(`[${subject}] Anfrage von ${name || 'der Website'}`)}` +
			`&body=${encodeURIComponent(`${message}\n\n—\n${name}\n${email}`)}`
	);

	/**
	 * The site is static, so there is no server of our own to post to.
	 * Until `site.contact.form_endpoint` is filled in (a Directus flow webhook,
	 * for example), the form hands the message to the visitor's mail client.
	 */
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		const endpoint = site.contact.form_endpoint;

		if (!endpoint) {
			window.location.href = mailto;
			status = 'sent';
			return;
		}

		status = 'sending';
		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, email, subject, message })
			});
			status = response.ok ? 'sent' : 'failed';
			if (response.ok) message = '';
		} catch {
			status = 'failed';
		}
	}
</script>

<svelte:head>
	<title>Kontakt — Blast of Eternity</title>
	<meta
		name="description"
		content="Fragen zum Blast of Eternity, zu Clubkonzerten, Sponsoring, Mitarbeit oder Booking? So erreichst du uns."
	/>
</svelte:head>

<PageHead eyebrow="Schreib uns" title="Kontakt" photo={data.photo}>
	{site.contact.intro}
</PageHead>

<section class="section">
	<div class="page columns">
		<div class="form-col" use:reveal>
			<h2 class="eyebrow">Nachricht</h2>

			<form onsubmit={submit}>
				<div class="field">
					<label for="name">Name</label>
					<input id="name" name="name" type="text" bind:value={name} required autocomplete="name" />
				</div>

				<div class="field">
					<label for="email">E-Mail</label>
					<input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
					/>
				</div>

				<div class="field">
					<label for="subject">Betreff</label>
					<select id="subject" name="subject" bind:value={subject}>
						{#each site.contact.subjects as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</div>

				<div class="field">
					<label for="message">Nachricht</label>
					<textarea id="message" name="message" rows="7" bind:value={message} required></textarea>
				</div>

				<div class="submit">
					<button class="action action--primary" type="submit" disabled={status === 'sending'}>
						{status === 'sending' ? 'Wird gesendet' : 'Absenden'}
					</button>
					<p class="hint dim" role="status">
						{#if status === 'sent' && !site.contact.form_endpoint}
							Dein Mailprogramm sollte sich mit der fertigen Nachricht geöffnet haben.
						{:else if status === 'sent'}
							Danke — deine Nachricht ist bei uns.
						{:else if status === 'failed'}
							Das hat nicht geklappt. Schreib uns bitte direkt an
							<a class="link" href="mailto:{site.organisation.email}">{site.organisation.email}</a>.
						{:else if !site.contact.form_endpoint}
							Öffnet die Nachricht in deinem Mailprogramm.
						{/if}
					</p>
				</div>
			</form>
		</div>

		<aside class="side" use:reveal={120}>
			<section>
				<h2 class="eyebrow">Direkt</h2>
				<p class="mail">
					<a class="link" href="mailto:{site.organisation.email}">{site.organisation.email}</a>
				</p>
				<p class="dim">
					<a class="link" href="tel:{site.organisation.phone}">{site.organisation.phone_label}</a>
				</p>
			</section>

			<section>
				<h2 class="eyebrow">Post</h2>
				<address>
					{site.organisation.name}<br />
					{site.organisation.street}<br />
					{site.organisation.postal_code}
					{site.organisation.city}
				</address>
			</section>

			<section>
				<h2 class="eyebrow">Social</h2>
				<ul>
					{#each site.socials as social (social.url)}
						<li>
							<a class="link" href={social.url} rel="me noopener" target="_blank">
								{social.platform} — {social.handle}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		</aside>
	</div>
</section>

<style>
	.columns {
		display: grid;
		gap: clamp(2.5rem, 6vw, 4.5rem);
	}

	@media (min-width: 55rem) {
		.columns {
			grid-template-columns: 1.4fr 1fr;
		}
	}

	form {
		margin-top: 2rem;
	}

	.field + .field {
		margin-top: 1.75rem;
	}

	label {
		display: block;
		margin-bottom: 0.65rem;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--step--1);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--silver-dim);
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 1px solid var(--hairline);
		background: var(--ink-raised);
		color: var(--silver);
		font-family: var(--font-body);
		font-size: var(--step-0);
		line-height: 1.5;
		border-radius: 0;
		transition: border-color 0.3s var(--ease);
	}

	select {
		appearance: none;
		background-image:
			linear-gradient(45deg, transparent 50%, var(--silver-dim) 50%),
			linear-gradient(135deg, var(--silver-dim) 50%, transparent 50%);
		background-position:
			calc(100% - 1.2rem) 1.35rem,
			calc(100% - 0.85rem) 1.35rem;
		background-size:
			6px 6px,
			6px 6px;
		background-repeat: no-repeat;
		padding-right: 3rem;
	}

	textarea {
		resize: vertical;
	}

	input:focus,
	select:focus,
	textarea:focus {
		border-color: var(--hairline-strong);
	}

	.submit {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.75rem;
		margin-top: 2rem;
	}

	button {
		cursor: pointer;
	}

	button[disabled] {
		opacity: 0.55;
		cursor: progress;
	}

	.hint {
		margin: 0;
		max-width: 22rem;
		font-size: var(--step--1);
		font-style: italic;
	}

	.side {
		align-self: start;
		padding: clamp(1.5rem, 3vw, 2rem);
		border: 1px solid var(--hairline);
		background: var(--ink-raised);
	}

	.side section + section {
		margin-top: 2.25rem;
		padding-top: 2.25rem;
		border-top: 1px solid var(--hairline);
	}

	.side h2 {
		margin-bottom: 1rem;
	}

	.mail {
		font-size: var(--step-1);
		margin-bottom: 0.5rem;
	}

	address {
		font-style: normal;
		line-height: 1.8;
		color: var(--silver-dim);
	}

	.side ul {
		list-style: none;
		margin: 0;
		padding: 0;
		line-height: 2;
		color: var(--silver-dim);
	}
</style>
