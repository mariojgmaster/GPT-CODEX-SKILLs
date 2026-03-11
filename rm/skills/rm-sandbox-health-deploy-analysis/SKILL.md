---
name: rm-sandbox-health-deploy-analysis
description: Analyze Salesforce sandbox and org health, validate failures, deploy errors, Flosum release evidence, and DevOps signals without mutating the analyzed environment. Use for read-only diagnostics and release triage.
---

# RM Sandbox Health Deploy Analysis

Use this skill for org health analysis, validate failures, deploy errors, and Flosum release diagnostics.

## Required flow
1. Gather evidence using `references/evidence-intake.md`.
2. If the case references live environments, confirms multiple orgs, or requires read-only checks, require `rm-readonly-session-lock` first.
3. Analyze errors using `references/deploy-error-triage.md` and `references/flosum-release-analysis.md`.
4. Separate facts, inference, and missing evidence.
5. Produce output with `assets/analysis-report.template.md`.
6. If the case should be recorded, route `rm-resolution-logbook` as the optional secondary skill.

## Hard guardrails
- Never execute mutating deployment actions.
- Never treat validate success as release approval by itself.
- Never compare multiple environments without explicit labels.
- Never state a root cause as certain when evidence is partial.
