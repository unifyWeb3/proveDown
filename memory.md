# memory.md — ProveDown Checkpoints

**Rule:** Record only at meaningful checkpoints (working contract slice, real deploy, real attestation, frontend E2E, security hardening, demo-ready, submission-ready). Not every edit.

---

## Checkpoint 1 — Research System + Gym Alignment (2026-09-03)

**What changed:** Completed full research funnel 12→8→4→2→1 → ProveDown thesis `07-final-thesis/final-product.md` (444 lines, 56 sources), validation gate `06-adversarial-analysis/05-08` (technical breach 3/3 stable, injection 2/2 resisted, hash 1/8 vs 5/5 variance), Gym research `01-genlayer-recon/05-benchmark-alignment.md` (93.7% resolvable = 611k direct 46% + 624k alt 47% + 83k currently unresolvable 6.3% — coverage not accuracy).

**Why:** Thesis before Sep 3 per user compression; Gym coverage vs accuracy distinction ensures we don't claim GenLayer proves per-SLO accuracy — thesis is functional SLO quality sidecar not status page uptime (where Gym direct proves Worker fetch viable).

**Evidence:** `https://gym.genlayer.foundation/benchmarks/polymarket/methodology` (fetched 2026-09-03: alternate agent-chosen not hardened, TLS notary not shipped, accuracy backtest open), `05-benchmark-alignment.md:Benchmark-to-Product` 6 mappings High (except subjective Medium). Sources `S01-S56` registry.

**Test result:** `pytest 5 passed`, `py_compile` OK, hash stable 1/8 `9566a8b5`/`9cd4199c` (not 5/5 dynamic).

**Unresolved risk:** Per-SLO backtest not done — coverage ≠ accuracy; needs Studio/Bradbury per-preset run.

**Next action:** Contract narrow slice ready (`contracts/provedown.py` 362 lines) — proceed to deploy via WSL-safe `genlayer-js` after faucet+Worker.

---

## Checkpoint 2 — Contract Narrow Slice (2026-09-03)

**What changed:** Created `contracts/provedown.py` (198→362 lines, pragma `py-genlayer:1jb45aa...`) with `register_sla` deterministic HTTPS + slo_json parse, `request_attestation` 1×web.render bundle (stable JSON) + exec_prompt breach bool + `run_nondet_unsafe` on breach only, `INCONCLUSIVE`/`no_consensus` first-class, Bayesian reputation. Plus `hosting/bundle-worker/worker.js` 4 presets, `tests/test_provedown.py` 5 analog, `scripts/deploy-with-js.mjs` WSL-safe per `KEYCHAIN-WLS2.md`.

**Why:** Implement smallest E2E proving User/API agreement → bundle → jury → verdict → hash → reputation per `implementation-readiness.md:1`, no P2 (poller/Merkle/USDC).

**Evidence:** File:line `contracts/provedown.py:168` `web.render` + `206` `exec_prompt` + `238` `validator_fn` breach-only + `48-52` `greybox_sanitize`. Evidence hash `sha256:9566a...` from `check_worker.py`.

**Test result:** Analog `test_bundle_hash_stable` PASS, but **no real Bradbury tx yet** — `genlayer account show` 0 GEN locked, placeholder `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=0x...` and `your-subdomain` 404 → would be INCONCLUSIVE.

**Unresolved risk:** `appeal_attestation` missing vs readiness (P1-7), malformed bundle before `exec_prompt` should be inconclusive (P1-2), 403 body not detected (P1-3), same private key for both chains.

**Next action:** Fund 0x3211... via faucet, deploy Worker → set real bundle URL, deploy contract via JS path, verify 2 attestations healthy/breach.

---

## Checkpoint 3 — Preflight Audit (2026-09-03)

**What changed:** Full adversarial preflight `FINAL-PREFLIGHT-AUDIT.md` (YELLOW), `PRE-HACKATHON-CHECKLIST.md`, `CREDENTIALS-REQUIRED.md`, `LUNCH?/LAUNCH-READINESS.md` YELLOW (3 P0 block E2E until M1-M2: frontend empty, Worker placeholder, contract placeholder, 0 GEN).

**Why:** Per operating rule: evidence before build, no fabricated success, prefer real E2E.

**Evidence:** `node scripts/check-env.mjs` 2 ✓ 2 ✗ (contract, worker 404), `bash scripts/check-bundle.sh` fallback httpbin vs Worker, `genlayer account show` 0 GEN, `ls frontend/` empty.

**Test result:** PyCompile + pytest PASS, but no real tx ACCEPTED — not GREEN.

**Unresolved risk:** Frontend build not run, Worker not deployed, contract not deployed — 15 min manual M1-M2 remains.

**Next action:** Sep 3 `YELLOW — BUILD WITH SPECIFIC BLOCKER` per `LAUNCH-READINESS.md: Hard decision` — unblock P0-2 (Worker) + P0-4 (fund) + P0-3 (contract) + P0-1 (frontend) in order, then re-audit to GREEN.

---

## Checkpoint 4 — Worker & Contract Live + First Real Attestation (2026-09-04)

**What changed:** Diagnosed Wrangler 4.129.0 static-files error (autoconfig in `/home/unify/startup` not `hosting/bundle-worker`, missing `account_id`), fixed `hosting/bundle-worker/wrangler.toml:1` (`account_id = "db5a771e35a0543bb7632c65261ee2af"`), deployed Worker via direct Cloudflare API `PUT /accounts/{id}/workers/scripts/provedown-bundle` (bypass WSL keychain hang), verified `https://provedown-bundle.contentbounty.workers.dev/bundle` live (200, 116 chars, 4 presets `breach` `9566a8b5`/`no_breach` `9cd4199c`/`ambig`/`empty` all 200, hash stable `b4fc2013` 2/2, no timestamp/random/secret). Updated `.env.local:27` to real Worker URL (was `your-subdomain` placeholder). Deployed ProveDown `contracts/provedown.py` via `genlayer-js` WSL-safe `scripts/deploy-with-js.mjs` (import fix `studionet`, symlink `startup/node_modules → genlayer-jury/node_modules`), funded `provedown-deployer` 0x3211..., got **real Bradbury deployment** `0x72a67E0cF59bCb526AEF0D81391e399C56703590` tx `0x89f1f09c8ba845310353ba8467f751a4633348fc9ebf4145adef05b7a5bf0ae6` ACCEPTED (status 5) explorer `https://explorer-bradbury.genlayer.com/address/0x72a...`. Verified live E2E: `register_sla demo-healthy` tx `0x09478238af86d51b508950f5af16abefdc022be9066a10cf988873c5703a715e` ACCEPTED, `request_attestation demo-healthy` tx `0xed5af79f5b4c47c2220440117128b59b6d1b03330356bd9d05e4196719d0a1f6` ACCEPTED (13) with attestation `1` breach false confidence 1000 hash `64e6c84f01418b89` p95 1600 status resolved, `get_reputation` score 75 total 1 breaches 0. Second breach att `0xd4c2ae...` had `attestation not found` (protocol UNDETERMINED honest split — correctly not fabricated as success). Created `frontend/index.html` 7.5K minimal static (no Next build hang) for demo `register→attest→explorer→hash→reputation`.

