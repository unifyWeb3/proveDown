# LAUNCH READINESS — 2026-09-04 (Consensus v0.6 RC + Uptime Gap)

**Date:** 2026-09-04
**Thesis:** ProveDown — neutral functional attestation for service-quality agreements (bundle `p95>2000+500 OR error>=1% OR fill<80%`), beginning with API functional SLOs. Track: Agentic Commerce Infrastructure, SLA enforcement via signed logs/decentralized monitoring. Validation gate PASSED with reframing; v0.6 migration audit done; Uptime gap proven.
**Primary env:** Studio-dev `https://studio-dev.genlayer.com/api` 61997 with `genlayer@0.40.0-rc.3` + `genlayer-js@2.0.0-rc.1` + `genlayer-py==0.19.0rc2` + `genlayer-test==0.30.0rc2` + `genvm-linter==0.11.1rc2`. Bradbury `0x72a6...` is compatibility/reference, not primary until v0.6 promoted there.

---

## Current status

| Layer | Status | Evidence |
|---|---|---|
| Research + Gym | ✅ 05-benchmark-alignment (93.7% resolvable, 89.6% direct/alt, 6.3% blocked) + 06-migration audit | `01-genlayer-recon/05-benchmark-alignment.md:1`, `06-consensus-v06-migration.md:1`, Gym Polymarket/Sources fetched |
| Uptime gap | ✅ 14-section analysis, positioning validated (functional vs factual) | `04-competitive-intelligence/uptime-gap-analysis.md:1` (`uptime_monitor.py` strict_eq is_up, `sla_verifier` linear/tiered/full+10%, `sla_agreement` worst-shortfall) |
| Contract | ✅ `contracts/provedown.py` 362 lines `py_compile` OK, `pytest` 5 passed, breach-bool consensus | `bash run-lint.sh` fallback OK (genvm-linter not in PATH, need 0.11.1rc2), `run-tests.sh` 5 passed 2026-09-04 |
| Worker | ✅ Live `https://provedown-bundle.contentbounty.workers.dev/bundle` 200×5 presets (healthy/breach/ambig/empty/invalid→breach), hash `b4fc2013...` twice same, no timestamp/random/secret | `curl -s ...?preset=breach` 200 verified 2026-09-04; Wrangler 4.129.0 cwd error diagnosed (autoconfig in `startup/` root per log, fixed comment to mandate `--cwd`/`-c`, no `[assets]` needed) |
| Env | ✅ `.env.local` present, `check-env.mjs` 4 ✓ (RPC, PRIVATE_KEY present masked, CONTRACT 0x72a6... 42-char, WORKER 200) | `node scripts/check-env.mjs` 2026-09-04 (Bradbury RPC ETIMEDOUT transient, curl live proves reachable) |
| Account/toolchain | ⚠️ Node 22.22.3 npm 10.9.8 Python 3.12.3, but `genlayer 0.39.2` vs required `0.40.0-rc.3`, `genlayer-js 1.1.8` vs `2.0.0-rc.1`, `genlayer-py`/`genlayer-test`/`genvm-linter` not installed | `genlayer --version`, `npm view genlayer-js` shows `2.0.0-rc.1` available, `pip show` not found |
| Frontend | ⚠️ Static `frontend/index.html` 7.5K demo-ready (`register→attest→explorer→hash→reputation` + bundle preview), but esm.sh `genlayer-js@1.1.8` + `testnetBradbury` must move to `2.0.0-rc.1` + `studioDevnet` + Transaction Kit | `frontend/index.html:1`, needs migration per `06-consensus-v06-migration.md:8` |
| Studio-dev | ✅ RPC live (GET 405, POST `gen_chainId` → `Method not found` JSON-RPC proves responsive) | `curl -s https://studio-dev.genlayer.com/api` 2026-09-04 |
| Bradbury compat | ✅ Prior real deployment `0x72a67E0cF59bCb526AEF0D81391e399C56703590` tx `0x89f1...` ACCEPTED, healthy register `0x0947...`, healthy att `0xed5a...` att 1 breach false 1000 hash `64e6...` resolved | Explorer `https://explorer-bradbury.genlayer.com/address/0x72a6...`, `get_attestation 1` JSON in `memory.md:Checkpoint 4` |
| Fees | ❌ Old `$0.04–0.08` INVALID under v0.6; no `fee-profile.json` yet | Must generate via `gltest --fee-profile` on studio-dev, then `estimateTransactionFees` + `distribution`/`feeValue` + `isSuccessful` |

