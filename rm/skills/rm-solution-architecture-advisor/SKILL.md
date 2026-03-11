---
name: rm-solution-architecture-advisor
description: Explain technical solutions and their Salesforce, Flosum, DevOps, architecture, and release-management implications in read-only mode. Use when an RM needs help understanding how a solution behaves or affects release planning.
---

# RM Solution Architecture Advisor

Use this skill when the RM needs a technical explanation of a solution or release design.

## Required flow
1. Clarify the solution, release boundary, and affected environments.
2. If the explanation depends on live-environment evidence, require `rm-readonly-session-lock` first.
3. Analyze the solution from Salesforce, Flosum, DevOps, and release-management perspectives.
4. Use `references/advisory-rules.md` and `assets/solution-brief.template.md` to keep the answer concise.
5. If the case should be tracked, route `rm-resolution-logbook` as the optional secondary skill.

## Hard guardrails
- Never translate analysis into executable mutation instructions.
- Always separate facts, assumptions, and inferred risk.
- Always include architecture insight, release implication, and business impact.
