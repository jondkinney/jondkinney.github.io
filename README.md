# Jon Kinney’s website

A personal site about open-source software, technical leadership at Headway, Fulcrum, and speaking. Built with React and vinext, exported to static files for GitHub Pages. The original Sites preview remains supported.

## Production hosting

- Website: https://jonkinney.com/
- DNS and domain management: [Name.com](https://www.name.com/account/login).
- Source: the `main` branch of [jondkinney/jondkinney.github.io](https://github.com/jondkinney/jondkinney.github.io).
- Deployment: `.github/workflows/pages.yml` builds and publishes on pushes to `main`.
- HTTPS: managed by GitHub Pages, with HTTP redirected to HTTPS once the domain certificate is issued and enforcement is enabled.

The `master` and `source` branches retain the previous website and its Octopress source. Each deployment restores the old published files from commit `07343920dc815a0a236200e328149751b85c90d7`, so existing blog posts and presentation URLs keep working. The new homepage and its assets take precedence. Historical pages receive HTTPS internal links and an upgrade policy for embedded HTTP resources.

Name.com should have four apex `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. The `www` CNAME points to `jondkinney.github.io`. GitHub Pages uses `jonkinney.com` as the custom domain and redirects `www` to it. See [GitHub’s custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Run locally

```sh
npm install
npm run dev
```

## Review the homepage arrangements

The same content and Nord-inspired design can be viewed with three different introductions and section orders:

- `/?focus=work&review=1`: The builder. Open source leads; Fulcrum connects the dots.
- `/?focus=teams&review=1`: The CTO. Technical leadership and Headway lead.
- `/?focus=fulcrum&review=1`: Fulcrum. The product leads, with Jon’s work providing context.

The comparison controls only appear with `review=1`. The close control hides them while retaining the chosen arrangement. Without a query, the site uses the builder arrangement. Optional arrangements and their no-index metadata are applied after hydration; the static HTML renders the builder and uses the production homepage as its canonical URL.

## Edit content

- `app/home.tsx`: project records, links, copy, page sections, and the three arrangements.
- `app/globals.css`: palette, layout, breakpoints, and reduced-motion support.
- `app/layout.tsx`: site metadata and Person structured data.
- `design/social-card.svg`: editable 1200 × 630 social card. Run `node scripts/render-social-card.mjs` after a build to render the PNG with the site's Geist fonts; this requires `rsvg-convert` from librsvg. The committed PNG is served directly to social crawlers.
- `public/images/`: Jon’s published Headway photo and existing product assets.
- `public/jon-kinney-speaker-bio.txt`: downloadable bio; keep in sync with `speakerBio` in `app/home.tsx`.

Contact currently routes to the published LinkedIn profile, with consulting inquiries going to Headway’s consultation page. Set `speakingLink` when a preferred public email is supplied. Fulcrum links to the existing early-access page; this site does not create subscriptions itself.

Existing writing and podcast episodes link to Headway. There are no invented posts or empty blog routes. Future writing can be added here when there is content to publish.

## Validation

```sh
npm run typecheck
npm run build:pages
```

GitHub Pages publishes `dist/client/`. To include historical pages locally, run `python3 scripts/restore-legacy-site.py /path/to/original-published-site` after building. The workflow checks out that historical commit automatically.

`npm run build` still produces the Cloudflare Worker bundle used by the Sites preview, whose project is recorded in `.openai/hosting.json`.

No database or external service is required for the site. The project filter, featured-project controls, Fulcrum tabs, mobile navigation, and copyable speaker bio run in the browser.
