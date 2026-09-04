#!/usr/bin/env bash
set -e
echo "=== lint: genvm-lint check contracts/provedown.py ==="
# Try genlayer lint (venv RC first) if available, else python -m py_compile fallback
if [ -x /tmp/provedown-rc-venv/bin/genvm-lint ]; then
  /tmp/provedown-rc-venv/bin/genvm-lint lint contracts/provedown.py
elif command -v genvm-lint >/dev/null 2>&1; then
  genvm-lint check contracts/provedown.py --json || genvm-lint check contracts/provedown.py
else
  echo "genvm-lint not in PATH — fallback: python -m py_compile (checks syntax only)"
  python3 -m py_compile contracts/provedown.py && echo "py_compile OK (syntax)"
  echo "NOTE: Install genvm-linter==0.11.1rc2 for full checks per 01-genlayer-recon/06"
fi
