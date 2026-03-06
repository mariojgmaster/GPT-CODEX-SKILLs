$ErrorActionPreference = "Stop"

function Get-ValueOrUnknown($value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return "unknown" }
  return $value
}

$repoPath = (Get-Location).Path
$branch = "unknown"
$remote = "unknown"
$userName = "unknown"
$userEmail = "unknown"

if (Get-Command git -ErrorAction SilentlyContinue) {
  try { $branch = Get-ValueOrUnknown (git rev-parse --abbrev-ref HEAD 2>$null) } catch {}
  try { $remote = Get-ValueOrUnknown (git remote get-url origin 2>$null) } catch {}
  try { $userName = Get-ValueOrUnknown (git config --get user.name 2>$null) } catch {}
  try { $userEmail = Get-ValueOrUnknown (git config --get user.email 2>$null) } catch {}
}

@{
  repo_path = $repoPath
  branch = $branch
  remote = $remote
  user_name = $userName
  user_email = $userEmail
} | ConvertTo-Json -Depth 3

