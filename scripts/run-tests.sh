#!/usr/bin/env bash
set -e
echo "=== unit/analog tests ==="
python3 -m pytest tests/test_provedown.py -v
echo ""
echo "=== python analog ==="
python3 tests/test_provedown.py
