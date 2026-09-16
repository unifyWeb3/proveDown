#!/usr/bin/env bash
# HISTORICAL / COMPATIBILITY ONLY: this Bradbury deployment helper is not part of
# the current Studio Next 61997 release path. Do not run it for the current demo.
set -e
echo "=== Bradbury deployment (persistent, for hackathon demo) ==="
echo "Pre-req: GENLAYER_PRIVATE_KEY funded via https://testnet-faucet.genlayer.foundation"
echo "Check: genlayer account show --name provedown-deployer"
echo ""
genlayer network set testnetBradbury
echo "Network set to testnetBradbury (4221) — rpc https://rpc-bradbury.genlayer.com explorer https://explorer-bradbury.genlayer.com"
echo ""
if [ -z "$GENLAYER_PRIVATE_KEY" ] && ! grep -q "GENLAYER_PRIVATE_KEY=0x" .env.local 2>/dev/null; then
  echo "ERROR: GENLAYER_PRIVATE_KEY not in env or .env.local — see CREDENTIALS-REQUIRED.md"
  exit 1
fi
echo "Deploying contracts/provedown.py..."
# Estimate first
if command -v genlayer >/dev/null 2>&1; then
  echo "Estimating fees..."
  genlayer estimate-fees ./contracts/provedown.py --network testnetBradbury || echo "estimate skipped (may need --fee-preset)"
fi
echo "Deploy (creates account if needed)..."
# Import if not exists (idempotent)
# genlayer deploy will prompt if account missing; we import from env if needed
if ! genlayer account list 2>&1 | grep -q provedown-deployer; then
  echo "Importing provedown-deployer from GENLAYER_PRIVATE_KEY env..."
  # read from .env.local without printing
  KEY=$(grep GENLAYER_PRIVATE_KEY .env.local 2>/dev/null | cut -d= -f2- | cut -d= -f2 | tr -d ' ' | head -n1)
  if [ -z "$KEY" ]; then KEY=$GENLAYER_PRIVATE_KEY; fi
  # genlayer account import expects interactive; fallback to manual instruction
  echo "Manual: genlayer account import --name provedown-deployer --private-key <your key>"
fi
genlayer account use provedown-deployer || true
echo "Running deploy..."
genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury --fee-preset standard || \
  genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury

echo ""
echo "SUCCESS — set NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=0x... in .env.local"
echo "Verify: https://explorer-bradbury.genlayer.com/address/0x..."
echo "Test: genlayer call <address> get_sla --args '[\"demo-healthy\"]' --network testnetBradbury"
echo "Test: genlayer write <address> register_sla --args '[\"demo-healthy\",\"https://example.com\",\"https://<worker>/bundle?preset=no_breach\",\"{\\\"p95_threshold\\\":2000,...}\"]' --network testnetBradbury"
