#!/usr/bin/env bash
# Starts the production server, waits until it answers, runs the given command against it,
# then stops the server and exits with the command's status.
#
#   scripts/ci-with-server.sh node scripts/e2e-a11y.mjs http://localhost:3000
set -uo pipefail
PORT="${PORT:-3000}"
npm start -- -p "$PORT" >/tmp/next-server.log 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do
  curl -fsS "http://localhost:$PORT/play/" >/dev/null 2>&1 && break
  sleep 1
done
if ! curl -fsS "http://localhost:$PORT/play/" >/dev/null 2>&1; then
  echo "The server did not start:" >&2
  cat /tmp/next-server.log >&2
  exit 1
fi
"$@"
