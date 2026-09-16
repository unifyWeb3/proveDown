# 06 — Consensus v0.6 Migration Audit

**Date:** 2026-09-04
**Sources:** `https://docs.genlayer.com/developers/consensus-v06-migration` (fetched 2026-09-04, last_updated 2026-09-03), `/developers/decentralized-applications/fees-and-transaction-kit`, `/fee-profiling-and-estimation`, `/transaction-kit-integration`, `startup/package.json (genlayer-js 1.1.8)`, `genlayer --version 0.39.2`, `pip show genlayer-py (not found)`, `npm view genlayer-js (1.1.8 → 2.0.0-rc.1 available)`
**Rule:** Audit before modifying product logic. Migrate only what is necessary.

> **Historical migration record.** This document captures the v0.6 migration investigation and older assumptions. The installed/live environment and current lifecycle evidence are maintained in `research/current-genlayer-environment.md`; do not treat old contract addresses or planned appeal/fee behavior here as current ProveDown features.

## 1. Old vs New Versions

| Component | Old (installed) | New (official v0.6 RC family) | Action |
|---|---|---|---|
| Consensus contracts + Node | Bradbury/stable (pre-v0.6) | v0.6 RC | Do NOT upgrade node locally; use `studio-dev` RPC |
| Studio | stable `https://studio.genlayer.com/api` 61999 | v0.123 RC at `https://studio-dev.genlayer.com/api` 61997 | Use studio-dev for validation, keep stable as reference |
| `genlayer-js` | 1.1.8 (startup + genlayer-jury) | 2.0.0-rc.1 (`2.0.0-rc.1` listed in npm versions) | Required for fee-aware deploy/write + `studioDevnet` chain + `isSuccessful` + appeal |
| `genlayer-py` | not installed | 0.19.0rc2 (`==0.19.0rc2`) | Required for `gltest --fee-profile` + py tests |
| CLI | 0.39.2 | 0.40.0-rc.3 (`genlayer@0.40.0-rc.3`) | Required for `estimate-fees --fee-profile`, `deploy --fee-profile`, `write --fee-profile` |
| Testing | analog `pytest tests/test_provedown.py` (no gltest) | `genlayer-test==0.30.0rc2` + `gltest --fee-profile` | Required for fee-profile.json generation |
| Linter | fallback `py_compile` (genvm-linter not in PATH) | `genvm-linter==0.11.1rc2` | Required for 20+ rules before deploy |
| Transaction Kit | not installed | `@genlayer/transaction-kit` + `-react`/`-vue` (GitHub `#pkg/core`, RC versions when published, do NOT use npm latest) | Required for frontend fee receipt + low/standard/high (1/3/5 rounds) |

Use exact RC versions as one coherent family. Do NOT mix stable + RC (e.g., stable `studionet` chain object pointed at preview RPC).

## 2. Breaking Changes Affecting ProveDown

### A. Fee-funded lifecycle (P0 — blocks all writes without change)
- Old: `client.deployContract({code, args:[]})`, `client.writeContract({address, functionName, args})` with no fees. Used in `scripts/deploy-with-js.mjs:32`, `attest_test.mjs:11`, `verify-live.mjs:23`, `simple_test.mjs:17`, `frontend/index.html` esm.sh 1.1.8.
- New: every deploy/write must carry `FeesDistribution` + quoted `feeValue`. Flow: exercise branches in tests → `gltest --fee-profile fee-profile.json` → convert profile entry → `estimateTransactionFees({..., appealRounds, rotations})` → submit returned `distribution` + `feeValue` unchanged. Deposit covers consensus time units (leader/validator GEN/time-unit), execution (receipt/storage/rollup), child messages, appeal/rotation posture. Unused refunded at finalization. Studio deployment can be gasless; detect from estimate, not network name.
- Required code changes: all 5 scripts + frontend must add estimate step. See §4.

