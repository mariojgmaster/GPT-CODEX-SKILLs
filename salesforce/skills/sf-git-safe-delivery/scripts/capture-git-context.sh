#!/usr/bin/env bash
set -euo pipefail

repo_path="$(pwd)"
branch="unknown"
remote="unknown"
user_name="unknown"
user_email="unknown"

if command -v git >/dev/null 2>&1; then
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
  remote="$(git remote get-url origin 2>/dev/null || echo unknown)"
  user_name="$(git config --get user.name 2>/dev/null || echo unknown)"
  user_email="$(git config --get user.email 2>/dev/null || echo unknown)"
fi

python - <<'PY' "$repo_path" "$branch" "$remote" "$user_name" "$user_email"
import json, sys
print(json.dumps({
  "repo_path": sys.argv[1],
  "branch": sys.argv[2] or "unknown",
  "remote": sys.argv[3] or "unknown",
  "user_name": sys.argv[4] or "unknown",
  "user_email": sys.argv[5] or "unknown"
}, indent=2))
PY

