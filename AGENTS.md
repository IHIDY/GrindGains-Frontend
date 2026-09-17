# GrindGains Frontend

Read `_docs/plan.md` first — it points to the shared product/technical spec in the
`GrindGains-Backend` repo (`_docs/plan.md` there). Don't recreate a copy of the API
docs in this repo; that already drifted out of date once (see the backend spec's
"Resolved drift" section) and got deleted.

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — oxlint

## Rules

- `mode` (isotonic vs mobeta) is inferred client-side from a movement's most recent
  entry, not stored as its own backend field — see the shared spec, §3 and §7.
