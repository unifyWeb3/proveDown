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
