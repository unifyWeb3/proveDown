# CHANGELOG — ProveDown

**Repo:** `https://github.com/unifyWeb3/proveDown` (private)

## [Unreleased] — 2026-09-16 — Milestone 2 submission-package audit

**Changed:** Added `DEMO-VIDEO-PLAN.md` (75s script + shot list + mandatory disclosures; nothing recorded) and `research/PUBLIC-PACKAGE-MANIFEST.md` (public file-set classification). Corrected two stale `read-only` wordings in `LAUNCH-READINESS.md` (frontend has wallet-backed writes since browser E2E). No runtime, contract, wallet, receipt, deployment, or scope change; no deletion, archive, commit, push, deploy, or transaction.

**Test:** `npm --prefix frontend run test` passed (15); `npm --prefix frontend run build` passed (25 release checks); `python3 -m pytest tests/test_provedown.py -q` passed (13); `python3 -m py_compile contracts/provedown.py` passed; `bash scripts/run-tests.sh` passed (13); Worker hashes stable; masked env check OK; all six pinned Explorer links + Worker URL HTTP 200; `git diff --check` passed. `bash scripts/run-lint.sh` exit 1 with only the two documented advisories at `contracts/provedown.py:214` and `:311`.

**Unresolved risk:** Five legacy Bradbury scripts await explicit REMOVE/ARCHIVE approval (recommendation only, untouched). No live `NO_CONSENSUS` receipt; Studio timestamps unavailable; Worker synthetic; relay mocked. Repo private, dirty, uncommitted. Submission deadline 2026-09-17 15:30 UTC.

## [Unreleased] — 2026-09-15 — Milestone 1 frontend release gate restored

**Changed:** Updated only `frontend/tests/release.test.mjs` and `frontend/scripts/build.mjs` so the proof-scope release assertions match the current `proofScopeFor(contract, caseIds)` implementation (`ids.indexOf('4')` and the explicit `scope === 'browser-smoke'` branch). The implementation was correct; the failing `visibleCaseIds.indexOf('4')` and `hasBrowserCase` checks were stale refactor-specific assertions. No runtime behavior, contract, wallet, receipt, deployment, or product scope changed.

**Test:** `npm --prefix frontend run test` passed (15); `npm --prefix frontend run build` passed (25 release checks); `python3 -m pytest tests/test_provedown.py -q` passed (13); `python3 -m py_compile contracts/provedown.py` passed. `bash scripts/run-lint.sh` exited 1 and remains non-clean only for the two documented nested nondeterministic reachability advisories at `contracts/provedown.py:214` and `:311`.

**Unresolved risk:** The repository remains private, dirty, and uncommitted; no deployment, transaction, or new browser wallet test was performed in this session. Worker evidence remains synthetic, the Base/Hyperlane relay remains mocked, Studio timestamps remain unavailable, no live `NO_CONSENSUS` receipt is pinned, and the final public-package/link/secret scan is still open.

**Next:** Run the public-package/link/secret scan and prepare the demo video. Keep the MVP limited to functional SLO attestation -> finalized verdict -> evidence hash -> reputation.

## [0.3.9] — 2026-09-13 — Three-view frontend app shell and interaction audit

**Changed:** Completed the bounded frontend shell with Overview, Verify, and Proof routes in the same static bundle. Preserved the live Studio read path, wallet-backed registration/attestation lifecycle, finalized receipt/readback gates, fee disclosures, query-string navigation, responsive layout, accessibility scaffolding, and explicit REAL/DERIVED/SYNTHETIC/MOCK labels. Updated `research/FRONTEND-SECTION-AUDIT.md` so it no longer describes the enabled wallet path as read-only. No contract, ABI, deployment, Worker, or chain state changed.

**Evidence:** Current source exposes `/`, `/verify`, and `/proof`; the rebuilt artifact served those routes with HTTP 200 and an unknown path with HTTP 404 in an isolated server smoke. Fresh Chromium/CDP verification covered all three routes at 390/768/1280, query preservation, browser back navigation, custom-proof isolation, and no console/request failures. The pass stopped before any wallet approval or transaction.

