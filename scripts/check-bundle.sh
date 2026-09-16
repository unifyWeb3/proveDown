#!/usr/bin/env bash
set -euo pipefail
URL=${1:-${NEXT_PUBLIC_BUNDLE_WORKER_URL:-}}
if [ -z "$URL" ]; then URL="https://httpbin.org/json"; echo "No BUNDLE_WORKER_URL, testing fallback $URL"; fi

fetch_bundle() {
  curl --fail --show-error --silent --location --max-time 15 "$1"
}

for preset in breach no_breach ambig empty; do
  echo "=== $preset: $URL?preset=$preset ==="
  body=$(fetch_bundle "$URL?preset=$preset")
  if [ -z "$body" ]; then
    echo "ERROR: empty response for preset $preset" >&2
    exit 1
  fi
  printf '%s\n' "$body" | head -c 300; echo
  hash=$(printf '%s' "$body" | sha256sum | cut -c1-16)
  echo "hash: $hash len: ${#body}"
done
echo "If hashes stable across 2 fetches per preset → jury will agree (like httpbin/json 1/8 not /get 5/5 per technical validation)"
for preset in breach no_breach; do
  h1=$(fetch_bundle "$URL?preset=$preset" | sha256sum | cut -c1-16)
  h2=$(fetch_bundle "$URL?preset=$preset" | sha256sum | cut -c1-16)
  if [ "$h1" = "$h2" ]; then echo "✓ $preset stable $h1"; else echo "✗ $preset UNSTABLE $h1 vs $h2 — would be UNDETERMINED"; fi
done
