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
  ['wallet writes use finalized success checks', html.includes("writeFinalized(wallet.client, 'register_sla'") && html.includes("writeFinalized(wallet.client, 'request_attestation'") && html.includes("waitUntil: 'finalized'") && html.includes('isSuccessful(receipt)')],
  ['contract reads remain explicit', html.includes("functionName: 'get_attestation'") && html.includes("functionName: 'get_reputation'") && html.includes("functionName: 'get_sla'")],
  ['wallet states remain explicit', html.includes('NO WALLET') && html.includes('WALLET REJECTION') && html.includes('WRONG NETWORK') && html.includes('FAILED TRANSACTION')],
  ['three-view shell is explicit', html.includes('data-view="overview"') && html.includes('data-view="verify"') && html.includes('data-view="proof"') && html.includes('const ROUTES = {')],
  ['query and history state are preserved', html.includes('var suffix = location.search') && html.includes('history.pushState') && html.includes('history.replaceState') && html.includes("window.addEventListener('popstate'")],
  ['accessible agreement form is named', html.includes('form id="setupForm" novalidate aria-labelledby="setupTitle"')],
  ['hash-bound evidence display', html.includes('actual !== expected') && html.includes('Fingerprint mismatch') && html.includes('hashBundle')],
  ['registration readback fails closed', html.includes('registrationReadback(stored') && html.includes('Contract readback mismatch') && html.includes('Canonical SLO JSON')],
  ['attestation and reputation readback follow finality', html.includes("functionName: 'get_attestation', args: [createdId]") && html.includes("functionName: 'get_reputation', args: [storedSla.api_url]")],
  ['fee estimate and receipt fields are bounded', html.includes('Fee estimate used') && html.includes('Finalized receipt fees') && html.includes('Receipt fee detail unavailable')],
  ['required verdict state copy', html.includes('No definitive decision was made.') && html.includes('Validators did not agree.')],
  ['current proof references', html.includes('0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a') && html.includes('0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110')],
  ['required query case support', html.includes('parseCases') && html.includes('CASE_TX') && html.includes("'4'" )],
  ['proof scope is keyed by contract and case selection', html.includes('function pinnedProofAvailable()') && html.includes('IS_DEFAULT_CONTRACT') && html.includes("ids.indexOf('4')") && html.includes('dynamic receipt/finality has not been mapped')],
  ['registration preflights existing agreement IDs', html.includes('preflightAgreementId') && html.includes('AGREEMENT EXISTS') && html.toLowerCase().includes('no wallet approval was requested')],
  ['first viewport thesis and overview', html.includes('HTTP 200 is reachability, not fulfillment.') && html.includes('data-view="overview"') && html.includes('REACHABLE BUT NOT FULFILLED')],
  ['accessibility and responsive baseline', html.includes('aria-live') && html.includes('prefers-reduced-motion') && html.includes('@media (max-width: 640px)')],
  ['metadata present', html.includes('property="og:title"') && html.includes('name="theme-color"') && html.includes('rel="icon"')],
  ['no decorative gradients', !html.includes('linear-gradient')],
  ['quote escaping', html.includes(".replace(/\"/g, '&quot;')") && html.includes(".replace(/'/g, '&#39;')")],
  ['data-only copy and retry controls', html.includes('data-copy-hash=') && html.includes('data-action=') && html.includes("getAttribute('data-action')") && !html.includes('onclick=' )],
  ['routing survives SDK failure', !/^import\s/m.test(html) && html.includes('await import("https://esm.sh/genlayer-js@2.0.0-rc.1")') && html.includes('function showSdkDegraded()') && html.includes('Live chain reads unavailable. Product navigation remains available.') && html.includes('window.__provedown')],
  ['preview and registration outputs are separated', html.includes('id="previewStatus"') && html.includes("getElementById('previewStatus')") && html.includes("document.getElementById('registerStatus')")],
  ['case selector is gated during reads', html.includes('id="caseBusyNote"') && html.includes('caseSet.disabled = busy') && html.includes('var requestedIds = visibleCaseIds.slice()')],
  ['wallet gate precedes write preflight', html.includes('function hasInjectedWallet()') && html.includes('Reads are available. Registering or requesting a new attestation requires a wallet.')],
  ['query fallback banner is visible', html.includes('id="queryNotice"') && html.includes('Invalid link parameters were ignored. Showing the default verified configuration.')],
  ['agreement and SLO errors name the field', html.includes('function describeAgreementError(') && html.includes('function describeSloError()') && html.includes('Use 1–128 characters')],
  ['write progress tracker is explicit', html.includes('function writeTrackerHtml(') && html.includes('aria-label="Write progress"')],
  ['noscript fallback is present', html.includes('<noscript>') && html.includes('JavaScript is required for live ProveDown reads')],
  ['no public private-key variable', !/NEXT_PUBLIC_[A-Z0-9_]*(PRIVATE|SECRET|KEY)/.test(html)]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) throw new Error(`Frontend release checks failed: ${failed.join(', ')}`);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await writeFile(output, html);
console.log(`Built ${output}`);
console.log(`${checks.length} release checks passed`);