**Test:** `npm --prefix frontend test` passed (13, including direct deep-link HTTP smoke); `npm --prefix frontend run build` passed (23 checks); inline module parse passed; Python compilation and 13 analog tests passed; Worker four-preset checks and masked environment check passed; `git diff --check` passed. `genvm-lint` still reports only the two documented nested reachability advisories.

**Unresolved risk:** Human screen-reader testing remains outstanding; the CDP accessibility tree passed. The repository remains private, dirty, and uncommitted; Worker evidence is synthetic, Base/Hyperlane is mocked, and no live `NO_CONSENSUS` receipt is pinned.

**Next:** Curate the exact submission package and run the final link/secret audit. Do not add product scope or perform blockchain writes during that packaging pass.

## [0.3.8] — 2026-09-12 — Custom-route proof disclosure and packaging audit refresh

**Changed:** Custom contract routes now replace default contract/attestation context labels and explicitly hide/reject reuse of pinned Studio proof and fee references. Reconciled stale audit counts and write-count wording with the completed frontend pass. No chain state or contract behavior changed.

**Test:** Frontend test passed; build passed with 23 release checks; 13 analog tests, Python compilation, Worker checks, masked environment check, Explorer link checks, and `git diff --check` passed. `genvm-lint` still reports only the two documented nested reachability advisories.

**Unresolved risk:** The public package/link/secret checkpoint is still open; Worker evidence is synthetic, the relay is mocked, no live `NO_CONSENSUS` receipt is pinned, and the repository remains private and uncommitted.

**Next:** Curate and scan the publication package, then request explicit publication approval.

## [0.3.7] — 2026-09-12 — Release hardening reconciliation

**Changed:** Reconciled the ignored local public contract value with the current Studio Next deployment, completed the repository/source-of-truth inventory, classified five untracked Bradbury helpers for approval-dependent removal or archival, and added explicit historical/compatibility labels to remaining Bradbury-first setup and verification material. Clarified that GenLayer protocol appeal mechanics are distinct from ProveDown's unimplemented application appeal, bond, or slashing flow. No contract, frontend runtime, wallet, receipt, or readback behavior changed.

**Evidence:** Current source of truth remains `EVIDENCE.md`: chain `61997`, contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`, finalized browser registration `0x63f386...`, finalized attestation `0xfe160a...`, attestation `4` `NO_BREACH` confidence `1000`, evidence hash `e33f6897...`, and reputation `66/3/1`. Explorer address and transaction links returned HTTP 200. Worker fixtures remained byte-stable.

**Test:** Frontend test passed; production build passed with 15 checks; Python compilation passed; 13 analog tests passed; masked environment check returned OK; Worker checker passed with stable breach/no-breach hashes; `git diff --check` and tracked/generated secret scans passed. `genvm-lint` reproduced only the two documented nested reachability advisories at contract lines 214 and 311.

**Unresolved risk:** A separate frontend visual-polish pass and public submission-package scan remain. Five legacy Bradbury scripts await explicit removal/archive approval. Worker evidence is synthetic, Base/Hyperlane relay is mocked, Studio timestamps are unavailable, no live `NO_CONSENSUS` receipt exists, and lint remains non-clean by the documented analyzer limitation.

**Next:** `READY FOR FRONTEND POLISH`. Keep the repository private and uncommitted until the later packaging checkpoint is reviewed.

## [0.3.6] — 2026-09-11 — Wallet-backed Studio browser E2E verified

**Changed:** Completed the injected-wallet browser lifecycle against the existing Studio Devnet contract without redeployment: registration readback, fee-bearing finalized receipt, attestation consensus, attestation readback, reputation readback, and evidence hash verification.

**Evidence:** Registration tx `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a`; attestation tx `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110`; both `FINALIZED`, `FINISHED_WITH_RETURN`, and `isSuccessful=true`. Attestation `4` is `resolved` / `NO_BREACH`, confidence `1000`, evidence hash `e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3`; current reputation is `66/3/1`. Exact Worker fetch matches the on-chain hash.

**Test:** Direct Studio receipt/readback checks passed; browser wallet smoke is now live evidence for this run. Worker remains synthetic fixture content and Base relay remains mocked.

**Unresolved risk:** Public submission package/link/secret audit, Studio timestamp availability, Worker provenance, and the two documented nested linter advisories remain open. No commit, push, or publication was performed.

**Next:** Run the final public-package/link/secret audit, capture the browser flow in the demo evidence, and keep the repository private until explicit submission approval.

## [0.3.2] — 2026-09-09 — Fail-closed judge parsing + fresh Studio deployment

**Changed:** Added the permanent operating constitution to `AGENTS.md`, recorded the requested GitHub profile quality audit in `research/github-patterns-audit.md` and `SOURCES.md` S57-S73 (including Ritapossible's Recourse and Vouch), changed malformed/partial LLM responses to explicit `INCONCLUSIVE` instead of resolved `NO_BREACH`, and bound frontend reputation reads to the selected on-chain SLA. Deployed the hardened source to Studio Next contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` and refreshed the pinned frontend/evidence docs.

