#!/usr/bin/env bash
set -euo pipefail

if [ -z "${JAVA_HOME:-}" ]; then
  for prefix in /opt/homebrew/opt/openjdk@17 /usr/local/opt/openjdk@17; do
    if [ -d "$prefix/libexec/openjdk.jdk/Contents/Home" ]; then
      export JAVA_HOME="$prefix/libexec/openjdk.jdk/Contents/Home"
      break
    fi
  done
fi

if [ -z "${JAVA_HOME:-}" ]; then
  echo "ERROR: Java not found. Install OpenJDK 17: brew install openjdk@17" >&2
  exit 1
fi

export PATH="$JAVA_HOME/bin:$PATH"

case "${1:-}" in
  generate)
    allure generate reports/allure-results -o reports/allure-report --clean
    ;;
  open)
    allure open reports/allure-report
    ;;
  *)
    echo "Usage: $0 {generate|open}" >&2
    exit 1
    ;;
esac
