$ErrorActionPreference = "Stop"

function Test-Command($cmd) {
  return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

if (Test-Command "sf") {
  $global:SFCLI = "sf"
} elseif (Test-Command "sfdx") {
  $global:SFCLI = "sfdx"
} else {
  Write-Host "ERRO: Nem 'sf' nem 'sfdx' foram encontrados no PATH."
  exit 1
}

