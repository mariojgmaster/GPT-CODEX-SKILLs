#!/usr/bin/env bash
set -euo pipefail

command_exists() { command -v "$1" >/dev/null 2>&1; }

if command_exists sf; then
  echo "CLI: sf"
  SFCLI="sf"
elif command_exists sfdx; then
  echo "CLI: sfdx"
  SFCLI="sfdx"
else
  echo "ERRO: Nem 'sf' nem 'sfdx' foram encontrados no PATH."
  echo "Instale a Salesforce CLI e tente novamente."
  exit 1
fi

