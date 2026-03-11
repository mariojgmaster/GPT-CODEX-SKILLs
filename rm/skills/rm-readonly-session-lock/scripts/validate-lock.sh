#!/usr/bin/env bash
set -euo pipefail

lock_path=".codex-utils/session-lock/session-lock.json"
if [[ ! -f "$lock_path" ]]; then
  echo "LOCK_INVALID: missing session lock file at $lock_path"
  exit 1
fi

python - "$lock_path" <<'PY'
import json
import sys
from datetime import datetime, timezone

lock_path = sys.argv[1]

try:
    with open(lock_path, "r", encoding="utf-8") as handle:
        lock = json.load(handle)
except Exception:
    print("LOCK_INVALID: lock file is not valid JSON")
    raise SystemExit(1)

if lock.get("access_mode") != "read_only":
    print("LOCK_INVALID: access_mode must be read_only")
    raise SystemExit(1)

envs = lock.get("environment_contexts") or []
if not envs:
    print("LOCK_INVALID: environment_contexts missing")
    raise SystemExit(1)

required_fields = ["role", "org_name", "org_id", "instance_url", "username_or_email"]
for env_ctx in envs:
    for field in required_fields:
        value = env_ctx.get(field)
        if not value or value == "unknown":
            print(f"LOCK_INVALID: environment field '{field}' missing or unknown")
            raise SystemExit(1)

expires_at = lock.get("expires_at")
if not expires_at:
    print("LOCK_INVALID: expires_at missing")
    raise SystemExit(1)

expires = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
if datetime.now(timezone.utc) > expires.astimezone(timezone.utc):
    print("LOCK_INVALID: session lock expired")
    raise SystemExit(1)

print("LOCK_VALID")
PY
