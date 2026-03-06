---
name: md-git-safe-delivery
description: Govern git operations safely by enforcing confirmed repo, branch, remote, and identity context, scoped commits, and explicit checks before commit, push, or release actions.
---

# MD Git Safe Delivery

Use this skill for git actions.

## Required flow
1. Capture context via `scripts/capture-git-context.(ps1|sh)`.
2. Confirm branch, remote, user.name, and user.email from session lock.
3. Verify changed files are in approved scope.
4. Block unsafe operations and ask for confirmation on mismatch.

## Hard rules
- No commit or push on unconfirmed branch.
- No push to unconfirmed remote.
- No staged files outside approved scope.

