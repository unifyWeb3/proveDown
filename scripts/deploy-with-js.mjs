#!/usr/bin/env node
// Deploy ProveDown via genlayer-js (WSL-safe, no OS keychain)
// Reuses genlayer-jury/deploy_dispute_court_v2.ts pattern
import { readFileSync } from 'fs';
import path from 'path';
import { createClient, createAccount } from 'genlayer-js';
import { testnetBradbury, studionet } from 'genlayer-js/chains';
import { TransactionStatus } from 'genlayer-js/types';

const network = process.env.GENLAYER_NETWORK || 'testnetBradbury';
const chain = network === 'studionet' ? studionet : testnetBradbury;

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

try { await client.initializeConsensusSmartContract(); } catch {}

const deployTx = await client.deployContract({ code, args: [] });
console.log(`Deploy transaction submitted: ${deployTx}`);
console.log('Waiting for ACCEPTED (up to 5 min)...');
const receipt = await client.waitForTransactionReceipt({ hash: deployTx, status: TransactionStatus.ACCEPTED, retries: 200 });
console.log(`Receipt status: ${receipt.statusName} (${receipt.status})`);
if (receipt.status !== 5 && receipt.status !== 6 && receipt.statusName !== 'ACCEPTED' && receipt.statusName !== 'FINALIZED') {
  console.error(`Deployment failed. Receipt: ${JSON.stringify(receipt, null, 2)}`);
  process.exit(1);
}
const r = receipt;
const contractAddress = r?.txDataDecoded?.contractAddress ?? r?.toAddress ?? r?.to_address ?? r?.data?.contract_address;
console.log(`\n✓ ProveDown deployed on ${network}!`);
console.log(`  Contract address : ${contractAddress}`);
console.log(`  Deploy tx hash   : ${deployTx}`);
console.log(`  Explorer         : ${chain.id === 4221 ? 'https://explorer-bradbury.genlayer.com' : 'https://studio.genlayer.com'}/address/${contractAddress}`);
console.log(`\nAdd to startup/.env.local:`);
console.log(`  NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=${contractAddress}`);
