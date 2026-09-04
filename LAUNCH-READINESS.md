# LAUNCH READINESS — Sep 3 2026 (Hackathon Build Window OPEN)

**Date:** 2026-09-03
**Thesis:** ProveDown — neutral functional attestation for service quality agreements (bundle `p95>2000+500 OR error>=1% OR fill<80%`), beginning with API enrichment SLOs as wedge. Thesis check `07-final-thesis/thesis-check.md` narrow: quality bundle + on-chain native (x402/Arc) first, sidecar on top of Datadog/Pingoru not replacement. Validation gate PASSED with reframing (functional SLO not status page uptime).

---

## Current status

| Layer | Status | Evidence |
|---|---|---|
| **Research** | ✅ 22 files + 05 benchmark alignment + 04 pattern review + 05 feature synthesis | `01-genlayer-recon/05-benchmark-alignment.md:1` (Gym 93.7% resolvable, 89.6% sources direct/alt), `04-competitive-intelligence/04-previous-product-review.md`, `07-final-thesis/feature-synthesis.md` |
| **Contract** | ✅ `contracts/provedown.py` 362 lines `py_compile` OK, `pytest 5` pass, hash-stable 116-char presets (1/8 not 5/5), `run_nondet_unsafe` breach-only per technical validation | `scripts/run-lint.sh` fallback OK, `scripts/run-tests.sh` 5 passed |
| **Bundle Worker** | ⚠️ Code ready `hosting/bundle-worker/worker.js` 116 chars 4 presets, but **not deployed** (`your-subdomain` 404). Fallback `httpbin.org/json` 429 chars stable 1/8 works for Studio test | `bash scripts/check-bundle.sh` → placeholder 404, fallback httpbin 429 |
| **Env** | ⚠️ `.env.local` filled except placeholders: `GENLAYER_RPC_URL` ✓ (Bradbury 405 reachable), `GENLAYER_PRIVATE_KEY` present (masked, `provedown-deployer` 0x3211... active), `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=0x...` placeholder invalid, `NEXT_PUBLIC_BUNDLE_WORKER_URL=your-subdomain` placeholder 404 | `node scripts/check-env.mjs` → 2 ✓ 2 ✗ (contract, worker) |
| **Account** | ⚠️ `provedown-deployer` 0x3211... active but **0 GEN** on `studionet` (`genlayer account show` 0 GEN locked) — faucet needed | `KEYCHAIN-WLS2.md` + `genlayer account show` |
| **Frontend** | ❌ `frontend/` empty (0 files) — `setup-frontend.sh` not run, no `package.json`, no `next build`, no flow `register→attest→explorer→hash→reputation` | `ls frontend/` empty |
| **Toolchain** | ✅ Node 22.22.3 npm 10.9.8 Python 3.12.3 genlayer 0.39.2 genlayer-js 1.1.8 | `genlayer network list` bradbury 4221 |
| **Gym alignment** | ✅ MVP uses **direct** public Worker (Gym direct 46% + alt 47% = 93.7% resolvable), stable JSON not paywall/captcha (`currently unresolvable` 6.3% avoided). Remaining gap is accuracy backtest (open) not coverage. | `01-genlayer-recon/05-benchmark-alignment.md:Benchmark-to-Product` 6 mappings all High except subjective confidence Medium |

---

## P0 blockers (must fix today)

