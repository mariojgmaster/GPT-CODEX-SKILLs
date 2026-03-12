---
name: rm-manual-step-classifier
description: Classify release manual steps as deployable, non-deployable, or inconclusive using Salesforce, Flosum, and DevOps evidence. Use when an RM needs to know whether a release action belongs in deployment automation or must remain manual.
---

# RM Manual Step Classifier

Use this skill to classify release manual steps.

## Required flow
1. Confirm the session is explicitly acting as `RM (DevOps)` under the router rules.
2. Capture the exact manual step text, release context, and target environments.
3. Apply `references/manual-step-rules.md`.
4. Classify each step as `deployavel`, `nao_deployavel`, or `inconclusivo`.
5. Explain the evidence, missing proof, and release risk using `assets/manual-step-assessment.template.md`.
6. If the case should be tracked, route `rm-resolution-logbook` as the optional secondary skill.

## Hard guardrails
- Never mark a step as deployable without evidence that it can be automated safely.
- Never modify project files while classifying the step.
- Never alter any artifact, including comments, debugs, annotations, markers, signatures, or returns.
- Treat data fixes, secret handling, user interaction, approvals, and one-off admin actions as non-deployable unless proven otherwise.
- Keep the answer focused on classification and release impact, not execution.
