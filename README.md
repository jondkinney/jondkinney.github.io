# Jon Kinney’s website

A personal site about open-source software, technical leadership at Headway, Fulcrum, and speaking. Built with React and vinext, with Sites hosting support.

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

The comparison controls only appear with `review=1`. The close control hides them while retaining the chosen arrangement. Without a query, the site uses the builder arrangement. Comparison URLs request no indexing.

## Edit content

- `app/home.tsx`: project records, links, copy, page sections, and the three arrangements.
- `app/globals.css`: palette, layout, breakpoints, and reduced-motion support.
- `app/layout.tsx`: site metadata and Person structured data.
- `public/images/`: Jon’s published Headway photo and existing product assets.
- `public/jon-kinney-speaker-bio.txt`: downloadable bio; keep in sync with `speakerBio` in `app/home.tsx`.

Contact currently routes to the published LinkedIn profile, with consulting inquiries going to Headway’s consultation page. Set `speakingLink` when a preferred public email is supplied. Fulcrum links to the existing early-access page; this site does not create subscriptions itself.

Existing writing and podcast episodes link to Headway. There are no invented posts or empty blog routes. Future writing can be added here when there is content to publish.

## Validation

```sh
npm run typecheck
npm run build
```

No database or external service is required for the site. The project filter, featured-project controls, Fulcrum tabs, mobile navigation, and copyable speaker bio run in the browser.
