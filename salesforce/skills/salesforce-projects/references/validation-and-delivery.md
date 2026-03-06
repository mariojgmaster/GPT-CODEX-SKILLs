# Validation and Delivery

Use this reference when preparing validation steps, deployment notes, or a final handoff for a Salesforce change.

## Validation order

1. Run the most local and targeted checks first.
2. Run repository-defined wrappers before inventing raw CLI commands.
3. Fall back to Salesforce CLI only when the repo does not expose a project command.

## Typical commands

Use only commands that fit the repository and installed tooling.

### Salesforce CLI

- `sf project deploy preview`
- `sf project deploy start --dry-run`
- `sf apex run test --tests <ClassName>`
- `sf apex run test --test-level RunLocalTests`

### Node or workspace tooling

- `npm test`
- `npm run test:unit`
- `npx sfdx-lwc-jest`
- project-specific lint, format, or validation scripts from `package.json`

## What to verify

- Apex tests cover new business rules and negative paths where applicable.
- LWC tests cover rendering, events, and service interactions that changed.
- Metadata dependencies are included: fields, layouts, labels, permissions, tabs, flexipages, flows.
- Deploy scope matches the feature; do not assume a full-org deploy is acceptable.

## Delivery checklist

Include these points in the final handoff:

1. What changed and which metadata types were touched.
2. Which tests or validation commands ran successfully.
3. Which commands could not run locally.
4. Which org-dependent assumptions remain: data model, profiles, licenses, packages, or activation steps.
5. Whether deployment order or post-deploy actions matter.
