---
name: md-react-native-expo-feature
description: Implement Expo and React Native feature work with platform-aware UI, scoped navigation and state changes, performance guardrails, and targeted validation only.
---

# MD React Native Expo Feature

Use this skill for mobile feature work in Expo or React Native projects.

## Required flow
1. Confirm screen, component, hook, navigation, API, or mobile config scope.
2. Apply `references/rn-expo-rules.md` and `references/ui-platform-aware.md`.
3. Reuse templates from `assets/` when creating new artifacts.
4. Keep mobile logic scoped and aligned to the repository pattern.
5. Route validation to `md-validation-release-guardrails`.

## Hard rules
- Do not invent architecture beyond repository patterns.
- Do not push business-critical security logic only to UI.
- Do not mix navigation and state patterns arbitrarily.
- Always consider iOS and Android differences, accessibility, offline, and error states.
- Always include architecture, business, performance, and maintenance impact in output.

