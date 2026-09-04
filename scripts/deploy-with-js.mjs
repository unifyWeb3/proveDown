#!/usr/bin/env node
// Deploy ProveDown via genlayer-js (WSL-safe, no OS keychain)
// v0.6 fee-aware: studio-dev (primary, 61997) uses estimate + fees + FINALIZED + isSuccessful.
// Bradbury (compat) keeps legacy no-fee path. See 01-genlayer-recon/06-consensus-v06-migration.md
import { readFileSync } from 'fs';
import path from 'path';
import { createClient, createAccount, isSuccessful } from 'genlayer-js';
import { testnetBradbury, studioDevnet } from 'genlayer-js/chains';

const network = process.env.GENLAYER_NETWORK || 'studio-dev';
const chain = network === 'testnetBradbury' ? testnetBradbury : studioDevnet;

const rawKey = process.env.GENLAYER_PRIVATE_KEY;
if (!rawKey) {
  console.error('GENLAYER_PRIVATE_KEY env var is not set. Export it before running:');
  console.error('  export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY startup/.env.local | cut -d= -f2 | tr -d "\\r\\n ")');
  process.exit(1);
}
const privateKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`);

// Use startup as cwd if run from /home/unify
const cwd = process.cwd().endsWith('startup') ? process.cwd() : path.join(process.cwd(), 'startup');
const contractPath = path.join(cwd, 'contracts/provedown.py');
console.log(`Deploying ${contractPath} to ${network} (${chain.id}) via genlayer-js...`);
const code = new Uint8Array(readFileSync(contractPath));
const account = createAccount(privateKey);
const client = createClient({ chain, account });
console.log(`Deployer: ${account.address}`);

let deployTx;
if (network === 'testnetBradbury') {
  // Legacy compat path (pre-v0.6, no fees)
  deployTx = await client.deployContract({ code, args: [] });
} else {
  // v0.6 fee-aware path
  const est = await client.estimateTransactionFees({ preset: 'standard' });
  console.log(`Fee quote: feeValue=${est.feeValue.toString()}`);
  deployTx = await client.deployContract({ code, args: [], fees: { distribution: est.distribution, feeValue: est.feeValue } });
}
console.log(`Deploy transaction submitted: ${deployTx}`);
console.log('Waiting for FINALIZED...');
const receipt = await client.waitForTransactionReceipt({ hash: deployTx, waitUntil: 'finalized', retries: 200 });
const ok = isSuccessful(receipt);
console.log(`Receipt: status=${receipt.status_name} exec=${receipt.txExecutionResultName ?? receipt.txExecutionResult} isSuccessful=${ok}`);
if (!ok) {
  console.error('Deployment did NOT succeed (see status/exec above). Check explorer for details.');
  process.exit(1);
}
const r = receipt;
const contractAddress = r?.txDataDecoded?.contractAddress ?? r?.toAddress ?? r?.to_address ?? r?.data?.contract_address;
const explorer = chain.id === 4221 ? 'https://explorer-bradbury.genlayer.com' : 'https://explorer-studio-dev.genlayer.com';
console.log(`\n✓ ProveDown deployed on ${network}!`);
console.log(`  Contract address : ${contractAddress}`);
console.log(`  Deploy tx hash   : ${deployTx}`);
console.log(`  Explorer         : ${explorer}/address/${contractAddress}`);
console.log(`\nAdd to startup/.env.local:`);
console.log(`  NEXT_PUBLIC_PROVEDOWN_CONTRACT_STUDIO_DEV=${contractAddress}`);
