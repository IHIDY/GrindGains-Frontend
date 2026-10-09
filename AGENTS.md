# GrindGains Frontend

Read `_docs/plan.md` first — it points to the shared product/technical spec in the
`GrindGains-Backend` repo (`_docs/plan.md` there). Don't recreate a copy of the API
docs in this repo; that already drifted out of date once (see the backend spec's
"Resolved drift" section) and got deleted.

Before creating or implementing any issue, read `_docs/process.md` (points to the
shared issue → branch → PR → merge → revert workflow and issue template, both in the
backend repo).

Before writing or changing tests, read `_docs/testing-guidelines.md` in the
`GrindGains-Backend` repo (the shared testing guide; not copied here).

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm test` — unit tests (Vitest, runs once and exits)
- `npm run lint` — oxlint

## Rules

- `mode` (isotonic vs mobeta) is inferred client-side from a movement's most recent
  entry, not stored as its own backend field — see the shared spec, §3 and §7.
