#!/bin/bash
#
# Single entrypoint for the Resort Cabana Booking app.
# Starts the backend (Express) and frontend (Vite) together.
#
# Usage:
#   ./run.sh --map ./map.ascii --bookings ./bookings.json
#
# Both flags are optional. If omitted, the backend falls back to
# map.ascii / bookings.json in the project root (see server/src/server.js).

set -e

MAP_PATH=""
BOOKINGS_PATH=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --map)
      MAP_PATH="$2"
      shift 2
      ;;
    --bookings)
      BOOKINGS_PATH="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      shift
      ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Resolve paths relative to wherever the script was called from, not the
# repo root, so `--map ./my-map.ascii` behaves the way someone would expect.
if [[ -n "$MAP_PATH" ]]; then
  MAP_PATH="$(cd "$(dirname "$MAP_PATH")" && pwd)/$(basename "$MAP_PATH")"
fi
if [[ -n "$BOOKINGS_PATH" ]]; then
  BOOKINGS_PATH="$(cd "$(dirname "$BOOKINGS_PATH")" && pwd)/$(basename "$BOOKINGS_PATH")"
fi

# Fall back to the example files in the project root if nothing was passed.
MAP_PATH="${MAP_PATH:-$ROOT_DIR/map.ascii}"
BOOKINGS_PATH="${BOOKINGS_PATH:-$ROOT_DIR/bookings.json}"

echo "Using map:      $MAP_PATH"
echo "Using bookings: $BOOKINGS_PATH"
echo ""

# Install dependencies if this is a fresh clone. With npm workspaces,
# dependencies are hoisted into the root node_modules rather than
# necessarily appearing in server/node_modules or client/node_modules,
# so that's what gets checked here.
if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
  echo "Installing dependencies (first run only)..."
  (cd "$ROOT_DIR" && npm install --workspaces)
  echo ""
fi

# Kill both processes if the script is stopped (Ctrl+C).
cleanup() {
  echo ""
  echo "Stopping..."
  kill "$SERVER_PID" "$CLIENT_PID" 2>/dev/null
}
trap cleanup EXIT

# Start the backend.
(cd "$ROOT_DIR/server" && node src/index.js --map "$MAP_PATH" --bookings "$BOOKINGS_PATH") &
SERVER_PID=$!

# Give the backend a moment to boot before starting the frontend.
sleep 1

# Start the frontend.
(cd "$ROOT_DIR/client" && npm run dev) &
CLIENT_PID=$!

echo ""
echo "Backend running on  http://localhost:3001"
echo "Frontend running on http://localhost:5173"
echo "Press Ctrl+C to stop both."
echo ""

wait "$SERVER_PID" "$CLIENT_PID"