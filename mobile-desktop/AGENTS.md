# AGENTS.md instructions for c:\Projects\_Personal\Study\GPT_Skills\mobile-desktop

<INSTRUCTIONS>
## Skills
A skill is a set of local instructions stored in a `SKILL.md` file.

### Available skills
- md-router-core-mandatory: Mandatory first-hop router for any request in this workspace. (file: skills/md-router-core-mandatory/SKILL.md)
- md-session-scope-lock: Confirms and locks mobile, desktop, and git execution context per session before mutable or external actions. (file: skills/md-session-scope-lock/SKILL.md)
- md-general-analysis-planning: Handles non-mutating analysis, estimation, investigation, and planning tasks. (file: skills/md-general-analysis-planning/SKILL.md)
- md-discovery-impact-map: Maps technical scope and impacted artifacts before implementation. (file: skills/md-discovery-impact-map/SKILL.md)
- md-react-native-expo-feature: Implements Expo and React Native feature work with platform-aware guidance. (file: skills/md-react-native-expo-feature/SKILL.md)
- md-electron-desktop-feature: Implements Electron desktop feature work with process boundary and packaging guidance. (file: skills/md-electron-desktop-feature/SKILL.md)
- md-validation-release-guardrails: Runs scoped validation, build checks, and release guardrails only. (file: skills/md-validation-release-guardrails/SKILL.md)
- md-git-safe-delivery: Governs safe git actions under explicit branch, remote, and identity confirmation. (file: skills/md-git-safe-delivery/SKILL.md)

### Mandatory routing rules
1) Always invoke `md-router-core-mandatory` first for every request.
2) Let router select one primary skill and at most one secondary skill.
3) If action is mutable, build-related, or external, invoke `md-session-scope-lock` before execution.
4) If confidence is low or target is ambiguous, ask the developer before executing.
5) If request includes validation, build, packaging, or release, invoke `md-validation-release-guardrails`.
6) If request includes git operations, invoke `md-git-safe-delivery`.

### Security and scope rules
- Never release to unconfirmed Expo, EAS, Electron, signing, or git targets.
- Never edit artifacts outside validated implementation scope.
- Never run project-wide validation by default; always validate only requested scope.
- Never create helper artifacts outside `.codex-utils`.
- For recurring artifacts in `.codex-utils`, add explicit whitelist entries in `.gitignore` before versioning.

### How to use skills
- Discovery: Skill metadata is loaded first; body and references are loaded on demand.
- Progressive disclosure: Load only files needed for the current task.
- Coordination: Keep context minimal and route precisely to reduce token usage.
- Fallback: If a skill is missing or blocked, state the issue and use best fallback safely.
</INSTRUCTIONS>

