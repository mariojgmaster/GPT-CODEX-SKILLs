\
    $ErrorActionPreference = "Stop"

    function Test-Command($cmd) {
      return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
    }

    if (Test-Command "sf") {
      Write-Host "CLI: sf"
      $global:SFCLI = "sf"
    } elseif (Test-Command "sfdx") {
      Write-Host "CLI: sfdx"
      $global:SFCLI = "sfdx"
    } else {
      Write-Host "ERRO: Nem 'sf' nem 'sfdx' foram encontrados no PATH."
      Write-Host "Instale a Salesforce CLI e tente novamente."
      exit 1
    }

