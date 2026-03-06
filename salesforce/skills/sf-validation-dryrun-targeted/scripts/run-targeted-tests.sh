#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/detect-cli.sh"

tests_csv="${1:-}"
target_org="${2:-}"
if [ -z "$tests_csv" ]; then
  echo "ERRO: informe testes alvo como primeiro argumento."
  exit 1
fi
if [ -z "$target_org" ]; then
  echo "ERRO: informe org alvo como segundo argumento."
  exit 1
fi

if [ "$SFCLI" = "sf" ]; then
  sf apex run test --target-org "$target_org" --tests "$tests_csv" --result-format human --wait 60
  sf apex get test --target-org "$target_org" --result-format human --code-coverage
else
  sfdx force:apex:test:run -u "$target_org" -n "$tests_csv" -r human -w 60
  sfdx force:apex:test:report -r human --codecoverage
fi
