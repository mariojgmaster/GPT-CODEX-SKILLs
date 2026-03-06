param(
  [Parameter(Mandatory = $true)]
  [string]$AllowedPrefix
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "GIT_SCOPE_INVALID: git not available."
  exit 1
}

try {
  $inside = git rev-parse --is-inside-work-tree 2>$null
} catch {
  $inside = "false"
}
if ($inside -ne "true") {
  Write-Host "GIT_SCOPE_INVALID: not inside a git worktree."
  exit 1
}

$files = git diff --name-only --cached 2>$null
foreach ($file in $files) {
  if (-not $file.StartsWith($AllowedPrefix)) {
    Write-Host "GIT_SCOPE_INVALID: file outside scope -> $file"
    exit 1
  }
}

Write-Host "GIT_SCOPE_VALID"
