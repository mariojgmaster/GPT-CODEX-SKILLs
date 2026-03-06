#!/usr/bin/env bash
set -euo pipefail

command_to_run="${1:-}"
if [ -z "$command_to_run" ]; then
  echo "ERRO: informe comando de typecheck alvo como primeiro argumento."
  exit 1
fi

eval "$command_to_run"

