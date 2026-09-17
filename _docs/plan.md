# GrindGains — Product & Technical Spec

The shared product/technical spec for GrindGains (both repos) lives in
`GrindGains-Backend/_docs/plan.md`, not here — keeping one copy avoids the exact kind
of drift that used to exist between this repo's old `README backend.md` and the
backend's real `README.md` (now deleted; see that spec's "Resolved drift" section).

Read `GrindGains-Backend/_docs/plan.md` for: product vision, user model, core concepts
(Movement/Mode/Entry), feature scope, data model, API contract, and open questions.

Frontend-specific notes that don't belong in the shared spec:

- Routes: `/login`, `/signup`, `/workouts`, `/workouts/:id`, `/workouts/:id/log` (all
  but login/signup gated by `RequireAuth`).
- Stack: React 19 + Vite + TypeScript + Tailwind v4 + Recharts, Cognito auth via
  `amazon-cognito-identity-js`.
- Design references: `Designs/hifi/*.dc.html` mockups, `Designs/colors/`.
