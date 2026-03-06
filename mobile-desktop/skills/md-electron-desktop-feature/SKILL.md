---
name: md-electron-desktop-feature
description: Implement Electron desktop feature work with explicit main, preload, and renderer boundaries, IPC safety, packaging awareness, and targeted validation only.
---

# MD Electron Desktop Feature

Use this skill for Electron desktop feature work.

## Required flow
1. Confirm main, preload, renderer, IPC, menu, tray, window, or packaging scope.
2. Apply `references/electron-rules.md` and `references/ipc-security.md`.
3. Reuse templates from `assets/` when creating new artifacts.
4. Keep process boundaries explicit and security-aware.
5. Route validation to `md-validation-release-guardrails`.

## Hard rules
- Never expose dangerous APIs directly to renderer.
- Always document boundaries between main, preload, and renderer.
- Always consider packaging and update impact.
- Always include architecture, business, performance, and maintenance impact in output.

