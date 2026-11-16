# Prime Ecommerce Store India: Sales Dashboard

Responsive React dashboard with four filter cards and a sortable transaction table.
Project reference: Prime Ecommerce Store India, Job ID xg2JlZp1vCL9WVzo1svW.

## Setup

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev       # development server
npm run build     # production build into dist/
npm run preview   # serve dist/ locally
npm test          # unit tests for filtering, sorting and fixture consistency
```

Both `/mock/summary.json` and `/mock/transactions.json` are static files in
`public/mock/`, served by the dev server and copied into `dist/`.
No server, secrets or external services are needed.

> `scripts/make-fixtures.mjs` generated the stand-in fixtures in `public/mock/`
> (24 transactions, 1-8 Nov 2026). Replace them with the supplied files unchanged.
> The app reads every metric from `summary.json`, never from the rows.

## Component structure

```
src/
  main.jsx                      entry point
  App.jsx                       owns data loading, filter and sort state
  App.module.css                12-column grid, page frame, states
  api.js                        fetchSummary / fetchTransactions (honours Vite base)
  index.css                     design tokens as CSS custom properties, focus style
  components/
    MetricCard.jsx(+.module.css)        accessible button card, aria-pressed
    TransactionTable.jsx(+.module.css)  native table, sortable headers, empty state
  utils/
    transactions.js             filterTransactions, sortTransactions
    format.js                   INR and UTC date formatting
tests/transactions.test.js
```

Key behaviour:
- Filter state (`all | paid | pending | failed`) lives in `App` and is shared by the
  cards and the labelled Status select, so they always match.
- Sort state `{ key, direction }` is separate, so changing a filter keeps the sort.
  Default is Date/time descending.
- Sorting compares raw `amountMinor` and `Date.parse(createdAt)`. Ties break on `id`
  in the same direction as the sort.
- Sorted headers expose `aria-sort`. The sort controls are buttons inside the `th`.
- Metrics always show full-dataset values from `summary.json`.
- Loading shows a status message. A fetch failure shows an alert with Retry and never
  renders zero metrics. An empty result shows a message explaining how to recover.
- Dates use `timeZone: "UTC"`. Amounts are paise divided by 100, formatted as `en-IN` INR.
- Layout: 12-column grid, cards span 3 / 6 / 12 columns at >=1024 / 640-1023 / <640 px.
  The table spans all 12 and scrolls horizontally inside its own container.

## Verification notes

Automated (done): `npm test` passes (summary matches rows, unique IDs, filters,
newest-first default with id tie-break, raw amount sort in both directions).
`npm run build` succeeds, and `vite preview` serves `/`, `/mock/summary.json` and
`/mock/transactions.json` with HTTP 200.

Manual checks to record before submitting (fill in your results):
- [ ] 1440, 768 and 390 px: card columns 4 / 2 / 1, no page-level horizontal scroll
- [ ] Each card and the select produce all / paid / pending / failed and stay in sync
- [ ] Sort Amount and Date/time both ways; change filter while sorted, sort is kept
- [ ] Visible count updates ("Showing N of 24 transactions")
- [ ] Tab through cards, select and sort buttons; focus ring is visible
- [ ] DevTools: block `/mock/transactions.json`, see error and Retry, unblock, then Retry
- [ ] Temporary copy of transactions.json with `{"transactions": []}`: empty message
      appears; restore the source file afterwards
- [ ] Screenshots saved in `screenshots/`

## Deployment

Build with `npm run build` and publish `dist/` to static hosting (Netlify, Vercel,
GitHub Pages). Hosted at the domain root (`base: "/"`). Under a subpath, set `base`
in `vite.config.js` and retest both `/mock` endpoints.

Live demo: _add URL_ | Repository: _add URL_
