#!/usr/bin/env bash
set -euo pipefail

if command -v sf >/dev/null 2>&1; then
  SFCLI="sf"
elif command -v sfdx >/dev/null 2>&1; then
  SFCLI="sfdx"
else
  echo "ERRO: Nem 'sf' nem 'sfdx' foram encontrados no PATH."
  exit 1
fi

