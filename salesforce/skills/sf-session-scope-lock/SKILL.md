---
name: sf-session-scope-lock
description: Confirm and lock Salesforce and Git execution context per session before mutable or external actions. Capture org and git identity, validate lock freshness, and block unsafe operations when lock is missing or stale.
---

# SF Session Scope Lock

Use this skill before any mutable or external action.

## Required flow
1. Collect context using `scripts/capture-context.(ps1|sh)`.
2. Ask explicit confirmation for Salesforce context:
   - org name
   - org id
   - instance url
   - username/email
3. Ask explicit confirmation for Git context:
   - repo path
   - branch
   - remote
   - user.name
   - user.email
4. Write lock state to `.codex-utils/session-lock/session-lock.json` using schema in `assets/session-lock.schema.json`.
5. Revalidate lock before execution with `scripts/validate-lock.(ps1|sh)`.

## Lock lifecycle
- Keep lock valid for the current session only.
- Reconfirm only on target change, expiration, or doubt.
- Block execution when lock is absent, stale, or incomplete.

## Hard guardrails
- Never deploy to unconfirmed org.
- Never commit/push to unconfirmed branch/remote/user.
- Never continue when identity fields are unknown.

