#!/usr/bin/env bash
set -euo pipefail

allowed_prefix="${1:-}"
if [ -z "$allowed_prefix" ]; then
  echo "GIT_SCOPE_INVALID: missing allowed prefix."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "GIT_SCOPE_INVALID: git not available."
  exit 1
fi

if [ "$(git rev-parse --is-inside-work-tree 2>/dev/null || echo false)" != "true" ]; then
  echo "GIT_SCOPE_INVALID: not inside a git worktree."
  exit 1
fi

while IFS= read -r file; do
  case "$file" in
    "$allowed_prefix"*) ;;
    *)
      echo "GIT_SCOPE_INVALID: file outside scope -> $file"
      exit 1
      ;;
  esac
done < <(git diff --name-only --cached 2>/dev/null)

echo "GIT_SCOPE_VALID"