### B. Network/chain identity (P0)
- Old: `testnetBradbury` 4221 (`GENLAYER_RPC_URL=https://rpc-bradbury.genlayer.com`), `studionet` 61999 (`GENLAYER_STUDIO_RPC=https://studio.genlayer.com/api`), imports `testnetBradbury, studionet` from `genlayer-js/chains`.
- New: preview `studio-dev.genlayer.com/api` 61997 with `studioDevnet` definition / CLI `studio-dev` alias. Chain identity + consensus contract addresses move together. Do NOT point stable `studionet` object at preview RPC.
- Required: add `studioDevnet` import, new env `GENLAYER_STUDIO_DEV_RPC=https://studio-dev.genlayer.com/api`, `GENLAYER_STUDIO_DEV_CHAIN_ID=61997`, keep Bradbury as compatibility/reference per §7, make studio-dev primary for hackathon validation.

### C. Status + execution result (P0 — demo correctness)
- Old: `waitForTransactionReceipt({hash, status: ACCEPTED})` + check `receipt.statusName==='ACCEPTED'` (see `deploy-with-js.mjs:35-38`). Treats ACCEPTED as success.
- New: ACCEPTED/FINALIZED alone does NOT prove contract execution success. Require `status ACCEPTED|FINALIZED` **and** `executionResult FINISHED_WITH_RETURN` via `isSuccessful` helper or Transaction Kit normalized outcome. Track until FINALIZED when UI needs exact fee consumption/refunds. Display deposit vs consumed vs refund as different values.
- Required: update all scripts + frontend verdict card to check `isSuccessful`, not just status. Current `attest_test.mjs` logs `receipt.statusName` only — must add execution check.

### D. Appeals (P1 — not in MVP but readiness mentions bond)
- Old: readiness `implementation-readiness.md:3` planned `appeal_attestation` simple bond (not implemented in `provedown.py` — no appeal method).
- New: use `getAppealCharge({txId})` + `appealTransaction({txId, value: charge})` which binds active decision via `topUpAndSubmitAppeal`. Direct `submitAppeal` only for low-level conformance against already-funded next round, else reverts `AppealRoundNotPermitted`. Successful appeal returns bond + 1.5× profit (2.5× total), induced-work funding not multiplied.
- Required: if appeal added, use high-level `appealTransaction`, not direct. For MVP, keep appeal mocked/documented, do NOT implement direct submitAppeal.

### E. Randomness / Tribunals / Rewards / Errors (P2 — observe, not MVP)
- Randomness: ECVRF proofs bound to operator pubkey + domain-separated seed chain (affects validator seed advances, not our `run_nondet_unsafe` breach bool directly).
- Tribunals: electorate/quorum frozen at creation, bounded retryable consequence, majority-disagree wires convicted leader into staking restriction (relevant if our jury splits often — currently `no_consensus` stored, not slashed).
- Developer rewards: first deployment mints one Developer NFT, later contracts attached; one claim processes ≤50 inflation epochs (affects deploy economics, not MVP logic).
- Error decoding: v0.6 snapshot exposes 363 custom-error selectors; use Error & Revert Reference with ABI from deployment (affects `UserError("[EXPECTED] ...")` decoding in frontend toasts).

## 3. Required Fee Changes

- Generate `fee-profile.json` (commit it): `python3 -m pytest tests/integration --fee-profile frontend/fee-profile.json` (or `gltest --fee-profile`) against fee-reporting Studio-dev. Cover: deploy, cheapest `register_sla`, expensive `request_attestation` (bundle fetch + exec_prompt + breach bool), failure paths (`unknown sla_id`, `https://` validation), `get_attestation`/`get_reputation` reads (reads are free, but writes need profile).
- Convert profile entry → live estimate options: `{leaderTimeunitsAllocation, validatorTimeunitsAllocation, executionBudgetPerRound, totalMessageFees, appealRounds, rotations: [rotationsPerRound]*(appealRounds+1)}` with headroom 1.25 (default) via `--fee-profile-headroom 1.5` if needed.
- Submit `distribution` + `feeValue` unchanged from `estimateTransactionFees` / `estimate_transaction_fees` / `genlayer estimate-fees --fee-profile frontend/fee-profile.json --fee-preset standard --args ...`.
- Presets differ: CLI low/standard/high = 0/1/2 appeal rounds; Transaction Kit low/standard/high = 1/3/5. Use explicit `--appeal-rounds` / `appealRounds` when needing shared posture. For ProveDown demo, `standard` (CLI 1 round) is sufficient; frontend Kit `standard` (3 rounds) is safer but more expensive — document which was used per tx.
- Regenerate when contract code, GenVM, Studio, or fee policy changes (treat like perf budget, same PR).

