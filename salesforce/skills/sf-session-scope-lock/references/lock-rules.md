# Lock Rules

## Lock file path
- `.codex-utils/session-lock/session-lock.json`

## Required Salesforce fields
- org name
- org id
- instance url
- username/email

## Required Git fields
- repo path
- branch
- remote
- user.name
- user.email

## Reconfirmation triggers
1. Target org or branch changes.
2. Lock expired.
3. Any mismatch between runtime context and lock file.

## Failure behavior
- Stop execution.
- Ask for missing or conflicting fields.
- Refresh lock before continuing.