**Evidence:** Deploy tx `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb`; healthy attestation tx `0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf`; breach tx `0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505`; empty tx `0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a`. All receipts are `FINALIZED`, `FINISHED_WITH_RETURN`, and `isSuccessful=true`.

**Test:** `pytest` 13 passed; Python compilation passed; frontend release test passed; static build passed with 11 checks; masked environment check passed. Full `genvm-lint` still reports two documented nested reachability advisories.

**Unresolved risk:** Browser-injected-wallet runtime smoke is still pending; Worker evidence is synthesized and Base relay remains mocked; unsupported forward-looking appeal/economic language remains in historical research docs and must stay out of judge-facing claims.

**Next:** Run the browser wallet smoke, perform the final public-package/link/secret scan, and keep the repo private until the submission gate is explicitly approved.

## [0.3.3] — 2026-09-09 — Readiness documentation reconciliation

**Changed:** Marked the pre-build preflight/blocker documents as historical and reconciled the active implementation-readiness and launch documents with the shipped Studio Next slice: static frontend, synthesized Worker, breach-only consensus, finalized readback, and documentation/UI-only Relay → Base boundary. Removed unsupported active references to an application appeal method and live settlement.

**Evidence:** Current contract and receipts remain pinned in `EVIDENCE.md`; this checkpoint changes documentation only. `git diff --check` passed before verification.

**Next:** Complete injected-wallet browser smoke and the final public-package/link/secret audit before any submission or publication.

## [0.3.4] — 2026-09-09 — Full reality audit refresh

**Changed:** Refreshed official Agent Tank/GenLayer/Uptime evidence, recorded the requested Recourse/Vouch research, corrected stale blocker matrices, and marked the two previously reported source defects as resolved in current code. Updated the current dated overlap snapshot to 48 mission submissions / 47 entries and recorded 390/768/1280 Chromium shell renders with the wallet/runtime limitation intact.

**Evidence:** Current Studio receipt/readback check, official mission API/docs, Uptime source, `SOURCES.md:S57-S73`, and `research/CODEX_FULL_AUDIT.md`.

**Test:** 13 analog tests, Python compilation, frontend test/build (11 checks), masked environment check, stable Worker hashes, and lint with two documented reachability advisories.

**Next:** Injected-wallet browser smoke and final public-package/link/secret audit. No commit, push, or publication was performed.

## [0.3.5] — 2026-09-09 — Official refresh, RPC cross-check, and stale-claim cleanup

**Changed:** Re-queried Mission 83 (48 submissions / 47 entries), added direct Studio RPC chain/lifecycle/receipt checks, and reconciled active docs with the current contract. Evidence hashes are now explicitly scoped to sanitized/truncated bytes; the Worker is identified as synthetic fixture data; fee-panel status is open; application appeal/bond/slash and settlement claims are deferred. Historical thesis, analog, migration, and hardening documents carry visible superseded banners.

