# GrindGains — Frontend

GrindGains is an invite-only personal training tracker. It logs two kinds of work:

- **Isotonic** movements: sets × reps with a load (e.g. bench press, push-ups)
- **Mobeta** movements: timed isometric holds with optional added weight (e.g. planks, gripper holds)

Each movement keeps its own history, with trend charts so you can see volume and intensity change over time. There is no coach, feed, or programmed routine — it is a training diary.

**Live app:** https://grindgains.junfa-li.me/ (sign-up requires an invite code)

This repository is the React single-page app. The API, database and auth live in [GrindGains-Backend](https://github.com/IHIDY/GrindGains-Backend).

## Features

- Sign up with email, password, a unique username and a one-time **invite code**, then confirm the email with a verification code (resend supported)
- Log in / log out; sessions persist and ID tokens are refreshed automatically
- **Workout list**: one card per movement you have logged, plus a "New Workout" form (movement name + mode)
- **Movement detail**: training log and trend charts (daily volume and average weight for isotonic movements)
- **Log a set** (reps, weight, optional RPE 1–10) or **log a hold** (optional added weight, then the time held, typed in seconds)
- **Edit a logged set** inline (reps, weight, RPE)

## Architecture

```
Browser (React SPA, S3 + CloudFront)
   │  Cognito sign-up / sign-in  ──────────►  Amazon Cognito User Pool
   │                                              (invite-code gate, ID tokens)
   │  fetch + "Authorization: Bearer <ID token>"
   ▼
AWS Lambda behind a Function URL  ──────────►  DynamoDB (single table)
        (GrindGains-Backend)
```

- The app talks to Cognito directly (`src/auth/cognito.ts`) and sends the resulting **ID token** on every API call. The Lambda verifies the token itself; there is no API Gateway.
- All backend communication is centralised in `src/api/` (`client.ts` for HTTP, `hooks.ts` for React state, `types.ts` for shared types), so pages never call `fetch` directly.
- The backend has no "workout" or "session" concept — a *workout* in the UI is one movement, and its history comes from that movement's flat log entries. A movement's mode (isotonic or mobeta) is inferred from its most recent entry.

The API contract, data model and error table live in the backend repository's `docs/api.md`; the product and technical spec is in `GrindGains-Backend/_docs/plan.md`. They are deliberately not copied here so there is a single source of truth.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Recharts · `amazon-cognito-identity-js` · Vitest · Oxlint

## Project structure

```
src/
  api/          HTTP client, React hooks for data fetching, shared types
  auth/         Cognito wrapper, AuthContext, RequireAuth route guard
  pages/        Route-level screens (login, signup, workout list/detail, new entry)
  components/   charts/, forms/, layout/, workouts/ building blocks
  lib/          Formatting and grouping helpers
Designs/        Hi-fi mockups and colour palette
_docs/          Pointers to the shared spec and process (see below)
scripts/        Manual deploy script
```

Routes: `/login`, `/signup`, `/workouts`, `/workouts/:id`, `/workouts/:id/log` (everything except login and signup requires authentication).

## Getting started

Requirements: **Node.js 22** (what CI uses) and npm, plus a deployed backend (or access to the existing one). Older setups such as Node 20.14 with npm 10.7 can fail `npm ci` with "Cannot find native binding" because of an npm bug with optional dependencies; use Node 22.

```bash
git clone https://github.com/IHIDY/GrindGains-Frontend.git
cd GrindGains-Frontend
npm ci
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Environment variables (Vite only exposes names starting with `VITE_`):

| Variable | What it is |
|---|---|
| `VITE_API_BASE_URL` | Backend Lambda Function URL (`FunctionUrl` stack output) |
| `VITE_COGNITO_USER_POOL_ID` | Cognito User Pool id (`UserPoolId` stack output) |
| `VITE_COGNITO_CLIENT_ID` | Cognito app client id (`UserPoolClientId` stack output) |
| `VITE_COGNITO_REGION` | AWS region of the user pool |

`.env.local` is git-ignored. To create an account you need an invite code; the backend repository's `docs/deploy.md` explains how to mint them.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run the unit tests once (Vitest) |
| `npm run lint` | Lint with Oxlint |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |

Tests cover the formatting helpers (`src/lib/format.ts`), the API client (`src/api/client.ts`) with `fetch` mocked, and the set/hold entry forms and the training log table (rendered with jsdom and React Testing Library, with the data hooks mocked), so they need no network or backend.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`:

1. `npm ci`, then a TypeScript type-check
2. `npm test` — a failing test stops the deploy before anything is built or uploaded
3. `npm run build` with the `VITE_*` values injected from repository secrets
4. Assume an AWS IAM role through GitHub's **OIDC** (no long-lived AWS keys are stored)
5. `aws s3 sync` the build to the hosting bucket, then invalidate the CloudFront cache

Required repository secrets: `VITE_API_BASE_URL`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_REGION`. The workflow can also be started by hand (`workflow_dispatch`), and `scripts/deploy.sh` does the same build-and-sync from a machine with AWS credentials (it does not run the tests, so run `npm test` first).

### Continuous integration

`.github/workflows/ci.yml` runs the TypeScript type-check and `npm test` (Node 22) on every pull request to `main` and on every push to `main`. It has no AWS access and uses no secrets. A red check means a test or the type-check failed; do not merge until it is green.

## How this was built

The project was built with AI coding agents (Claude Code), working from a written spec rather than ad-hoc prompts:

- `GrindGains-Backend/_docs/plan.md` is the shared product and technical spec
- `AGENTS.md` / `CLAUDE.md` give a fresh agent session the commands, rules and pointers it needs
- Every change goes through issue → branch → pull request → squash merge, so each feature is traceable and can be reverted as a single commit (`GrindGains-Backend/_docs/process.md`)
