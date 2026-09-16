# ProveDown Release Repository Inventory

Date: 2026-09-12
Scope: non-destructive reconciliation only. No contract deployment, registration, attestation, deletion, move, revert, reset, clean, commit, or push was performed.

## Current verified deployment

| Item | Current value | Evidence |
|---|---|---|
| Network | Studio Next, chain 61997 | `EVIDENCE.md`, `memory.md` |
| Contract | `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` | Studio address readback and current frontend default |
| Registration | `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a` | FINALIZED, FINISHED_WITH_RETURN, successful; browser SLA |
| Attestation | `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110` | FINALIZED, FINISHED_WITH_RETURN, successful; attestation ID 4 |
| Attestation readback | ID 4, resolved, NO_BREACH, confidence 1000 | `EVIDENCE.md`, `CLAIM-PACKET.md`, `memory.md` |
| Worker | `https://provedown-bundle.contentbounty.workers.dev/bundle` | HTTP 200; two-fetch stable hashes |
| Worker hashes | Browser-SLA query (`sla=browser-smoke-20260909-01`): breach `9a5b14c953b4d2f82a47a2a3ee45265d47f129cec8c583c16ca53a97cbc6333d`; no_breach `e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3` | Read-only curl checks on 2026-09-11 |

The Worker bodies are explicitly synthetic fixture evidence. The downstream Base relay remains mocked.

## Final hardening delta (2026-09-12)

- The ignored `.env.local` public contract value was verified against the current Studio address without printing unrelated values; the frontend default and Studio write helper resolve to the same contract.
- Bradbury-first credential, pre-hackathon, keychain, build-queue, deployment, and post-deploy verification material now carries explicit historical/compatibility labeling.
- Current roadmap/decision language distinguishes GenLayer protocol appeal mechanics from the absent ProveDown application appeal, bond, or slashing flow.
- No frontend layout, contract source, wallet flow, receipt handling, live readback, or chain state was changed in this reconciliation.

## Worktree classification

Classification is for the current `git status --short` inventory. No item was removed.

## Runtime smoke delta (2026-09-12)

The dynamic browser smoke found and fixed a trailing-separator bug in frontend evidence-summary URL parsing. The release helper now fails closed on Worker HTTP/network errors and empty responses. The later custom-contract proof-scope pass also removes default proof context from valid custom routes. These changes are recorded in `memory.md` Checkpoints 17-18 and `CHANGELOG.md` 0.3.8; no contract or chain state changed.

Untracked directories are `frontend/scripts/`, `frontend/tests/`, and `research/`. Their individual files are classified below. The remaining untracked entries are individual files under `scripts/`.

### KEEP: modified runtime, tests, and release records

- `contracts/provedown.py`
- `frontend/index.html`
- `scripts/attest-studio-dev.mjs`
- `scripts/check-env.mjs` (bounded the GenLayer CLI version probe to five seconds after the unbounded probe stalled)
- `scripts/run-lint.sh`
- `tests/test_provedown.py`
- `AGENTS.md`
- `CHANGELOG.md`
- `CLAIM-PACKET.md`
- `COMPETITIVE-POSITION.md`
- `CORE_NOW.md`
- `CUSTOMER-WORKFLOW.md`
- `DEMO.md`
- `EVIDENCE.md`
- `LAUNCH-READINESS.md`
- `PRODUCT-INTERFACE-CONTRACT.md`
- `PRODUCT-SYSTEM.md`
- `PRODUCT-THESIS.md`
- `README.md`
- `SOURCES.md`
- `SUBMISSION-CHECKLIST.md`
- `memory.md`
- `01-genlayer-recon/06-consensus-v06-migration.md`
- `04-competitive-intelligence/uptime-gap-analysis.md`
- `06-adversarial-analysis/02-genlayer-necessity-tests.md`
- `06-adversarial-analysis/05-provedown-technical-validation.md`
- `06-adversarial-analysis/09-final-hardening-pass.md`
- `07-final-thesis/final-product.md`
- `07-final-thesis/hackathon-alignment.md`

### REVIEW: retained records with potentially stale operational context

- `07-final-thesis/implementation-blockers.md` contains pre-deployment blockers that should remain historical until a documentation checkpoint reconciles them with the live deployment.
- `07-final-thesis/implementation-readiness.md` is a design/readiness record with an explicit current-slice reconciliation; retain, but review before submission if its deferred-work wording changes.
- `FINAL-PREFLIGHT-AUDIT.md` contains the original preflight blocker matrix as historical audit evidence; review its active-looking placeholder rows before a final submission checkpoint.
- `KEYCHAIN-WLS2.md` contains setup and historical account notes; retain for reproducibility, but do not treat its Bradbury instructions as the current target.

