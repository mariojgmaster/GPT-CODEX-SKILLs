# Deploy and validate triage

Read failures in this order:
1. target environment and acting identity
2. command or release action attempted
3. first blocking error, not downstream noise
4. metadata/package scope involved
5. test failures versus compile failures versus dependency failures

Classify findings as:
- environment health signal
- packaging or dependency issue
- metadata gap
- permissions/profile gap
- data/manual-step dependency
- Flosum orchestration issue