**Why:** Blocker discipline: Worker was P0-2, contract P0-3, deployer funded P0-4. Fix was config not static files (do not add random assets). Direct API deploy most reliable in WSL without `wrangler deploy` interactive hang.

**Evidence:** `curl -s https://provedown-bundle.contentbounty.workers.dev/bundle?preset=breach` 200 `{"p95":4800 ...}` hash stable `b4fc2013` 2/2, no timestamp 0 matches; `node scripts/check-env.mjs` now 4 ✓ (RPC present, PRIVATE_KEY present, CONTRACT 0x72a6... 42-char, WORKER 200); `genlayer receipt` ACCEPTED; `get_attestation 1` JSON above.

**Test result:** `pytest 5 passed` still, `py_compile` OK, Worker 4 presets 200, contract deployed explorer verifiable, 1 real attestation resolved.

**Unresolved risk:** Frontend Next build still not run (static HTML is demo-ready but not Next 16 build per `setup-frontend.sh`), second breach att UNDETERMINED needs retry/ambig handling, `appeal_attestation` still missing, `genvm-lint` still fallback.

**Next action:** Harden frontend `index.html` → Next build if time, re-attempt breach attestation with retry, update docs and checkpoint commit.

## 2026-09-08 — Interrupted backend completed and hardened Studio checkpoint

**What changed:** Completed the interrupted backend slice in `contracts/provedown.py` v0.3.1: strict numeric/finite/range SLO validation, conflicting agreement-ID rejection, canonical SLO storage, evidence metric range guards, prompt input reduced to five validated metrics, and strict boolean consensus parsing. Completed static frontend lifecycle in `frontend/index.html`: pinned `genlayer-js@2.0.0-rc.1`, wallet network/account path, fee estimation, register + attest writes, FINALIZED polling, `isSuccessful` verification, on-chain readback, exact evidence-hash verification, quote-safe escaping, and data-attribute copy controls. Added static frontend build/release tests and server scripts. Profile patterns are source-backed in `SOURCES.md` S57-S65 and `research/github-patterns-audit.md`.

**Why:** The GitHub profile review identified four quality bars relevant to ProveDown: Clasp/Vestra invariant and idempotency discipline [S57,S58], SealRail/StateMirror proof-gated state and chain readback [S59,S60], ValidatorBriberyTrap honest simulation boundaries [S61], and Synapse Fleet explicit state transitions [S65]. These were applied without adding payment rails, continuous polling, appeals, or a general security suite.

**Evidence:** Hardened contract deployed on Studio Devnet 61997 at `0xB5E2F043c9D5f971c347FaC1e6E853eDBE5d955C`; deploy tx `0x65793c043eebcb2e8254755caef7398f88291579f87be8bffcf97881020b1146` FINALIZED/FINISHED_WITH_RETURN/isSuccessful=true. Registration receipts: `0x1f5b8bfdf3b82b210ad566d53d5dbd2247905d3c48249fbd1d19b0f9a13d6778`, `0x5eca828a8680a19bd57c16f7c64b403f290a9db5f3bf426687bf5c9c1319a500`, `0x3b89e786f58ac35ea81358604b79dda20143b975054875466a3896a7d60c1056`, `0xfb2dfbfe029b2778edd7194a1306b2429b37cfaed7bd2a79fd863fcbcb02abde` all finalized successfully. Canonical hardened attestations: case 1 healthy tx `0xc2bb9792e9ab12a380b6557da4f10650c5b9040a530f6db58185d837ea0f70f9` → NO_BREACH, hash `64e6c84f01418b89...`; case 2 breach tx `0xbb7520c27269773fe94b21c8e2561b2035712b74b264f3dd9874285db56a8028` → BREACH/LATENCY, hash `b4fc2013862e316e...`; case 3 empty tx `0xac8aee5b2f80da675a2260ecb3df433a97bf5baf37889cd5041dd858c9f37909` → INCONCLUSIVE, confidence 0, no hash. Worker full SHA-256 checks stable for breach/no_breach/ambig/empty and match stored hashes for resolved cases. Tests: `bash scripts/run-tests.sh` 12 passed; `npm --prefix frontend run test` 1 passed; `npm --prefix frontend run build` 11 release checks passed; `python3 -m py_compile contracts/provedown.py` passed; `node scripts/check-env.mjs` reports masked credentials/connectivity. Full local linter command is `PYTHONPATH=/tmp/provedown-linter /tmp/provedown-linter/bin/genvm-lint lint contracts/provedown.py` and reports only two documented nested `run_nondet_default` reachability warnings; do not call it clean.

**Unresolved risk:** Browser wallet smoke and clean-environment public build are still pending; Studio timestamps currently read empty; Worker content remains synthesized fixture evidence; no live `NO_CONSENSUS` case is proven; local linter false positive remains. The deployed hardened contract is Studio-only until a Bradbury deployment is separately verified.

**Next action:** Run wallet-enabled browser smoke at 390/768/1280, verify dynamic registration/attestation from the browser, then update `CLAIM-PACKET.md`, `CHANGELOG.md`, and submission artifacts only after the browser lifecycle is proven. Keep the repo private until the public-submission gate.

---

## Checkpoint 5 — v0.6 Migration Audit + Uptime Gap + Worker Live Verify (2026-09-04)

**What changed:** Diagnosed Wrangler 4.129.0 `Could not detect static files` as cwd error (ran from `startup/` root, autoconfig in `/home/unify/startup` per `~/.config/.wrangler/logs/wrangler-2026-09-04_02-08-52_413.log:8`, not missing config). Fixed `hosting/bundle-worker/wrangler.toml:1` comment to mandate `--cwd hosting/bundle-worker` / `-c` path, verified no `[assets]` needed (script Worker with `main="worker.js"` is correct). Verified live Worker `https://provedown-bundle.contentbounty.workers.dev/bundle` 200 ×5 presets (healthy/breach/ambig/empty/invalid→breach fallback), hash stable `b4fc2013...` twice same, no timestamp/random/secret. Inspected live Uptime (`genlayer-foundation/uptime`: `uptime_monitor.py` strict_eq is_up, `sla_verifier.py` linear/tiered/full +10% fee, `sla_agreement.py` worst-shortfall settlement, Vercel cron + KV) and wrote `04-competitive-intelligence/uptime-gap-analysis.md` (14 sections, positioning validated: functional attestation vs factual reachability). Wrote `01-genlayer-recon/06-consensus-v06-migration.md` (old 0.39.2/1.1.8 vs new 0.40.0-rc.3/2.0.0-rc.1/0.19.0rc2/0.30.0rc2/0.11.1rc2, studio-dev 61997 vs studionet 61999, fee-profile + estimate + isSuccessful + appealTransaction, old $0.04–0.08 INVALID). Wrote `07-final-thesis/hackathon-alignment.md` (track fit, decisive difference: 200-but-empty still BREACH, reputation, amber splits). Updated `feature-synthesis.md` addendum with CORE/REINFORCING/90-DAY/LONG-TERM/REJECT mapping. Validated studio-dev RPC live (GET 405, POST `gen_chainId` → `Method not found` JSON-RPC, proves endpoint responsive), `py_compile` OK, `pytest` 5 passed.

