#!/usr/bin/env bash
set -euo pipefail

command_to_run="${1:-}"
target_os="${2:-}"
if [ -z "$command_to_run" ] || [ -z "$target_os" ]; then
  echo "ERRO: informe comando e target OS."
  exit 1
fi

eval "$command_to_run"

