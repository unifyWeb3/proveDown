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
