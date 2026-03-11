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

## Core Commands

List remote catalog workspaces and skills:

```bash
skills list
skills list --workspace rm
```

Install a complete workspace:

```bash
skills install salesforce
skills install mobile-desktop
skills install rm
```

Install a single skill:

```bash
skills install salesforce/sf-router-core-mandatory
```

Inspect installed skills:

```bash
skills list --installed
```

Validate a local skill repository:

```bash
skills doctor repo .
skills doctor installed
```

## Behavior

- Installs skills into `$CODEX_HOME/skills` when `CODEX_HOME` is defined.
- Falls back to `~/.codex/skills` when `CODEX_HOME` is not set.
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
