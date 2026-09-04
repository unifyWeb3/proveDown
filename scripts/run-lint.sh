#!/usr/bin/env bash
set -e
echo "=== lint: genvm-lint check contracts/provedown.py ==="
# Try genlayer lint if available, else python -m py_compile fallback
if command -v genvm-lint >/dev/null 2>&1; then
  genvm-lint check contracts/provedown.py --json || genvm-lint check contracts/provedown.py
else
  echo "genvm-lint not in PATH — fallback: python -m py_compile (checks syntax only, not 20+ GenLayer rules)"
  python3 -m py_compile contracts/provedown.py && echo "py_compile OK (syntax)"
  echo "NOTE: Install genvm-lint for full 20+ rule checks per 01-genlayer-recon/04"
fi
