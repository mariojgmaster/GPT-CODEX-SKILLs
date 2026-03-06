#!/usr/bin/env bash
set -euo pipefail

value_or_unknown() {
  local value="${1:-}"
  if [ -z "$value" ]; then
    echo "unknown"
  else
    echo "$value"
  fi
}

sf_org_name="unknown"
sf_org_id="unknown"
sf_instance_url="unknown"
sf_username="unknown"

# Safe default: keep Salesforce context unknown unless probe is explicitly enabled.
if [ "${CODEX_ALLOW_SF_PROBE:-0}" = "1" ] && command -v sf >/dev/null 2>&1; then
  sf_json="$(sf org display --json 2>/dev/null || true)"
  if [ -n "$sf_json" ]; then
    sf_org_name="$(python - <<'PY' "$sf_json"
import json, sys
raw = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
result = raw.get("result", {})
print(result.get("alias") or "unknown")
PY
)"
    sf_org_id="$(python - <<'PY' "$sf_json"
import json, sys
raw = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
result = raw.get("result", {})
print(result.get("id") or "unknown")
PY
)"
    sf_instance_url="$(python - <<'PY' "$sf_json"
import json, sys
raw = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
result = raw.get("result", {})
print(result.get("instanceUrl") or "unknown")
PY
)"
    sf_username="$(python - <<'PY' "$sf_json"
import json, sys
raw = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
result = raw.get("result", {})
print(result.get("username") or "unknown")
PY
)"
  fi
fi

repo_path="$(pwd)"
branch="unknown"
remote="unknown"
user_name="unknown"
user_email="unknown"

if command -v git >/dev/null 2>&1; then
  branch="$(value_or_unknown "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)")"
  remote="$(value_or_unknown "$(git remote get-url origin 2>/dev/null || true)")"
  user_name="$(value_or_unknown "$(git config --get user.name 2>/dev/null || true)")"
  user_email="$(value_or_unknown "$(git config --get user.email 2>/dev/null || true)")"
fi

python - <<'PY' "$sf_org_name" "$sf_org_id" "$sf_instance_url" "$sf_username" "$repo_path" "$branch" "$remote" "$user_name" "$user_email"
import json, sys
out = {
  "sf_context": {
    "org_name": sys.argv[1],
    "org_id": sys.argv[2],
    "instance_url": sys.argv[3],
    "username_or_email": sys.argv[4],
  },
  "git_context": {
    "repo_path": sys.argv[5],
    "branch": sys.argv[6],
    "remote": sys.argv[7],
    "user_name": sys.argv[8],
    "user_email": sys.argv[9],
  },
}
print(json.dumps(out, indent=2))
PY