| ID | Missing | Why required | Exact manual action | Expected result | From |
|---|---|---|---|---|---|
| **P0-1** | Frontend not bootstrapped | No UI flow to demonstrate `register→attest→explorer` | `bash startup/scripts/setup-frontend.sh` (creates `frontend/package.json` from jury 1.1.8, `npm install`, `next build`) — Node 22 present | `ls frontend/package.json` exists, `npm --prefix frontend run build` exit 0 | `FINAL-PREFLIGHT-AUDIT.md:F1` + `07-final-thesis/implementation-blockers.md:P0-1` |
| **P0-2** | Bundle Worker placeholder `your-subdomain` 404 | Jury `fetch failed` → `INCONCLUSIVE` not BREACH/NO_BREACH | `npx wrangler login` (browser OAuth) → `cd startup/hosting/bundle-worker && npx wrangler deploy` → copy `https://provedown-bundle.../bundle` → set `NEXT_PUBLIC_BUNDLE_WORKER_URL` + `BUNDLE_WORKER_URL` in `startup/.env.local` → `bash startup/scripts/check-bundle.sh` 2/2 stable | `curl $NEXT_PUBLIC_BUNDLE_WORKER_URL?preset=breach \| sha256sum` stable `9566a8b5...` | `CREDENTIALS-REQUIRED.md:5` |
| **P0-3** | Contract not deployed placeholder `0x...` invalid | Frontend live reads invalid → revert `unknown sla_id` | **First fund P0-4**, then `export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY startup/.env.local \| cut -d= -f2 \| tr -d '\r\n ')` → `node startup/scripts/deploy-with-js.mjs` (WSL-safe per `KEYCHAIN-WLS2.md`, reads key via `createAccount`, not `genlayer account unlock`) → `Contract address: 0x...` → set `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS` | `node startup/scripts/check-env.mjs` shows ✓ contract 42-char hex, `bash startup/scripts/verify-post-deploy.sh 0x...` → `register_sla demo-breach` tx ACCEPTED + `/tx/0x...` explorer | `CREDENTIALS-REQUIRED.md:1` |
| **P0-4** | Deployer 0 GEN `0x3211...` locked, `genlayer account show` 0 GEN, `keychain not available` blocks CLI `deploy` | Even JS deploy needs GEN for gas (estimate ~0.05 GEN per attestation) | Paste `0x3211d1419709682b81c53CC51cb63622E25488d3` into `https://testnet-faucet.genlayer.foundation` (Bradbury) → `genlayer account show` balance >0 (studionet) — switch `genlayer network set testnetBradbury` if needed (note CLI bug `testnetBradbury not found` transient — retry) | `genlayer account show` → `balance: '50 GEN'` etc. | `FINAL-PREFLIGHT-AUDIT.md:B1` |
| **P0-5** | CLI `genlayer deploy` blocked by WSL keychain | Same as P0-3, cannot use CLI `deploy` interactively | **Do NOT use CLI `deploy`** — use `scripts/deploy-with-js.mjs` per `KEYCHAIN-WLS2.md` | No password prompt, direct `createAccount(privateKey)` | `KEYCHAIN-WLS2.md` |

**Security note:** Never `echo $GENLAYER_PRIVATE_KEY` or `cat .env.local` without redaction; `scripts/check-env.mjs` reports `present/missing` only.

---

## P1 issues (should fix before demo, not blocking start)

| ID | Problem | File | Fix | Verification |
|---|---|---|---|---|
| **P1-1** | Frontend missing `INCONCLUSIVE`/`no_consensus` amber + `UserError("[EXPECTED] ...")` toast | `contracts/provedown.py:182-276` returns those statuses | After P0-1, implement UI branch: `inconclusive` → amber retry, `no_consensus` → amber honest split, `UserError` → toast | Trigger `preset=empty` → INCONCLUSIVE, invalid `api_url http://` → UserError toast |
| **P1-2** | Malformed bundle JSON → `p50=""` → LLM may hallucinate p95 | `provedown.py:199-205` | Add guard `if not isinstance(maybe, dict) or "p95" not in maybe: return inconclusive` before `exec_prompt` | Redeploy, test `preset=empty` inconclusive not resolved |
| **P1-3** | 403 HTML via `web.render` not detected (returns body 200-ish, not exception) | `provedown.py:168` catches exception only | Post-hackathon use `web.get` status_code; for MVP Worker always 200, so P1 not P0 | Document in 05-benchmark Remaining gap |
| **P1-4** | Same private key for both chains `0x398...` identical | `.env.local:6,19` | Rotate Base key via `cast wallet new` — keep testnet but add comment `testnet only` | `grep 0x398 startup --exclude=.env.local` 0 |
| **P1-5** | No git repo yet, `.gitignore` not enforced | `.gitignore:1` | `git init` in `startup/` → `git add .gitignore .env.example` first, never `.env.local` | `git check-ignore -v .env.local` → `.gitignore:1:.env.local` |
| **P1-6** | `genvm-lint` not in PATH — fallback to `py_compile` only | `scripts/run-lint.sh` | Studio lints server-side on deploy, or `pip install genlayer` | Studio deploy error surfaces |
| **P1-7** | `appeal_attestation` missing vs readiness | `contracts/provedown.py` | Implement 0.1 GEN bond re-jury or update readiness to mocked (do not demo nonexistent) | `grep appeal contracts/provedown.py` |

---

## P2 deferred (do NOT spend build time)

Continuous poller (5 min), hourly Merkle batch 100→one rootHash, USDC escrow `emit_transfer`, residential IP diversity / ZK random, TEE, ENS, Gateway nanopayments/CCTP, VRF, Playbook 16 guards, procurement expansion (90d), carbon/health — all in `feature-synthesis.md:Long-term` and `implementation-readiness.md:2`.

---

## Benchmark alignment (Gym 2026-09-03)

