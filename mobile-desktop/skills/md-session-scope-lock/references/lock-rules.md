# Lock Rules

## Lock file path
- `.codex-utils/session-lock/session-lock.json`

## Required mobile fields
- expo account
- expo project id
- eas profile
- ios bundle id
- android application id

## Required desktop fields
- electron app id
- release channel
- target os
- signing identity hint

## Required git fields
- repo path
- branch
- remote
- user.name
- user.email

## Reconfirmation triggers
1. Build target or release target changes.
2. Git branch or remote changes.
3. Lock expired.
4. Any mismatch between runtime context and lock file.

## Failure behavior
- Stop execution.
- Ask for missing or conflicting fields.
- Refresh lock before continuing.