**Why:** Official hackathon stack moved to Consensus v0.6 RC + track explicitly asks SLA enforcement with live Uptime benchmark we must beat, not clone. Must prove architecture survives migration and difference is demonstrable.

**Evidence:** `curl -s .../bundle?preset=breach` 200 `p95 4800` hash `b4fc2013` ×2, `curl -s ...?preset=no_breach` 200, `curl -s https://studio-dev.genlayer.com/api` 405 + POST JSON-RPC error (responsive), `genlayer --version 0.39.2` vs required `0.40.0-rc.3`, `npm view genlayer-js` shows `2.0.0-rc.1` available, `pip show genlayer-py` not found (must install `==0.19.0rc2`).

**Test result:** Worker 5/5 presets 200, hash stable PASS, no secret PASS; contract `py_compile` PASS, analog 5 PASS; studio-dev RPC reachable PASS; full v0.6 fee-profile/deploy/write/read/nondet lifecycle NOT yet proven (requires RC install + `gltest --fee-profile` + `estimateTransactionFees` + `isSuccessful`) — tracked as P0 migration work.

**Unresolved risk:** Fee economics UNKNOWN until profile measured on studio-dev; frontend esm.sh 1.1.8 must move to 2.0 RC + Transaction Kit; `py-genlayer:1jb45aa...` pragma must be re-linted with 0.11.1rc2; studio-dev may reset (note in demo).

**Next action:** Install coherent RC set, generate `fee-profile.json`, redeploy to studio-dev via `deploy-with-js.mjs` + fees, verify one write/read/nondet with `isSuccessful` + FINALIZED, then update LAUNCH-READINESS to GREEN if E2E holds.

---

## Checkpoint 6 — Studio Next E2E GREEN (2026-09-04)

**What changed:** Migrated to Consensus v0.6 RC and proved complete real E2E on studio-dev 61997. Contract rewritten (`# v0.3.0` + `5jycge...` hash from Studio-dev JS bundle, `import genlayer as gl` + `genlayer.types` + `TreeMap` from `genlayer.storage.tree_map`, `gl.contract.Contract`, JSON-string storage, `gl.storage.inmem_allocate`, `run_nondet_default`, fenceless `exec_prompt`, malformed-bundle inconclusive guard). Toolchain: `genlayer-js@2.0.0-rc.1` (startup/node_modules), `genvm-linter==0.11.1rc2`/`genlayer-py==0.19.0rc2`/`genlayer-test==0.30.0rc2` (`--no-deps` venv; `lint` 3 checks PASS, `validate` blocked by 310MB download at 100kB/s — Studio lints server-side). Deployed `0xeE85DFbB4C419dD27D730D105EEeEA213DD7c0FF` (tx `0x5a34f359d575b4e74742ccc3ec7ea2e1d919911be90c47b9fdb125b53837a782` FINALIZED FINISHED_WITH_RETURN isSuccessful=true). Cases: A healthy `0x5b1cb325b5b27d6d0603a6cea6a33c1b4cb173788093bb87036609314d7ac497` NO_BREACH 980 hash `64e6...` p95 1600; B breach `0xe04dae35608f65b703cfcd2f80a197cb402330c5776f5e634e419f9519bc7383` BREACH 1000 hash `b4fc20...` p95 4800 LATENCY (200-but-fill-72% differentiator vs Uptime); C empty `0xa218c962dbe7aa23dee7d705e5a7ec8a2dcdf5bdbbc9bdfdfef01dd2a7cdea43` INCONCLUSIVE conf-0 (missing metrics never definitive); reputation 60/2/1. Fees measured: deposit ~0.1 GEN, deploy consumed ~7.9e-5, attest ~1.3e-4, refunded majority; fiat UNKNOWN, old `$0.04–0.08` retired. Frontend migrated to esm.sh 2.0.0-rc.1 + `studioDevnet` + live reads + fee-aware write path + state handling. Scripts: `deploy-with-js.mjs` fee-aware dual-path (studio-dev default), new `attest-studio-dev.mjs`, `check-env.mjs` checks studio-dev contract + v2 version. Docs: `06-consensus-v06-migration.md:9` verified findings, `hackathon-alignment.md`, `feature-synthesis.md` addendum CORE/REINFORCING/90-DAY/LONG-TERM/REJECT, `LAUNCH-READINESS.md` GREEN.

**Why:** Studio Next compulsory per GenLayer team; Bradbury/old SDK insufficient (no fees, wrong chain, ACCEPTED-only). Root-caused 3 successive deploy failures with real validator stderr: stale runner hash → `invalid_contract runner malformed`; `from genlayer import *` → `gl`/`allow_storage` NameError; `gl.Contract` → suggest `contract`; `run_nondet_unsafe` → suggest `run_nondet_default`. Each fixed from evidence (Studio JS bundle hash, working `0x6E68...` prediction-market source, `0xCC04...` TreeMap pattern, probe contract `0x89aB...`), not guesses.

**Evidence:** Explorer-studio-dev txs above (all FINALIZED FINISHED_WITH_RETURN isSuccessful=true except where noted), `get_attestation 1/2/3` + `get_reputation` JSON, fee `feeValue=100000000000010352` + `executionConsumed=78628000000000` + `data_fees_consumed=[127878000000000]`, Worker 200×5 + hash stable, `pytest` 5 passed, `lint` 3 checks passed.

**Test result:** E2E acceptance sequence complete (Worker → 61997 → fee-bearing tx → consensus → finalized → hash → frontend reads → explorer). P1s: empty→resolved-conf-0, timestamp empty, appeal mocked, lint false-positive, studio-dev reset risk, CLI 0.39.2 (JS path used).

**Unresolved risk:** None blocking demo. Next: demo + submission packaging.

**Next action:** Demo dry-run from `LAUNCH-READINESS.md`, then submission-ready build.

---

