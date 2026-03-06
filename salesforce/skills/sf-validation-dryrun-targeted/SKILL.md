---
name: sf-validation-dryrun-targeted
description: Enforce targeted validation and dry-run execution for requested scope only, blocking broad project-wide tests or deploy checks unless explicitly approved.
---

# SF Validation Dryrun Targeted

Use this skill for validation and dry-run operations.

## Required flow
1. Confirm exact validation scope (tests/classes/metadata paths).
2. Confirm explicit target org for every command.
3. Reject broad validation by default.
4. Run targeted commands via `scripts/run-targeted-tests.(ps1|sh)` or `scripts/run-dryrun-deploy.(ps1|sh)`.
5. Report command, org, scope, and result.

## Hard rules
- Require session lock before mutable or external validation.
- Never run full test suite without explicit approval.
- Keep artifacts in `.codex-utils` only.
