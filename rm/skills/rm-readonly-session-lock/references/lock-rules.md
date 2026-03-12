# Lock rules

Before collecting any environment lock, confirm the session is explicitly acting as `RM (DevOps)`.

Use a read-only lock whenever the RM request touches:
- one or more live environments
- read-only validate/check execution
- Flosum release evidence outside the repo
- local release artifacts whose origin branch or package matters
- local machine or Salesforce CLI evidence

Minimum environment fields:
1. role label
2. org name
3. org id
4. instance URL
5. acting username or email

If any field is unknown, stop and ask the RM.

Machine/tooling context to capture:
- hostname
- current local user
- operating system
- Salesforce CLI availability and version
- default org details surfaced by the CLI, if available