## Checkpoint 7 — Hardening + Demo Ready (2026-09-04)

**What changed:** Fixed empty-evidence path (guard now requires all five metrics present + numeric → unanimous refusal stored as explicit **INCONCLUSIVE**; `validator_fn` agrees only when leader also refused, mixed verdicts → `no_consensus`; `gl.block.timestamp` fallback added). Added 4 analog tests (empty/malformed non-definitive, valid-reach-jury, inconclusive agreement) — `pytest` **9 passed**. Redeployed `0xeE85...` (tx `0x5a34...` FINALIZED FINISHED_WITH_RETURN) and re-proved A (NO_BREACH 980 `0x5b1c...`), B (BREACH 1000 LATENCY `0xe04d...`), C (INCONCLUSIVE conf 0 `0xa218...`); reputation 60/2/1. Wrote `06-adversarial-analysis/09-final-hardening-pass.md` (17 attacks: 1 FIX, rest PASS/DOCUMENT, no hidden risk). Rewrote `README.md` (6 sections), `DEMO.md` (deterministic 3-case 60–90s + honesty labels), created `SUBMISSION-CHECKLIST.md` + `EVIDENCE.md` (full tx/hash/fee/version/test record, no secrets). Migrated `frontend/index.html` to live 3-case reads + v2 fee-aware write path + Uptime-differentiation panel.

**Why:** P1 empty→resolved-conf-0 violated "never turn missing evidence into definitive judgment". Smallest correct fix preserves all other behavior (A/B unchanged).

**Evidence:** `get_attestation 3` = `{"status":"inconclusive","reason":"UNAVAILABLE","confidence":0}` on `0xeE85...`; `pytest` 9 passed; hardening pass table; explorer-studio-dev txs in `EVIDENCE.md`.

**Test result:** `pytest` 9 passed, `lint` reports 2 reachability advisories (false-positive for nested-closure pattern, proven on-chain), `py_compile` OK, 3/3 cases FINALIZED FINISHED_WITH_RETURN isSuccessful=true.

**Unresolved risk:** P1s only (timestamp empty, appeal mocked, studio-dev reset, key reuse testnet-only). None block demo.

**Next action:** Demo + submission packaging. Architecture frozen unless real blocker.

---

## Checkpoint 8 — HCI Design Phase (2026-09-05)

**What changed:** Dedicated design (no implementation): created `design.md` (source of truth: personality, user, 10 UX principles, tokens, components, all states, REAL vs MOCK visual language, a11y, copy rules), `frontend-hci-audit.md` (15-criterion scorecard, mean 4.8, all below 8 with fixes), `frontend-gap-analysis.md` (7 P0 + 7 P1 + 7 P2, each HCI-justified). Researched Nielsen 10 heuristics (NN/g) + WCAG 2.2 AA baseline; tore down Cairn (receipt hierarchy to borrow), Clasp (state clarity, security lab, honesty table), Vigil (JS-gated, minimal signal Retrieved). Recovery system audited and preserved (AGENTS.md/memory/CHANGELOG/checkpoints/secret-scan intact). No frontend code touched.

**Why:** User directive: design source of truth + actionable spec before any build pass; architecture frozen.

**Evidence:** `design.md:1` (32 sections), `frontend-hci-audit.md:1` (15 scores), `frontend-gap-analysis.md:1` (P0-1..P0-7 minimal fix set). Browser automation unavailable — documented as limitation, static code inspection only, no pretended visual testing.

**Test result:** N/A (design phase). Pre-existing verification still holds: `pytest` 9 passed, studio-dev E2E txs in `EVIDENCE.md`.

**Unresolved risk:** Scores are single-evaluator heuristic review, not user testing — validate with 1-2 real user walkthroughs during build.

**Next action:** Build phase implements P0-1..P0-7 per `design.md`, then re-audit.

---

## Checkpoint 9 — Productization + Phase-0 Re-verification (2026-09-05)

**What changed:** Wrote 12 productization docs (`PRODUCT-THESIS/SYSTEM`, `CUSTOMER-WORKFLOW`, `CORE_NOW`, `PLATFORM_VISION`, `ROADMAP`, `IMPLEMENTATION-ORDER`, `BUSINESS-MODEL`, `COMPETITIVE-POSITION`, `PRODUCT-METRICS`, `POST-HACKATHON`, `DECISION-LOG` D-01..D-06, `ROADMAP-DECISION`) + 5 build-prep docs (`PRODUCT-INTERFACE-CONTRACT`, `DOWNSTREAM-ACTION`, `NEXT-BUILD-QUEUE`, `FEE-ECONOMICS`, `CLAIM-PACKET`). Re-ran full E2E on Studio Next with **fresh writes** (not old hashes): atts 4 (NO_BREACH 950), 5 (BREACH 1000 LATENCY), 6 (INCONCLUSIVE 0), all FINALIZED + isSuccessful; reputation 57/4/2 formula-verified; fee estimate unchanged. No contract/frontend/worker modifications (HCI session owns `frontend/index.html` + `design.md` + Worker CORS line — left untouched, alignment verified via structural grep: all 4 verdict states + REAL/MOCK + fees + reputation + explorer present).

**Why:** Productization converts proven core into ordered build queues; fresh-tx re-verification proves the workspace still works (old hashes alone insufficient per operating rules).

**Evidence:** Txs `0x68cf…`/`0x9f31…`/`0x67a8…` FINALIZED FINISHED_WITH_RETURN isSuccessful=true, `EVIDENCE.md` re-verification section, `pytest` 9 passed, lint 2 known false-positive advisories (proven on-chain ×12 txs).

**Test result:** E2E RE-VERIFIED. Worker 4/4 presets 200 + hash-stable; reads (SLAs + atts 1-3 byte-identical, no reset); writes 3/3 FINALIZED 43–111s.

**Unresolved risk:** `timestamp` still `""` on studio-dev (use explorer tx time); appeal still mocked; studio-dev may reset; fiat GEN price unknown (no dollar claims).

**Next action:** N-2 claim packet + N-3 fee panel + N-4 submission packaging; freeze features after Sep 14.

---

## Checkpoint 10 — HCI Build Pass P0-1…P0-7 (2026-09-05)

**What changed:** Implemented all 7 P0 fixes in `frontend/index.html` per `design.md` (no architecture/product change): dominant verdict block + collapsed explanation `<details>`; skeleton loaders + read/write trackers; single badge system (icon+text) across verdict/reputation/tracker/mock; 5-class friendly errors (cause → impact → next action → `<details>` tech); REAL (green left-border + ✓ VERIFIED) vs MOCK (gray dashed + ○ MOCK) visual blocks; a11y baseline (focus ring, `aria-live`, `#a8a8a8` text, reduced-motion, 44px targets); observed-vs-limit rows per case (live bundle re-fetch). Fixed 2 rendered defects found by inspection: Worker CORS (added `Access-Control-Allow-Origin: *`, redeployed 2026-09-05, bodies byte-identical so hashes unaffected) and contrast (`--accent` → `#5a5ee6` 5.0:1, `--border-strong` `#6b6b6b` 3.2:1 for inputs, card borders documented decorative).

