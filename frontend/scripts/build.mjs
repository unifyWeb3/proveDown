import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'index.html');
const outputDir = resolve(root, 'dist');
const output = resolve(outputDir, 'index.html');
const html = await readFile(source, 'utf8');

const checks = [
  ['pinned GenLayer SDK', html.includes('genlayer-js@2.0.0-rc.1')],
  ['no unpinned latest import', !html.includes('@latest')],
  ['no removed transaction-kit import', !html.includes('@genlayer/transaction-kit')],
  ['read-only frontend has no wallet/write APIs', !/writeContract|eth_requestAccounts|window\.ethereum|register_sla|request_attestation/.test(html)],
  ['contract reads remain explicit', html.includes("functionName: 'get_attestation'") && html.includes("functionName: 'get_reputation'") && html.includes("functionName: 'get_sla'")],
  ['read-only controls are visibly disabled', html.includes('id="registerBtn"') && html.includes('id="attestBtn"') && html.includes('disabled') && html.includes('MOCKED OUT')],
  ['hash-bound evidence display', html.includes('actual !== expected') && html.includes('Fingerprint mismatch') && html.includes('hashBundle')],
  ['required verdict state copy', html.includes('No definitive decision was made.') && html.includes('Validators did not agree.')],
  ['current proof references', html.includes('0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a') && html.includes('0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110')],
  ['required query case support', html.includes('parseCases') && html.includes('CASE_TX') && html.includes("'4'" )],
  ['first viewport thesis and overview', html.includes('HTTP 200 is reachability, not fulfillment.') && html.includes('id="overview"')],
  ['accessibility and responsive baseline', html.includes('aria-live') && html.includes('prefers-reduced-motion') && html.includes('@media (max-width: 640px)')],
  ['metadata present', html.includes('property="og:title"') && html.includes('name="theme-color"') && html.includes('rel="icon"')],
  ['no decorative gradients', !html.includes('linear-gradient')],
  ['quote escaping', html.includes(".replace(/\"/g, '&quot;')") && html.includes(".replace(/'/g, '&#39;')")],
  ['data-only copy and retry controls', html.includes('data-copy-hash=') && html.includes('data-action=') && html.includes("getAttribute('data-action')") && !html.includes('onclick=' )],
  ['no public private-key variable', !/NEXT_PUBLIC_[A-Z0-9_]*(PRIVATE|SECRET|KEY)/.test(html)]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) throw new Error(`Frontend release checks failed: ${failed.join(', ')}`);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await writeFile(output, html);
console.log(`Built ${output}`);
console.log(`${checks.length} release checks passed`);
