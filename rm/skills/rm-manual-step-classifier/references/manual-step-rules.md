# Manual step rules

Default classes:
- `deployavel`: versionable, repeatable, deterministic, and automatable without human judgment
- `nao_deployavel`: depends on human judgment, ad-hoc data changes, user communication, external approval, or secret handling
- `inconclusivo`: missing evidence about tooling, metadata support, or operational constraints

Strong indicators for `nao_deployavel`:
- data correction in production-like orgs
- manual profile/user setup
- secret rotation
- stakeholder sign-off
- UI clicks without a proven metadata or automation equivalent

Strong indicators for `deployavel`:
- metadata-backed configuration
- scriptable validation or report generation
- repeatable package assembly steps already defined in tooling
