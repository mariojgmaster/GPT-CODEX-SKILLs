$ErrorActionPreference = "Stop"

$lockPath = ".codex-utils/session-lock/session-lock.json"
if (!(Test-Path $lockPath)) {
  Write-Host "LOCK_INVALID: missing session lock file at $lockPath"
  exit 1
}

try {
  $lock = Get-Content -Raw $lockPath | ConvertFrom-Json
} catch {
  Write-Host "LOCK_INVALID: lock file is not valid JSON"
  exit 1
}

if (-not $lock.expires_at) {
  Write-Host "LOCK_INVALID: expires_at missing"
  exit 1
}

$expires = Get-Date $lock.expires_at
if ((Get-Date) -gt $expires) {
  Write-Host "LOCK_INVALID: session lock expired"
  exit 1
}

Write-Host "LOCK_VALID"

