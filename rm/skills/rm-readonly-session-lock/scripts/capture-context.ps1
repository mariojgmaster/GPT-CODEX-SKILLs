$ErrorActionPreference = "Stop"

function Get-ValueOrUnknown($value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return "unknown" }
  return $value
}

function Test-Command($cmd) {
  return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

$repoPath = (Get-Location).Path
$branch = "unknown"
$remote = "unknown"
$userName = "unknown"
$userEmail = "unknown"

if (Test-Command "git") {
  try { $branch = Get-ValueOrUnknown (git rev-parse --abbrev-ref HEAD 2>$null) } catch {}
  try { $remote = Get-ValueOrUnknown (git remote get-url origin 2>$null) } catch {}
  try { $userName = Get-ValueOrUnknown (git config --get user.name 2>$null) } catch {}
  try { $userEmail = Get-ValueOrUnknown (git config --get user.email 2>$null) } catch {}
}

$tenantOrOrg = Get-ValueOrUnknown $env:RM_FLOSUM_TENANT_OR_ORG
$branchOrBaseline = Get-ValueOrUnknown $env:RM_FLOSUM_BRANCH_OR_BASELINE
$packageOrRelease = Get-ValueOrUnknown $env:RM_FLOSUM_PACKAGE_OR_RELEASE

$output = @{
  access_mode = "read_only"
  environment_contexts = @(
    @{
      role = "unknown"
      org_name = "unknown"
      org_id = "unknown"
      instance_url = "unknown"
      username_or_email = "unknown"
    }
  )
  flosum_context = @{
    tenant_or_org = $tenantOrOrg
    branch_or_baseline = $branchOrBaseline
    package_or_release = $packageOrRelease
  }
  git_context = @{
    repo_path = $repoPath
    branch = $branch
    remote = $remote
    user_name = $userName
    user_email = $userEmail
  }
}

Write-Output ($output | ConvertTo-Json -Depth 6)