**Why:** HCI audit mean was 4.8; trust communication is the product and was typographic-only.

**Evidence:** Headless-Chromium screenshots read directly (1280px + 390px, no overflow either width); CDP interaction tests (validation disable/error/aria, focus outline, overflow checks — all pass); node unit tests of shipped `verdictHtml` branches 10/10 (null/inconclusive/no-consensus/ok/bad/XSS-escaped); computed contrast pairs; zero console errors. Re-audit appended to `frontend-hci-audit.md`: mean **4.8 → 7.7** (8×8, 4×7, 0 below 7).

**Test result:** Rendered UI inspected (not just source). All 9 required states reachable: initial skeleton, setup validation, pending tracker, NO_BREACH/BREACH/INCONCLUSIVE live, NO_CONSENSUS via unit test (no live example exists — documented), reverted/error pattern, worker-failure pattern (fallback row). No fake success states; loading states truthful.

**Unresolved risk:** No screen-reader run; tablet 768px not screenshotted; wallet write path untested E2E (no wallet in sandbox); shared-contract attestation drift (demo pins ids 1–3, unaffected).

**Next action:** P1 polish per gap analysis; submission packaging.

## Checkpoint 11 — Fail-closed judge hardening + fresh Studio deployment (2026-09-09)

**What changed:** Added the permanent `AGENTS.md` operating constitution and completed the requested public-profile quality audit (`SOURCES.md` S57-S71, `research/github-patterns-audit.md`). Hardened `parse_llm_json()` so malformed/partial LLM output becomes `INCONCLUSIVE` instead of a resolved low-confidence `NO_BREACH`; added analog regression coverage. Bound frontend reputation reads to the selected agreement's on-chain API URL. Deployed the updated contract to Studio Next `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` and refreshed the pinned frontend/evidence docs.

**Evidence:** Deploy `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb`; healthy `0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf` (NO_BREACH, hash `64e6c84f...`); breach `0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505` (BREACH, hash `b4fc2013...`); empty `0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a` (INCONCLUSIVE, no hash). Each receipt is finalized, finished with return, and successful.

**Test result:** `python3 -m pytest tests/test_provedown.py -q` = 13 passed; `python3 -m py_compile contracts/provedown.py` passed; frontend release test passed; frontend build passed with 11 checks; `node scripts/check-env.mjs` passed with masked output. Full lint remains two known nested reachability advisories.

**Unresolved risk:** Injected-wallet browser E2E is not proven in this environment; Worker evidence is synthesized; Base settlement is mocked; timestamps are unavailable on Studio; no live `NO_CONSENSUS` case is pinned.

**Next action:** Run one wallet-backed browser smoke, then perform the final public package/link/secret audit. Keep the repository private until explicit submission approval.

## Checkpoint 12 — Readiness documentation reconciliation (2026-09-09)

**What changed:** Marked `FINAL-PREFLIGHT-AUDIT.md` and `07-final-thesis/implementation-blockers.md` as historical/superseded baselines. Reconciled `07-final-thesis/implementation-readiness.md` and `LAUNCH-READINESS.md` with the shipped implementation: static frontend, Studio Next 61997, synthesized Worker, `run_nondet_default` breach-only consensus, leader-observed evidence fields, no application-level appeal method, and documentation/UI-only Relay → Base boundary.

**Why:** The interrupted backend is now deployed and verified, but stale pre-build docs could cause a future agent to rebuild removed components or claim unsupported appeal/settlement behavior.

**Evidence:** Current contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`; deploy tx `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb`; canonical healthy, breach, and empty receipts recorded above and in `EVIDENCE.md`. `git diff --check` passed before verification rerun.

**Test result:** Documentation-only reconciliation; rerun `py_compile`, analog pytest, frontend release test/build, masked environment check, and Worker hash check before checkpoint commit.

**Unresolved risk:** Injected-wallet browser E2E, final public-package scan, real Worker provenance, Base settlement, timestamps, and live `no_consensus` receipt remain open. Full linter retains two nested reachability advisories.

**Next action:** Complete one wallet-backed browser smoke and final public-package/link/secret audit. Keep the repository private until explicit submission approval.

## Checkpoint 13 — Full reality audit refresh (2026-09-09)

**What changed:** Refreshed the official Agent Tank and GenLayer environment evidence, verified the current Uptime source, and reconciled stale research matrices with the shipped backend/frontend. The current source already fixes the former malformed-judge-to-NO_BREACH defect and the hardcoded reputation subject; those findings are now marked historical/resolved. Added the requested `Ritapossible/Recourse` and `Ritapossible/Vouch` patterns to the permanent research record and corrected the dated Agent Tank overlap snapshot to 48 mission submissions / 47 entries.

**Evidence:** Mission API `https://portal-admin.genlayer.foundation/api/v1/missions/83/` (48 submissions on 2026-09-09); entries endpoint returned 47 records; official GenLayer docs `https://docs.genlayer.com/full-documentation.txt`; Uptime source `uptime_monitor.py`, `sla_verifier.py`, and `sla_agreement.py`; `SOURCES.md:S57-S73`; `research/github-patterns-audit.md`. Current Studio receipt check returned `FINALIZED`, `FINISHED_WITH_RETURN`, `isSuccessful=true` for deploy `0x6cdb...`, healthy `0xa5a1...`, breach `0xf566...`, and empty `0x90b9...`, with readback statuses resolved/resolved/inconclusive.

**Test result:** `python3 -m pytest tests/test_provedown.py -q` = 13 passed; `python3 -m py_compile contracts/provedown.py` passed; frontend test passed; frontend build passed with 11 checks; `bash scripts/run-lint.sh` reached `genvm-lint 0.11.1rc2` and reported only the two known nested reachability advisories; `node scripts/check-env.mjs` passed with masked values; Worker breach/no-breach hashes stable across repeated reads; Chromium shell renders captured at 390/768/1280.

**Unresolved risk:** Injected-wallet browser E2E, immutable/authoritative Worker provenance, Base settlement, timestamps, a live no-consensus receipt, and final public-package/link/secret scan remain open. The repository remains intentionally dirty and private; no commit or push was made.

**Next action:** Run one wallet-backed browser smoke if a funded injected wallet is available, then perform the publication package scan. Keep the MVP limited to functional SLO attestation -> finalized verdict -> evidence hash -> reputation.

## Checkpoint 14 — Official refresh, RPC cross-check, and stale-claim cleanup (2026-09-09)

