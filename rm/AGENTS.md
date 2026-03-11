# AGENTS.md instructions for c:\Projects\_Personal\Study\GPT_Skills\rm

<INSTRUCTIONS>
## Skills
A skill is a set of local instructions stored in a `SKILL.md` file.

### Available skills
- rm-router-core-mandatory: Mandatory first-hop router for any request in this workspace. (file: skills/rm-router-core-mandatory/SKILL.md)
- rm-readonly-session-lock: Confirms and locks read-only environment, Flosum, and Git context before any remote inspection, validate, or external analysis. (file: skills/rm-readonly-session-lock/SKILL.md)
- rm-sandbox-health-deploy-analysis: Analyzes org health, validation failures, deploy errors, and Flosum release evidence without mutating environments. (file: skills/rm-sandbox-health-deploy-analysis/SKILL.md)
- rm-manual-step-classifier: Classifies manual steps as deployable, non-deployable, or inconclusive with explicit evidence gaps. (file: skills/rm-manual-step-classifier/SKILL.md)
- rm-solution-architecture-advisor: Explains technical solutions and their Salesforce, Flosum, DevOps, and release-management implications. (file: skills/rm-solution-architecture-advisor/SKILL.md)
- rm-resolution-logbook: Creates and updates per-case RM logs in `.rm-logs/` with incremental status tracking. (file: skills/rm-resolution-logbook/SKILL.md)

### Mandatory routing rules
1) Always invoke `rm-router-core-mandatory` first for every request.
2) Let router select one primary skill and at most one secondary skill.
3) If request needs remote read-only evidence, validate/check execution, or multi-environment analysis, invoke `rm-readonly-session-lock` first.
4) If confidence is low, environments are ambiguous, or evidence is incomplete, ask the RM before continuing.
5) If request asks for any mutation, refuse clearly and continue only with read-only analysis alternatives.
6) If case should be recorded, use `rm-resolution-logbook` as the optional secondary skill.

### Security and scope rules
- Never deploy, quick deploy, promote, push, update, delete, or mutate any analyzed environment.
- Never provide executable mutation instructions for the analyzed environment, even when explicitly requested.
- Never continue when an environment is missing name, URL, Id, or acting user.
- Never assume environment mapping when more than one org/sandbox is involved.
- Never store helper artifacts outside `.codex-utils`.
- Never store RM case logs outside `.rm-logs/`.
- Never mark a case as `solucionado_confirmado` without explicit RM confirmation.

### How to use skills
- Discovery: Skill metadata is loaded first; body and references are loaded on demand.
- Progressive disclosure: Load only the references needed for the current route.
- Coordination: Keep context minimal, prefer one primary skill, and use `rm-resolution-logbook` only when the case should be recorded.
- Fallback: If a skill is blocked, state the issue and continue with the safest read-only alternative.
</INSTRUCTIONS>
