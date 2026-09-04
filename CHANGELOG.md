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
