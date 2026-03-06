param(
  [Parameter(Mandatory = $true)]
  [string]$Command,
  [Parameter(Mandatory = $true)]
  [string]$TargetProfile
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Command) -or [string]::IsNullOrWhiteSpace($TargetProfile)) {
  Write-Host "ERRO: informe comando e target profile."
  exit 1
}

Invoke-Expression $Command

