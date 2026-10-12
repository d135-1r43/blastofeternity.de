import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// The site is served from the domain root, and the 404 page is copied
			// up a directory after the build — relative asset paths would break it.
			paths: { relative: false },

			// SvelteKit 3 replaced `$lib` with the `#lib` subpath import, but
			// svelte-check can't yet resolve `.svelte` files through subpath imports
			// and would type every component as `any`. Keep `$lib` as an alias.
			alias: { $lib: 'src/lib' },

			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// The whole site is content the build already knows about, so every route
			// is prerendered to plain HTML in `build/` and can be served from any
			// static host. See src/lib/content.ts for the Directus migration path.
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				precompress: false,
				strict: true
			})
		})
	]
});
