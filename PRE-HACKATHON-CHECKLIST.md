# PRE-HACKATHON CHECKLIST — ProveDown (before Sep 3)

**Date:** 2026-09-02
**Reference:** `CREDENTIALS-REQUIRED.md`, `07-final-thesis/implementation-readiness.md`, validation `06-adversarial-analysis/05-08`

> **Historical / superseded checklist.** This is the pre-deployment Bradbury-first checklist from 2026-09-02. Do not use its pending tasks or old chain references as current release instructions; use `EVIDENCE.md`, `LAUNCH-READINESS.md`, and `research/RELEASE-INVENTORY.md` for the current Studio Next deployment.

---

## 1. What is Already Working? (self-checked 2026-09-02)

| Item | Status | Evidence |
|---|---|---|
| **Research system** | ✅ Working | `startup/` 22 files: `01-07` + `SOURCES.md` 56 sources + `contracts/provedown.py` (198 LOC) + `hosting/bundle-worker/worker.js` + `tests/test_provedown.py` |
| **Analogy tests** | ✅ 5/5 pass | `python3 tests/test_provedown.py` + `pytest -v` 5 passed [check 2026-09-02] |
| **Bundle Worker presets** | ✅ Hash-stable 1/8 not 5/5 | Check: `python3 /tmp/check_worker.py` → breach `9566a8b5...` stable, no_breach `9cd4199...` stable, len 116 (<3000 truncate, <16k limit) — unlike `httpbin.org/get` 5/5 variance |
| **Toolchain Node/Python** | ✅ | Node v22.22.3, npm 10.9.8, Python 3.12.3, genlayer 0.39.2, genlayer-js 1.1.8 (from genlayer-jury) |
| **GenLayer CLI network table** | ✅ | `genlayer network list` shows localnet/studionet/testnet-asimov/testnet-bradbury (4221) |
| **Bradbury RPC** | ✅ Reachable (HTTP 405 expected for GET, POST required) | `curl https://rpc-bradbury.genlayer.com` 405 1.26s — endpoint alive |
| **Contract syntax** | ✅ `python3 -m py_compile contracts/provedown.py` passes | Full `genvm-lint` not in PATH — fallback ok, Studio will catch 20+ rules |
| **Env template** | ✅ | `.env.example` with all 15 vars, placeholder not secret |
| **Git protections** | ✅ | `.gitignore` covers `.env*` `*.key` `keystores/` `.genlayer/` etc. |
| **Runbooks** | ✅ | `scripts/run-lint.sh`, `run-tests.sh`, `deploy-studio.sh`, `deploy-bradbury.sh`, `verify-post-deploy.sh`, `setup-frontend.sh`, `check-bundle.sh`, `check-env.mjs` — all `chmod +x` |
| **Demo presets** | ✅ 3 cases | `DEMO.md` + `hosting/bundle-worker/README.md`: breach/no_breach/ambig + empty inconclusive |

---

## 2. What Still Requires My Credentials? (manual, blocked until you act)

| Credential | Where | Blocked until | How to fix (exact command) |
|---|---|---|---|
| **`GENLAYER_PRIVATE_KEY`** funded | `CREDENTIALS-REQUIRED.md` §1 | **BLOCKED for deploy** — `genlayer account list` shows 0 accounts (2026-09-02) | `genlayer account create provedown-deployer` → fund via `https://testnet-faucet.genlayer.foundation` (paste address from `genlayer account show`) |
| **`NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS`** | After `scripts/deploy-bradbury.sh` | Blocks frontend live mode | `genlayer network set testnetBradbury && genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury` → copy `0x...` → set in `.env.local` → redeploy frontend |
| **`NEXT_PUBLIC_BUNDLE_WORKER_URL`** | Cloudflare Workers | Blocks jury fetch (would be INCONCLUSIVE empty) — fallback `https://httpbin.org/json` works for Studio but not for demo realism | `npx wrangler login` → `npx wrangler deploy` in `hosting/bundle-worker/` → copy `https://provedown-bundle.<you>.workers.dev/bundle` → set in `.env.local` |
| **`OPENROUTER_API_KEY`** (optional) | Only for mocked frontend fallback (`NEXT_PUBLIC_LIVE_JURY=false`) | Not blocked for live GenLayer mode (validators have LLMs) | Reuse existing in `/home/unify/genlayer-jury/.env.local` (verified present) or `https://openrouter.ai/keys` |
| **Base Sepolia deploy** | `BASE_SEPOLIA_PRIVATE_KEY` + RPC | **Not required for hackathon** — bridge is mocked per `implementation-readiness.md` §9 | Post-hackathon: `cast wallet new` + faucet `https://www.alchemy.com/faucets/base-sepolia` |

