$ErrorActionPreference = "Stop"

if (Test-Path "pnpm-lock.yaml") {
  Write-Host "pnpm"
} elseif (Test-Path "package-lock.json") {
  Write-Host "npm"
} elseif (Test-Path "yarn.lock") {
  Write-Host "yarn"
} elseif (Test-Path "bun.lockb") {
  Write-Host "bun"
} else {
  Write-Host "npm"
}

