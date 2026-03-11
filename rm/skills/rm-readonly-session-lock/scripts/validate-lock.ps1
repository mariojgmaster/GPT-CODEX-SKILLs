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

if ($lock.access_mode -ne "read_only") {
  Write-Host "LOCK_INVALID: access_mode must be read_only"
  exit 1
}

if (-not $lock.environment_contexts -or $lock.environment_contexts.Count -lt 1) {
  Write-Host "LOCK_INVALID: environment_contexts missing"
  exit 1
}

foreach ($envCtx in $lock.environment_contexts) {
  foreach ($field in @("role", "org_name", "org_id", "instance_url", "username_or_email")) {
    if (-not $envCtx.$field -or $envCtx.$field -eq "unknown") {
      Write-Host "LOCK_INVALID: environment field '$field' missing or unknown"
      exit 1
    }
  }
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
