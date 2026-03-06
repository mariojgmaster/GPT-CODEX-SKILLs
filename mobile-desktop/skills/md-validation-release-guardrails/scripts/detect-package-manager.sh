#!/usr/bin/env bash
set -euo pipefail

if [ -f "pnpm-lock.yaml" ]; then
  echo "pnpm"
elif [ -f "package-lock.json" ]; then
  echo "npm"
elif [ -f "yarn.lock" ]; then
  echo "yarn"
elif [ -f "bun.lockb" ]; then
  echo "bun"
else
  echo "npm"
fi

