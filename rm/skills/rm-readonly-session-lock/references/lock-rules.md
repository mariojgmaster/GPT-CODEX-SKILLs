# Lock rules

Use a read-only lock whenever the RM request touches:
- one or more live environments
- read-only validate/check execution
- Flosum release evidence outside the repo
- local release artifacts whose origin branch or package matters

Minimum environment fields:
1. role label
2. org name
3. org id
4. instance URL
5. acting username or email

If any field is unknown, stop and ask the RM.
