# LAUNCH READINESS — 2026-09-12 (Studio Next 61997 LIVE, v0.6 hardened)

**Date:** 2026-09-11
**Thesis:** ProveDown — neutral functional attestation for service-quality agreements (bundle `p95>2000+500 OR error>=1% OR fill<80%`), beginning with API functional SLOs. Track: Agentic Commerce Infrastructure, SLA enforcement via signed logs/decentralized monitoring. Validation gate PASSED with reframing; v0.6 migration audit done; Uptime gap proven.
**Primary env:** Studio-dev `https://studio-dev.genlayer.com/api` 61997 with live writes via `genlayer-js@2.0.0-rc.1`, `genlayer-py==0.19.0rc2`, `genlayer-test==0.30.0rc2`, and `genvm-linter==0.11.1rc2`. The Windows-backed `genlayer` CLI 0.39.2 is compatibility-only; Bradbury `0x72a6...` is historical reference, not primary.

---

## Current status

| Layer | Status | Evidence |
|---|---|---|
| Research + Gym | ✅ 05-benchmark-alignment (93.7% resolvable, 89.6% direct/alt, 6.3% blocked) + 06-migration audit | `01-genlayer-recon/05-benchmark-alignment.md:1`, `06-consensus-v06-migration.md:1`, Gym Polymarket/Sources fetched |
| Uptime gap | ✅ 14-section analysis, positioning validated (functional vs factual) | `04-competitive-intelligence/uptime-gap-analysis.md:1` (`uptime_monitor.py` strict_eq is_up, `sla_verifier` linear/tiered/full+10%, `sla_agreement` worst-shortfall) |
| Contract | ✅ v0.6 `contracts/provedown.py` (`# v0.3.1` + `5jycge...`, `gl.contract.Contract`, JSON-string storage, `run_nondet_default`, fenceless `exec_prompt`, strict evidence/judge guards) `py_compile` OK, `pytest` 13 passed | `bash scripts/run-lint.sh` (two documented nested-reachability advisories) + `bash scripts/run-tests.sh` 2026-09-11; live deployment evidence in `EVIDENCE.md` |
| Worker | ✅ Live `https://provedown-bundle.contentbounty.workers.dev/bundle` 200×4 presets (healthy/breach/ambig/empty; unknown falls back to breach), hashes stable across repeated reads, no timestamp/random/secret | `bash scripts/check-bundle.sh https://provedown-bundle.contentbounty.workers.dev/bundle` 2026-09-11 |
| Env | ✅ Required values present and masked; both local public contract variables resolve to the current Studio contract | `node scripts/check-env.mjs` 2026-09-11; its CLI/connectivity probes timed out in this runner, while the independent Worker check passed |
| Account/toolchain | ✅ Node 22.22.3, `genlayer-js@2.0.0-rc.1` (startup/node_modules), `genvm-linter==0.11.1rc2` + `genlayer-py==0.19.0rc2` + `genlayer-test==0.30.0rc2` (`--no-deps` venv), deployer 0x3211... ~0.099 GEN on studio-dev | `npm list genlayer-js` → 2.0.0-rc.1, `eth_getBalance` `0x162fdf55b87bd39` |
| Frontend | ✅ Static `frontend/index.html` (live reads + wallet-backed writes) on esm.sh `2.0.0-rc.1` + `studioDevnet` + current contract `0x278C...` + explorer-studio-dev + hash-bound evidence rows | `npm --prefix frontend test`, `npm --prefix frontend run build`, dynamic Chromium smoke |
| Studio-dev E2E | ✅ Current contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` (deploy `0x6cdb...` FINALIZED FINISHED_WITH_RETURN). Case A `0xa5a1...` NO_BREACH 1000 hash `64e6...`; Case B `0xf566...` BREACH 1000 hash `b4fc20...` reason ERROR_QUALITY; Case C `0x90b9...` INCONCLUSIVE conf 0. Browser registration `0x63f386...` + attestation 4 `0xfe160a...` finalized successfully; current REP 66/3/1. | `EVIDENCE.md`, explorer-studio-dev `/tx/0x...` |
| Studio-dev | ✅ RPC live (GET 405, POST `gen_chainId` → `Method not found` JSON-RPC proves responsive) | `curl -s https://studio-dev.genlayer.com/api` 2026-09-04 |
| Bradbury compat | ✅ Prior real deployment `0x72a67E0cF59bCb526AEF0D81391e399C56703590` tx `0x89f1...` ACCEPTED, healthy register `0x0947...`, healthy att `0xed5a...` att 1 breach false 1000 hash `64e6...` resolved | Explorer `https://explorer-bradbury.genlayer.com/address/0x72a6...`, `get_attestation 1` JSON in `memory.md:Checkpoint 4` |
| Fees | ✅ Measured on studio-dev: deposit `feeValue=100000000000010352` (~0.1 GEN), deploy consumed `78628000000000` (~7.9e-5 GEN), attest consumed `[127878000000000]` (~1.3e-4 GEN), refunded majority at FINALIZED. Fiat UNKNOWN (GEN testnet price unknown). Old `$0.04–0.08` retired | Receipt `fee_accounting` in `06-consensus-v06-migration.md:9`; economics in GEN: ~1e-4 consumed/verification |

