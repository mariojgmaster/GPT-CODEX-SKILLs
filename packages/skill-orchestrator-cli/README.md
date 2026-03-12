# Skill Orchestrator CLI

`@mariojgmaster/skill-orchestrator` is a Node.js CLI for listing, installing, and validating Codex skill catalogs published from `mariojgmaster/GPT-CODEX-SKILLs`.

It is designed for workspace-first skill packs such as:
- `salesforce`
- `mobile-desktop`
- `rm`

## Installation

Install globally:

```bash
npm install -g @mariojgmaster/skill-orchestrator
```

On Windows, if global installation fails due to permissions, configure a user-level npm prefix first:

```cmd
npm.cmd config set prefix "%APPDATA%\\npm" --location=user
npm.cmd install -g @mariojgmaster/skill-orchestrator
```

The global command is:

```bash
codex-skills
```

## Core Commands

List remote catalog workspaces and skills:

```bash
codex-skills list
codex-skills list --workspace rm
```

Install a complete workspace:

```bash
codex-skills install salesforce
codex-skills install mobile-desktop
codex-skills install rm
```

Install into the current project root instead of the global Codex home:

```bash
codex-skills install rm --scope local
```

Local scope installs the selected workspace directly into the current project root. For example, a workspace can place `AGENTS.md`, `skills/`, `.codex-utils/`, and any other workspace files at the project root.

Install a single skill:

```bash
codex-skills install salesforce/sf-router-core-mandatory
```

Inspect installed skills:

```bash
codex-skills list --installed
codex-skills list --installed --scope local
```

Remove an installed workspace or skill:

```bash
codex-skills remove rm
codex-skills remove salesforce/sf-router-core-mandatory
codex-skills remove rm --scope local
```

Validate a local skill repository:

```bash
codex-skills doctor repo .
codex-skills doctor installed
```

## Behavior

- Installs skills into `$CODEX_HOME/skills` when `CODEX_HOME` is defined.
- Falls back to `~/.codex/skills` when `CODEX_HOME` is not set.
- Supports `--scope global` and `--scope local`.
- Global scope installs individual skills into the Codex home.
- Local scope installs one workspace directly into the current project root and keeps orchestration metadata under `./.codex/`.
- Local scope supports full workspace install/remove only.
- If another workspace is already installed locally, the CLI requires explicit confirmation before replacement and shows the project paths that will be removed.
- Resolves the catalog from the GitHub repository configured in `catalog.manifest.json`.
- Installs workspace packs as individual Codex skills compatible with the native skill model.
- Maintains a local registry for managed installs.

## Authentication

For private GitHub catalogs, export one of:

```bash
GITHUB_TOKEN
GH_TOKEN
```

## Notes

- The CLI manages catalog lifecycle only. It does not bootstrap `AGENTS.md` into user projects.
- After installing or updating skills, restart Codex so the new skills are loaded.
