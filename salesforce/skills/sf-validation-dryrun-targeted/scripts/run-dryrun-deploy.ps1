param(
  [Parameter(Mandatory = $true)]
  [string]$ManifestPath,
  [Parameter(Mandatory = $true)]
  [string]$TargetOrg
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot\detect-cli.ps1"

if ([string]::IsNullOrWhiteSpace($ManifestPath)) {
  Write-Host "ERRO: informe caminho de manifest."
  exit 1
}
if ([string]::IsNullOrWhiteSpace($TargetOrg)) {
  Write-Host "ERRO: informe org alvo em -TargetOrg."
  exit 1
}

if ($SFCLI -eq "sf") {
  sf project deploy start --target-org $TargetOrg --manifest $ManifestPath --dry-run
} else {
  sfdx force:source:deploy -u $TargetOrg -x $ManifestPath --checkonly
}