## Remaining release gates

| Gate | Current state | Required action |
|---|---|---|
| Browser wallet E2E | ✅ Browser registration + attestation completed with finalized receipts and chain readbacks | Preserve the two transaction links in `EVIDENCE.md`; repeat only if Studio resets |
| Submission package | Repository remains private and the final public package has not been scanned | Curate the public app/package, verify every direct link and receipt, run the secret scan, then publish only with explicit approval |
| Evidence provenance | Worker returns deterministic synthesized fixtures | Keep the fixture and mocked Base relay labels visible; do not describe them as production monitoring or settlement |
| Full linter | Two nested nondeterministic reachability advisories remain | Retain the documented exception with live deployment evidence, or resolve against a newer official linter |

**Security note:** Never print `GENLAYER_PRIVATE_KEY`, `BASE_SEPOLIA_PRIVATE_KEY`, `OPENROUTER_API_KEY`. Use `scripts/check-env.mjs` (`present/missing` only) + `grep ... | sed 's/=.*/=***/'`. `.env.local` gitignored (`git check-ignore -v .env.local` → `.gitignore:3`).

## Bounded limitations

- Studio timestamps are empty in current reads; use the Explorer transaction time.
- `appeal_attestation` and Base settlement are not implemented; protocol appeal support is not a ProveDown feature claim.
- The Worker is startup-operated fixture evidence; a real poller and signed/TEE provenance are post-MVP.
- Public registration and repeated attestation writes have no owner/rate policy yet; assess after the narrow wedge is stable.

## P2 deferred (do NOT build)

Continuous poller, Merkle batch, USDC escrow `emit_transfer`, DAO/token, multi-chain Hyperlane real, residential IP, ENS, Gateway nanopayments/CCTP, VRF, Playbook 16 guards, procurement 90d, carbon/health, betting. From Gym: no paywalled/login/captcha fetching (currently unresolvable 6.3%).

## Benchmark alignment (Gym + track)

Gym 93.7% coverage (611k direct 46% + 624k alt 47% + 83k blocked 6.3%: paywall 5k, hard blocked 56k), Sources 182 (121 direct 66% + 42 alt 23% + 19 blocked 10%). Rewards source URL + public host + supported family. ProveDown bundle is direct stable JSON (132–155 byte presets) with 1/8-style deterministic hashing, not blocked. Remaining gap is accuracy backtest (open) — stable analogs and three Studio cases are not a per-SLO accuracy study. Mapping 6 caps in `05-benchmark-alignment.md:Benchmark-to-Product` all High except subjective Medium. Outside strongest: arbitrary paywalled status pages — correctly avoided.

Track fit: SLA enforcement via signed logs/decentralized monitoring. Decisive difference vs Uptime: 200-but-empty still BREACH (functional quality), evidence hash + confidence + breach reason + reputation + amber splits. See `uptime-gap-analysis.md:14` + `hackathon-alignment.md:2`.

