# CLAIM-PACKET.md — Provable Claims Only (2026-09-05)

Every claim → evidence → source/tx → confidence. Anything without a row below must not appear in submission, demo, or pricing.

| Claim | Evidence | Source / tx | Confidence |
|---|---|---|---|
| Detects functional SLA failure even when HTTP returns 200 | Bundle all-200 (`breach` preset) judged BREACH LATENCY conf 1000, p95 4800 + fill 0.72 vs SLO | Att 5, tx `0x9f311b965d2c436fbb1e6eff7f56dcb56cbc0d90e8b777b280227e4d90c3f4fc` (+ att 2 `0xe04d…`) | HIGH (reproduced 2/2 days) |
| GenLayer consensus produced the verdict | `run_nondet_default` leader/validator breach-bool agreement; validators fetch independently | `contracts/provedown.py:264-288`, FINALIZED receipts | HIGH |
| Evidence is hashed and re-checkable | `evidence_hash == sha256(exact bundle bytes)`; recompute: `curl …/bundle?preset=breach \| sha256sum` → `b4fc2013…` | Atts 2/5 `b4fc…`, atts 1/4 `64e6…` | HIGH (byte-match verified) |
| Transactions finalized on Studio Next | FINALIZED + FINISHED_WITH_RETURN + `isSuccessful=true`, chain 61997 | Txs `0x68cf…`, `0x9f31…`, `0x67a8…` at `explorer-studio-dev.genlayer.com/tx/0x…` | HIGH |
| Missing evidence never becomes a definitive judgment | Empty preset (all nulls) → `inconclusive`, conf 0, no reputation change | Atts 3 (`0xa218…`) + 6 (`0x67a8…`) | HIGH (2/2 + analog tests) |
| Honest disagreement is a first-class state | `no_consensus` path stored when validators split; never forced | `contracts/provedown.py:290-309` + analog test | MEDIUM (code + analog; no live split observed yet) |
| Verification consumed ≈1.3e-4 GEN under measured config | Receipt `data_fees_consumed`, deposit 0.1 refunded majority | `EVIDENCE.md` receipts + `FEE-ECONOMICS.md` | HIGH for testnet config; NOT transferable to mainnet/fiat |
| Reputation accumulates correctly | Bayesian updates 60/2/1 → 57/4/2 match formula exactly | `get_reputation` reads 2026-09-04/05 | HIGH |
| Prompt-injection hardening resists tested attacks | 2/2 injection analog tests pass (`FORBIDDEN_TOKENS` + DATA framing) | `tests/test_provedown.py`, `05-provedown-technical-validation.md` | MEDIUM (analog only, tested token set) |

## Explicitly NOT claimed

Real-time (<seconds) verification; mainnet costs; appeal liveness (mocked); cross-chain settlement (mocked arrow); poller-collected evidence (synthesized Worker); per-SLO accuracy backtest (Gym coverage ≠ accuracy — `memory.md` Cp1).
