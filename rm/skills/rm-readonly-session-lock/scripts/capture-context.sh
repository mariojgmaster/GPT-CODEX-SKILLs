#!/usr/bin/env bash
set -euo pipefail

value_or_unknown() {
  local value="${1:-}"
  if [[ -z "${value// }" ]]; then
    printf 'unknown'
  else
    printf '%s' "$value"
  fi
}

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

cat <<JSON
{
  "access_mode": "read_only",
  "environment_contexts": [
    {
      "role": "unknown",
      "org_name": "unknown",
      "org_id": "unknown",
      "instance_url": "unknown",
      "username_or_email": "unknown"
    }
  ],
  "flosum_context": {
    "tenant_or_org": "$(value_or_unknown "${RM_FLOSUM_TENANT_OR_ORG:-}")",
    "branch_or_baseline": "$(value_or_unknown "${RM_FLOSUM_BRANCH_OR_BASELINE:-}")",
    "package_or_release": "$(value_or_unknown "${RM_FLOSUM_PACKAGE_OR_RELEASE:-}")"
  },
  "git_context": {
    "repo_path": "$repo_path",
    "branch": "$branch",
    "remote": "$remote",
    "user_name": "$user_name",
    "user_email": "$user_email"
  }
}
JSON
