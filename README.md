# blastofeternity.de

The website for the Blast of Eternity festival and the club shows of the
CVJM Jugendkultur & Musik e. V.

SvelteKit 2 (Svelte 5, runes) · TypeScript · prerendered to static HTML.

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # → build/
pnpm preview    # serve build/ locally
pnpm check      # svelte-check
pnpm format     # prettier
```

## How it is put together

### Content

All copy and data lives in `src/lib/content/*.json` and is read through one
module, `src/lib/content.ts`. Nothing else in the app touches the JSON.

| File                    | Shape      | Holds                                                |
| ----------------------- | ---------- | ---------------------------------------------------- |
| `site.json`             | singleton  | Navigation, association details, socials, bank       |
| `festivals.json`        | collection | The festival on sale — line-up, tickets, FAQ, travel |
| `festival-archive.json` | collection | Every past edition since 2017                        |
| `concerts.json`         | collection | Upcoming club shows                                  |
| `concert-archive.json`  | collection | Every past club show since 2016                      |
| `podcast.json`          | singleton  | Podcast description, platforms, episodes             |
| `photos.json`           | collection | The photographs, with alt text and available widths  |
| `pages.json`            | singleton  | Home intro, Über uns, Impressum                      |
| `privacy.json`          | singleton  | Datenschutzerklärung                                 |

The records are shaped the way Directus returns them — `id`, `status`, `sort`,
snake_case fields, ISO dates — so the JSON files can be imported as collections
more or less as they stand. `src/lib/types.ts` is the contract.

### Moving to Directus

`src/lib/content.ts` is the only file that has to change. Every accessor is
already `async` and every page loads through it, so swapping the source does not
ripple outward:

```ts
import { createDirectus, readItems, rest } from '@directus/sdk';
const directus = createDirectus(DIRECTUS_URL).with(rest());

export const getFestival = () =>
	directus
		.request(
			readItems('festivals', {
				filter: { state: { _eq: 'upcoming' } },
				fields: ['*', 'lineup.*', 'faq.*'],
				limit: 1
			})
		)
		.then((rows) => rows[0]);
```

Because the site is prerendered, content changes reach visitors on the next
build. Point a Directus **flow** at the host's build hook (`Trigger: Event →
items.create / items.update` on the content collections, `Operation: Webhook`)
and publishing in Directus redeploys the site.

Two things want doing at the same time:

- **Images.** `photos.json` records a base path plus the widths rendered on
  disk; `Figure.svelte` builds the `srcset` from that list. With Directus, swap
  the base path for an asset id and the widths for `?width=` transform params.
- **Contact form.** `site.contact.form_endpoint` is `null`, so the form composes
  a mail in the visitor's client. Set it to a Directus flow webhook URL and the
  form POSTs `{name, email, subject, message}` as JSON instead — no other
  change needed.

### Design

- **Palette.** Silver on ink, and nothing else. The only colour on the site
  comes out of the photographs; the one accent (`--ember`, a deep red) is reserved for
  things you can buy a ticket with. Tokens are at the top of `src/app.css`.
- **Type.** Cinzel for display, EB Garamond for text — the Roman capitals the
  festival already sets its posters in, and an old-style face for reading. Both
  are self-hosted from `static/fonts` (`src/fonts.css`), so no request goes to
  Google when someone visits.
- **The line-up** (`Lineup.svelte`) is set the way the posters are set: centred
  capitals, one band per line, size falling with the billing. Tier comes from
  the `tier` field on each band, so the poster is editable content.
- **Weight.** Cinzel and EB Garamond are both used above their lightest cut
  (600 and 500), and `-webkit-font-smoothing` is deliberately left alone —
  `antialiased` thins glyphs on macOS, which reads as weak on a dark ground.
- **The hero** cross-fades four photographs with a slow drift. Only the first
  loads with the page; each next one mounts a beat before it is needed, so a
  visitor who scrolls straight past never downloads the set.
- **Motion** is the hero sequence (a specular highlight crosses the wordmark
  once) plus scroll reveals via `use:reveal`. All of it is off under
  `prefers-reduced-motion`, which also freezes the hero on its first slide.

### Privacy

The site makes no third-party requests on load. Fonts are self-hosted, and
YouTube embeds are click-to-load facades (`VideoEmbed.svelte`) that only reach
youtube-nocookie.com once someone presses play. There is no analytics and there
are no cookies, so no consent banner is needed.

> **Still to do:** `privacy.json` was carried over from the Webflow site and
> still describes that stack (Webflow hosting, Google reCAPTCHA, Font Awesome).
> It needs a pass to match what this site actually does before going live.

## Deploying

`pnpm build` writes plain HTML to `build/`, deployable to any static host.
`static/_redirects` carries the legacy Webflow URLs (Netlify and Cloudflare
Pages read it; on other hosts configure the same redirects server-side).

### Docker

For hosts that want a container rather than a directory, `Dockerfile` builds
the site and bakes it into nginx. Nothing of the toolchain survives into the
final image — it is the `build/` output and a web server.

```sh
docker build -t blastofeternity .
docker run --rm -p 8080:8080 blastofeternity   # http://localhost:8080
```

The server config is `docker/nginx.conf`. It resolves the clean URLs, answers
`/healthz` for container health checks, serves `404.html` for anything it does
not have, and repeats the three legacy redirects from `static/_redirects` —
**keep the two files in step.** The image listens on 8080 and runs as an
unprivileged user, so it needs no extra capabilities.

Because the content is baked in at build time, publishing means building a new
image; see the Directus note above on triggering that from a flow.

### Published images

`.github/workflows/docker.yml` builds the image on every push to `main` and
pushes it to the GitHub Container Registry, tagged `latest`, with the commit
SHA, and — for a `v*` tag — with the version:

```sh
docker pull ghcr.io/d135-1r43/new.blastofeternity.de:latest
```

Pull requests build the image and run a smoke test against it, but publish
nothing.

A package pushed by Actions starts out private, so that `docker pull` only
works once the package's visibility has been set to public under **Packages →
new.blastofeternity.de → Package settings**.

## Assets

`originals/` holds the source artwork; `static/images/` holds the rendered
widths the site serves. Regenerate from the originals if you need other sizes.

Sources are kept at roughly twice the largest rendered width rather than at full
capture resolution — enough to re-derive any web size, without carrying tens of
megabytes in the repo.

## Licence

MIT — see [LICENSE](LICENSE). That covers the code. The photographs in
`originals/` and `static/images/`, the festival wordmark and logo, and the
content in `src/lib/content/` are not ours to relicense: they belong to their
photographers and to CVJM Jugendkultur & Musik e. V. Ask before reusing them.
