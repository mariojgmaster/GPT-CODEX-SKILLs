---
name: sf-refactor-governance
description: Govern refactors with explicit scope, risk control, and mandatory alignment on legacy-preserving versus modernized structure before any non-trivial change.
---

# SF Refactor Governance

Use this skill for refactoring requests.

## Required flow
1. Read `references/refactor-rules.md`.
2. Ask explicitly: keep legacy structure or adopt modern pattern.
3. Define narrow refactor scope and rollback-safe steps.
4. Apply only approved refactor type.
5. Route validation to `sf-validation-dryrun-targeted`.

## Hard rules
- No architecture-wide refactor without explicit approval.
- No cosmetic-only refactor without measurable gain.
- Always present risk and behavior impact.

