# Implementation Patterns

Use this reference when deciding how to implement a Salesforce change without fighting the repository's existing architecture.

## Pick the smallest viable surface

### Apex

Prefer Apex when the change needs:

- trigger-driven business rules
- cross-object orchestration
- callouts, platform events, queueables, batches, or schedulables
- complex validations that are already code-based

Guardrails:

- bulkify queries and DML
- keep SOQL and DML outside loops
- preserve sharing behavior intentionally
- prefer existing selector, service, domain, or handler layers if they already exist

### LWC

Prefer LWC when the change is user-facing and the repo already supports Lightning UI work.

Guardrails:

- keep business rules on the server when they depend on data integrity or security
- reuse existing wire adapters, Apex controllers, and design patterns
- update labels and permissions when component visibility depends on them
- add Jest tests when the repo already uses `sfdx-lwc-jest` or equivalent wrappers

### Flow and declarative metadata

Prefer Flow or metadata-only changes when:

- the request is configuration-driven
- the repo already manages automation declaratively
- the change is mostly object schema, page layout, or access setup

Guardrails:

- avoid mixing declarative and code automation on the same event without checking existing behavior
- keep versions and activation assumptions explicit
- update dependent metadata such as fields, record types, and permission sets together

## Common feature combinations

### Object feature

Touch some combination of:

- `objects/...`
- validation rules or record types
- permission sets or profiles
- Apex trigger or service logic
- tests that create the new schema usage path

### UI feature

Touch some combination of:

- `lwc/...`
- Apex controller classes
- labels
- flexipages, tabs, or permissions if required for exposure

### Integration or async feature

Touch some combination of:

- queueable, batch, schedulable, or platform event code
- named credential or external service metadata if present in repo
- tests with callout mocks or async assertions

## Review checklist

Before finalizing implementation, confirm:

1. Data access rules are respected.
2. Trigger behavior remains bulk-safe.
3. Metadata changes include the access model needed to use them.
4. Tests exercise the changed path instead of only happy-path setup.
5. The change matches existing naming and packaging conventions.
