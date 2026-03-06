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

$output = @{
  mobile_context = @{
    expo_account = Get-ValueOrUnknown $env:EXPO_ACCOUNT
    expo_project_id = Get-ValueOrUnknown $env:EXPO_PROJECT_ID
    eas_profile = Get-ValueOrUnknown $env:EAS_BUILD_PROFILE
    ios_bundle_id = Get-ValueOrUnknown $env:IOS_BUNDLE_ID
    android_application_id = Get-ValueOrUnknown $env:ANDROID_APPLICATION_ID
  }
  desktop_context = @{
    electron_app_id = Get-ValueOrUnknown $env:ELECTRON_APP_ID
    release_channel = Get-ValueOrUnknown $env:RELEASE_CHANNEL
    target_os = Get-ValueOrUnknown $env:TARGET_OS
    signing_identity_hint = Get-ValueOrUnknown $env:SIGNING_IDENTITY_HINT
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