### KEEP: untracked release files

- `frontend/package.json`
- `frontend/scripts/build.mjs`
- `frontend/scripts/serve.mjs`
- `frontend/tests/release.test.mjs`
- `research/65-final-release-blockers.md`
- `research/66-final-readiness-matrix.md`
- `research/CODEX_FULL_AUDIT.md`
- `research/current-genlayer-environment.md`
- `research/current-hackathon-rules.md`
- `research/frontend-backend-contract.md`
- `research/github-patterns-audit.md`
- `research/interaction-matrix.md`
- `research/uptime-delta.md`
- `research/RELEASE-INVENTORY.md` (this reconciliation record)

These files supply the frontend release checks, current environment notes, research decisions, interaction audit, and release-readiness evidence.

### Legacy script classification: approval required; nothing removed

All five scripts target the historical Bradbury contract `0x72a67E0cF59bCb526AEF0D81391e399C56703590` and `testnetBradbury`, not the current Studio Next deployment. Repository references are limited to the explicitly historical migration audit and this inventory; no package script, frontend path, current release script, or judge-facing current instruction invokes them.

| Script | Runtime behavior | Current-release usefulness | Classification |
|---|---|---|---|
| `scripts/attest_test.mjs` | Writes Bradbury registration and two attestations using the old no-fee path | None; can create unintended historical-chain transactions | **REMOVE** (approval required) |
| `scripts/check_all.mjs` | Read-only Bradbury attestation IDs 1-5 and reputation | Compatibility inspection only | **ARCHIVE** (approval required; retain outside active release path if desired) |
| `scripts/check_att.mjs` | Read-only Bradbury attestation IDs 1-4 and reputation | Compatibility inspection only | **ARCHIVE** (approval required; retain outside active release path if desired) |
| `scripts/simple_test.mjs` | Reads Bradbury, then writes a Bradbury registration | None; can create an unintended transaction | **REMOVE** (approval required) |
| `scripts/verify-live.mjs` | Writes Bradbury healthy/breach registrations and attestations | Superseded by `scripts/attest-studio-dev.mjs`; uses old status-only receipt handling | **REMOVE** (approval required) |

No file was deleted, moved, or archived during this pass. Until an explicit cleanup checkpoint, treat every one of these scripts as non-release historical material and do not execute them.

## Required runtime and reproducibility files

- Contract/runtime: `contracts/provedown.py`, `package.json`, `package-lock.json`, `scripts/attest-studio-dev.mjs`, `scripts/deploy-with-js.mjs`, `scripts/verify-post-deploy.sh`, `scripts/check-env.mjs`.
- Frontend: `frontend/index.html`, `frontend/package.json`, `frontend/scripts/build.mjs`, `frontend/scripts/serve.mjs`, `frontend/tests/release.test.mjs`.
- Worker: `hosting/bundle-worker/worker.js`, `hosting/bundle-worker/wrangler.toml`, `hosting/bundle-worker/package.json`, `hosting/bundle-worker/README.md`, `scripts/check-bundle.sh`.
- Tests: `tests/test_provedown.py`, `scripts/run-tests.sh`, frontend release tests and build checks.
- Documentation/evidence: `README.md`, `DEMO.md`, `EVIDENCE.md`, `CLAIM-PACKET.md`, `SUBMISSION-CHECKLIST.md`, `FINAL-PREFLIGHT-AUDIT.md`, `LAUNCH-READINESS.md`, `memory.md`, `CHANGELOG.md`.
- Research/decisions: `SOURCES.md`, `DECISION-LOG.md`, `ROADMAP-DECISION.md`, `research/`, and the numbered research directories.

All other unchanged tracked files are retained as the research archive, product thesis, architecture, roadmap, and setup record. No tracked file was classified for deletion.

### Complete tracked manifest

`K` means KEEP and `R` means REVIEW. This is the complete 97-file `git ls-files` result, so every tracked item has an explicit disposition.

