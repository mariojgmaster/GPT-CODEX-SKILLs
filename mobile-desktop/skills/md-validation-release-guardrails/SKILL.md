---
name: md-validation-release-guardrails
description: Enforce targeted validation, build checks, and release guardrails for Expo, React Native, and Electron scope only, blocking broad validation or implicit publish flows by default.
---

# MD Validation Release Guardrails

Use this skill for validation, build checks, packaging, and release guardrails.

## Required flow
1. Confirm exact validation scope and explicit target.
2. Confirm package manager using `scripts/detect-package-manager.(ps1|sh)`.
3. Reject broad validation by default.
4. Run only targeted commands via the scripts in `scripts/`.
5. Report command, target, scope, and result.

## Hard rules
- Require session lock before build, package, or release actions.
- Never publish implicitly.
- Never run project-wide tests or typecheck by default.
- Keep helper outputs under `.codex-utils`.