**Evidence:** Mission API and entries endpoint, `eth_chainId=61997`, finalized lifecycle for breach tx `0xf566...ed505`, receipt `status=0x1`, masked environment check, and existing pinned Studio read/receipt evidence.

**Test:** `git diff --check` clean; no application code or live state changed in this documentation-only checkpoint.

**Next:** Injected-wallet browser smoke if available, then final public-package/link/secret audit. Keep the repo private until explicit submission approval.

---

## [0.1.0] — 2026-09-03 — Research + Gym alignment + narrow slice

**Changed:** Full research system 22 files + 56 sources (Gym 93.7% resolvable direct 611k alt 624k, blocked 10% 19) → ProveDown thesis functional SLO quality sidecar.

**Evidence:** `01-genlayer-recon/05-benchmark-alignment.md` (fetched `gym.genlayer.foundation/benchmarks/polymarket/methodology` 2026-09-03), `05-provedown-technical-validation.md` analog breach 3/3 stable injection 2/2, hash 1/8 stable not 5/5.

**Test:** `pytest 5 passed` analog, `py_compile` OK, but **no real Bradbury tx yet** — analog only.

**Uncommitted:** Startup not yet git repo (no commit hash yet).

**Next:** Fund deployer, deploy Worker + contract, verify E2E.

---

## [0.1.1] — 2026-09-03 — Contract narrow slice

**Changed:** `contracts/provedown.py` 362 lines, `hosting/bundle-worker/worker.js` 4 presets, `scripts/deploy-with-js.mjs` per `KEYCHAIN-WLS2.md` (WSL no keychain).

**Evidence:** `contracts/provedown.py:238` `run_nondet_unsafe` breach-only, `48` `greybox_sanitize`, analog hash `9566a8b5`/`9cd4199c`.

**Test:** Analog 5 passed, no real deployment (0 GEN locked).

**Uncommitted:** Same as 0.1.0 + new files, not yet pushed (private).

---

## [0.1.2] — 2026-09-03 — Preflight audit YELLOW

**Changed:** `FINAL-PREFLIGHT-AUDIT.md` YELLOW (3 P0 block E2E: frontend empty, Worker `your-subdomain` 404, contract `0x...` placeholder, 0 GEN), `PRE-HACKATHON-CHECKLIST.md`, `CREDENTIALS-REQUIRED.md`, `LAUNCH-READINESS.md` YELLOW, `KEYCHAIN-WLS2.md`, `DEMO.md`, `04-competitive-intelligence/04-previous-product-review.md`, `07-final-thesis/feature-synthesis.md`, `thesis-check.md`, `implementation-blockers.md`.

**Evidence:** `node scripts/check-env.mjs` 2 ✓ 2 ✗, `genlayer account show` 0 GEN, `ls frontend/` empty, `bash scripts/check-bundle.sh` fallback httpbin vs Worker 404.

**Test:** No real tx — analog only until P0 funded.

**Next:** M1 faucet + M2 Worker deploy → `deploy-with-js.mjs` → `verify-post-deploy.sh` → `setup-frontend.sh` → GREEN.

---

## [0.2.0] — 2026-09-04 — Worker & Contract Live + First Real Attestation

**Changed:** Diagnosed Wrangler static-files error (autoconfig in wrong dir, missing `account_id`), fixed `hosting/bundle-worker/wrangler.toml` (`account_id = "db5a771e35a0543bb7632c65261ee2af"`), deployed Worker via direct API `PUT /workers/scripts/provedown-bundle` (bypass `wrangler deploy` WSL hang) → live `https://provedown-bundle.contentbounty.workers.dev/bundle` (200, 4 presets 116 chars hash stable `b4fc2013` 2/2). Updated `.env.local` Worker URL (was placeholder). Deployed ProveDown via `genlayer-js` `scripts/deploy-with-js.mjs` (fixed `studionet` import, symlinked `node_modules`) → **real Bradbury** `0x72a67E0cF59bCb526AEF0D81391e399C56703590` tx `0x89f1f09c8ba845310353ba8467f751a4633348fc9ebf4145adef05b7a5bf0ae6` ACCEPTED, `register_sla demo-healthy` tx `0x09478238af86d51b508950f5af16abefdc022be9066a10cf988873c5703a715e` ACCEPTED, `request_attestation demo-healthy` tx `0xed5af79f5b4c47c2220440117128b59b6d1b03330356bd9d05e4196719d0a1f6` ACCEPTED with attestation `1` breach false 1000 hash `64e6c84f01418b89` p95 1600 resolved, second breach att `0xd4c2ae...` had attestation not found (honest UNDETERMINED, not fabricated). Created `frontend/index.html` 7.5K static (no Next hang) for demo `register→attest→explorer→hash→reputation`. Reclassified `feature-synthesis.md` to CORE / REINFORCING / 90-DAY / LONG-TERM / IRRELEVANT per second requirement.