```text
K .env.example
K .gitignore
K 00-mission.md
K 01-genlayer-recon/01-primitives.md
K 01-genlayer-recon/02-consensus-appeals.md
K 01-genlayer-recon/03-constraints.md
K 01-genlayer-recon/04-developer-workflow.md
K 01-genlayer-recon/05-benchmark-alignment.md
K 01-genlayer-recon/06-consensus-v06-migration.md
K 02-market-research/01-problem-candidates-12.md
K 02-market-research/02-auto-research-deep-dive.md
K 02-market-research/03-agentic-commerce-map.md
K 02-market-research/04-second-order-effects.md
K 03-hackathon-intelligence/01-genlayer-ecosystem.md
K 03-hackathon-intelligence/02-adjacent-ecosystems.md
K 03-hackathon-intelligence/03-saturation-map.md
K 04-competitive-intelligence/01-direct-indirect-substitutes.md
K 04-competitive-intelligence/02-emerging-competitors.md
K 04-competitive-intelligence/03-competitor-reality-check.md
K 04-competitive-intelligence/04-previous-product-review.md
K 04-competitive-intelligence/uptime-gap-analysis.md
K 05-opportunity-map/01-scoring-framework.md
K 05-opportunity-map/02-ranked-12.md
K 05-opportunity-map/03-ranked-8.md
K 05-opportunity-map/04-final-4.md
K 05-opportunity-map/05-final-2-adversarial.md
K 06-adversarial-analysis/01-kill-tests.md
K 06-adversarial-analysis/02-genlayer-necessity-tests.md
K 06-adversarial-analysis/03-security-models.md
K 06-adversarial-analysis/04-economic-models.md
K 06-adversarial-analysis/05-provedown-technical-validation.md
K 06-adversarial-analysis/06-provedown-assumption-validation.md
K 06-adversarial-analysis/07-provedown-wedge-challenge.md
K 06-adversarial-analysis/08-procurement-vs-sla.md
K 06-adversarial-analysis/09-final-hardening-pass.md
K 07-final-thesis/01-startup-test.md
K 07-final-thesis/02-architecture.md
K 07-final-thesis/03-roadmap.md
K 07-final-thesis/feature-synthesis.md
K 07-final-thesis/final-product.md
K 07-final-thesis/hackathon-alignment.md
R 07-final-thesis/implementation-blockers.md
R 07-final-thesis/implementation-readiness.md
K 07-final-thesis/thesis-check.md
K AGENTS.md
K BUSINESS-MODEL.md
K CHANGELOG.md
K CLAIM-PACKET.md
K COMPETITIVE-POSITION.md
K CORE_NOW.md
K CREDENTIALS-REQUIRED.md
K CUSTOMER-WORKFLOW.md
K DECISION-LOG.md
K DEMO.md
K DOWNSTREAM-ACTION.md
K EVIDENCE.md
K FEE-ECONOMICS.md
R FINAL-PREFLIGHT-AUDIT.md
K IMPLEMENTATION-ORDER.md
R KEYCHAIN-WLS2.md
K LAUNCH-READINESS.md
K NEXT-BUILD-QUEUE.md
K PLATFORM_VISION.md
K POST-HACKATHON.md
K PRE-HACKATHON-CHECKLIST.md
K PRODUCT-INTERFACE-CONTRACT.md
K PRODUCT-METRICS.md
K PRODUCT-SYSTEM.md
K PRODUCT-THESIS.md
K README.md
K ROADMAP-DECISION.md
K ROADMAP.md
K SOURCES.md
K SUBMISSION-CHECKLIST.md
K contracts/provedown.py
K design.md
K frontend-gap-analysis.md
K frontend-hci-audit.md
K frontend/index.html
K hosting/bundle-worker/README.md
K hosting/bundle-worker/package.json
K hosting/bundle-worker/worker.js
K hosting/bundle-worker/wrangler.toml
K memory.md
K package-lock.json
K package.json
K scripts/attest-studio-dev.mjs
K scripts/check-bundle.sh
K scripts/check-env.mjs
K scripts/deploy-bradbury.sh
K scripts/deploy-studio.sh
K scripts/deploy-with-js.mjs
K scripts/run-lint.sh
K scripts/run-tests.sh
K scripts/setup-frontend.sh
K scripts/verify-post-deploy.sh
K tests/test_provedown.py
```

## Deployment reference reconciliation

