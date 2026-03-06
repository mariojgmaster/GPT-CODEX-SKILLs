param(
  [Parameter(Mandatory = $true)]
  [string]$Command,
  [Parameter(Mandatory = $true)]
  [string]$TargetOs
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Command) -or [string]::IsNullOrWhiteSpace($TargetOs)) {
  Write-Host "ERRO: informe comando e target OS."
  exit 1
}

Invoke-Expression $Command

