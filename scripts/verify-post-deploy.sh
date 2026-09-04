#!/usr/bin/env bash
set -e
CONTRACT=${1:-$NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS}
if [ -z "$CONTRACT" ] || [[ "$CONTRACT" == *"0x..."* ]]; then
  echo "Usage: ./scripts/verify-post-deploy.sh 0xYOUR_CONTRACT"
  echo "Or set NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS in .env.local"
  exit 1
fi
echo "=== Post-deploy verification $CONTRACT ==="
echo "Explorer: https://explorer-bradbury.genlayer.com/address/$CONTRACT"
genlayer network set testnetBradbury
echo ""
echo "1. Read SLA (should be missing initially → EXPECTED error):"
genlayer call $CONTRACT get_sla --args '["demo-healthy"]' --network testnetBradbury || echo " → as expected, not yet registered"

echo ""
echo "2. Register SLA (preset no_breach):"
genlayer write $CONTRACT register_sla --args '["demo-healthy","https://example.com","https://httpbin.org/json","{\"p95_threshold\":2000,\"error_threshold\":0.01,\"fill_threshold\":0.80,\"match_threshold\":0.85}"]' --network testnetBradbury || true

echo ""
echo "3. Request attestation (jury: expect 30-60s to ACCEPTED, then FINALIZED window):"
TX=$(genlayer write $CONTRACT request_attestation --args '["demo-healthy"]' --network testnetBradbury 2>&1 | grep -o '0x[0-9a-fA-F]*' | head -n1)
echo "TX $TX"
echo "Explorer TX: https://explorer-bradbury.genlayer.com/tx/$TX"
if [ -n "$TX" ]; then
  echo "Waiting receipt..."
  genlayer receipt $TX --network testnetBradbury --status ACCEPTED --retries 60 --interval 5000 || true
  echo "Trace:"
  genlayer trace $TX --network testnetBradbury || true
fi

echo ""
echo "4. Read attestation:"
genlayer call $CONTRACT get_attestation --args '["1"]' --network testnetBradbury || true

echo ""
echo "5. Reputation:"
genlayer call $CONTRACT get_reputation --args '["https://example.com"]' --network testnetBradbury || true

echo ""
echo "6. Ramdom notes: check-env + bundle worker reachability:"
node scripts/check-env.mjs || true
