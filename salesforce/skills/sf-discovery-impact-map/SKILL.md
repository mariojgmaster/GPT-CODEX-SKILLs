---
name: sf-discovery-impact-map
description: Map technical scope and impact before implementation by identifying affected artifacts, dependencies, validation targets, and regression risks while enforcing strict in-scope boundaries.
---

# SF Discovery Impact Map

Use this skill before implementation when impact is uncertain.

## Required flow
1. Read `references/discovery-checklist.md`.
2. Map impacted artifacts only for requested scope.
3. Identify dependency edges and regression risk.
4. Define targeted validation set.
5. Output using `assets/impact-map.template.md`.

## Guardrails
- Never expand scope without explicit approval.
- Never propose broad validation by default.
- Always name affected artifacts and unaffected boundaries.

