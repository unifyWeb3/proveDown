#!/usr/bin/env node
// Fee-aware attestation runner for Studio Next 61997 (Consensus v0.6 RC).
// Usage: GENLAYER_PRIVATE_KEY=... node scripts/attest-studio-dev.mjs [contractAddress]
// Registers demo-healthy / demo-breach / demo-empty (idempotent) and requests
// attestations A (expect NO_BREACH), B (expect BREACH), C (empty bundle).
// Requires: genlayer-js@2.0.0-rc.1, funded studio-dev account (built-in faucet 💧
// in https://studio-dev.genlayer.com account selector).
// Do NOT alter implementation to force outcomes — record actual evidence.
import { createClient, createAccount, isSuccessful } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';

const C = process.argv[2] || process.env.NEXT_PUBLIC_PROVEDOWN_CONTRACT_STUDIO_DEV || '0x8faE0025892bA58e5c2E16D10cC414Af47D30d55';
const B = process.env.NEXT_PUBLIC_BUNDLE_WORKER_URL || 'https://provedown-bundle.contentbounty.workers.dev/bundle';
const SLO = JSON.stringify({ p95_threshold: 2000, error_threshold: 0.01, fill_threshold: 0.80, match_threshold: 0.85 });

const rawKey = process.env.GENLAYER_PRIVATE_KEY;
if (!rawKey) { console.error('GENLAYER_PRIVATE_KEY missing'); process.exit(1); }
const account = createAccount(rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`);
const client = createClient({ chain: studioDevnet, account });
console.log(`Contract ${C} chain 61997 deployer ${account.address}`);

async function withRetry(fn, tries = 8, label = '') {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) {
      console.log(`  retry ${i + 1}/${tries} ${label}: ${e.message.slice(0, 80)}`);
      await new Promise((r) => setTimeout(r, 8000));
    }
  }
  throw new Error(`retries exhausted (${label})`);
}
async function write(method, args) {
  const est = await withRetry(() => client.estimateTransactionFees({ preset: 'standard' }), 8, 'estimate');
  const tx = await withRetry(() => client.writeContract({ address: C, functionName: method, args, fees: { distribution: est.distribution, feeValue: est.feeValue } }), 8, method);
  console.log(`TX=${tx} fee=${est.feeValue.toString()}`);
  const r = await withRetry(() => client.waitForTransactionReceipt({ hash: tx, waitUntil: 'finalized', retries: 60 }), 8, 'receipt');
  const ok = isSuccessful(r);
  console.log(`STATUS=${r.status_name} EXEC=${r.txExecutionResultName ?? r.txExecutionResult} SUCCESS=${ok} explorer=https://explorer-studio-dev.genlayer.com/tx/${tx}`);
  if (!ok) throw new Error(`transaction not successful: ${tx}`);
  return tx;
}
async function read(method, args) {
  return await withRetry(() => client.readContract({ address: C, functionName: method, args }), 8, method);
}

for (const [id, preset] of [['demo-healthy', 'no_breach'], ['demo-breach', 'breach'], ['demo-empty', 'empty']]) {
  console.log(`--- register ${id} ---`);
  try { await write('register_sla', [id, 'https://example.com', `${B}?preset=${preset}`, SLO]); }
  catch (e) { console.log('FAILED', e.message.slice(0, 200)); }
}
console.log('--- Case A: healthy (expect NO_BREACH) ---');
try { await write('request_attestation', ['demo-healthy']); console.log('ATT_A=' + JSON.stringify(await read('get_attestation', ['1']))); }
catch (e) { console.log('FAILED', e.message.slice(0, 300)); }
console.log('--- Case B: breach (expect BREACH, 200-but-empty-fill still breach) ---');
try { await write('request_attestation', ['demo-breach']); console.log('ATT_B=' + JSON.stringify(await read('get_attestation', ['2']))); }
catch (e) { console.log('FAILED', e.message.slice(0, 300)); }
console.log('--- Case C: empty (expect INCONCLUSIVE or low-conf resolved) ---');
try { await write('request_attestation', ['demo-empty']); console.log('ATT_C=' + JSON.stringify(await read('get_attestation', ['3']))); }
catch (e) { console.log('FAILED', e.message.slice(0, 300)); }
console.log('--- reputation ---');
try { console.log('REP=' + JSON.stringify(await read('get_reputation', ['https://example.com']))); }
catch (e) { console.log('FAILED', e.message.slice(0, 200)); }
