#!/usr/bin/env bash
set -euo pipefail

lock_path=".codex-utils/session-lock/session-lock.json"
if [ ! -f "$lock_path" ]; then
  echo "LOCK_INVALID: missing session lock file at $lock_path"
  exit 1
fi

python - <<'PY' "$lock_path"
import json, sys, datetime
from datetime import timezone

path = sys.argv[1]
try:
    data = json.load(open(path, "r", encoding="utf-8"))
except Exception:
    print("LOCK_INVALID: lock file is not valid JSON")
    raise SystemExit(1)

expires = data.get("expires_at")
if not expires:
    print("LOCK_INVALID: expires_at missing")
    raise SystemExit(1)

expires_norm = expires.replace("Z", "+00:00")
try:
    dt = datetime.datetime.fromisoformat(expires_norm)
except Exception:
    print("LOCK_INVALID: invalid expires_at format")
    raise SystemExit(1)

if datetime.datetime.now(timezone.utc) > dt.astimezone(timezone.utc):
    print("LOCK_INVALID: session lock expired")
    raise SystemExit(1)

print("LOCK_VALID")
PY