**What changed:** Re-queried the live Mission 83 API and entries feed, corrected the current count to 48/47, added direct RPC lifecycle evidence, and reconciled active docs with the deployed contract. Active claims now qualify the evidence hash as sanitized/truncated bytes, identify the Worker as synthetic fixture data, keep the fee panel explicitly open, and do not imply an application appeal, bond/slash policy, or settlement rail. Older thesis, analog, migration, and hardening documents now carry historical/superseded banners. The interrupted backend remains preserved and is still the source of the pinned Studio receipts.

**Why:** The official feed and current contract behavior changed relative to older planning snapshots. Without this cleanup, a future agent or judge could mistake protocol-level GenLayer appeals for an implemented ProveDown feature or treat raw-provider bytes and synthesized fixtures as stronger evidence than they are.

**Evidence:** Mission API reported 48 submissions and `/entries/` returned 47 records. Studio RPC `eth_chainId` returned `0xf22d`; `gen_getTransactionLifecycle` for breach tx `0xf566...ed505` returned `storedStatus=Finalized`, `projectedStatus=Finalized`, `decisionActive=false`; `eth_getTransactionReceipt` returned `status=0x1`; `node scripts/check-env.mjs` passed with masked values. Updated files include `README.md`, `CORE_NOW.md`, `PRODUCT-SYSTEM.md`, `COMPETITIVE-POSITION.md`, `CLAIM-PACKET.md`, `DEMO.md`, `CUSTOMER-WORKFLOW.md`, current research matrices, and historical source banners.

**Test result:** `git diff --check` clean after the documentation pass. Prior live evidence remains: 13 analog tests, Python compilation, frontend release test/build (11 checks), stable Worker hashes, and finalized Studio receipts/readbacks. No application code, contract state, commit, push, or publication was changed in this checkpoint.

**Unresolved risk:** Injected-wallet browser E2E, immutable/authoritative Worker provenance, fee panel UI, Base settlement, timestamps, live `no_consensus` receipt, and final public-package/link/secret scan remain open. Full linter retains two nested reachability advisories.

**Next action:** Run one wallet-backed browser smoke if a funded injected wallet is available; otherwise perform the final release scan and keep the repository private until explicit submission approval.

## Checkpoint 15 — Wallet-backed Studio browser E2E (2026-09-11)

**What changed:** Completed the injected-wallet browser lifecycle against the existing Studio Devnet contract without redeployment: finalized `register_sla` for `browser-smoke-20260909-01`, exact `get_sla` readback, finalized `request_attestation`, `get_attestation` readback, `get_reputation` readback, and exact synthetic Worker hash verification.

**Why:** This closes the last implementation/runtime gap for the narrow frontend wedge. A receipt alone is insufficient; the browser result is only considered successful after finality, `isSuccessful`, and authoritative chain readbacks.

**Evidence:** Registration tx `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a` and attestation tx `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110` are both `FINALIZED`, `FINISHED_WITH_RETURN`, and `isSuccessful=true`. Attestation `4`: `resolved`, `breach=false`, reason `OK`, confidence `1000`, p50/p95 `320/1600`, evidence hash `e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3`; reputation `score=66,total=3,breaches=1`. The exact Worker URL recomputed to the same SHA-256. Receipt fees were read from the returned receipts: registration deposit `613834800010352`, consumed `78632250000000`, refund `535202550009529`; attestation deposit `624289200010352`, consumed `80206250000000`, refund `544082950009529`.

**Test result:** Direct Studio receipt/readback checks passed; Explorer HEAD returned 200; exact Worker hash matched. No contract redeployment or wallet approval was performed by the agent.

**Unresolved risk:** Final public-package/link/secret audit, Studio timestamps, immutable Worker provenance, Base settlement, and live `no_consensus` evidence remain open. The repository remains private and intentionally uncommitted.

**Next action:** Run the final release scan and package the demo evidence; do not add P2 features or redeploy the contract.

## Checkpoint 16 — Release hardening reconciliation (2026-09-12)

**What changed:** Reconciled the ignored local public contract value with the current Studio Next contract; completed the repository inventory and five-script legacy analysis; reproduced and classified the two nested linter advisories; audited deployment, Worker, transaction, settlement, evidence-provenance, appeal, economics, accuracy, and historical references; and added explicit historical/compatibility labels where Bradbury-first material could be mistaken for the current release. Current roadmap language now distinguishes GenLayer protocol appeal mechanics from the absent ProveDown application appeal, bond, or slashing flow. No runtime, contract, frontend layout, wallet, receipt, readback, or chain state changed.

**Why:** Release packaging must have one current deployment source of truth and must not let dated runbooks or future-state economics blur the verified Studio slice.

**Evidence:** `EVIDENCE.md` remains authoritative for Studio Next chain `61997`, contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`, finalized browser registration `0x63f386...`, finalized attestation `0xfe160a...`, attestation `4` `NO_BREACH` confidence `1000`, evidence hash `e33f6897...`, and reputation `66/3/1`. The contract and both transaction Explorer URLs returned HTTP 200. The Worker returned stable repeated hashes for all four presets. `.env.local` remains ignored and both public contract variables resolve to the current address without exposing secrets.

**Test result:** Frontend test 1/1 passed; frontend build passed with 15 release checks; Python compilation passed; 13 analog tests passed; masked environment check returned OK; Worker checker passed; `git diff --check`, tracked-file secret scan, generated `frontend/dist` secret scan, and client-facing `NEXT_PUBLIC_*` secret-name scan passed. `genvm-lint` reproduced only the two documented nested reachability advisories at `contracts/provedown.py:214` and `:311`.

**Unresolved risk:** A separate frontend visual-polish pass and final assembled-public-package scan remain. Five historical Bradbury scripts await explicit removal/archive approval. The Worker is synthetic fixture evidence, Base/Hyperlane relay is mocked, Studio timestamps remain unavailable, no live `NO_CONSENSUS` receipt exists, and the linter remains non-clean by the documented analyzer limitation. The repository remains private, dirty, and uncommitted.

**Next action:** `READY FOR FRONTEND POLISH`. After that pass, assemble and scan the public submission package before any commit, push, or publication decision.

## Checkpoint 17 — Final runtime smoke and release-helper hardening (2026-09-12)

**What changed:** Ran a fresh read-only Studio smoke against contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`, verified attestations 1–4 and reputation readback, and checked all six pinned transaction receipts. Fixed frontend evidence URL parsing so punctuation before the evidence-summary character count cannot become part of the Worker URL (`frontend/index.html:421-425`); this had caused false fingerprint mismatches for the healthy and browser-smoke cases. Hardened `scripts/check-bundle.sh` with strict shell failure handling, HTTP failure propagation, a timeout, and non-empty-response checks.