**Gym is 93.7% coverage, not accuracy:** Polymarket 1.3M addressable → 611k direct 46% + 624k alt 47% + 83k currently unresolvable 6.3% (paywall 5k, hard blocked 56k). Sources 182 → 121 direct 66% + 42 alt 23% + 19 blocked 10% → 89.6% reachable. **Rewards having source URL**, public host, supported family. **Struggles:** paywall/login/captcha, hard blocked/no alternate, not yet classified, pure-consensus subjective. **Our alignment:** Bundle Worker is **direct** public stable JSON 116 chars 1/8 not 5/5, not in currently unresolvable. So MVP asks GenLayer to do what Gym proves well (public direct fetch + LLM judge). **Remaining gap:** Gym headline is coverage, not per-market accuracy (open question) — our breach/no_breach 3/3 stable analog needs Bradbury per-preset backtest; hardened alternates agent-chosen not whitelist (open). TLS notary not needed for MVP.

**Mapping 6 capabilities → ProveDown:** External retrieval (web.render bundle) High, accessibility (direct) High, multi-validator reasoning (run_nondet_unsafe breach bool) High (reason drift avoided), subjective resolution (exec_prompt SLO) Medium (vertical prompt horizontal today), evidence normalization (sanitize/truncate 3000 sha256) High, disagreement/inconclusive honest split High.

**Outside strongest capability:** Fetching arbitrary customer API status pages with paywall/captcha → 6.3% currently unresolvable — correctly avoided (bundle we control).

---

## Previous-product lessons (from 04-previous-product-review.md)

Reuse: BridgeSender→Base VerdictRegistry (AgentEscrow), Bayesian reputation `(good+2)/(total+3)` (ArcSLA, already in contract), temporal `next_check_at` recheck (SponsorGuard) for 180d poller, Merkle batch (TrustTrace) for 90d, independent timestamp (Pingoru). Derivative trap avoid: generic escrow (Tribunal 9 clones), deterministic per-call marketplace (ArcSLA live 9 providers — its `Optional DisputeModule for subjective` is our whitespace), pure ping (Pingoru $15). Strengthens core verification/attestation layer around SAME workflow without kitchen-sink.

---

## Feature synthesis

**Core MVP 7 primitives (already in 362-line contract + worker + 5 tests):** functional SLO jury not status page, evidence hash, consensus breach-only, neutral attestation+reputation, INCONCLUSIVE/UNDETERMINED first-class, mock bridge proof, sanitize+DATA framing.

**Near-term 90d (strong fit after MVP):** temporal recheck + Merkle batch + aggregated global intelligence (like Updog but for quality). **Long-term platform:** multi-party settlement + code/security + procurement + cross-chain + guards — same jury different verifier prompt, horizontal after wedge proves. **Irrelevant:** betting, stigmergy, carbon/health (explicitly cut).

**No kitchen-sink** — combine around ONE customer/workflow (pipeline owner, functional SLO breach, neutral attestation with evidence hash, downstream reputation/router).

---

## Final MVP boundary (from 07-final-thesis/implementation-readiness.md)

Single SLO functional quality (P50 500 P95 2000+500 error 1% fill 80% match 85%) via bundle not probe; one jury run `1×web.render` bundle + `1×exec_prompt` + breach-only consensus; one attestation anchored `evidence_hash p50/p95` + explorer; one mock BridgeProof arrow (AgentEscrow pattern); one reputation TreeMap; one frontend flow register→attest (5 validators) → BREACH/NO_BREACH/UNDETERMINED + hash + explorer + reputation + live sandbox; stable Worker presets healthy/breach/ambig/empty; no continuous poller/Merkle/USDC/ENS/residential/TLS.

---

## What must be built today (Sep 3)

1. **P0-2 Worker:** `npx wrangler deploy` → set URL → `check-bundle.sh` 1/8 stable
2. **P0-4 Fund:** paste 0x3211... into Bradbury faucet
3. **P0-3 Deploy:** `node startup/scripts/deploy-with-js.mjs` → 0x... → set `.env.local` → `verify-post-deploy.sh` register 2 SLAs → attest healthy/breach → tx ACCEPTED explorer
4. **P0-1 Frontend:** `bash startup/scripts/setup-frontend.sh` → `npm install` → `next build` (requires .env.local 42-char)
5. **P1-1 Frontend handles INCONCLUSIVE/UNDETERMINED/UserError** amber/toast (to avoid demo failure)

---

## What must NOT be built today

Per P2: continuous poller, Merkle batch, USDC escrow, DAO/token, multi-chain Hyperlane real, residential IP, ENS, Gateway nanopayments, Playbook 16 guards, procurement expansion, carbon/health, betting. From 05 benchmark: no paywalled/login/captcha fetching (would be currently unresolvable 6.3%).

---

## Exact manual actions required from you (blocked until you act)

