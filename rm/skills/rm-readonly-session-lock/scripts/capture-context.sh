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
hostname_value="$(hostname 2>/dev/null || printf 'unknown')"
current_user="$(whoami 2>/dev/null || printf 'unknown')"
os_platform="$(uname -s 2>/dev/null || printf 'unknown')"
branch="unknown"
remote="unknown"
user_name="unknown"
user_email="unknown"
sf_cli_available=false
sf_cli_version="unknown"
sf_default_org_name="unknown"
sf_default_org_id="unknown"
sf_default_instance_url="unknown"
sf_default_username="unknown"

if command -v git >/dev/null 2>&1; then
  branch="$(value_or_unknown "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)")"
  remote="$(value_or_unknown "$(git remote get-url origin 2>/dev/null || true)")"
  user_name="$(value_or_unknown "$(git config --get user.name 2>/dev/null || true)")"
  user_email="$(value_or_unknown "$(git config --get user.email 2>/dev/null || true)")"
fi

if command -v sf >/dev/null 2>&1; then
  sf_cli_available=true
  sf_cli_version="$(value_or_unknown "$(sf --version 2>/dev/null || true)")"
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
  },
  "machine_context": {
    "hostname": "$(value_or_unknown "$hostname_value")",
    "current_user": "$(value_or_unknown "$current_user")",
    "os_platform": "$(value_or_unknown "$os_platform")",
    "workspace_path": "$repo_path"
  },
  "tooling_context": {
    "sf_cli_available": $sf_cli_available,
    "sf_cli_version": "$sf_cli_version",
    "sf_default_org_name": "$sf_default_org_name",
    "sf_default_org_id": "$sf_default_org_id",
    "sf_default_instance_url": "$sf_default_instance_url",
    "sf_default_username": "$sf_default_username"
  }
}
JSON
