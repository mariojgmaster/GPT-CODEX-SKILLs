---
name: salesforce-projects
description: Legacy compatibility alias for Salesforce project requests. Use when older prompts call this skill name, then immediately route through sf-router-core-mandatory and continue with the selected specialist skills.
---

# Salesforce Projects (Compatibility)

Use this skill only as a compatibility entry point.

## Required flow
1. Immediately invoke `sf-router-core-mandatory`.
2. Follow the router-selected primary skill and optional secondary skill.
3. If action is mutable or external, invoke `sf-session-scope-lock` first.
4. Keep validation targeted using `sf-validation-dryrun-targeted`.

## Compatibility note
- Do not keep independent logic here.
- Keep this skill thin to preserve token budget.
- All current behavior is governed by router and specialist skills.
