# Routing Matrix

## Intent taxonomy
- `health`: org health, sandbox health, release readiness symptoms, read-only diagnostics.
- `deploy_triage`: validate failures, deploy errors, Flosum release errors, blocked promotions.
- `manual_steps`: classify steps as deployable, non-deployable, or inconclusive.
- `solution_analysis`: explain technical solutions and release implications.
- `documentation`: create DOCX or PDF deliverables from analyzed RM content.
- `logging`: create or update RM case logs.

## Skill routing
| intent | primary skill | optional secondary |
|---|---|---|
| health | rm-sandbox-health-deploy-analysis | rm-resolution-logbook |
| deploy_triage | rm-sandbox-health-deploy-analysis | rm-resolution-logbook |
| manual_steps | rm-manual-step-classifier | rm-resolution-logbook |
| solution_analysis | rm-solution-architecture-advisor | rm-resolution-logbook |
| documentation | rm-documentation-docx-pdf | rm-resolution-logbook |
| logging | rm-resolution-logbook | |

## Read-only routing rule
- Start every session by confirming the user is acting as `RM (DevOps)`.
- If the answer is not explicit confirmation, do not route any RM specialist skill.
- If the request needs remote inspection, run `rm-readonly-session-lock` first.
- If the request mentions more than one environment, require explicit labels such as `source`, `target`, or `reference`.
- If the request asks for any mutation, set `refusal_required=true` and keep the route in read-only analysis mode.
- Treat any request to comment, annotate, debug, mark, re-signature, or otherwise alter a project artifact as a mutation request.
- If the request explicitly asks for documentation, allow writes only for documentation output under `.codex-utils/doc-output/`.

## Confidence guide
- High confidence: one intent, one clearly labeled environment or complete local evidence.
- Medium confidence: intent is clear but evidence or environment mapping is partial.
- Low confidence: mutation request, mixed unrelated goals, or missing critical environment fields.
