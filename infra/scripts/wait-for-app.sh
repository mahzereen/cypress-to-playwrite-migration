#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${REPO_ROOT}/.env"
  set +a
fi

API_URL="${CONDUIT_API_URL:-http://localhost:3001/api}"
HEALTH_PATH="${CONDUIT_HEALTH_PATH:-/tags}"
MAX_ATTEMPTS="${WAIT_MAX_ATTEMPTS:-60}"
SLEEP_SECONDS="${WAIT_SLEEP_SECONDS:-2}"

url="${API_URL%/}${HEALTH_PATH}"
echo "Waiting for Conduit API at ${url}..."

for (( attempt = 1; attempt <= MAX_ATTEMPTS; attempt++ )); do
  if curl -sf "${url}" >/dev/null 2>&1; then
    echo "Conduit API is ready (attempt ${attempt}/${MAX_ATTEMPTS})."
    exit 0
  fi
  sleep "${SLEEP_SECONDS}"
done

echo "ERROR: Conduit API did not become ready within $((MAX_ATTEMPTS * SLEEP_SECONDS))s." >&2
exit 1
