#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/detect-cli.sh"

if [ "$SFCLI" = "sf" ]; then
  sf apex run test --result-format human --wait 60
  sf apex get test --result-format human --code-coverage
else
  sfdx force:apex:test:run -r human -w 60
  sfdx force:apex:test:report -r human --codecoverage
fi