| # | Action | Command / Where | Expected result (masked) |
|---|---|---|---|
| **M1** | Fund deployer | Visit `https://testnet-faucet.genlayer.foundation` paste `0x3211d1419709682b81c53CC51cb63622E25488d3` (from `genlayer account show`) | `genlayer account show` → `balance: '...' GEN` >0 |
| **M2** | Deploy Bundle Worker | `cd startup/hosting/bundle-worker && npx wrangler login` (OAuth) → `npx wrangler deploy` | `https://provedown-bundle...workers.dev/bundle` → set `NEXT_PUBLIC_BUNDLE_WORKER_URL` in `startup/.env.local` → `bash startup/scripts/check-bundle.sh` → 2/2 stable `9566a8b5`/`9cd4199c` |
| **M3** | Verify Worker | `curl "$NEXT_PUBLIC_BUNDLE_WORKER_URL?preset=breach" \| sha256sum` twice same | 2 same hashes |
| **M4** | No other secret | Do NOT `cat .env.local` raw; `node startup/scripts/check-env.mjs` reports `present/missing` only | All ✓ for GENLAYER_RPC_URL, PRIVATE_KEY (present), BUNDLE_WORKER_URL (real 200), CONTRACT (after M5) |

**Agent will automate after M1-M2:** `export GENLAYER_PRIVATE_KEY=... && node startup/scripts/deploy-with-js.mjs` → contract 0x... → set `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS` → `bash startup/scripts/verify-post-deploy.sh 0x...` → `bash startup/scripts/setup-frontend.sh` → frontend build.

---

## Exact commands for next execution step (when you are ready)

```bash
# verify current (no secrets printed)
node startup/scripts/check-env.mjs
bash startup/scripts/run-tests.sh  # 5 passed
bash startup/scripts/run-lint.sh   # py_compile OK

# after you fund (M1) and Worker deploy (M2):
export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY startup/.env.local | cut -d= '=' -f2 | tr -d '\r\n ')
node startup/scripts/deploy-with-js.mjs  # → Contract address: 0x...  Deploy tx: 0x...

# then
# edit startup/.env.local set NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=0x...
bash startup/scripts/verify-post-deploy.sh 0x...  # register → attest → explorer
bash startup/scripts/setup-frontend.sh  # npm install + next build
npm --prefix startup/frontend run dev  # http://localhost:3000 → register → attest → BREACH/NO_BREACH → explorer + reputation
```

---

## Definition of done for today's session

- [ ] M1-M2 done (faucet + Worker deploy, 5 min manual)
- [ ] P0-3 deploy via JS → `0x...` 42-char hex in `.env.local` + explorer `/address/0x...` persistent
- [ ] `verify-post-deploy.sh` → 2 txs `ACCEPTED` with `/tx/0x...` links, `get_attestation` BREACH (p95 4800) and NO_BREACH (1600), `get_reputation` score 66→60/75
- [ ] P0-1 frontend `npm --prefix startup/frontend run build` PASS with live `NEXT_PUBLIC_LIVE_JURY=true`
- [ ] Demo `DEMO.md` 3 presets: healthy `?preset=no_breach` → NO_BREACH, breach `?preset=breach` → BREACH, ambig `?preset=ambig` → BREACH low conf or no_consensus (all explorer-verifiable)
- [ ] `node startup/scripts/check-env.mjs` shows 3 ✓ (RPC present, PRIVATE_KEY present, BUNDLE_WORKER 200, CONTRACT 42-char) — not `your-subdomain` 404 / `0x...` placeholder

---

## Hard decision

### `YELLOW — BUILD WITH SPECIFIC BLOCKER`

**Why not RED:** Thesis validation gate PASSED with reframing (functional SLO quality sidecar, not status page — Gym proves direct fetch 93.7% resolvable, not paywalled; 116-char bundle 1/8 stable not 5/5; LLM breach 3/3 stable, injection 2/2 resisted). No secret leaked, tooling ready, contract narrow slice lint+tests pass, no speculative infra.

**Why not GREEN:** Exactly 3 P0 blockers remain **stopping E2E `register→attest→explorer` from being live**: frontend empty (P0-1), Worker placeholder 404 (P0-2 → INCONCLUSIVE not BREACH), contract placeholder `0x...` invalid (P0-3), deployer 0 GEN locked (P0-4) + WSL keychain forces JS deploy path (P0-5). All are **15 min manual** (faucet + wrangler deploy) then 30 min automated (deploy-with-js → verify → frontend build) — not research. Previous P1/P2 are deferred but tracked.

**Do NOT reopen funnel, do NOT add features (P2), do NOT search random repos for credentials (per blocker discipline). Build now after M1-M2.**
