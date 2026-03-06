---
name: md-session-scope-lock
description: Confirm and lock mobile, desktop, and git execution context per session before mutable, build, packaging, or release actions. Capture release identity, validate lock freshness, and block unsafe operations when lock is missing or stale.
---

# MD Session Scope Lock

Use this skill before any mutable, build, packaging, or release action.

## Required flow
1. Collect context using `scripts/capture-context.(ps1|sh)`.
2. Ask explicit confirmation for mobile release context:
   - expo account
   - expo project id
   - eas profile
   - ios bundle id
   - android application id
3. Ask explicit confirmation for desktop release context:
   - electron app id
   - release channel
   - target os
   - signing identity hint
4. Ask explicit confirmation for git context:
   - repo path
   - branch
   - remote
   - user.name
   - user.email
5. Write lock state to `.codex-utils/session-lock/session-lock.json` using `assets/session-lock.schema.json`.
6. Revalidate lock before execution with `scripts/validate-lock.(ps1|sh)`.

## Lock lifecycle
- Keep lock valid for the current session only.
- Reconfirm only on target change, expiration, or doubt.
- Block execution when lock is absent, stale, or incomplete.

## Hard guardrails
- Never release to unconfirmed Expo, EAS, Electron, signing, or git targets.
- Never continue when identity fields are unknown.

