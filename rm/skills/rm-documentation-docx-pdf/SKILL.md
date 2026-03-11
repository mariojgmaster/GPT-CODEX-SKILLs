---
name: rm-documentation-docx-pdf
description: Create DOCX or PDF documentation for RM analysis using the local Triscal template copy in this skill and the bundled `doc` and `pdf` skills in this workspace. Use only when the RM explicitly asks for documentation output.
---

# RM Documentation DOCX PDF

Use this skill only when the RM explicitly requests documentation output.

## Required flow
1. Keep documentation generation scoped to the analyzed case. Never edit the analyzed project content.
2. Always start from `assets/triscal-doc-template.docx`, which is a local copy of the Triscal model.
3. Use only the formatting and document configuration from the template. Never reuse any textual content from the original model.
4. Use the bundled `doc` skill for DOCX creation/editing and the bundled `pdf` skill when a PDF is requested or derived from the DOCX.
5. Write deliverables only under `.codex-utils/doc-output/`, unless the RM gives another safe destination outside the analyzed project.
6. Follow the visual model shown in the attached patterns for:
   - cover
   - header
   - footer with page counter
   - table of contents
7. Use the Triscal logo color palette for table fills, separator lines, and highlighted rows.
8. Organize content with headings, tables, and lists when they improve clarity.
9. Update the footer and the table of contents before finalizing the document.

## Hard guardrails
- Never create documentation by editing the analyzed project files.
- Never use any informational content from the Triscal model; use only layout, styles, and formatting.
- Never skip DOCX generation when documentation is requested explicitly.
