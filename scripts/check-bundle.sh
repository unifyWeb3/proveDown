#!/usr/bin/env bash
set -e
URL=${1:-$NEXT_PUBLIC_BUNDLE_WORKER_URL}
if [ -z "$URL" ]; then URL="https://httpbin.org/json"; echo "No BUNDLE_WORKER_URL, testing fallback $URL"; fi
for preset in breach no_breach ambig empty; do
  echo "=== $preset: $URL?preset=$preset ==="
  curl -s "$URL?preset=$preset" 2>&1 | head -c 300; echo
  echo "hash: $(curl -s "$URL?preset=$preset" | sha256sum | cut -c1-16) len: $(curl -s "$URL?preset=$preset" | wc -c)"
done
echo "If hashes stable across 2 fetches per preset → jury will agree (like httpbin/json 1/8 not /get 5/5 per technical validation)"
for preset in breach no_breach; do
  h1=$(curl -s "$URL?preset=$preset" | sha256sum | cut -c1-16)
  h2=$(curl -s "$URL?preset=$preset" | sha256sum | cut -c1-16)
  if [ "$h1" = "$h2" ]; then echo "✓ $preset stable $h1"; else echo "✗ $preset UNSTABLE $h1 vs $h2 — would be UNDETERMINED"; fi
done