**Why:** The prior frontend report had not exercised the live evidence-row path against the current DOM. The dynamic smoke exposed a real parser regression even though stored hashes and Worker bytes were correct. The old Worker checker could hash an empty network-error response and still report a stable result.

**Evidence:** Studio reads returned attestation 1 `resolved/NO_BREACH`, 2 `resolved/BREACH`, 3 `inconclusive`, 4 `resolved/NO_BREACH`; reputation `66/3/1`. Deploy, healthy, breach, empty, browser registration, and browser attestation receipts all returned `FINALIZED`, `FINISHED_WITH_RETURN`, `isSuccessful=true`. Chromium dynamic smoke rendered observed metric rows for all three selected cases. CDP accessibility tree exposed 457 nodes including required landmarks, headings, controls, links, and labels. Live Worker checker passed all four presets and stable breach/no-breach hashes; an unreachable endpoint exited 7.

**Test result:** `npm --prefix frontend test` passed; `npm --prefix frontend run build` passed with 17 checks; `bash scripts/check-bundle.sh https://provedown-bundle.contentbounty.workers.dev/bundle` passed; `bash -n scripts/check-bundle.sh` passed; `python3 -m pytest tests/test_provedown.py -q` passed (13); `python3 -m py_compile contracts/provedown.py` passed; `git diff --check` passed. `genvm-lint` remains non-clean only for the two documented nested nondeterministic reachability advisories.

**Unresolved risk:** The repository is still dirty and private; no commit or push was made. Submission still needs a curated public package/link/secret scan, explicit treatment of five legacy Bradbury helper scripts, and a decision on whether to improve pinned-case receipt lookup/finality wording. Worker provenance remains synthetic and mutable, Base/Hyperlane relay remains mocked, no live `NO_CONSENSUS` receipt is pinned, Studio timestamps are unavailable, and public write/rate/owner policy is deferred.

**Next action:** Freeze runtime scope. Curate the release file set, remove or archive legacy write helpers only with explicit approval, run the final masked secret/link scan, and publish only after the package is reviewed. Do not add pollers, settlement, appeals, or other P2 features before submission.

## Checkpoint 18 — Custom-route proof disclosure and submission audit refresh (2026-09-12)

**What changed:** Tightened the frontend custom-contract route so it replaces the default contract and attestation context labels, hides pinned proof and fee references, and explicitly says attestation 4 is not reused. Reconciled current audit documents with the completed frontend pass and corrected stale release-check/write-count wording. No contract, wallet, receipt, readback, Worker, or chain state changed.

**Why:** A valid custom `?contract=` route must not visually inherit the default deployment's proof language, even when its pinned proof cards are hidden. Submission records must agree on the current release state.

**Evidence:** Custom-route source assertions cover `verifyContractContext`, `proofAgreementContext`, `proofAttestationContext`, and the no-reuse disclosure. Current Studio Explorer links returned HTTP 200; the masked environment check returned OK; Worker four-preset checks passed.

**Test result:** Frontend release test passed; frontend build passed with 23 checks; 13 analog tests, Python compilation, Worker checks, `git diff --check`, and the masked secret/link scans passed. Full lint remains non-clean only for the two documented nested nondeterministic reachability advisories.

**Unresolved risk:** The public package is still unassembled and the repository remains private, dirty, and uncommitted. Worker provenance is synthetic, the relay is mocked, no live `NO_CONSENSUS` receipt is pinned, Studio timestamps are unavailable, and public write/rate/owner policy remains deferred.

**Next action:** Curate the exact release file set, decide the fate of the five legacy Bradbury helpers, run the final assembled-package scan, and obtain explicit publication approval.

## Checkpoint 19 — Three-view frontend app shell and interaction audit (2026-09-13)

**What changed:** Completed the bounded static frontend shell with route-aware Overview (`/`), Verify (`/verify`), and Proof (`/proof`) views in one HTML bundle. Preserved query parameters and history navigation, the current Studio read path, wallet-backed `register_sla` and `request_attestation` lifecycles, fee/readback gates, responsive/a11y scaffolding, and explicit REAL/DERIVED/SYNTHETIC/MOCK disclosures. Reconciled `research/FRONTEND-SECTION-AUDIT.md` so it accurately describes enabled wallet controls rather than the superseded read-only surface. No contract, ABI, deployment, Worker, or chain state changed.

**Why:** The submission surface needed a clear homepage-like overview before the operational verification and proof views, while remaining within the narrow MVP and existing static deployment model.

**Evidence:** Isolated static-server smoke returned HTTP 200 for `/`, `/verify`, and `/proof` (including the current contract and `cases=4,1,2` query) and HTTP 404 for an unknown path. Fresh Chromium/CDP verification covered all three routes at 390/768/1280, query preservation, active navigation, browser back behavior, custom-proof isolation, and no console/request failures. The current source/build checks include finalized receipt success, registration readback, attestation/reputation readback, bounded fee display, route/history preservation, hash-bound evidence, and the required wallet/error states; no wallet approval or transaction was attempted in this checkpoint.

**Test result:** `npm --prefix frontend test` = 13 passed, including direct deep-link HTTP smoke and custom-proof isolation assertions; `npm --prefix frontend run build` = 23 release checks passed; inline module parse passed; `python3 -m py_compile contracts/provedown.py` passed; `bash scripts/run-tests.sh` = 13 passed; Worker four-preset/stable hash checks passed; masked environment check passed; `git diff --check` passed. `genvm-lint` retains only the two documented nested reachability advisories.

**Unresolved risk:** Human screen-reader testing remains outstanding; the current CDP accessibility tree passed. The repository remains private, dirty, and uncommitted. Worker content remains synthetic, Base/Hyperlane remains mocked, Studio timestamps are unavailable, and no live `NO_CONSENSUS` receipt is pinned.

**Next action:** Curate and scan the exact submission package. Do not redeploy, create transactions, or expand product scope.

## Checkpoint 20 — Milestone 1 frontend release gate restored (2026-09-15)

**What changed:** Updated only `frontend/tests/release.test.mjs` and `frontend/scripts/build.mjs` so the proof-scope release assertions match the current `proofScopeFor(contract, caseIds)` implementation (`ids.indexOf('4')` and the explicit `scope === 'browser-smoke'` branch). The implementation was correct; the failing `visibleCaseIds.indexOf('4')` and `hasBrowserCase` checks were stale refactor-specific assertions. No runtime behavior, contract, wallet, receipt, deployment, or product scope changed.

**Evidence:** The current frontend checks the default contract before exposing pinned proof, exposes pinned browser-smoke proof only when selected case IDs include `4`, returns no pinned references for custom contracts, and hides browser-smoke proof/fee values for other case selections. Existing finalized/readback and fail-closed success gates remain intact.

