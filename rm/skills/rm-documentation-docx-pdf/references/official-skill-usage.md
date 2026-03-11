# Official skill usage

This skill depends on local copies of the official OpenAI skills bundled in this workspace:
- `doc`
- `pdf`

Use `doc` for:
- creating the DOCX from the local template copy
- editing document structure, headings, tables, and footer content
- updating the table of contents

Use `pdf` for:
- creating a PDF derivative when explicitly requested
- reviewing or adjusting the generated PDF output if needed

If either skill is unavailable in the session, stop and tell the RM that the bundled dependency is missing.
