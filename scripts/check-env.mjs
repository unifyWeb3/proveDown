#!/usr/bin/env node
/**
 * ProveDown environment validation — does NOT print secrets
 * Usage: node scripts/check-env.mjs [--strict]
 * Exit 0 if minimal for hackathon demo (Bradbury read), 1 otherwise.
 * Checks: Node/Python/genlayer CLI, .env presence, credential existence (not value), RPC connectivity (read-only).
 */
import fs from 'fs';
import { execSync } from 'child_process';
import https from 'https';

const strict = process.argv.includes('--strict');
const required = [
  'GENLAYER_RPC_URL',
  'GENLAYER_PRIVATE_KEY',
  'NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_BUNDLE_WORKER_URL',
];
const optional = [
  'GENLAYER_STUDIO_RPC','BASE_SEPOLIA_RPC_URL','BASE_SEPOLIA_PRIVATE_KEY','HYPERLANE_MAILBOX','OPENROUTER_API_KEY'
];

function existsEnvFile() {
  return fs.existsSync('.env.local') || fs.existsSync('.env');
}
function loadEnv() {
  const files = ['.env.local','.env'];
  const env = {};
  for (const f of files) if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f,'utf8').split('\n')) {
      const m=line.match(/^([A-Z_0-9]+)=(.*)$/);
      if(m) env[m[1]]=m[2].trim();
    }
  }
  // also process.env
  for (const k of [...required,...optional]) if (process.env[k]) env[k]=process.env[k];
  return env;
}
function mask(v){ if(!v) return '(missing)'; if(v.length<10) return '***'; return v.slice(0,6)+'***'+v.slice(-4); }

console.log('=== ProveDown check-env ===');
console.log(`Node ${process.version}  npm ${execSync('npm --version').toString().trim()}`);
try{ console.log(`Python ${execSync('python3 --version').toString().trim()}`);}catch{}
try{ console.log(`genlayer ${execSync('genlayer --version').toString().trim()}`);}catch{ console.log('genlayer CLI: not found');}
console.log(`genlayer-js ${(()=>{try{return JSON.parse(fs.readFileSync('../genlayer-jury/node_modules/genlayer-js/package.json','utf8')).version}catch{return '(not found)';}})()}`);
console.log(`env file present: ${existsEnvFile() ? 'yes (.env.local or .env)' : 'NO — copy .env.example'}`);
const env = loadEnv();
let fail=false;
for (const k of required) {
  const v=env[k];
  const ok = !!v && !v.includes('YOUR_') && !v.includes('0x...') && v.length>5;
  console.log(`${ok?'✓':'✗'} ${k}: ${ok ? (k.includes('PRIVATE_KEY')||k.includes('API_KEY') ? '(present, not shown)' : mask(v)) : '(missing or placeholder)'}`);
  if(!ok) fail=true;
}
for (const k of optional) {
  const v=env[k];
  console.log(`  ${k}: ${v ? (k.includes('PRIVATE_KEY')||k.includes('API_KEY') ? '(present)' : mask(v)) : '(optional, not set)'}`);
}
function checkRpc(url){
  return new Promise(res=>{
    if(!url || url.includes('YOUR_')) return res('skip');
    const req=https.get(url, {timeout:5000}, r=>{ res(`http ${r.statusCode}`); r.resume(); });
    req.on('error', e=>res(`fail ${e.code||e.message}`));
    req.setTimeout(5000, ()=>{ req.destroy(); res('timeout'); });
  });
}
const rpc = env.GENLAYER_RPC_URL || 'https://rpc-bradbury.genlayer.com';
const bundle = env.NEXT_PUBLIC_BUNDLE_WORKER_URL || env.NEXT_PUBLIC_BUNDLE_WORKER_URL;
console.log(`\nConnectivity (read-only, 5s timeout):`);
checkRpc(rpc).then(v=>console.log(`  Bradbury RPC ${rpc}: ${v}`)).then(()=>checkRpc(bundle)).then(v=>console.log(`  Bundle Worker ${bundle||'(not set)'}: ${v}`)).then(()=>{
  if(fail){
    console.log('\nResult: FAIL — required for deploy missing (but read-only demo via Studio may still work)');
    if(strict) process.exit(1);
  } else console.log('\nResult: OK — minimal deploy credentials present');
});