## Previous-product lessons

Reuse BridgeSender→Base (AgentEscrow), Bayesian reputation (ArcSLA, already in contract), temporal recheck (SponsorGuard) 90d, Merkle batch (TrustTrace) 90d, independent timestamp (Pingoru). Avoid generic escrow 9 clones, deterministic marketplace (ArcSLA live), pure ping ($15). Quality bar from `enoch208/clasp` (122 tests, 10-step policy engine, real Fiber testnet `0x3d2c...`, honesty table), `Vestra` (22 Foundry tests, mainnet agent #9387, non-custodial guards), `cairnand` 404 (no bar). Extract clarity/workflow/proof/attacks/evidence/onboarding/architecture/memorability/defensibility without copying.

## Feature synthesis (CORE / REINFORCING / 90-DAY / LONG-TERM / REJECT)

Core 7 (functional jury, bundle hash, breach-only consensus, attestation+reputation, INCONCLUSIVE/UNDETERMINED, mocked downstream boundary, sanitize) are present in the contract + Worker + tests. Reinforcing (automation, policy, observability) earns a place only if it strengthens the same workflow. 90-DAY (temporal recheck, Merkle batch, reputation marketplace, auditability 12-mo, procurement supplier attestation). LONG-TERM (multi-party settlement, security verification, cross-chain real, agent delegation, payments x402, guards). REJECT (betting, stigmergy, carbon, health). See `feature-synthesis.md:Addendum 2026-09-04`. No kitchen-sink.

## Final MVP boundary

Single functional SLO (P50 500 P95 2000+500 error 1% fill 80% match 85%) via bundle; one jury `1×web.render bundle + 1×exec_prompt` with breach-only consensus; one attestation `evidence_hash` + observed metrics + Explorer readback; one labeled mock Relay → Base boundary; one reputation TreeMap; one frontend flow `register→attest→BREACH/NO_BREACH/INCONCLUSIVE/NO_CONSENSUS + hash + explorer + reputation + sandbox`; presets healthy/breach/ambig/empty; no poller/Merkle/USDC/ENS/residential/TLS. Fees via profile + live estimate, `isSuccessful` required, FINALIZED for fee panel.

## What must NOT be built before the wedge is proven

Per P2 + Gym blocked 6.3% (no paywall/login/captcha). No generic uptime ping, no deterministic marketplace rebuild, no token/DAO.

## Definition of done

- [x] RC fee-aware Studio deployment, finalized receipts, on-chain readback, and Worker hash verification
- [x] Frontend consumes real Studio results; mocked relay and fixture boundaries are labeled
- [x] Demo answers “Why not just Uptime?” with 200-but-functional-breach, hash, reputation, and amber states
- [x] Masked environment and release checks pass
- [x] Injected-wallet browser smoke
- [ ] Public submission package and final secret/link audit

---

## Hard decision

### `READY FOR SUBMISSION PACKAGING`

**Why controlled demo:** The full contract/Worker/readback sequence is proven on Studio Next 61997 with finalized receipts: Case A NO_BREACH, Case B BREACH (the 200-but-empty-fill differentiator vs Uptime), Case C INCONCLUSIVE, evidence hashes, and reputation. The static frontend reads those finalized records and contains the real wallet write path. Fee economics are measured in GEN, not fiat. No secret leaked, no kitchen-sink, and Bradbury is compatibility evidence only.

**Remaining release gates:** The final curated public-package, direct-link, and masked-secret scan remains; the repository is still private and uncommitted. The dynamic browser smoke and CDP accessibility-tree pass are complete. `timestamp` is empty on Studio reads (use Explorer transaction time); the Worker is synthesized fixture evidence; the Base relay is mocked; and two nested `genvm-lint` reachability advisories remain documented. The contract has no application-level appeal method, so protocol `appealTransaction` must not be presented as a ProveDown feature.

Do NOT reopen funnel, do NOT add P2, do NOT search random repos for credentials. Demo the studio-dev E2E now.
