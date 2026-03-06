\
    . "$PSScriptRoot\detect-cli.ps1"

    if ($SFCLI -eq "sf") {
      sf apex run test --result-format human --wait 60
      sf apex get test --result-format human --code-coverage
    } else {
      sfdx force:apex:test:run -r human -w 60
      sfdx force:apex:test:report -r human --codecoverage
    }

