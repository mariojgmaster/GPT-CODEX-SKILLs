# Documentation rules

Use this skill only on explicit documentation requests.

Required format policy:
- create a DOCX first
- use `assets/triscal-doc-template.docx` as the formatting base
- ignore all textual information from the original Triscal model
- organize information clearly with sections, tables, and lists
- update footer fields and table of contents before final output
- keep the following mandatory sections visually aligned with the model:
  - cover page
  - header
  - footer with page counter
  - table of contents
- use the Triscal visual palette for table fills and filled divider lines

Visual expectations:
- cover with large solution title, client name, and short subtitle
- header with Triscal logo and orange separator line
- footer with structured metadata row and page counter
- TOC page using the same logo/header treatment

Output policy:
- default destination: `.codex-utils/doc-output/`
- never write inside the analyzed project unless the RM explicitly chooses a separate safe destination outside that project