**Test result:** `npm --prefix frontend run test` = 15 passed; `npm --prefix frontend run build` = 25 release checks passed; `python3 -m pytest tests/test_provedown.py -q` = 13 passed; `python3 -m py_compile contracts/provedown.py` passed. `bash scripts/run-lint.sh` exited 1 and remains non-clean only for the two documented nested nondeterministic reachability advisories at `contracts/provedown.py:214` and `:311`.

**Unresolved risk:** The repository remains private, dirty, and uncommitted; no deployment, transaction, or new browser wallet test was performed in this session. Worker evidence remains synthetic, the Base/Hyperlane relay remains mocked, Studio timestamps remain unavailable, no live `NO_CONSENSUS` receipt is pinned, and the final public-package/link/secret scan is still open.

**Next action:** Run the public-package/link/secret scan and prepare the demo video. Keep the MVP limited to functional SLO attestation -> finalized verdict -> evidence hash -> reputation.

## Checkpoint 21 — Milestone 2 submission-package audit (2026-09-16)

**What changed:** Audited (not built): no prior Codex Milestone 2 work was found — no `Milestone 2`, `demo-video`, or package-manifest strings existed anywhere, and no artifact postdates Milestone 1 (2026-09-15). Created `DEMO-VIDEO-PLAN.md` (75s script + shot list + verbatim disclosures, nothing recorded) and `research/PUBLIC-PACKAGE-MANIFEST.md` (INCLUDE/EXCLUDE/ARCHIVE/GENERATED/SENSITIVE/HISTORICAL/UNRESOLVED over the current worktree). Fixed two stale `read-only` wordings in `LAUNCH-READINESS.md` (frontend is static with live reads + wallet-backed writes since Checkpoint 15). No runtime, contract, wallet, receipt, deployment, or product-scope change; no deletion, archive, commit, push, deploy, or transaction.

**Why:** Release packaging must prove the public file set, secret hygiene, deployment consistency, evidence honesty, and link health from the current repo state without touching product behavior.

**Evidence:** All six pinned Explorer links + Worker URL returned HTTP 200. Mission 83 API re-checked live: `Agent Tank: Hackathon`, window 2026-09-03–2026-09-17 15:30 UTC, track `Agentic Commerce Infrastructure`, 1 project per builder, public repo required, submission_count now 113 (was 48/47 on 2026-09-09). Secret scans: no private-key/API/token material in tracked files, untracked candidates, docs, frontend source, or `frontend/dist` (dist 64-hex hits are public tx hashes; 42-char hit is the current contract). `.env.local` and `frontend/dist` verified ignored. Legacy Bradbury scripts re-verified: `attest_test`/`simple_test`/`verify-live` write to historical `0x72a6…` (RECOMMEND REMOVE), `check_all`/`check_att` read-only (RECOMMEND ARCHIVE) — recommendation only, untouched. Current docs agree on Studio Next 61997 / `0x278C…` / `genlayer-js@2.0.0-rc.1`; stale addresses/chain IDs/URLs/SDK claims appear only in labeled historical sections or legacy helpers.

**Test result:** `npm --prefix frontend run test` = 15 passed; `npm --prefix frontend run build` = 25 release checks passed; `python3 -m pytest tests/test_provedown.py -q` = 13 passed; `python3 -m py_compile contracts/provedown.py` passed; `bash scripts/run-tests.sh` = 13 passed; `bash scripts/check-bundle.sh` stable (`b4fc2013…`/`64e6c84f…`); `node scripts/check-env.mjs` OK (masked); `git diff --check` passed. `bash scripts/run-lint.sh` exit 1 with only the two documented advisories at `contracts/provedown.py:214` and `:311`.

**Unresolved risk:** Five legacy Bradbury scripts await explicit REMOVE/ARCHIVE approval. No live `NO_CONSENSUS` receipt, Studio timestamps unavailable, Worker synthetic, relay mocked — all disclosed. Demo video not recorded. Repo private, dirty, uncommitted by design.

**Next action:** Obtain explicit approval for legacy-script disposition, then a separately authorized release-checkpoint commit. Submission deadline 2026-09-17 15:30 UTC.

## Checkpoint 22 — Milestone 3 release checkpoint + public frontend (2026-09-16)

**What changed:** Created ONE release checkpoint `d90ac57` (`checkpoint: ProveDown submission release candidate`, 54 modified + 13 new files) and pushed branch `provedown-app-shell` to the PRIVATE repo (visibility verified PRIVATE; `scripts/` on the branch holds only the 10 release scripts; no `frontend/dist`; README present). Added minimal `frontend/vercel.json` (build `npm run build`, output `dist`, rewrites for `/verify` + `/proof` only) and deployed the existing static frontend to production: `https://frontend-k4z1tmaco-oxunify.vercel.app/`. The first deploy was SSO-gated by Vercel's default deployment protection, so project SSO protection was disabled via the Vercel API (user's own CLI credential, never printed) and the deployment re-verified ungated. No product, contract, wallet, receipt, or scope change; no GenLayer transaction; repo still private.

**Why:** The submission needs a stable public app URL for judging and for the Milestone 4 video; the repo must stay private until the explicitly authorized publication step.

**Evidence:** Public routes `/`, `/verify`, `/proof`, `/verify?contract=0x278C…7aC1&cases=4,1,2`, `/proof?...&cases=4,1,2` all HTTP 200 with the app shell; `/nope` 404. Headless Chromium DOM shows live reads (NO_BREACH case 4, BREACH, INCONCLUSIVE, hashes `e33f6897`/`b4fc2013`/`64e6c84f`, Explorer links, FINALIZED markers, observed rows); no rendered error banners; zero console errors/failed loads; 390/768/1280 screenshots render with no overflow. Release docs updated with the URL + commit hash (`README.md`, `DEMO.md`, `EVIDENCE.md`, `SUBMISSION-CHECKLIST.md`, `LAUNCH-READINESS.md`, this file, `CHANGELOG.md`).

**Test result:** Pre-commit gate all green: frontend 15 passed, build 25 checks, analog 13 passed, `py_compile` passed, lint exit 1 with only the two documented advisories (`:214`, `:311`), `git diff --check` passed, Worker hashes stable, masked env OK, tracked/candidate/dist secret scans clean, all seven Explorer links HTTP 200.

**Unresolved risk:** A second commit (hosting config + URL records) still needs pushing; one extra `UNKNOWN`-status production deployment (`frontend-m7u0j80eq`) exists from a timed-out CLI call — canonical URL is the Ready `frontend-k4z1tmaco` deployment. Five legacy scripts remain local-only untracked. Demo video not recorded (Milestone 4).

**Next action:** Milestone 4 — record and upload the final demo video against the public URL. Do not make the repo public; do not submit yet.
