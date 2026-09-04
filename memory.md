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
