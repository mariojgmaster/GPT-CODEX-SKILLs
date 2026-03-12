---
name: rm-resolution-logbook
description: Create and update per-case RM logs in `.rm-logs/` with incremental summaries, statuses, and explicit RM confirmation. Use when an RM case should be recorded during analysis or marked as solved.
---

# RM Resolution Logbook

Use this skill when an RM case should be recorded or consolidated.

## Required flow
1. Confirm the session is explicitly acting as `RM (DevOps)` under the router rules.
2. Derive a short case title from the active issue.
3. Create or update `.rm-logs/YYYYMMDD - titulo-curto.md` with `scripts/upsert-rm-log.(ps1|sh)`.
4. At the end of analysis, append a summary with status `em_analise` or `solucao_proposta`.
5. Only when the RM explicitly confirms resolution, append another entry with status `solucionado_confirmado`.
6. Use `assets/log-entry.template.md` and `references/logging-rules.md`.

## Hard guardrails
- Never log secrets, tokens, or raw credentials.
- Never mark a case as solved without explicit RM confirmation.
- Keep one file per case and append incrementally instead of creating duplicates.
- Never write outside `.rm-logs/` when logging a case.
- Never alter any analyzed project artifact while recording a case.