## P0 blockers (must fix for studio-dev E2E)

| ID | Missing | Why required | Exact manual action (no secret in chat) | Expected result (masked) |
|---|---|---|---|---|
| P0-M1 | RC toolchain not installed | Fee-aware deploy/write requires coherent RC set; 0.39.2/1.1.8 lack `FeesDistribution`, `studioDevnet`, `isSuccessful`, `appealTransaction` | `npm install -g genlayer@0.40.0-rc.3` (or `npm i -D genlayer-js@2.0.0-rc.1`), `pip install genlayer-py==0.19.0rc2 genlayer-test==0.30.0rc2 genvm-linter==0.11.1rc2` — pin exact RC, do NOT use `latest` | `genlayer --version` → `0.40.0-rc.3`, `npm list genlayer-js` → `2.0.0-rc.1`, `pip show genlayer-py` → `0.19.0rc2` |
| P0-M2 | No `fee-profile.json` | Every v0.6 deploy/write must carry profile-derived `distribution` + live `feeValue`; hardcoded fees cancel at activation if price rose | `python3 -m pytest tests/ --fee-profile frontend/fee-profile.json -v -s --rpc-url https://studio-dev.genlayer.com/api` (cover deploy, cheap `register_sla`, expensive `request_attestation`, failure paths), commit `fee-profile.json` | `frontend/fee-profile.json` exists with `deploy` + `methods.register_sla`/`request_attestation` entries (max-observed + headroom 1.25) |
| P0-M3 | Scripts use old SDK (no fees, wrong chain, ACCEPTED-only) | Studio-dev rejects fee-less writes; `studionet` object pointed at preview RPC mismatches chain identity + consensus address | Update `scripts/deploy-with-js.mjs`, `attest_test.mjs`, `verify-live.mjs`, `simple_test.mjs`, `frontend/index.html` to `import {studioDevnet} from 'genlayer-js/chains'`, `estimateTransactionFees({... appealRounds, rotations})`, `fees:{distribution, feeValue}`, `isSuccessful(receipt)` (ACCEPTED/FINALIZED + FINISHED_WITH_RETURN) per `06-consensus-v06-migration.md:5` | `grep -r studioDevnet scripts/ frontend/` non-empty, `grep -r estimateTransactionFees` non-empty, no bare `deployContract({code,args:[]})` |
| P0-M4 | Studio-dev deploy not yet proven | Need one fee-bearing deploy + write + read + nondet + FINALIZED to prove lifecycle | `export GENLAYER_PRIVATE_KEY` (variable name only, value in `.env.local`, never print) → `node scripts/deploy-with-js.mjs` with `GENLAYER_NETWORK=studio-dev` → `register_sla demo-healthy` → `request_attestation` → `get_attestation` + `get_reputation` + Explorer fee panel (deposit vs consumed vs refund) | Contract `0x...` 42-char on studio-dev 61997, tx `0x...` `isSuccessful` true, attestation `breach false` hash `64e6...`-like, fee panel shows refund |
| P0-W1 | Wrangler `deploy` cwd error (already diagnosed, Worker live) | `npx wrangler deploy` from `startup/` root triggers autoconfig static detection → `Could not detect static files` | Run with `workdir=/home/unify/startup/hosting/bundle-worker npx wrangler deploy` OR `npx wrangler deploy -c hosting/bundle-worker/wrangler.toml` OR `npx wrangler deploy --cwd hosting/bundle-worker`. Do NOT add `[assets]`. Config already correct (`main="worker.js"`, no assets). No redeploy needed while `curl .../bundle?preset=breach` 200 + hash stable | `curl -s .../bundle?preset=breach` 200, `check-bundle.sh` 2/2 stable (already PASS 2026-09-04) |

**Security note:** Never print `GENLAYER_PRIVATE_KEY`, `BASE_SEPOLIA_PRIVATE_KEY`, `OPENROUTER_API_KEY`. Use `scripts/check-env.mjs` (`present/missing` only) + `grep ... | sed 's/=.*/=***/'`. `.env.local` gitignored (`git check-ignore -v .env.local` → `.gitignore:3`).

## P1 issues (should fix before demo)