**Evidence:** `curl -s .../bundle?preset=breach` 200 `p95 4800` hash stable 2/2, `node scripts/check-env.mjs` 4 ✓ (RPC, PRIVATE_KEY, CONTRACT 0x72a6..., WORKER 200), `genlayer receipt` ACCEPTED, `get_attestation 1` JSON above, `get_reputation` 75.

**Test:** `pytest 5 passed`, `py_compile` OK, Worker 4 presets 200, contract deployed explorer `https://explorer-bradbury.genlayer.com/address/0x72a...`, 1 real attestation resolved (second UNDETERMINED honest).

**Next:** Harden frontend (handle INCONCLUSIVE/no_consensus amber), re-attempt breach with retry, update `LAUNCH-READINESS.md` to reflect Worker+contract live, checkpoint commit.

## 0.3.1 — 2026-09-08

**Changed:** Completed the interrupted backend/frontend lifecycle. Contract v0.3.1 now validates canonical numeric SLOs, rejects conflicting ID reuse, bounds evidence metrics, strips extra bundle fields from the judge prompt, and requires strict boolean consensus. Static frontend now performs wallet-backed `register_sla` and `request_attestation` writes with pinned `genlayer-js@2.0.0-rc.1`, fee estimation, FINALIZED receipt polling, `isSuccessful`, on-chain readback, and exact evidence-hash verification. Added static build/release tests and a local preview server. Profile-derived quality patterns are cited as `S57-S65` in `SOURCES.md`.

**Evidence:** Hardened Studio Devnet contract `0xB5E2F043c9D5f971c347FaC1e6E853eDBE5d955C`; deploy tx `0x65793c043eebcb2e8254755caef7398f88291579f87be8bffcf97881020b1146` FINALIZED/FINISHED_WITH_RETURN/isSuccessful=true. Canonical case receipts: `0xc2bb9792e9ab12a380b6557da4f10650c5b9040a530f6db58185d837ea0f70f9` (NO_BREACH), `0xbb7520c27269773fe94b21c8e2561b2035712b74b264f3dd9874285db56a8028` (BREACH/LATENCY), `0xac8aee5b2f80da675a2260ecb3df433a97bf5baf37889cd5041dd858c9f37909` (INCONCLUSIVE). `bash scripts/run-tests.sh`: 12 passed. Frontend test: 1 passed. Frontend build: 11 release checks passed.

**Next:** Wallet-enabled browser smoke at 390/768/1280 and final public-submission package. The Worker remains synthesized MVP evidence and the Base bridge remains explicitly mocked.

**Commit:** `378d128` → this checkpoint will be `0.2.0`.

---

## [0.3.0] — 2026-09-04 — v0.6 Migration Audit + Uptime Gap + Worker Live Verify

