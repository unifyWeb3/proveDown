import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const server = await readFile(new URL('../scripts/serve.mjs', import.meta.url), 'utf8');

test('frontend pass is strictly read-only', () => {
  assert.doesNotMatch(html, /writeContract|eth_requestAccounts|window\.ethereum|register_sla|request_attestation/);
  assert.match(html, /id="registerBtn"[^>]+disabled/);
  assert.match(html, /id="attestBtn"[^>]+disabled/);
  assert.match(html, /no wallet access, signature, or transaction is requested/);
  assert.doesNotMatch(html, /onclick=/);
  assert.doesNotMatch(html, /@genlayer\/transaction-kit|@latest/);
});

test('untrusted values are escaped and copy uses data attributes', () => {
  assert.match(html, /\.replace\(\/"\/g, '&quot;'\)/);
  assert.match(html, /\.replace\(\/'\/g, '&#39;'\)/);
  assert.match(html, /data-copy-hash=/);
  assert.match(html, /data-action=/);
  assert.match(html, /getAttribute\('data-action'\)/);
});

test('evidence rows are hash-bound and fail closed', () => {
  assert.match(html, /actual !== expected/);
  assert.match(html, /Fingerprint mismatch/);
  assert.match(html, /function hashBundle/);
  assert.match(html, /functionName: 'get_sla'/);
  assert.ok(html.includes("replace(/[.,;:]+$/, '')"));
});

test('reputation reads follow an on-chain agreement subject', () => {
  assert.match(html, /async function resolveReputationSubject\(client\)/);
  assert.match(html, /kind: 'error'/);
  assert.match(html, /subject\.kind === 'missing'/);
  assert.match(html, /functionName: 'get_sla', args: \[id\]/);
  assert.match(html, /functionName: 'get_reputation', args: \[subject\.apiUrl\]/);
  assert.match(html, /browser-smoke-20260909-01/);
});

test('required verdict states and proof references are present', () => {
  assert.match(html, /No definitive decision was made\./);
  assert.match(html, /Validators did not agree\./);
  assert.match(html, /HTTP 200 is reachability, not fulfillment\./);
  assert.match(html, /0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a/);
  assert.match(html, /0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110/);
  assert.match(html, /e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3/);
  assert.match(html, /id="proofCard"/);
});

test('fee disclosure is explicit and does not invent values', () => {
  assert.match(html, /Receipt fee accounting/);
  assert.match(html, /Deposit/);
  assert.match(html, /Consumed/);
  assert.match(html, /Refund/);
  assert.match(html, /Measured on Studio-dev under that transaction\/configuration/);
  assert.match(html, /no value is inferred/);
  assert.match(html, /Timestamp unavailable on Studio Next/);
});

test('contract reads and responsive/a11y scaffolding remain explicit', () => {
  assert.match(html, /functionName: 'get_attestation'/);
  assert.match(html, /functionName: 'get_reputation'/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-describedby="sloHint sloError"/);
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /@media \(max-width: 640px\)/);
  assert.match(html, /meta name="theme-color"/);
  assert.match(html, /property="og:title"/);
});

test('synthetic evidence, mocked relay, and Studio testnet boundaries are labeled', () => {
  assert.match(html, /synthetic fixture evidence/);
  assert.match(html, /Base\/Hyperlane relay/);
  assert.match(html, /STUDIO NEXT · 61997/);
  assert.match(html, /Worker bundles are deterministic fixtures/);
});

test('static server serves index.html for query-string routes', () => {
  assert.match(server, /const pathname = new URL\(req\.url \|\| '\/', 'http:\/\/localhost'\)\.pathname/);
  assert.match(server, /pathname === '\/' \? 'index\.html'/);
});