- Frontend `INCONCLUSIVE`/`no_consensus` amber + `UserError` toast (contract returns both, UI must branch).
- Malformed bundle guard before `exec_prompt` (`if not isinstance(maybe,dict) or "p95" not in maybe: return inconclusive`).
- 403 HTML via `web.render` not detected (use `web.get` status_code post-hackathon; Worker always 200 for MVP).
- Same private key for both chains (rotate Base via `cast wallet new`, testnet-only comment).
- `genvm-lint` fallback → install `0.11.1rc2` and run `genvm-lint check contracts/provedown.py --json`.
- `appeal_attestation` missing vs readiness → keep mocked, use `appealTransaction`/`getAppealCharge` only if implemented (do NOT use direct `submitAppeal`).
- `py-genlayer:1jb45aa...` pragma verify via 0.11.1rc2; update only if linter says so.

## P2 deferred (do NOT build)

Continuous poller, Merkle batch, USDC escrow `emit_transfer`, DAO/token, multi-chain Hyperlane real, residential IP, ENS, Gateway nanopayments/CCTP, VRF, Playbook 16 guards, procurement 90d, carbon/health, betting. From Gym: no paywalled/login/captcha fetching (currently unresolvable 6.3%).

## Benchmark alignment (Gym + track)

Gym 93.7% coverage (611k direct 46% + 624k alt 47% + 83k blocked 6.3%: paywall 5k, hard blocked 56k), Sources 182 (121 direct 66% + 42 alt 23% + 19 blocked 10%). Rewards source URL + public host + supported family. ProveDown bundle is direct stable JSON 116 chars 1/8 (Gym direct), not blocked. Remaining gap is accuracy backtest (open) — our breach/no_breach 3/3 stable analog needs studio-dev per-preset backtest. Mapping 6 caps in `05-benchmark-alignment.md:Benchmark-to-Product` all High except subjective Medium. Outside strongest: arbitrary paywalled status pages — correctly avoided.

Track fit: SLA enforcement via signed logs/decentralized monitoring. Decisive difference vs Uptime: 200-but-empty still BREACH (functional quality), evidence hash + confidence + breach reason + reputation + amber splits. See `uptime-gap-analysis.md:14` + `hackathon-alignment.md:2`.

## Previous-product lessons

