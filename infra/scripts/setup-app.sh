#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="${REPO_ROOT}/app-under-test"
REPO_URL="https://github.com/TonyMckes/conduit-realworld-example-app.git"
PINNED_REF="${CONDUIT_APP_REF:-main}"

if [[ -d "${APP_DIR}/.git" ]]; then
  echo "app-under-test already cloned — skipping"
  exit 0
fi

if [[ -d "${APP_DIR}" ]]; then
  echo "ERROR: ${APP_DIR} exists but is not a git clone. Remove it and retry." >&2
  exit 1
fi

echo "Cloning Conduit (RealWorld) into app-under-test (ref: ${PINNED_REF})..."
git clone --depth 1 --branch "${PINNED_REF}" "${REPO_URL}" "${APP_DIR}"
echo "Clone complete."
