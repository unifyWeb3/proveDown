import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const server = await readFile(new URL('../scripts/serve.mjs', import.meta.url), 'utf8');
const frontendRoot = fileURLToPath(new URL('..', import.meta.url));

test('wallet actions preserve the finalized and fail-closed lifecycle', () => {
  assert.match(html, /writeFinalized\(wallet\.client, 'register_sla'/);
  assert.match(html, /writeFinalized\(wallet\.client, 'request_attestation'/);
  assert.match(html, /estimateTransactionFeesForWrite/);
  assert.match(html, /waitUntil: 'finalized'/);
  assert.match(html, /fullTransaction: true/);
  assert.match(html, /isSuccessful\(receipt\)/);
  assert.match(html, /eth_requestAccounts/);
  assert.match(html, /WRONG NETWORK/);
  assert.match(html, /WALLET REJECTION/);
  assert.match(html, /FAILED TRANSACTION/);
  assert.match(html, /NO WALLET/);
  assert.doesNotMatch(html, /onclick=/);
  assert.doesNotMatch(html, /@genlayer\/transaction-kit|@latest/);
});

test('three route views use one document and preserve query state', () => {
  assert.match(html, /data-view="overview"/);
  assert.match(html, /data-view="verify"/);
  assert.match(html, /data-view="proof"/);
  assert.match(html, /const ROUTES = \{/);
  assert.match(html, /history\.pushState/);
  assert.match(html, /history\.replaceState/);
  assert.match(html, /window\.addEventListener\('popstate'/);
  assert.match(html, /var suffix = location\.search/);
  assert.match(html, /history\.pushState\(\{ route: path \}, '', path \+ location\.search\)/);
  assert.match(html, /renderRoute\(location\.pathname, true\)/);
  assert.match(html, /sessionStorage\.setItem\('provedownAgreementId'/);
  assert.match(html, /form id="setupForm" novalidate aria-labelledby="setupTitle"/);
  assert.match(html, /var featured = loaded\[0\]/);
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

test('registration readback matches all authoritative stored fields', () => {
  assert.match(html, /function registrationReadback\(stored, submitted\)/);
  assert.match(html, /stored\.owner/);
  assert.match(html, /stored\.api_url === submitted\.apiUrl/);
  assert.match(html, /stored\.bundle_url === submitted\.bundleUrl/);
  assert.match(html, /stored\.slo_json === submitted\.sloJson/);
  assert.match(html, /Contract readback mismatch/);
  assert.match(html, /Canonical SLO JSON/);
});

test('attestation finalization reads attestation, SLA, and reputation from chain', () => {
  assert.match(html, /findCreatedAttestation/);
  assert.match(html, /functionName: 'get_attestation', args: \[createdId\]/);
  assert.match(html, /functionName: 'get_sla', args: \[slaId\]/);
  assert.match(html, /functionName: 'get_reputation', args: \[storedSla\.api_url\]/);
  assert.match(html, /Finalized chain readback/);
});

test('required verdict states and proof references are present', () => {
  assert.match(html, /No definitive decision was made\./);
  assert.match(html, /Validators did not agree\./);
  assert.match(html, /HTTP 200 is reachability, not fulfillment\./);
  assert.match(html, /0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a/);
  assert.match(html, /0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110/);
  assert.match(html, /e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3/);
  assert.match(html, /id="proofCard"/);
  assert.match(html, /const IS_DEFAULT_CONTRACT = CONTRACT\.toLowerCase\(\) === DEFAULT_CONTRACT\.toLowerCase\(\)/);
  assert.match(html, /function pinnedProofAvailable\(\)/);
  assert.match(html, /ids\.indexOf\('4'\)/);
  assert.match(html, /function applyProofScope\(\)/);
  assert.match(html, /id="verifyContractContext"/);
  assert.match(html, /id="proofAgreementContext"/);
  assert.match(html, /id="proofAttestationContext"/);
  assert.match(html, /Pinned attestation 4 is not reused/);
  assert.match(html, /No pinned proof reused/);
  assert.match(html, /No pinned value from the default deployment is reused or guessed/);
  assert.match(html, /dynamic receipt\/finality has not been mapped/);
  assert.match(html, /function caseTx\(id\)/);
});

test('registration preflights an existing agreement before wallet access', () => {
  assert.match(html, /async function preflightAgreementId\(client, slaId\)/);
  assert.match(html, /function isMissingAgreementError\(error\)/);
  assert.match(html, /This agreement ID is already registered to an existing owner/);
  assert.match(html, /var preflightClient = createClient\(\{ chain: studioDevnet \}\)/);
  assert.match(html, /var preflight = await preflightAgreementId\(preflightClient, slaId\)/);
  assert.match(html, /if \(preflight\.kind === 'exists'\)/);
  assert.match(html, /choose a new unique agreement ID before registering/);
});

test('proof scope keeps browser-smoke references behind default contract and case 4', () => {
  assert.match(html, /const STATIC_CASE_TX = \{/);
  assert.match(html, /if \(String\(id\) === '4'\) return pinnedProofAvailable\(\)/);
  assert.match(html, /if \(scope === 'browser-smoke'\)/);
  assert.match(html, /Browser attestation 4 is not selected/);
  assert.match(html, /pinnedFeePanel.*hidden/);
  assert.match(html, /proofReference.*hidden/);
});

test('fee disclosure is explicit and does not invent values', () => {
  assert.match(html, /Fee estimate used/);
  assert.match(html, /Finalized receipt fees/);
  assert.match(html, /function receiptFeeValues\(receipt\)/);
  assert.match(html, /fees && fees\.deposit/);
  assert.match(html, /fees && fees\.consumed && fees\.consumed\.executionConsumed/);
  assert.match(html, /accounting && accounting\.total_refunded/);
  assert.match(html, /Receipt fee detail unavailable/);
  assert.match(html, /Deposit/);
  assert.match(html, /Consumed/);
  assert.match(html, /Refund/);
  assert.match(html, /Measured on Studio Devnet under these transactions\/configuration/);
  assert.match(html, /0\.000624289200010352 GEN/);
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

test('routing works without the chain SDK (A1)', () => {
  assert.doesNotMatch(html, /^import\s/m);
  assert.ok(html.includes('await import("https://esm.sh/genlayer-js@2.0.0-rc.1")'));
  assert.ok(html.includes('await import("https://esm.sh/genlayer-js@2.0.0-rc.1/chains")'));
  assert.match(html, /function sdkAvailable\(\)/);
  assert.match(html, /function showSdkDegraded\(\)/);
  assert.ok(html.includes('Live chain reads unavailable. Product navigation remains available.'));
  assert.ok(html.includes('id="sdkStatus"'));
  assert.ok((html.match(/const ROUTES = \{/g) || []).length >= 2);
  assert.match(html, /window\.__provedown = window\.__provedown \|\| \{\}/);
});

test('registration proof is never overwritten by preview (A2)', () => {
  assert.ok(html.includes('id="previewStatus"'));
  assert.ok(html.includes("var box = document.getElementById('previewStatus')"));
  assert.match(html, /bundlePreset'\)\.addEventListener\('change'[\s\S]{0,300}getElementById\('previewStatus'\)/);
  assert.ok(html.includes("document.getElementById('registerStatus')"));
  assert.doesNotMatch(html, /previewEvidence\(\)[\s\S]{0,500}getElementById\('registerStatus'\)/);
});

test('case selector cannot race an active read (A3)', () => {
  assert.ok(html.includes('id="caseBusyNote"'));
  assert.match(html, /caseSet\.disabled = busy/);
  assert.match(html, /caseNote\.hidden = !busy/);
  assert.match(html, /var requestedIds = visibleCaseIds\.slice\(\)/);
  assert.match(html, /'case ' \+ id \+ ' ' \+ \(i \+ 1\) \+ ' of ' \+ requestedIds\.length/);
});

test('write actions fail fast without a wallet (A4)', () => {
  assert.match(html, /function hasInjectedWallet\(\)/);
  assert.match(html, /function noWalletHtml\(\)/);
  assert.ok(html.includes('Reads are available. Registering or requesting a new attestation requires a wallet.'));
  const registerBody = html.slice(html.indexOf('async function registerAgreement'));
  assert.ok(registerBody.indexOf('if (!hasInjectedWallet())') < registerBody.indexOf('preflightAgreementId(preflightClient'));
  const attestBody = html.slice(html.indexOf('async function requestAttestation'));
  assert.ok(attestBody.indexOf('if (!hasInjectedWallet())') < attestBody.indexOf("functionName: 'get_sla'"));
});

test('query fallback shows a visible banner (B2)', () => {
  assert.ok(html.includes('id="queryNotice"'));
  assert.ok(html.includes('Invalid link parameters were ignored. Showing the default verified configuration.'));
});

test('agreement and SLO validation name the failing field (B3/B4)', () => {
  assert.match(html, /function describeAgreementError\(/);
  assert.match(html, /function describeSloError\(\)/);
  assert.ok(html.includes('Use 1–128 characters: letters, numbers, dot, dash, underscore, colon.'));
  assert.ok(html.includes('Service limits must be valid JSON.'));
  assert.ok(html.includes('must be between 0 and 1.'));
  assert.ok(html.includes('"p95_threshold" must be 600000 ms or lower.'));
});

test('write lifecycle reuses a visible step tracker (B5)', () => {
  assert.match(html, /function writeTrackerHtml\(/);
  assert.match(html, /function writePhaseIndex\(phase\)/);
  assert.ok(html.includes('aria-label="Write progress"'));
  assert.ok(html.includes('FINALIZED + READ BACK'));
});

test('static server and rewrites cover trailing-slash routes (B1)', () => {
  assert.ok(server.includes("replace(/\\/+$/, '')"));
  assert.ok(html.includes('<noscript>'));
});

test('static server serves only the allowed app-shell routes', () => {
  assert.match(server, /new URL\(req\.url \|\| '\/', 'http:\/\/localhost'\)\.pathname/);
  assert.match(server, /new Set\(\['\/', '\/verify', '\/proof'\]\)/);
  assert.match(server, /appRoutes\.has\(pathname\) \? 'index\.html'/);
});

test('static server serves deep links and preserves route/query variants', async (t) => {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '0'], {
    cwd: frontendRoot,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => child.kill());
  const port = await new Promise((resolve, reject) => {
    let settled = false;
    const deadline = Date.now() + 15000;
    let output = '';
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      output += chunk.toString();
      const match = output.match(/ProveDown frontend: http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) finish(null, Number(match[1]));
    };
    child.stdout.on('data', onData);
    const poll = () => {
      if (settled) return;
      if (Date.now() >= deadline) return finish(new Error(`frontend server did not start (${output.trim()})`));
      setTimeout(poll, 100);
    };
    child.once('error', (error) => finish(error));
    child.once('exit', (code) => finish(new Error(`frontend server exited before start (${code})`)));
    poll();
  });

  const current = '0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1';
  const custom = '0x1111111111111111111111111111111111111111';
  const queries = ['', `?cases=1`, `?cases=4,1,2`, `?cases=99`, `?contract=${custom}&cases=99`];
  const routes = queries.flatMap((query) => [`/${query}`, `/verify${query}`, `/proof${query}`]);
  const responses = await Promise.all(routes.map((route) => fetch(`http://127.0.0.1:${port}${route}`)));
  assert.deepEqual(responses.map((response) => response.status), routes.map(() => 200));
  const bodies = await Promise.all(responses.map((response) => response.text()));
  assert.equal(bodies[1], bodies[2]);
  assert.equal(bodies[6], bodies[7]);
  assert.ok(bodies.every((body) => body === bodies[0]));
  assert.ok(html.includes(current));
  assert.equal(html.includes(custom), false);
  const unknown = await fetch(`http://127.0.0.1:${port}/unknown`);
  assert.equal(unknown.status, 404);
});

test('static server serves trailing-slash app-shell routes', async (t) => {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '0'], {
    cwd: frontendRoot,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => child.kill());
  const port = await new Promise((resolve, reject) => {
    let settled = false;
    const deadline = Date.now() + 15000;
    let output = '';
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      output += chunk.toString();
      const match = output.match(/ProveDown frontend: http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) finish(null, Number(match[1]));
    };
    child.stdout.on('data', onData);
    const poll = () => {
      if (settled) return;
      if (Date.now() >= deadline) return finish(new Error(`frontend server did not start (${output.trim()})`));
      setTimeout(poll, 100);
    };
    child.once('error', (error) => finish(error));
    child.once('exit', (code) => finish(new Error(`frontend server exited before start (${code})`)));
    poll();
  });

  for (const route of ['/verify/', '/proof/']) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.ok(body.includes('data-view="verify"'));
    assert.ok(body.includes('data-view="proof"'));
  }
});
