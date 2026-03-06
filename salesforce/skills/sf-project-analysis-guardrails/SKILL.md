---
name: sf-project-analysis-guardrails
description: Legacy compatibility alias for project analysis requests. Use when older prompts call this skill name, then route immediately through sf-router-core-mandatory and continue with the selected specialist workflow.
---

# SF Project Analysis Guardrails (Compatibility)

Use this skill only as compatibility shim.

## Required flow
1. Invoke `sf-router-core-mandatory` first.
2. Follow the routed primary skill and optional secondary.
3. If mutable or external action exists, invoke `sf-session-scope-lock`.
4. Keep validations scoped via `sf-validation-dryrun-targeted`.

## Compatibility note
- Keep this skill thin for token efficiency.
- Keep legacy references as optional artifacts only.