| Occurrence class | Locations | Treatment |
|---|---|---|
| Current/live | `frontend/index.html`, `scripts/attest-studio-dev.mjs`, ignored `.env.local`, `DEMO.md`, `EVIDENCE.md`, `CLAIM-PACKET.md`, `SUBMISSION-CHECKLIST.md`, `LAUNCH-READINESS.md`, `PRODUCT-INTERFACE-CONTRACT.md`, `CORE_NOW.md`, `07-final-thesis/implementation-readiness.md`, `research/current-genlayer-environment.md`, `research/CODEX_FULL_AUDIT.md`, `memory.md`, `CHANGELOG.md` | Uses the Studio Next contract address or records the current finalized browser transactions. |
| Historical evidence | `EVIDENCE.md` compatibility section, `LAUNCH-READINESS.md` Bradbury row, `01-genlayer-recon/06-consensus-v06-migration.md`, `memory.md`, `CHANGELOG.md`, and older research records | Retained and labeled as prior deployment/compatibility evidence; not rewritten silently. |
| Stale active reference | The five untracked scripts classified in the legacy-script table; ignored `.env.local` had a legacy `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS` before this pass | The local variable is now reconciled; script cleanup still requires a future approval checkpoint. Do not invoke the old write scripts. |
| Irrelevant artifact | Generated `frontend/dist/index.html` contains the current contract because it is a byte-for-byte release build of the source page; generated caches are listed below | Ignored; not authoritative release source. |

### Exact current-reference occurrence classification

- Current/live runtime or local configuration reference: `scripts/attest-studio-dev.mjs`, `frontend/index.html`, ignored `.env.local`, `07-final-thesis/implementation-readiness.md`, `LAUNCH-READINESS.md`, `DEMO.md`, `PRODUCT-INTERFACE-CONTRACT.md`, `CORE_NOW.md`, `research/current-genlayer-environment.md`, `research/CODEX_FULL_AUDIT.md`, `SUBMISSION-CHECKLIST.md`, `CLAIM-PACKET.md`, and `EVIDENCE.md`.
- Current/live browser transaction evidence: `DEMO.md`, `SUBMISSION-CHECKLIST.md`, `CLAIM-PACKET.md`, `EVIDENCE.md`, `research/current-genlayer-environment.md`, `research/CODEX_FULL_AUDIT.md`, `memory.md`, and `CHANGELOG.md`.
- Historical checkpoint that accurately names the still-current contract: the dated entries in `memory.md` and `CHANGELOG.md`.
- Current reconciliation record: this file's deployment and occurrence tables.
- Irrelevant generated occurrence: ignored `frontend/dist/index.html`, produced from the current source by the passing build.
- Stale active occurrence of the exact current contract or either current browser transaction hash: none.

The current exact registration and attestation hashes were searched across tracked, untracked, and ignored files (excluding `.git/` and dependency contents). No conflicting occurrence of either current hash was found. The current contract address is the only address used by the current Studio frontend/default write script; other addresses are documented historical deployments or stale untracked helpers.

## Judge-facing source-of-truth audit

| Search area | Classification | Current treatment |
|---|---|---|
| Studio Next contract `0x278CbC...7aC1`, chain 61997, browser registration/attestation hashes | **CURRENT** | `EVIDENCE.md` is the canonical source; current frontend and release docs point to this deployment. |
| Bradbury contracts, 61999/4221-era records, prior Studio addresses, old attestation IDs and receipts | **HISTORICAL-CLEAR** | Kept only in dated checkpoints, compatibility sections, or files explicitly marked historical/superseded. |
| Legacy Bradbury helper scripts and the former local public-contract value | **STALE** | The ignored local value was reconciled in this pass. The five scripts are classified in the legacy-script table and remain untouched pending approval. |
| Old current-facing claims about only IDs 1-3, `60/2/1` as the current reputation, absent fee UI, absent wallet smoke, or no build artifact | **FIXED** | Updated in `PRODUCT-INTERFACE-CONTRACT.md`, `PRODUCT-SYSTEM.md`, `research/frontend-backend-contract.md`, `README.md`, `SUBMISSION-CHECKLIST.md`, `ROADMAP-DECISION.md`, and release records. |
| Base/Hyperlane settlement, application appeal/bond/slashing, production monitoring, real customer measurements, mainnet/fiat costs, and per-SLO accuracy | **MISLEADING if presented as current** | Current-facing docs now label these mocked, deferred, synthetic, unknown, or unproven. Historical research retains them only behind explicit historical/design labels. |
| Obsolete Worker placeholders (`your-subdomain`) or fallback URLs (`httpbin.org`) | **HISTORICAL-CLEAR / SETUP FALLBACK** | They remain only in `.env.example`, Worker setup notes, or generic verification fallback scripts; the deployed Worker URL is the sole current release URL. |

