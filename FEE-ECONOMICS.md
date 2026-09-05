# FEE-ECONOMICS.md — Measured Fee Evidence (Studio Next 61997, v0.6) (2026-09-05)

Source of truth for every cost claim. All figures measured, none estimated — except where labeled.

## Measured (fresh 2026-09-05 + prior receipts in `EVIDENCE.md`)

| Item | Value (GEN) | Source |
|---|---|---|
| Attestation fee deposit (`feeValue`, standard preset) | `100000000000010352` ≈ **0.1 GEN** | estimate 2026-09-05 (identical to 2026-09-04 — stable) |
| Attestation consumed | ≈ **1.3e-4 GEN** (`data_fees_consumed=[127878000000000]`) | 2026-09-04 receipts |
| Deploy consumed | ≈ **7.9e-5 GEN** (`executionConsumed=78628000000000`) | deploy receipt |
| Refund | majority of deposit refunded at FINALIZED | receipts (`99921372000009529` refunded on deploy) |
| Reads (`get_attestation`, `get_reputation`, `get_sla`) | 0 (view calls, no tx) | protocol semantics |
| Retry/inconclusive cost | same as attestation (inconclusive still mints id + tx: att 6 consumed a full write) | tx `0x67a8…` 2026-09-05 |
| Request→FINALIZED latency | 111s / 44s / 43s (3 fresh writes) | 2026-09-05 run |

## Not implemented / unknown

- Appeal cost: `appeal_attestation` not implemented — no measurement exists. Do not quote. Path for V1.5: `appealTransaction`/`getAppealCharge` + 1.5× profit rule per migration doc (ROADMAP, not fact).
- Fiat conversion: **UNKNOWN** — GEN testnet has no price. Never display dollars for chain cost. Old `$0.04–0.08` retired.
- Mainnet fee policy will differ — re-measure before locking overage pricing.

## Cost per verification (claimable today)

≈1.3e-4 GEN consumed + amortized deploy + off-chain infra (Worker free tier + poller later). At starter volume the dominant cost is our off-chain infra + support, not chain fees. Margin assumption (`BUSINESS-MODEL.md`): positive from first paid tier if poller <$20/customer/mo; batching (100 probes → 1 attestation) drives marginal probe cost to ≈1e-6 GEN + infra.
