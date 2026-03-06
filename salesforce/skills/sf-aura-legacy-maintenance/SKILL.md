---
name: sf-aura-legacy-maintenance
description: Maintain legacy Aura components with minimal-risk updates, strict scope control, and no architecture migration unless explicitly requested by the developer.
---

# SF Aura Legacy Maintenance

Use this skill only for Aura legacy work.

## Required flow
1. Confirm artifact-level scope and legacy constraints.
2. Read `references/aura-rules.md`.
3. Apply minimal-risk updates in existing structure.
4. Do not migrate to LWC unless explicitly requested.
5. Route validation to `sf-validation-dryrun-targeted`.

## Hard rules
- Keep handlers and helpers explicit.
- Avoid broad rewrites.
- Preserve behavior unless approved change demands it.