The audit covered current docs, source, scripts, numbered research, untracked research records, and ignored `.env.local`/`frontend/dist` (excluding dependency contents). No active judge-facing stale deployment link remains after the edits above.

## Intentionally historical files and sections

- `FINAL-PREFLIGHT-AUDIT.md`: explicitly labeled 2026-09-02 pre-deployment baseline.
- `01-genlayer-recon/06-consensus-v06-migration.md`: prior migration and deployment evidence.
- `EVIDENCE.md`: Bradbury compatibility section and dated prior re-verification rows.
- `LAUNCH-READINESS.md`: explicitly labeled Bradbury compatibility row.
- `memory.md` and `CHANGELOG.md`: chronological checkpoints; older addresses, receipts, tool versions, and reputation states are retained as dated evidence.
- `07-final-thesis/implementation-blockers.md` and `KEYCHAIN-WLS2.md`: setup/blocker history retained for reproducibility and marked REVIEW above.

## Intentionally ignored files (KEEP IGNORED; do not stage)

- `.env.local`: local configuration; ignored and never printed. Its two public contract variables now both resolve to the current Studio contract; private values remain local and were not exposed.
- `node_modules/`: installed dependencies.
- `frontend/dist/`: generated release output.
- `.pytest_cache/`, `contracts/__pycache__/`, `tests/__pycache__/`: generated test/compile artifacts.
- `.env`, `.env.*.local`, `*.key`, `*.pem`, `keystores/`, `.genlayer/`, `.wrangler/`, `.next/`, `build/`, `.vercel`: secret, credential, tool, or build outputs protected by `.gitignore`.

## Verification record

- `npm --prefix frontend run test`: PASS, 1 test file / 1 test passed.
- `npm --prefix frontend run build`: PASS, 23 release checks passed; generated `frontend/dist/index.html`.
- `python3 -m py_compile contracts/provedown.py`: PASS.
- `python3 -m pytest tests/test_provedown.py -v`: PASS, 13 analog tests.
- `git diff --check`: PASS.
- `.env.local` ignore check: PASS (`.gitignore:3`).
- Tracked and generated-output secret scans: PASS; no private-key block, concrete API key, token, or credential value found. Documentation placeholders and variable names were not treated as leaked values.
- Worker two-fetch checks: PASS, full `scripts/check-bundle.sh` returned HTTP 200 and identical hashes for all four presets; required stable checks were `breach` `b4fc2013862e316e` and `no_breach` `64e6c84f01418b89`. The browser-SLA query independently returned `9a5b14c9...` for `breach` and attestation-4-matching `e33f6897...` for `no_breach`.
- `node scripts/check-env.mjs`: PASS for masked required-value and tool-version checks after bounding the GenLayer CLI probe. The CLI version probe timed out as expected; the independent connectivity probes returned Studio HTTP 405 (responsive POST endpoint) and Worker HTTP 200. No value was printed unmasked.
- Explorer/link checks: PASS; the current contract address, browser registration transaction, and browser attestation transaction URLs each returned HTTP 200.
- `bash scripts/run-lint.sh`: expected non-clean result with exactly two documented nested nondeterministic reachability advisories at `contracts/provedown.py:214` and `:311`; `py_compile`, analog tests, and the finalized Studio deployment remain successful.

## Lint advisory assessment

The two `genvm-lint 0.11.1rc2` diagnostics are category **(c), known tooling limitation/advisory**. Both nondeterministic calls are inside `run_judgment`, the callback passed to `gl.vm.run_nondet_default` (`contracts/provedown.py:211-214`, `:311`, `:402`). The analyzer reports the nested callback as unreachable, but the same deployed structure has finalized Studio attestations exercising `web.render`, `exec_prompt`, consensus, and storage. Changing the callback structure would require a contract redeploy and could alter semantics, so the source is unchanged and the warning remains documented.

## Removal and checkpoint decisions

No removal is authorized by this reconciliation. A future checkpoint should decide whether to delete or archive the five stale Bradbury scripts and, separately, whether any historical-looking preflight/blocker prose still belongs in the public package. This file and the existing `memory.md`/`CHANGELOG.md` records are the proposed handoff artifacts; no commit or push was made.
