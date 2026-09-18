# Process

Shared with `GrindGains-Backend` — see that repo's `_docs/process.md` and
`_docs/task-template.md` for the full issue → branch → PR → merge → revert workflow.
Not duplicated here, for the same reason `plan.md` isn't: two copies of the same
process drift apart exactly like the old duplicated README did.

The short version: every feature is a GitHub issue (one per repo it touches, one
independently-shippable unit of work) → its own branch → a PR that closes it →
squash-merged into `main`. Read the issue and `_docs/plan.md` again right before
implementing, every time.
