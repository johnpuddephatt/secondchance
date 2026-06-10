# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the project

Frontend site for [Second Chance Headway Centre](https://secondchancewakefield.com), a Wakefield charity supporting people with brain injury. Built with Eleventy (11ty) and deployed to Netlify.

## Commands

```bash
npm start        # dev server with hot reload (same as npm run dev)
npm run build    # production build → dist/
npm run clean    # delete dist/
```

The `ELEVENTY_ENV` environment variable is set to `development` or `production` automatically by the npm scripts. Sass and JS are compiled as part of the Eleventy build via `*.11ty.js` template files.

## Architecture

### Content types

- **Pages** (`src/pages/*.njk`) — static informational pages. Front matter sets `title`, `section` (groups pages under a nav section), `order`, and optionally `image`/`image_alt`. URL is auto-generated from `title | slug | prepend_page_section(section)` (see `src/pages/pages.11tydata.json`).
- **Posts** (`src/posts/*.md`) — news items. Front matter includes `date`, `title`, `description`, and `url` (external link). Posts link out to external articles; the `.md` body is typically empty.
- **Sections** (`src/sections/*.njk`) — used for homepage section blocks.

### Layouts

`src/layouts/base.njk` wraps everything. Aliases: `base`, `post`, `page`, `section`.

The `page` layout (`src/layouts/page.njk`) renders a sidebar nav when multiple pages share the same `section` value, plus a TOC if the page has `h2` headings, and a footer "Need to talk?" CTA.

### Global data

`src/data/meta.json` holds site-wide values (title, phone, email, address, social links) available as `{{ meta.* }}` in all templates.

### Assets

- **Styles**: `src/assets/styles/styles.11ty.js` compiles `main.scss` via Sass. Structure: `utils/` → `base/` → `components/` → `layouts/`.
- **Scripts**: `src/assets/scripts/scripts.11ty.js` bundles via webpack. Entry point is `main.js`.
- **Icons**: SVG icons live in `src/assets/icons/`. They are compiled into an inline sprite at build time by `utils/iconsprite.js` and inserted into `base.njk`.
- **Uploads**: `src/uploads/` — user-uploaded images passed through as-is (with hashed filenames in dist).

### Custom Nunjucks additions (utils/)

- `filters.js` — `dateToFormat`, `dateToISO`, `obfuscate`, `markdown`, `markdownify`, `where` (filter collection by `section`), `prepend_page_section`, `prependAbbreviations`
- `shortcodes.js` — `{% icon "name", "class", w, h %}` renders an SVG `<use>` reference
- `pairedshortcodes.js` — `{% tip 'Name', '/img.jpg' %}...{% endtip %}` renders a blockquote callout; `{% dropdown title, desc, img %}...{% enddropdown %}` renders a `<details>` element
- `transforms.js` — HTML minification (production only) and critical CSS inlining

### Eleventy collections

- `collections.pages` — all `src/pages/*.njk`, sorted by `order`
- `collections.posts` — all `src/posts/*.*`, sorted newest-first by `date`
- `collections.sections` — all `src/sections/*.*`

### Image handling

Uses `eleventy-plugin-srcset`. The `{% srcset src, alt, class, w, h, sizes %}` shortcode generates responsive images. The plugin also auto-processes images inside `.page__content__inner` elements.

### Deployment

Netlify. Build command: `npm run build`. Publish dir: `dist`. Catch-all 404 redirect defined in `netlify.toml`.
