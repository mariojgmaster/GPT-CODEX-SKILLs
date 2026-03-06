param(
  [Parameter(Mandatory = $true)]
  [string]$TestsCsv,
  [Parameter(Mandatory = $true)]
  [string]$TargetOrg
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot\detect-cli.ps1"

if ([string]::IsNullOrWhiteSpace($TestsCsv)) {
  Write-Host "ERRO: informe testes alvo em -TestsCsv."
  exit 1
}
if ([string]::IsNullOrWhiteSpace($TargetOrg)) {
  Write-Host "ERRO: informe org alvo em -TargetOrg."
  exit 1
}

if ($SFCLI -eq "sf") {
  sf apex run test --target-org $TargetOrg --tests $TestsCsv --result-format human --wait 60
  sf apex get test --target-org $TargetOrg --result-format human --code-coverage
} else {
  sfdx force:apex:test:run -u $TargetOrg -n $TestsCsv -r human -w 60
  sfdx force:apex:test:report -r human --codecoverage
}