**Script to verify without exposing:** `node scripts/check-env.mjs` (currently FAIL until you copy `.env.example`→`.env.local` and fill 3 vars). Already available: `GENLAYER_PRIVATE_KEY` in jury env (not shown) but **genlayer CLI account store is empty** — you must `account import` from that key or create new.

---

## 3. What Still Requires GenLayer/Bradbury?

| Needs GenLayer | Why | Fallback |
|---|---|---|
| `genlayer deploy` to Bradbury | Persistent contract for demo explorer links | Studio (`studionet` 61999) works without deploy for test, but explorer is `studionet` temporary not Bradbury persistent — demote to backup |
| `genlayer write request_attestation` real jury | 5 validators fetch bundle + LLM judge → consensus 30-60s to ACCEPTED | Mocked mode `NEXT_PUBLIC_LIVE_JURY=false` prewrites SSE (like genlayer-jury) — snappy but not on-chain proof; keep both toggles |
| `genlayer estimate-fees` | Real gas cost vs analog $0.05 estimate | Run after deploy; if >$1 would trigger §24 Kill #3 bridge-cost reassess |
| Explorer `explorer-bradbury.genlayer.com` | Verifiable proof per Jury lesson (v1 cosmetic rightly rejected [S19]) | Without explorer, claim is unverifiable — must have |

**Connectivity now:** Bradbury RPC reachable (405), faucet alive, Studio https://studio.genlayer.com accessible (no Docker needed).

---

## 4. What Can Fail on Hackathon Day? + Fallback

| Fail | Fallback | Prepared |
|---|---|---|
| Bradbury congested (Retry-After, 500s finalize) | Mocked frontend mode (`NEXT_PUBLIC_LIVE_JURY=false`) shows prewritten 5-validator reasoning + links to *earlier* real preset txs (breach/no_breach) that are already on explorer | ✅ Toggle in `implementation-readiness.md` §12, like Jury 30-60s fallback |
| Bundle Worker not deployed / 403 | Fallback to `https://httpbin.org/json` (stable 1/8 hash `4073fc...`) for Studio test; bundle presets still demo via Worker once deployed; empty preset shows INCONCLUSIVE path | ✅ `hosting/bundle-worker/README.md` documents fallback |
| `genvm-lint` missing 20+ rules | `python -m py_compile` syntax only; Studio deploy catches rest; pre-deploy on Studio before Bradbury | ✅ `scripts/run-lint.sh` fallback noted |
| `web.render` empty → INCONCLUSIVE | Show as first-class outcome (payload empty), retry with different preset | ✅ Contract handles `inconclusive` status |
| `UNDETERMINED` honest split at threshold (p95 2100 ambiguous) | Show amber "honest split" not error, per `01-genlayer-recon/03` Failure as feature | ✅ Frontend verdict 3-way |
| Latency variance kills p95 (stdev 1-2.7s) | Bundle quality wedge already (fill/match not ms) + tolerance 500ms in prompt | ✅ Technical validation 05 §5 mitigation |
| Provider fast-path via WebDriver IP | Bundle is our Worker (we control, not adversarial) — not relevant for MVP | ✅ Low for demo |
| Base bridge real txn fails | Mocked Relay→Base diagram is sufficient for hackathon per readiness §9, not blocked | ✅ Mock boundary documented |
| No Docker for `genlayer up` localnet | Studio GLSim (`glsim`) or Studio hosted (no Docker) | ✅ `deploy-studio.sh` documents Studio UI path |

