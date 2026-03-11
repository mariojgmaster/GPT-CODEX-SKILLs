$ErrorActionPreference = "Stop"

function Get-ValueOrUnknown($value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return "unknown" }
  return $value
}

function Test-Command($cmd) {
  return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

$hostname = $env:COMPUTERNAME
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$osPlatform = (Get-CimInstance Win32_OperatingSystem).Caption
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
$sfCliAvailable = $false
$sfCliVersion = "unknown"
$sfDefaultOrgName = "unknown"
$sfDefaultOrgId = "unknown"
$sfDefaultInstanceUrl = "unknown"
$sfDefaultUsername = "unknown"

if (Test-Command "sf") {
  $sfCliAvailable = $true
  try { $sfCliVersion = Get-ValueOrUnknown ((sf --version 2>$null) -join " ") } catch {}
  try {
    $orgRaw = sf org display --json 2>$null | ConvertFrom-Json
    $result = $orgRaw.result
    $sfDefaultOrgName = Get-ValueOrUnknown $result.alias
    $sfDefaultOrgId = Get-ValueOrUnknown $result.id
    $sfDefaultInstanceUrl = Get-ValueOrUnknown $result.instanceUrl
    $sfDefaultUsername = Get-ValueOrUnknown $result.username
  } catch {}
}

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
  machine_context = @{
    hostname = Get-ValueOrUnknown $hostname
    current_user = Get-ValueOrUnknown $currentUser
    os_platform = Get-ValueOrUnknown $osPlatform
    workspace_path = Get-ValueOrUnknown $repoPath
  }
  tooling_context = @{
    sf_cli_available = $sfCliAvailable
    sf_cli_version = $sfCliVersion
    sf_default_org_name = $sfDefaultOrgName
    sf_default_org_id = $sfDefaultOrgId
    sf_default_instance_url = $sfDefaultInstanceUrl
    sf_default_username = $sfDefaultUsername
  }
}

Write-Output ($output | ConvertTo-Json -Depth 6)
