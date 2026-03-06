---
name: sf-integration-serviceagent
description: Implement Salesforce integration changes using service-agent patterns, named credentials, secure error handling, and strict scope validation.
---

# SF Integration ServiceAgent

Use this skill for external integration tasks.

## Required flow
1. Confirm integration scope and endpoint ownership.
2. Apply rules from `references/integration-rules.md`.
3. Use `assets/serviceagent.template` as scaffold when needed.
4. Avoid credential leakage in code and logs.
5. Route validation to `sf-validation-dryrun-targeted`.

## Hard rules
- Prefer named credentials/auth providers.
- Keep errors safe and non-sensitive.
- Keep callout code isolated and testable.

