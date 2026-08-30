<script lang="ts">
	import NotFound from '$lib/components/NotFound.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
</script>

<!--
  A real, prerendered 404. adapter-static's `fallback` option writes an empty
  SPA shell instead, which leaves the page blank for anyone without JavaScript
  while the rest of this site is plain HTML. `scripts/postbuild.mjs` copies the
  output of this route to build/404.html, where nginx and the static hosts
  expect to find it.
-->
<Seo
	site={data.site}
	title="Seite nicht gefunden"
	description="Diese Seite gibt es nicht — oder nicht mehr."
	noindex
/>

<NotFound status={404} />
