#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/detect-cli.sh"

manifest_path="${1:-}"
target_org="${2:-}"
if [ -z "$manifest_path" ]; then
  echo "ERRO: informe caminho de manifest."
  exit 1
fi
if [ -z "$target_org" ]; then
  echo "ERRO: informe org alvo como segundo argumento."
  exit 1
fi

if [ "$SFCLI" = "sf" ]; then
  sf project deploy start --target-org "$target_org" --manifest "$manifest_path" --dry-run
else
  sfdx force:source:deploy -u "$target_org" -x "$manifest_path" --checkonly
fi
