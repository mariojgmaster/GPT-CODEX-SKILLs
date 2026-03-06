# AGENTS.md instructions for c:\Projects\_Personal\Study\GPT_Skills

<INSTRUCTIONS>
## Skills
A skill is a set of local instructions stored in a `SKILL.md` file.

### Available skills
- sf-router-core-mandatory: Mandatory first-hop router for any request in this repository. (file: skills/sf-router-core-mandatory/SKILL.md)
- sf-session-scope-lock: Confirms and locks Salesforce/Git execution context per session before mutable or external actions. (file: skills/sf-session-scope-lock/SKILL.md)
- sf-general-analysis-planning: Handles non-mutating analysis, estimation, investigation, and planning tasks. (file: skills/sf-general-analysis-planning/SKILL.md)
- sf-discovery-impact-map: Maps technical scope and impacted artifacts before implementation. (file: skills/sf-discovery-impact-map/SKILL.md)
- sf-apex-standard-scaffold: Implements Apex changes with fixed scaffold and quality/security guardrails. (file: skills/sf-apex-standard-scaffold/SKILL.md)
- sf-lwc-slds-first: Implements Salesforce frontend tasks with SLDS-first and performance guidance. (file: skills/sf-lwc-slds-first/SKILL.md)
- sf-aura-legacy-maintenance: Maintains Aura artifacts in legacy mode with minimal-risk changes. (file: skills/sf-aura-legacy-maintenance/SKILL.md)
- sf-flow-metadata-scope: Implements Flow and metadata changes with strict scope control. (file: skills/sf-flow-metadata-scope/SKILL.md)
- sf-integration-serviceagent: Implements integration changes with named credentials and secure error handling. (file: skills/sf-integration-serviceagent/SKILL.md)
- sf-refactor-governance: Governs refactors with explicit legacy-vs-modern alignment and risk control. (file: skills/sf-refactor-governance/SKILL.md)
- sf-validation-dryrun-targeted: Runs scoped dry-run and targeted tests only. (file: skills/sf-validation-dryrun-targeted/SKILL.md)
- sf-git-safe-delivery: Governs safe git actions under explicit branch/user/remote confirmation. (file: skills/sf-git-safe-delivery/SKILL.md)
- salesforce-projects: Legacy compatibility skill that forwards to router flow. (file: skills/salesforce-projects/SKILL.md)
- sf-project-analysis-guardrails: Legacy compatibility skill that forwards to router flow. (file: skills/sf-project-analysis-guardrails/SKILL.md)

### Mandatory routing rules
1) Always invoke `sf-router-core-mandatory` first for every request, regardless of domain.
2) Let router select one primary skill and at most one secondary skill.
3) If action is mutable or external, invoke `sf-session-scope-lock` before execution.
4) If confidence is low or intent/target is ambiguous, ask the developer before executing.
5) If request includes validation/deploy, invoke `sf-validation-dryrun-targeted`.
6) If request includes git operations, invoke `sf-git-safe-delivery`.

### Security and scope rules
- Never deploy to an environment that was not explicitly confirmed in the current session lock.
- Never operate on branches/remotes/users that were not explicitly confirmed in session lock.
- Never edit artifacts outside the validated implementation scope.
- Never run project-wide tests by default; run targeted validation only.
- Never create helper artifacts outside `.codex-utils`.
- For recurring artifacts in `.codex-utils`, add explicit whitelist entries in `.gitignore` before versioning.

### How to use skills
- Discovery: Skill metadata is loaded first; body and references are loaded on demand.
- Progressive disclosure: Load only files needed for the current task.
- Coordination: Keep context minimal and route precisely to reduce token usage.
- Fallback: If a skill is missing or blocked, state the issue and use best fallback safely.
</INSTRUCTIONS>
