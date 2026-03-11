# Routing Matrix

## Intent taxonomy
- `analysis`: investigation, estimation, planning, diagnostics.
- `discovery`: impact map, dependency mapping, scope mapping.
- `apex`: classes, triggers, services, tests.
- `lwc`: frontend Lightning, component behavior, UI performance.
- `aura`: legacy Aura maintenance.
- `flow_metadata`: declarative objects/fields/layouts/flows/perms.
- `integration`: callout, external systems, credentials, adapters.
- `refactor`: architecture cleanup with behavior preservation.
- `validation`: dry-run, targeted tests, release checks.
- `git_delivery`: branch safety, commit/push/release control.

## Skill routing
| intent | primary skill | optional secondary |
|---|---|---|
| analysis | sf-general-analysis-planning | sf-discovery-impact-map |
| discovery | sf-discovery-impact-map | sf-general-analysis-planning |
| apex | sf-apex-standard-scaffold | sf-validation-dryrun-targeted |
| lwc | sf-lwc-slds-first | sf-validation-dryrun-targeted |
| aura | sf-aura-legacy-maintenance | sf-validation-dryrun-targeted |
| flow_metadata | sf-flow-metadata-scope | sf-validation-dryrun-targeted |
| integration | sf-integration-serviceagent | sf-validation-dryrun-targeted |
| refactor | sf-refactor-governance | sf-validation-dryrun-targeted |
| validation | sf-validation-dryrun-targeted | sf-discovery-impact-map |
| git_delivery | sf-git-safe-delivery | sf-session-scope-lock |

## Cross-domain Apex rule
- If the requested change creates any Apex class, trigger, test, service, controller, or service agent, include `sf-apex-standard-scaffold`.
- If Apex creation is the main deliverable, route `sf-apex-standard-scaffold` as primary.
- If another domain remains primary, keep that domain skill as primary and route `sf-apex-standard-scaffold` as secondary.
- Apply this rule before choosing `sf-validation-dryrun-targeted` as the optional secondary skill.

## Confidence guide
- High confidence: intent clearly maps to one route and scope is explicit.
- Medium confidence: intent is clear but scope details are partial.
- Low confidence: intent or target ambiguous, mixed unrelated actions, or missing critical safety data.

## Router output minimum
- `task_type`, `domain`, `risk_level`
- `primary_skill`, `secondary_skills`
- `needs_confirmation`, `confidence`, `token_budget`
