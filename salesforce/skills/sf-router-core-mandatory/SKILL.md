---
name: sf-router-core-mandatory
description: Mandatory first-hop router for any request in this repository. Classify intent, enforce context lock for mutable/external actions, select the minimum skill set, and block low-confidence execution until clarified.
---

# SF Router Core Mandatory

Use this skill first for every request.

## Required flow
1. Classify request intent and domain using `references/routing-matrix.md`.
2. Determine if action is non-mutating, mutating, or external.
3. If mutating or external, invoke `sf-session-scope-lock` before any execution.
4. Select one primary skill and at most one secondary skill.
5. If confidence is below 0.80, stop and ask a concise clarification question.
6. Produce routing output using `assets/router-output.template.md`.
7. Persist route decision format from `assets/route-decision.schema.json`.

## Hard guardrails
- Never skip session lock for mutable or external operations.
- Never allow broad validation by default; enforce scoped validation.
- Never allow helper artifacts outside `.codex-utils`.
- Always include scope, risks, assumptions, validation plan, and business impact.

## Token optimization policy
- Keep this skill minimal and route quickly.
- Load only one specialist skill unless dependency requires a second.
- Avoid loading unrelated references.

