$ErrorActionPreference = "Stop"

function Get-ValueOrUnknown($value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return "unknown" }
  return $value
}

function Test-Command($cmd) {
  return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

$sfOrgName = "unknown"
$sfOrgId = "unknown"
$sfInstanceUrl = "unknown"
$sfUsername = "unknown"

# Safe default: keep Salesforce context unknown unless probe is explicitly enabled.
$allowSfProbe = $env:CODEX_ALLOW_SF_PROBE
if ($allowSfProbe -eq "1" -and (Test-Command "sf")) {
  try {
    $orgRaw = sf org display --json 2>$null | ConvertFrom-Json
    $result = $orgRaw.result
    $sfOrgName = Get-ValueOrUnknown $result.alias
    $sfOrgId = Get-ValueOrUnknown $result.id
    $sfInstanceUrl = Get-ValueOrUnknown $result.instanceUrl
    $sfUsername = Get-ValueOrUnknown $result.username
  } catch {
    # keep unknown fields
  }
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

$output = @{
  sf_context = @{
    org_name = $sfOrgName
    org_id = $sfOrgId
    instance_url = $sfInstanceUrl
    username_or_email = $sfUsername
  }
  git_context = @{
    repo_path = $repoPath
    branch = $branch
    remote = $remote
    user_name = $userName
    user_email = $userEmail
  }
}

Write-Output ($output | ConvertTo-Json -Depth 5)