Reuse BridgeSender→Base (AgentEscrow), Bayesian reputation (ArcSLA, already in contract), temporal recheck (SponsorGuard) 90d, Merkle batch (TrustTrace) 90d, independent timestamp (Pingoru). Avoid generic escrow 9 clones, deterministic marketplace (ArcSLA live), pure ping ($15). Quality bar from `enoch208/clasp` (122 tests, 10-step policy engine, real Fiber testnet `0x3d2c...`, honesty table), `Vestra` (22 Foundry tests, mainnet agent #9387, non-custodial guards), `cairnand` 404 (no bar). Extract clarity/workflow/proof/attacks/evidence/onboarding/architecture/memorability/defensibility without copying.

## Feature synthesis (CORE / REINFORCING / 90-DAY / LONG-TERM / REJECT)

Core 7 (functional jury, bundle hash, breach-only consensus, attestation+reputation, INCONCLUSIVE/UNDETERMINED, mock bridge, sanitize) already in 362-line contract + worker + 5 tests. Reinforcing (automation, policy, observability already in verdict card, dispute via appealTransaction) earns place only if same workflow. 90-DAY (temporal recheck, Merkle batch, reputation marketplace, auditability 12-mo, procurement supplier attestation). LONG-TERM (multi-party settlement, security verification, cross-chain real, agent delegation, payments x402, guards). REJECT (betting, stigmergy, carbon, health). See `feature-synthesis.md:Addendum 2026-09-04`. No kitchen-sink.

## Final MVP boundary

Single functional SLO (P50 500 P95 2000+500 error 1% fill 80% match 85%) via bundle; one jury `1×web.render bundle + 1×exec_prompt` breach-only; one attestation `evidence_hash p50/p95` + explorer; one mock BridgeProof arrow; one reputation TreeMap; one frontend flow `register→attest→BREACH/NO_BREACH/UNDETERMINED + hash + explorer + reputation + sandbox`; presets healthy/breach/ambig/empty; no poller/Merkle/USDC/ENS/residential/TLS. Fees via profile + live estimate, `isSuccessful` required, FINALIZED for fee panel.

## What must be built today

1. P0-M1: install coherent RC set + lock versions.
2. P0-M2: generate + commit `fee-profile.json` on studio-dev.
3. P0-M3: migrate 5 scripts + frontend to `studioDevnet` + fees + `isSuccessful`.
4. P0-M4: studio-dev deploy → register 2 SLAs → attest healthy/breach → `isSuccessful` + FINALIZED + fee panel + `get_attestation`/`get_reputation`.
5. P1 frontend amber/toast (to avoid demo failure).

## What must NOT be built today

Per P2 + Gym blocked 6.3% (no paywall/login/captcha). No generic uptime ping, no deterministic marketplace rebuild, no token/DAO.

## Exact manual actions required (no secret in chat)

| # | Variable / Where | Action | Expected result (masked) |
|---|---|---|---|
| M1 | `GENLAYER_PRIVATE_KEY` in `startup/.env.local` | Ensure present for `deploy-with-js.mjs` via `export GENLAYER_PRIVATE_KEY=$(grep ...)`; fund studio-dev address via studio-dev faucet (URL in release notes / `testnet-faucet` equivalent for 61997) | `node scripts/check-env.mjs` → `GENLAYER_PRIVATE_KEY: (present, not shown)`, `genlayer account show` (after `0.40.0-rc.3` install) balance >0 |
| M2 | `NEXT_PUBLIC_BUNDLE_WORKER_URL` in `startup/.env.local` | Already `https://provedown-bundle.contentbounty.workers.dev/bundle` live 200 — no action unless redeploy needed; if redeploy: `workdir=hosting/bundle-worker npx wrangler deploy` (NOT from root) | `bash scripts/check-bundle.sh` 2/2 stable `b4fc2013...` (already PASS) |
| M3 | `CLOUDFLARE_API_TOKEN` (if wrangler login expires) | `npx wrangler login` (browser OAuth, already complete per user) — only if `wrangler whoami` fails | `npx wrangler whoami` shows account `db5a77...` |

## Exact commands for next execution step

```bash
# verify current (no secrets printed)
node scripts/check-env.mjs
bash scripts/run-tests.sh  # 5 passed
bash scripts/run-lint.sh   # py_compile OK (until 0.11.1rc2)
curl -s "https://provedown-bundle.contentbounty.workers.dev/bundle?preset=breach" | head -c 200
curl -s -X POST https://studio-dev.genlayer.com/api -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"gen_chainId","params":[]}' | head -c 200

# migrate (after M1):
npm install -g genlayer@0.40.0-rc.3
npm install -D genlayer-js@2.0.0-rc.1
pip install genlayer-py==0.19.0rc2 genlayer-test==0.30.0rc2 genvm-linter==0.11.1rc2
python3 -m pytest tests/ --fee-profile frontend/fee-profile.json -v -s --rpc-url https://studio-dev.genlayer.com/api
export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY .env.local | cut -d= -f2 | tr -d '\r\n ')
GENLAYER_NETWORK=studio-dev node scripts/deploy-with-js.mjs  # after P0-M3 migration
```

## Definition of done

- [ ] P0-M1–M4 done (RC set + fee-profile + studio-dev deploy with fees + `isSuccessful` FINALIZED + fee panel)
- [ ] `verify-post-deploy.sh`-equivalent on studio-dev → 2 txs `isSuccessful` with `/tx/0x...` links, `get_attestation` BREACH (4800) and NO_BREACH (1600), `get_reputation` 66→60/75
- [ ] Frontend consumes real studio-dev result (no mocked verdict as live, bridge arrow labeled mock)
- [ ] Demo answers “Why not just Uptime?” in 60s (200-but-empty→BREACH + hash + reputation + amber splits)
- [ ] `check-env.mjs` shows studio-dev 61997 + contract 42-char + worker 200 + fee-profile exists

---

## Hard decision

### `YELLOW — BUILD WITH SPECIFIC BLOCKER`

**Why not RED:** Thesis validation PASSED with reframing + Gym direct proves Worker fetch viable (116 chars 1/8 stable) + live Worker 200×5 presets + prior Bradbury real txs (`0x89f1...` deploy, `0x0947...` register, `0xed5a...` att 1 resolved) + Uptime gap is genuine functional vs factual (strict_eq vs LLM jury) + architecture (bundle → jury → hash → reputation → mock bridge) survives v0.6 with mechanical migration (fees + chain + isSuccessful + appeal). No secret leaked, no kitchen-sink.

**Why not GREEN:** Exactly P0-M1–M4 migration work remains stopping studio-dev E2E `register→attest→isSuccessful→FINALIZED→fee panel` from being live under official hackathon stack (0.39.2/1.1.8 lack fees, no fee-profile, ACCEPTED-only checks, `testnetBradbury` pointed at preview would mismatch). Old fee `$0.04–0.08` INVALID until re-measured. Previous Bradbury E2E is compatibility/reference, not primary hackathon proof.

Do NOT reopen funnel, do NOT add P2, do NOT search random repos for credentials. Build P0-M1–M4 now.
