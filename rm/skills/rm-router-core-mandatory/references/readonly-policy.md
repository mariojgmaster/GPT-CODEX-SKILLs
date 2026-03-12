# Read-only policy

The `rm` workspace never mutates analyzed environments or the analyzed project content.

Forbidden actions:
- deploy
- quick deploy
- promote
- push/update/delete metadata
- create/edit/delete files in the analyzed project
- add comments, markers, annotations, or debug statements
- change signatures, return types, return values, formatting, or temporary instrumentation
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
- any read-only API needed for analysis
- local machine inspection
- Salesforce CLI inspection

Allowed writes inside this workspace only:
- `.codex-utils/`
- `.rm-logs/`
- `.codex-utils/doc-output/` for explicit documentation requests

When a mutation is requested:
1. Refuse clearly.
2. State that the workspace is analysis-only.
3. Offer safe alternatives: evidence review, root-cause analysis, manual runbook, or release recommendations.
