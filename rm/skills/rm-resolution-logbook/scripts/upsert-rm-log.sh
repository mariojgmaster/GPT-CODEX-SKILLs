#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "usage: upsert-rm-log.sh <title> <status> <analysis_summary> [decision] [next_actions] [environments] [evidence_reviewed] [confirmed_by_rm]" >&2
  exit 1
fi

title="$1"
status="$2"
analysis_summary="$3"
decision="${4:-}"
next_actions="${5:-}"
environments="${6:-}"
evidence_reviewed="${7:-}"
confirmed_by_rm="${8:-}"

sanitize_title() {
  local value
  value="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
  if [[ -z "$value" ]]; then
    printf 'caso-rm'
  else
    printf '%s' "$value"
  fi
}

date_stamp="$(date +%Y%m%d)"
timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
safe_title="$(sanitize_title "$title")"
mkdir -p .rm-logs
path=".rm-logs/${date_stamp} - ${safe_title}.md"

if [[ ! -f "$path" ]]; then
  printf '# %s\n' "$title" > "$path"
fi

cat >> "$path" <<EOF

## $timestamp
- Status: $status
- Environments: $environments
- Evidence reviewed: $evidence_reviewed
- Analysis summary: $analysis_summary
- Decision: $decision
- Next actions: $next_actions
- Confirmed by RM: $confirmed_by_rm
EOF

printf '%s\n' "$path"
