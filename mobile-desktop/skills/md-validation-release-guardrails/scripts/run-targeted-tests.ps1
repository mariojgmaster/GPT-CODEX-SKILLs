param(
  [Parameter(Mandatory = $true)]
  [string]$Command
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Command)) {
  Write-Host "ERRO: informe comando de teste alvo em -Command."
  exit 1
}

Invoke-Expression $Command

