#!/usr/bin/env bash
# Starts the production server, waits until it answers, runs the given command against it,
# then stops the server and exits with the command's status.
#
#   scripts/ci-with-server.sh node scripts/e2e-a11y.mjs http://localhost:3000
set -uo pipefail
PORT="${PORT:-3000}"
# Node instead of curl, because the Playwright container image may not include curl.
up() { node -e "fetch('http://localhost:$PORT/play/').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"; }
npm start -- -p "$PORT" >/tmp/next-server.log 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do
  up && break
  sleep 1
done
if ! up; then
  echo "The server did not start:" >&2
  cat /tmp/next-server.log >&2
  exit 1
fi
"$@"
