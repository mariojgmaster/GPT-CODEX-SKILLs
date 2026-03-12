---
name: rm-documentation-docx-pdf
description: Create DOCX or PDF documentation for RM analysis using the local Triscal template copy in this skill and the bundled `doc` and `pdf` skills in this workspace. Use only when the RM explicitly asks for documentation output.
---

# RM Documentation DOCX PDF

Use this skill only when the RM explicitly requests documentation output.

## Required flow
1. Confirm the session is explicitly acting as `RM (DevOps)` under the router rules.
2. Keep documentation generation scoped to the analyzed case. Never edit the analyzed project content.
3. Always start from `assets/triscal-doc-template.docx`, which is a local copy of the Triscal model.
4. Use only the formatting and document configuration from the template. Never reuse any textual content from the original model.
5. Use the bundled `doc` skill for DOCX creation/editing and the bundled `pdf` skill when a PDF is requested or derived from the DOCX.
6. Write deliverables only under `.codex-utils/doc-output/`, unless the RM gives another safe destination outside the analyzed project.
7. Follow the visual model shown in the attached patterns for:
   - cover
   - header
   - footer with page counter
   - table of contents
8. Use the Triscal logo color palette for table fills, separator lines, and highlighted rows.
9. Organize content with headings, tables, and lists when they improve clarity.
10. Update the footer and the table of contents before finalizing the document.

## Hard guardrails
- Never create documentation by editing the analyzed project files.
- Never create or alter any analyzed project artifact, even for comments, annotations, markers, or formatting.
- Never use any informational content from the Triscal model; use only layout, styles, and formatting.
- Never skip DOCX generation when documentation is requested explicitly.
