# Routing Matrix

## Intent taxonomy
- `analysis`: investigation, estimation, planning, diagnostics.
- `discovery`: impact map, dependency mapping, scope mapping.
- `mobile_feature`: Expo or React Native screen, component, hook, navigation, or mobile config work.
- `desktop_feature`: Electron main, preload, renderer, IPC, window, menu, tray, or packaging work.
- `validation_release`: targeted tests, typecheck, build checks, packaging, signing, release dry-run.
- `git_delivery`: branch safety, commit, push, release control.

## Skill routing
| intent | primary skill | optional secondary |
|---|---|---|
| analysis | md-general-analysis-planning | md-discovery-impact-map |
| discovery | md-discovery-impact-map | md-general-analysis-planning |
| mobile_feature | md-react-native-expo-feature | md-validation-release-guardrails |
| desktop_feature | md-electron-desktop-feature | md-validation-release-guardrails |
| validation_release | md-validation-release-guardrails | md-discovery-impact-map |
| git_delivery | md-git-safe-delivery | md-session-scope-lock |

## Confidence guide
- High confidence: intent clearly maps to one route and scope is explicit.
- Medium confidence: intent is clear but scope details are partial.
- Low confidence: intent or target ambiguous, mixed unrelated actions, or missing critical safety data.

## Router output minimum
- `task_type`, `platform`, `risk_level`
- `primary_skill`, `secondary_skills`
- `needs_confirmation`, `confidence`, `token_budget`

