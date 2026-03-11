---
name: rm-router-core-mandatory
description: Mandatory first-hop router for RM requests in this workspace. Classify read-only release-management intent, refuse any environment or project mutation, require explicit environment mapping for remote analysis, and select the minimum specialist skill set.
---

# RM Router Core Mandatory

Use this skill first for every RM request.

## Required flow
1. Classify request intent using `references/routing-matrix.md`.
2. Determine whether the request is local analysis only, remote read-only evidence gathering, or explicit documentation generation.
3. If the user asks for deploy, promote, quick deploy, update, delete, push, project edits, or any other mutation, refuse immediately and offer only read-only analysis alternatives.
4. If remote inspection, validate/check execution, or multi-environment analysis is required, invoke `rm-readonly-session-lock` before any execution.
5. If the user explicitly requests documentation, route to `rm-documentation-docx-pdf`.
6. Select one primary skill and at most one secondary skill. Use `rm-resolution-logbook` as the secondary skill only when the case should be recorded.
7. If confidence is below 0.80, environments are ambiguous, or evidence is incomplete, ask one concise clarification question.
8. Produce routing output with `assets/router-output.template.md`.
9. Persist the route decision shape defined by `assets/route-decision.schema.json`.

## Hard guardrails
- Never route to a mutating action.
- Never relax the read-only rule, even when the RM asks explicitly.
- Never allow writes to the analyzed project or repository content.
- Never assume environment identity when name, URL, Id, or acting user is missing.
- Never treat `validate` or health checks as permission to deploy.
- Only allow write scope `rm_internal_only` or `documentation_output_only`.
- Always include scope, evidence reviewed, risks, assumptions, and next safe actions.

## Token policy
- Keep this skill minimal and route quickly.
- Load only one specialist skill unless `rm-resolution-logbook` is needed.
- Avoid loading references unrelated to the active route.
