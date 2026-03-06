#!/usr/bin/env bash
set -euo pipefail

command_to_run="${1:-}"
target_profile="${2:-}"
if [ -z "$command_to_run" ] || [ -z "$target_profile" ]; then
  echo "ERRO: informe comando e target profile."
  exit 1
fi

eval "$command_to_run"

