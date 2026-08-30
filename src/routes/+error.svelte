<script lang="ts">
	import { page } from '$app/state';
	import NotFound from '$lib/components/NotFound.svelte';
</script>

<svelte:head>
	<title>Fehler {page.status} — Blast of Eternity</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<NotFound status={page.status} message={page.error?.message ?? null} />