## 4. Changed Network Config

| Env | Old | New (add, do NOT replace Bradbury yet) |
|---|---|---|
| `GENLAYER_RPC_URL` | `https://rpc-bradbury.genlayer.com` 4221 | Keep as compatibility/reference |
| `GENLAYER_STUDIO_RPC` | `https://studio.genlayer.com/api` 61999 | Keep stable |
| `GENLAYER_STUDIO_DEV_RPC` (new) | — | `https://studio-dev.genlayer.com/api` 61997 (primary for hackathon validation) |
| `GENLAYER_STUDIO_DEV_CHAIN_ID` (new) | — | `61997` |
| `GENLAYER_NETWORK` | `testnetBradbury` | Allow `studio-dev` (maps to `studioDevnet` chain) |

## 5. Changed Deployment Process

Old (0.39.2 + 1.1.8): `client.deployContract({code, args:[]})` → `waitForTransactionReceipt ACCEPTED` → read `txDataDecoded.contractAddress`.

New (0.40 RC + 2.0 RC):
1. `gltest --fee-profile fee-profile.json` from representative tests.
2. `estimate = await client.estimateTransactionFees({leaderTimeunitsAllocation, validatorTimeunitsAllocation, executionBudgetPerRound, totalMessageFees, appealRounds, rotations})`.
3. `deployTx = await client.deployContract({code, args:[], fees:{distribution: estimate.distribution, feeValue: estimate.feeValue}})`.
4. `receipt = await client.waitForTransactionReceipt({hash: deployTx, status: FINALIZED (for fee accounting) or ACCEPTED (for demo speed)})`, then `isSuccessful(receipt)` requires status + `FINISHED_WITH_RETURN`.
5. Display deposit vs consumed vs refund separately (Explorer fee panel).

## 6. Changed Testing Process

- Install `genlayer-test==0.30.0rc2`, `genlayer-py==0.19.0rc2`, `genvm-linter==0.11.1rc2` explicitly (do NOT rely on latest).
- `python3 -m pytest tests/ --fee-profile fee-profile.json -v -s --rpc-url https://studio-dev.genlayer.com/api` for profile generation.
- Profile tests must `wait_until="finalized"` (not just accepted) for reliable fee accounting.
- Use trusted developer preset for profiling tx itself: `{leaderTimeunitsAllocation:100, validatorTimeunitsAllocation:200, totalMessageFees:0, rotations:[1]}` via `get_gl_client().estimate_transaction_fees`.
- `genvm-lint check contracts/provedown.py --json` with 0.11.1rc2 (20+ rules) before every deploy.

## 7. Known Compatibility Risks

- Mixing RC + stable (e.g., 1.1.8 `testnetBradbury` object against studio-dev RPC) → chain identity + consensus address mismatch → `AppealRoundNotPermitted` or silent wrong network. Must lock one coherent RC set in `package.json` + manifests.
- Studio-dev may reset (warning in migration doc) — do NOT treat studio-dev contract address as durable. Move durable testing to Bradbury only after v0.6 promoted there. For hackathon demo, studio-dev txs are valid proof but note reset risk; keep Bradbury `0x72a6...` as compatibility evidence, not primary.
- `py-genlayer:1jb45aa...` pragma in `provedown.py:1` may need bump for v0.6 GenVM — verify via linter 0.11.1rc2; if linter reports pragma mismatch, update pragma from release notes, not guess.
- `gl.nondet.web.render(bundle_url, mode="text")` + `exec_prompt(..., response_format="json")` + `run_nondet_unsafe` APIs are unchanged in migration doc excerpts, but verify via 0.19 RC `genlayer-py` types + error reference (363 selectors) — `UserError("[EXPECTED] ...")` decoding may need ABI from deployment.
- Fee underestimation (e.g., using old $0.04–0.08 without profile) → activation cancels before consensus and refunds escrow if GEN-per-time-unit rose above ceiling. Must use profile + live estimate, not hardcoded feeValue.
- Frontend esm.sh `genlayer-js@1.1.8` in `frontend/index.html` must move to `2.0.0-rc.1` + `@genlayer/transaction-kit` for fee receipt; otherwise writes will lack fees and revert on fee-charging studio-dev.

