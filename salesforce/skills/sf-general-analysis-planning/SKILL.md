---
name: sf-general-analysis-planning
description: Handle non-mutating requests such as search, analysis, estimation, and planning across this repository with strict scope mapping, explicit assumptions, and concise high-signal output.
---

# SF General Analysis Planning

Use this skill for non-mutating requests.

## Required flow
1. Clarify objective and scope boundaries.
2. Gather facts from repository and runtime context.
3. Separate facts, assumptions, and risks.
4. Produce a concise plan or estimate using `assets/analysis-output.template.md`.
5. Include architecture and business impact in every technical output.

## Guardrails
- Do not mutate files.
- Do not assume missing data when it materially changes recommendation.
- Ask one concise question if critical ambiguity remains.