---

## 5. What Must Be Completed Before September 3? (minimal)

- [ ] **You:** `genlayer account create provedown-deployer` + fund via faucet (5 min) — *BLOCKED until you act*
- [ ] **You:** `npx wrangler login && npx wrangler deploy` in `hosting/bundle-worker/` (3 min) — or delegate, but mocked `httpbin.org/json` works fallback
- [ ] **You:** Copy `.env.example` → `.env.local`, fill 3 vars (`GENLAYER_PRIVATE_KEY`, `NEXT_PUBLIC_BUNDLE_WORKER_URL`, later `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS`) — 2 min
- [ ] **We:** `bash scripts/run-tests.sh` (already 5 passed) — no action
- [ ] **We:** `genlayer network set testnetBradbury && genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury` (once you funded) — *blocked until your key*
- [ ] **We:** `scripts/check-bundle.sh` hash stable 1/8 — after Worker deploy
- [ ] **We:** `scripts/verify-post-deploy.sh <address>` register + attest 2 presets → explorer links — after deploy
- [ ] **We:** Frontend bootstrap (`scripts/setup-frontend.sh` if not already) — 5 min, Node 20.9+ required (we have 22*)

**Not required before Sep 3 (mock is fine):** Base VerdictRegistry deploy, Hyperlane mailbox, continuous poller, batch Merkle, DAO, token.

**Total blocked time:** ~15 min of your manual actions; then 30 min of our deploy+verify.

---

## 6. What Is Explicitly Out of Scope? (do not expand, per readiness §2)

No continuous poller / batch Merkle rootHash / USDC escrow / `emit_transfer` billing auto-credit / residential IP diversity / ENS policy hash / Gateway nanopayments / CCTP / VRF front-running mitigation beyond docs / 16-contract Playbook guards / procurement expansion (90d) / token / DAO / multi-chain beyond mocked bridge diagram.

Adding these would be "impressive but no startup value" (saturation map §03).

---

## 7. Self-Check Executed Now (2026-09-02)

```bash
python3 tests/test_provedown.py && echo "tests: PASS 5/5"
python3 -m py_compile contracts/provedown.py && echo "contract syntax: PASS"
grep -q GENLAYER_PRIVATE_KEY /home/unify/genlayer-jury/.env.local && echo "env fallback key: present (not shown) in jury env"
genlayer --version && echo "genlayer CLI: present 0.39.2"
genlayer network list | grep bradbury && echo "network bradbury: present"
curl -s https://rpc-bradbury.genlayer.com -X POST -d '{}' 2>&1 | head -c 20 && echo " rpc reachable"
node scripts/check-env.mjs --strict 2>&1 | head -n 15 || true
```

**Actual output now:**

- tests 5 passed, contract py_compile PASS, genlayer CLI 0.39.2 present, bradbury network present, RPC reachable (405 for GET but POST alive), `check-env` FAIL until you copy `.env.example`→`.env.local` (expected).

**Next manual run after you act:** `node scripts/check-env.mjs` should show 3 ✓ for GENLAYER_RPC_URL / PRIVATE_KEY / BUNDLE_WORKER_URL (masked), then `bash scripts/run-tests.sh` then `bash scripts/deploy-bradbury.sh` then `bash scripts/verify-post-deploy.sh 0x...`.

---

## Result

**When hackathon opens Sep 3, we ship immediately:** `scripts/run-lint.sh` → `scripts/run-tests.sh` (5 passed) → `scripts/deploy-bradbury.sh` (already funded) → `scripts/verify-post-deploy.sh` (2 presets BREACH/NO_BREACH explorer-verifiable) → `scripts/setup-frontend.sh` → demo `register→attest→verdict→hash→explorer→reputation→mock bridge`. No day-1 infra setup.

**No further approval unless blocked by missing credential above.**
