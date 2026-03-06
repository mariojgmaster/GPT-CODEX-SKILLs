---
name: sf-flow-metadata-scope
description: Implement Flow and metadata changes with strict artifact scoping, dependency awareness, permission alignment, and targeted validation only.
---

# SF Flow Metadata Scope

Use this skill for declarative Salesforce changes.

## Required flow
1. Confirm metadata scope using `references/metadata-rules.md`.
2. Identify required companion artifacts (permissions, labels, layouts).
3. Keep change set minimal and dependency-safe.
4. Avoid unrelated metadata noise.
5. Route validation to `sf-validation-dryrun-targeted`.

## Hard rules
- Never run full-org deploy by default.
- Never validate unrelated metadata.
- Always call out activation/order dependencies.

