---
name: rm-readonly-session-lock
description: Confirm and lock read-only environment, Flosum, and Git context before any remote inspection, validate, or external RM analysis. Use when the request touches one or more environments, read-only checks, or release evidence gathered outside the repository.
---

# RM Readonly Session Lock

Use this skill before any remote read-only inspection, validate/check, or multi-environment analysis.

## Required flow
1. Collect available context using `scripts/capture-context.(ps1|sh)`.
2. Confirm each environment with:
   - role label
   - org name
   - org id
   - instance URL
   - acting username/email
3. Confirm Flosum context when relevant:
   - org or tenant label
   - branch or baseline
   - package or release reference
4. Confirm Git context when local release artifacts are part of the evidence.
5. Write the lock state to `.codex-utils/session-lock/session-lock.json` using `assets/session-lock.schema.json`.
6. Revalidate the lock with `scripts/validate-lock.(ps1|sh)` before execution.

## Lock lifecycle
- Keep `access_mode` fixed as `read_only`.
- Reconfirm the lock when the target environment changes, a second environment is introduced, or the lock expires.
- Treat missing identity fields as a hard stop.

## Hard guardrails
- Never reinterpret a read-only lock as permission to mutate.
- Never continue when any environment is unlabeled or incomplete.
- Never allow validate/check execution without explicit target confirmation.