## 8. What Breaks in Current ProveDown Code Today

| File | Old pattern | Breaks under v0.6? | Fix |
|---|---|---|---|
| `scripts/deploy-with-js.mjs:7-11` | `import {testnetBradbury, studionet}`, `network==='studionet'?studionet:testnetBradbury` | Yes — missing `studioDevnet`, no fees | Add `studioDevnet` import, `GENLAYER_NETWORK=studio-dev` branch, estimate + fees |
| `scripts/deploy-with-js.mjs:32` | `deployContract({code, args:[]})` | Yes — missing fees | Add profile → estimate → `fees:{distribution, feeValue}` |
| `scripts/deploy-with-js.mjs:35` | `waitForTransactionReceipt ACCEPTED` + check `status 5/6` | Partial — must also check `FINISHED_WITH_RETURN` via `isSuccessful` | Add `isSuccessful` + track FINALIZED for fee panel |
| `scripts/attest_test.mjs:11`, `verify-live.mjs:23`, `simple_test.mjs:17` | `writeContract({address, functionName, args})` no fees | Yes | Same estimate + fees |
| `frontend/index.html` esm.sh 1.1.8 | `createClient({chain:testnetBradbury})`, no fee UI | Yes | Move to `2.0.0-rc.1` + Transaction Kit panel with `suggestions: feeProfile` |
| `contracts/provedown.py:1` | `py-genlayer:1jb45aa...` | Unknown — verify via 0.11.1rc2 linter | Update only if linter says so |
| `tests/test_provedown.py` | analog, no `gltest`, no fee-profile | Incomplete for v0.6 | Add `gltest` integration with `transaction_fee_preset()` + `wait_until="finalized"` |
| `scripts/check-env.mjs` | checks `GENLAYER_RPC_URL`, `1.1.8` version | Outdated — must check `STUDIO_DEV_RPC`, `2.0.0-rc.1`, fee-profile exists | Update required list |

Old fee estimate `$0.04–$0.08` in `07-final-thesis/final-product.md` is **INVALID** under v0.6 until re-measured via profile + live estimate on studio-dev. Do NOT reuse.

## 9. Verified on Studio-dev 61997 (2026-09-04, real txs)

Toolchain installed: `genlayer-js@2.0.0-rc.1` (npm, `studioDevnet` id 61997 RPC `https://studio-dev.genlayer.com/api` consensus `0xb727...`), `genlayer-py==0.19.0rc2` + `genlayer-test==0.30.0rc2` (`--no-deps`, metadata only), `genvm-linter==0.11.1rc2` (`lint` 3 checks PASS; `validate` needs 310MB GenVM download, blocked by 100kB/s bandwidth — Studio lints server-side on deploy instead). Deployer `0x3211...` funded (~0.099 GEN via `eth_getBalance`).