**Changed:** Diagnosed Wrangler cwd error (autoconfig in `startup/` root per log, not missing config; fixed `wrangler.toml` comment to mandate `--cwd`/`-c`, verified live Worker 200×5 presets hash `b4fc2013` stable, no secret). Inspected live Uptime (`uptime_monitor.py` strict_eq is_up, `sla_verifier.py` linear/tiered/full +10%, `sla_agreement.py` worst-shortfall, Vercel cron+KV) → `04-competitive-intelligence/uptime-gap-analysis.md` (14 sections, positioning validated). Wrote `01-genlayer-recon/06-consensus-v06-migration.md` (0.39.2/1.1.8 vs 0.40.0-rc.3/2.0.0-rc.1/0.19.0rc2/0.30.0rc2/0.11.1rc2, studio-dev 61997 vs 61999, fee-profile + estimate + isSuccessful + appealTransaction, old $0.04–0.08 INVALID). Wrote `07-final-thesis/hackathon-alignment.md` (track fit, decisive 200-but-empty→BREACH difference, studio-dev primary, Bradbury compatibility). Updated `feature-synthesis.md` addendum with CORE/REINFORCING/90-DAY/LONG-TERM/REJECT mapping. Validated studio-dev RPC live (GET 405, POST `gen_chainId` → `Method not found` JSON-RPC), `py_compile` OK, `pytest` 5 passed.

**Evidence:** `curl -s .../bundle?preset=breach` 200, `curl -s ...?preset=no_breach` 200, hash twice same, `curl -s https://studio-dev.genlayer.com/api` responsive, `npm view genlayer-js` shows `2.0.0-rc.1`, `genlayer --version 0.39.2` vs required `0.40.0-rc.3`.

**Test:** Worker 5/5 presets 200 PASS, studio-dev RPC PASS, analog 5 PASS; full v0.6 fee-profile/deploy/write/read/nondet lifecycle NOT yet proven (requires RC install).

**Next:** Install coherent RC set, generate `fee-profile.json`, redeploy to studio-dev with fees, verify `isSuccessful` + FINALIZED, then GREEN if E2E holds.

---

## [0.4.0] — 2026-09-04 — Studio Next E2E GREEN (v0.6 migrated)

**Changed:** Contract rewritten for v0.6 (`# v0.3.0` + `5jycge...`, `gl.contract.Contract`, JSON storage, `run_nondet_default`, fenceless `exec_prompt`, malformed guard). Toolchain `genlayer-js@2.0.0-rc.1` + RC pythons. Deployed `0xeE85...` (tx `0x5a34...` FINALIZED FINISHED_WITH_RETURN). Cases A NO_BREACH 980 (`0x5b1c...`), B BREACH 1000 LATENCY (`0xe04d...`, 200-but-fill-72% vs Uptime), C INCONCLUSIVE conf-0 (`0xa218...`); reputation 60/2/1. Fees measured in GEN (deposit ~0.1, consumed ~1e-4, refunded majority). Frontend on esm.sh 2.0.0-rc.1 + `studioDevnet` + live reads + fee-aware writes. Scripts fee-aware (`deploy-with-js.mjs`, new `attest-studio-dev.mjs`). Docs: migration §9 verified, hackathon-alignment, synthesis addendum, LAUNCH-READINESS GREEN.

**Evidence:** Explorer-studio-dev txs above, all FINALIZED + isSuccessful=true; `get_attestation`/`get_reputation` JSON; Worker 200 + hash stable; `pytest` 5 passed; `lint` 3 checks passed.

**Test:** Full acceptance sequence on 61997 (Worker → fee tx → consensus → finalized → hash → frontend reads → explorer). P1s tracked, none blocking.

**Next:** Demo dry-run + submission packaging.

---

## [0.4.1] — 2026-09-04 — Hardening + Demo Ready

**Changed:** Empty-evidence guard tightened (all five metrics required numeric → unanimous refusal stored as explicit INCONCLUSIVE; validator agrees only when leader also refused). 4 new analog tests (`pytest` 9 passed). Redeployed `0xeE85...` (tx `0x5a34...` FINALIZED FINISHED_WITH_RETURN). Re-proved A NO_BREACH 980 (`0x5b1c...`), B BREACH 1000 LATENCY (`0xe04d...`), C INCONCLUSIVE conf-0 (`0xa218...`); reputation 60/2/1. Hardening pass `09-final-hardening-pass.md` (17 attacks). Rewrote `README.md`/`DEMO.md`, created `SUBMISSION-CHECKLIST.md` + `EVIDENCE.md`. Frontend live 3-case reads + differentiation panel.

