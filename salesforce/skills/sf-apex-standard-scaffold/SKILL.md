---
name: sf-apex-standard-scaffold
description: Implement Apex changes using a fixed scaffold and quality guardrails, preserving controller-service-test structure, reusable service-agent patterns, secure code, and targeted validation only.
---

# SF Apex Standard Scaffold

Use this skill for Apex implementation.

## Required flow
1. Confirm scope and impacted Apex artifacts.
2. Follow `references/apex-rules.md`.
3. Reuse templates from `assets/` when creating controller, service, test, or service-agent artifacts.
4. Keep changes minimal and in-scope.
5. Route validation to `sf-validation-dryrun-targeted`.

## Hard rules
- Keep architecture stable.
- Avoid SOQL/DML in loops.
- Keep naming explicit and maintainable.
- Do not hardcode secrets or IDs.
