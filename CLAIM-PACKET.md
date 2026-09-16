# CLAIM-PACKET.md — Provable Claims Only (2026-09-11, hardened Studio refs re-verified live)

Every claim → evidence → source/tx → confidence. Anything without a row below must not appear in submission, demo, or pricing. All measurements "on Studio Next under the current configuration" unless stated.

## Deployment references

- Contract: `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` — `https://explorer-studio-dev.genlayer.com/address/0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`
- Chain: Studio Next **61997**, RPC `https://studio-dev.genlayer.com/api`
- Deploy tx: `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb` (FINALIZED + FINISHED_WITH_RETURN + isSuccessful)
- Contract source: `contracts/provedown.py` (`# v0.3.1`, `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng`)
- Worker: `https://provedown-bundle.contentbounty.workers.dev/bundle` — digests `no_breach` 132 chars `sha256:64e6c84f…`, `breach` 155 chars `sha256:b4fc2013…` (hash-stable, re-verified 2026-09-05/06)
- Toolchain: `genlayer-js@2.0.0-rc.1`, `genlayer-py==0.19.0rc2`, `genlayer-test==0.30.0rc2`, `genvm-linter==0.11.1rc2`, Node v22.22.3, Python 3.12.3

## Attestation registry (all FINALIZED + FINISHED_WITH_RETURN + isSuccessful; re-read live 2026-09-11)

| Att | SLA | Attest tx | Verdict | Conf | Evidence hash | p50/p95 |
|---|---|---|---|---|---|---|
| 1 | demo-healthy | `0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf` | NO_BREACH OK | 1000 | `64e6c84f01418b89…` | 320/1600 |
| 2 | demo-breach | `0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505` | BREACH ERROR_QUALITY | 1000 | `b4fc2013862e316e…` | 1561/4800 |
| 3 | demo-empty | `0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a` | INCONCLUSIVE UNAVAILABLE | 0 | (refused) | / |
| 4 | browser-smoke-20260909-01 | `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110` | NO_BREACH OK | 1000 | `e33f68976f1f4b46…` | 320/1600 |

Explorer pattern: `https://explorer-studio-dev.genlayer.com/tx/<hash>`. Reputation after the canonical three-case run was `{"score":60,"total":2,"breaches":1}`; the inconclusive case did not change reputation. After finalized browser attestation 4, the current live reputation is `{"score":66,"total":3,"breaches":1}`. Canonical SLO: `{"p95_threshold":2000,"error_threshold":0.01,"fill_threshold":0.80,"match_threshold":0.85}`. Fee: deposit `100000000000010352` (~0.1 GEN) per write, consumed ≈1.3e-4 GEN/attestation, majority refunded (see `FEE-ECONOMICS.md`).

## Claims

| Claim | Evidence | Source / tx | Confidence |
|---|---|---|---|
| Detects functional SLA failure even when HTTP returns 200 | All-200 bundle judged BREACH ERROR_QUALITY conf 1000 (p95 4800 + fill 0.72 vs SLO) | Current attestation 2 (`0xf566…`) | HIGH for the current finalized run |
| GenLayer consensus produced the verdict | `run_nondet_default` leader/validator breach-bool agreement; independent per-validator fetches | `contracts/provedown.py:264-288` + FINALIZED receipts | HIGH |
| Evidence is hashed and re-checkable | `evidence_hash == sha256(sanitized-and-truncated bundle bytes)`; for the current clean presets, the Worker bytes and stored hashes match (`curl …/bundle?preset=breach \| sha256sum` → `b4fc2013…`) | Atts 1/4 `64e6…`, 2/5 `b4fc…` | HIGH for clean preset byte-match; scope-qualified |
| Transactions finalized on Studio Next (chain 61997) | FINALIZED + FINISHED_WITH_RETURN + `isSuccessful=true` | Registry above, explorer links | HIGH |
| Missing evidence never becomes a definitive judgment | All-null bundle → `inconclusive` conf 0, no reputation change | Hardened att 3 (`0x90b9…`) + analog tests | HIGH (live + analog) |
| Honest disagreement is a first-class state | `no_consensus` stored on validator split, never forced | `contracts/provedown.py:290-309` + analog test | MEDIUM (code + analog; no live split observed) |
| Verification consumed ≈1.3e-4 GEN under measured config | Receipt `data_fees_consumed`; deposit 0.1 refunded majority | `EVIDENCE.md` + `FEE-ECONOMICS.md` | HIGH for this config; NOT mainnet/fiat-transferable |
| Reputation accumulates correctly | Canonical 60/2/1 → browser healthy 66/3/1 matches the Bayesian formula | Live `get_reputation` read after attestation 4 | HIGH |
| Wallet-backed browser E2E finalizes and reads back the result | Browser registration and attestation both finalized successfully; `get_sla`, `get_attestation`, and `get_reputation` were read after finality | Registration `0x63f386…` + attestation `0xfe160a…` on Studio 61997 | HIGH for this run |
| Prompt-injection hardening resists tested attacks | 2/2 injection analog tests (`FORBIDDEN_TOKENS` + DATA framing) | `tests/test_provedown.py` | MEDIUM (analog, tested token set) |

## Explicitly NOT claimed

Real-time verification; mainnet costs; appeal liveness (mocked); cross-chain settlement (mocked arrow); poller-collected evidence (synthesized Worker); per-SLO accuracy backtest (Gym coverage ≠ accuracy).
