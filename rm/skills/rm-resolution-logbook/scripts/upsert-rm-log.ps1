param(
  [Parameter(Mandatory = $true)][string]$Title,
  [Parameter(Mandatory = $true)][string]$Status,
  [Parameter(Mandatory = $true)][string]$AnalysisSummary,
  [string]$Decision = "",
  [string]$NextActions = "",
  [string]$Environments = "",
  [string]$EvidenceReviewed = "",
  [string]$ConfirmedByRm = ""
)

$ErrorActionPreference = "Stop"

function Sanitize-Title($value) {
  $safe = $value.ToLowerInvariant()
  $safe = [regex]::Replace($safe, "[^a-z0-9]+", "-")
  $safe = $safe.Trim("-")
  if ([string]::IsNullOrWhiteSpace($safe)) { return "caso-rm" }
  return $safe
}

$date = Get-Date -Format "yyyyMMdd"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$safeTitle = Sanitize-Title $Title
$dir = ".rm-logs"
if (!(Test-Path $dir)) {
  New-Item -ItemType Directory -Force $dir | Out-Null
}

$path = Join-Path $dir "$date - $safeTitle.md"
if (!(Test-Path $path)) {
  Set-Content -Path $path -Value "# $Title`n" -Encoding UTF8
}

$entry = @"

## $timestamp
- Status: $Status
- Environments: $Environments
- Evidence reviewed: $EvidenceReviewed
- Analysis summary: $AnalysisSummary
- Decision: $Decision
- Next actions: $NextActions
- Confirmed by RM: $ConfirmedByRm
"@

Add-Content -Path $path -Value $entry -Encoding UTF8
Write-Output $path
