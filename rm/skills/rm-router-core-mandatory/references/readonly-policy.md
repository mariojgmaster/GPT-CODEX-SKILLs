# Read-only policy

The `rm` workspace never mutates analyzed environments.

Forbidden actions:
- deploy
- quick deploy
- promote
- push/update/delete metadata
- data write
- permission change
- branch mutation
- any executable instruction whose purpose is to alter the analyzed target

Allowed actions:
- query
- report
- validate/check read-only
- log inspection
- metadata/package inspection
- architecture and release analysis

When a mutation is requested:
1. Refuse clearly.
2. State that the workspace is analysis-only.
3. Offer safe alternatives: evidence review, root-cause analysis, manual runbook, or release recommendations.