**Evidence:** `get_attestation 3` inconclusive JSON; explorer-studio-dev txs in `EVIDENCE.md`; `pytest` 9 passed.

**Test:** Full acceptance re-proven on 61997 after fix (3/3 FINALIZED FINISHED_WITH_RETURN isSuccessful=true). P1s tracked, none blocking.

---

## [0.4.2] — 2026-09-05 — HCI Design Phase (no implementation)

**Changed:** Created `design.md` (frontend source of truth), `frontend-hci-audit.md` (15 scores, mean 4.8), `frontend-gap-analysis.md` (7 P0 + 7 P1 + 7 P2 with HCI justification). Inputs: Nielsen 10 heuristics, WCAG 2.2 AA, Cairn/Clasp/Vigil teardowns (concepts only, nothing copied). No product/framework/architecture changes; no frontend code modified.

**Evidence:** Three new docs at repo root; browser automation unavailable (documented limitation).

**Test:** N/A. Existing E2E evidence unchanged (`EVIDENCE.md`).

**Next:** Build phase per `design.md` P0 set, then re-audit.

---

## [0.5.0] — 2026-09-05 — Productization + Phase-0 re-verification (no implementation)

**Changed:** 12 productization docs (thesis → system → workflow → CORE_NOW/PLATFORM_VISION → roadmap → business/competitive/metrics → post-hackathon → decision) + 5 build-prep docs (interface contract, downstream action, build queue, fee economics, claim packet). Fresh Studio Next E2E: atts 4/5/6 FINALIZED (`0x68cf…`/`0x9f31…`/`0x67a8…`), reputation 57/4/2, fee estimate unchanged. No contract/frontend/worker code modified.

**Evidence:** `EVIDENCE.md` re-verification section; `pytest` 9 passed; lint 2 known false-positive advisories.

**Test:** E2E RE-VERIFIED (reads byte-identical, writes 3/3 FINALIZED 43–111s).

---

## [0.5.1] — 2026-09-05 — HCI Build Pass (P0-1…P0-7 implemented)

**Changed:** `frontend/index.html` rewritten per `design.md`: dominant verdict, skeleton + FINALIZED tracker, badge system, friendly errors, REAL/MOCK blocks, a11y baseline, observed-vs-limit rows. Worker: `Access-Control-Allow-Origin: *` added + redeployed (bodies identical, hashes unaffected). Tokens: `--accent` `#5a5ee6`, `--border-strong` `#6b6b6b`.

**Evidence:** Screenshots read at 1280px + 390px (no overflow); CDP interaction tests pass; shipped render branches 10/10 incl. XSS; contrast computed; zero console errors. Re-audit mean 4.8 → 7.7 (`frontend-hci-audit.md`).

**Test:** All 9 UI states verified (NO_CONSENSUS via unit test — no live example, documented).

**Next:** P1 polish; submission packaging.

## [0.5.2] — 2026-09-12 — Runtime smoke and release verification hardening

**Changed:** Fixed evidence-summary URL parsing in `frontend/index.html` so a trailing separator is removed before Worker hash verification. Hardened `scripts/check-bundle.sh` to fail on curl/HTTP errors, time out, and reject empty responses. Added a frontend regression assertion for the parser fix.

**Evidence:** Fresh Studio reads and receipts remain live for contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`; all six pinned receipts are FINALIZED, FINISHED_WITH_RETURN, and successful. Dynamic Chromium smoke rendered observed rows for cases 4, 1, and 2. CDP accessibility tree exposed required landmarks and named controls. Worker four-preset check and repeated breach/no-breach hashes passed; an unreachable endpoint now exits nonzero.

**Test:** 13 analog tests passed; frontend test passed; frontend build passed with 17 checks; Python compilation and shell syntax checks passed; `git diff --check` passed. The two known nested `genvm-lint` reachability advisories remain documented.

**Next:** Curate and scan the public submission package. Keep the repo private and do not expand the MVP.