Runner hash: Studio-dev frontend bundle (`/assets/index-Bwt_FM7z.js`) embeds `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng` (not docs' `1jb45aa...`). v0.6 contract header is `# v0.3.0` + `# { "Depends": "py-genlayer:5jycge..." }`. Single-`Depends` (NOT `Seq` — `Seq` is embeddings-only per skills docs; a `Seq` single-item deploy failed with `invalid_contract runner malformed`).

v0.6 Python API (proven by working studio-dev contracts `0x6E68...` prediction-market, `0xCC04...` policy attestation + our deploys):
- `import genlayer as gl` + `from genlayer.types import *` (+ `from genlayer.storage.tree_map import TreeMap` for maps). `from genlayer import *` does NOT export `gl`, `Contract`, or `allow_storage` (deploy fails `NameError: gl/allow_storage not defined`).
- `class X(gl.contract.Contract)` (lowercase; `gl.Contract` → `AttributeError`).
- `gl.storage.inmem_allocate(TreeMap[str, str])` required for TreeMap fields in `__init__`.
- `gl.nondet.web.render(url, mode="text")` unchanged; `gl.nondet.exec_prompt(task)` WITHOUT `response_format` (positional only — strip fences + `json.loads`, prediction-market pattern); `gl.vm.run_nondet_default(leader, validator)` replaces removed `run_nondet_unsafe`; `gl.vm.Return`, `gl.vm.UserError`, `gl.message.sender_address`, `gl.message_raw["datetime"]`, `gl.eq_principle.strict_eq` confirmed present on studio-dev.
- Sla/Attestation stored as JSON strings (`TreeMap[str, str]`) — no custom dataclass types needed.
- `genvm-lint lint` reachability warning (`gl.nondet.* not reachable from equivalence block` for nested-def-passed-as-arg) is a FALSE POSITIVE — same structure succeeds on-chain (prediction-market + our attestations).

Measured fees (studio-dev, `estimateTransactionFees({preset:'standard'})`, all presets identical without profile):
- deposit `feeValue=100000000000010352` (~0.1 GEN), policy `genPerTimeUnit=1, storageUnitPrice=250000000, receiptGasPrice=250000000, floor=76548000000000`.
- deploy consumed `executionConsumed=78628000000000` (~7.9e-5 GEN), refunded `99921372000009529` (~0.0999 GEN).
- attestation (web+LLM) consumed `data_fees_consumed=[127878000000000,...]` (~1.3e-4 GEN).
- Fiat conversion UNKNOWN (GEN testnet price unknown) — economics must be quoted in GEN: ~1e-4 GEN consumed per verification, 0.1 GEN deposit (mostly refunded at FINALIZED). Old `$0.04–0.08` retired.

Real studio-dev proof (contract `0x8faE0025892bA58e5c2E16D10cC414Af47D30d55`):
- deploy `0x5424f3d44de6d8543348301a475ff9f61887b7d5f7ebf914c09419a70c281711` FINALIZED FINISHED_WITH_RETURN isSuccessful=true.
- register healthy `0xdff058bc23c31facfc984258370a15ca165fa76ed4084f79ed452a6f651f9234`, breach `0x3a11ea99e16262c3ac95b7d73ce9713f2bf50abe4b471130b315315003be3d45`, empty `0xed5e525abffafed0b7d07781993a34412ba5503a9571a6dcb511e63ae243a7b3` — all SUCCESS=true.
- Case A healthy `0x5b1cb325b5b27d6d0603a6cea6a33c1b4cb173788093bb87036609314d7ac497` → att 1 breach FALSE conf 980 hash `64e6c84f01418b89` p95 1600 reason OK resolved (NO_BREACH ✓, contract `0xeE85...` with strict evidence guard).
- Case B breach `0xe04dae35608f65b703cfcd2f80a197cb402330c5776f5e634e419f9519bc7383` → att 2 breach TRUE conf 1000 hash `b4fc2013862e316e` p95 4800 reason LATENCY resolved (BREACH ✓ — HTTP 200 + fill 72% still breach, the Uptime differentiator).
- Case C empty `0xa218c962dbe7aa23dee7d705e5a7ec8a2dcdf5bdbbc9bdfdfef01dd2a7cdea43` → att 3 **INCONCLUSIVE** conf 0 reason UNAVAILABLE (missing metrics never definitive ✓).
- reputation `{"score":60,"total":2,"breaches":1}` (resolved only; Bayesian (1+2)/(2+3)=60 ✓).
- Minimal-probe contract `0x89aBdeBAE91857B6dcACF96d73c8A2b3101fA6ec` proved TreeMap/u256/inmem_allocate/message pattern before full rewrite.
