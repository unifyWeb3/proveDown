# CHANGELOG — ProveDown

**Repo:** `https://github.com/unifyWeb3/proveDown` (private)

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
