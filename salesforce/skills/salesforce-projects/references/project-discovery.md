# Project Discovery

Use this reference when you need to identify how a Salesforce repository is organized before changing code or metadata.

## Check these files first

- `sfdx-project.json`: package directories, package names, source API version, namespace hints.
- `manifest/package.xml`: deploy scope and metadata types expected by the team.
- `force-app/` or custom package directories: primary metadata source.
- `config/`: org definitions, scratch org config, project defaults.
- `package.json`, `jest.config.*`, `.husky/`, CI files: local validation and release workflow.

## Common repository shapes

### Salesforce DX source format

Typical markers:

- `force-app/main/default/`
- `sfdx-project.json`
- Metadata split into folders such as `classes`, `lwc`, `objects`, `permissionsets`, `flows`

Implication:

- Prefer editing the source-format metadata directly and validating with `sf` or `sfdx` commands already used in the repo.

### Metadata API style or mixed repos

Typical markers:

- `src/` or legacy metadata folders
- generated `package.xml`
- deployment scripts that convert source before deploy

Implication:

- Follow the repo's conversion pipeline instead of assuming direct source deploy.

### Monorepo with app wrappers

Typical markers:

- multiple package directories in `sfdx-project.json`
- root `package.json` plus workspace tooling
- Salesforce app side by side with docs, infra, or integration services

Implication:

- Scope changes to the active package directory and avoid cross-package edits unless the feature requires them.

## Metadata locations to scan

- `classes/`: Apex classes and tests
- `triggers/`: trigger entry points
- `lwc/`: Lightning Web Components
- `aura/`: legacy component bundles
- `objects/`: custom objects, fields, validation rules, record types
- `permissionsets/` and `profiles/`: access control
- `flows/`: declarative automation
- `labels/`: custom labels for UI text
- `layouts/`, `tabs/`, `applications/`: UI metadata

## Questions to answer during discovery

1. Which package directory owns the feature?
2. Is the requested change code-first, metadata-first, or mixed?
3. Which existing tests cover the same object, service, or component area?
4. Which deploy command or CI job is the source of truth?
5. Are there namespace, managed package, or unlocked package constraints?
