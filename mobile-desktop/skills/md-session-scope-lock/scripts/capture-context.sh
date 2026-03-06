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

python - <<'PY' "$repo_path" "$branch" "$remote" "$user_name" "$user_email" "${EXPO_ACCOUNT:-}" "${EXPO_PROJECT_ID:-}" "${EAS_BUILD_PROFILE:-}" "${IOS_BUNDLE_ID:-}" "${ANDROID_APPLICATION_ID:-}" "${ELECTRON_APP_ID:-}" "${RELEASE_CHANNEL:-}" "${TARGET_OS:-}" "${SIGNING_IDENTITY_HINT:-}"
import json, sys

def val(value):
    return value if value else "unknown"

out = {
  "mobile_context": {
    "expo_account": val(sys.argv[6]),
    "expo_project_id": val(sys.argv[7]),
    "eas_profile": val(sys.argv[8]),
    "ios_bundle_id": val(sys.argv[9]),
    "android_application_id": val(sys.argv[10]),
  },
  "desktop_context": {
    "electron_app_id": val(sys.argv[11]),
    "release_channel": val(sys.argv[12]),
    "target_os": val(sys.argv[13]),
    "signing_identity_hint": val(sys.argv[14]),
  },
  "git_context": {
    "repo_path": sys.argv[1],
    "branch": val(sys.argv[2]),
    "remote": val(sys.argv[3]),
    "user_name": val(sys.argv[4]),
    "user_email": val(sys.argv[5]),
  }
}
print(json.dumps(out, indent=2))
PY

