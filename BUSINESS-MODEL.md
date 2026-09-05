# BUSINESS-MODEL.md — Realistic Model on Measured Costs (2026-09-05)

FACT base ( `EVIDENCE.md` ): attestation deposit ~0.1 GEN, consumed ~1.3e-4 GEN; deploy consumed ~7.9e-5 GEN; majority refunded at FINALIZED. Fiat price of GEN testnet UNKNOWN — do not quote dollars for on-chain cost until mainnet pricing exists. Old `$0.04–0.08` estimate is RETIRED (`hackathon-alignment.md:4`).

## Customer, pricing, cost, margin (OUR DESIGN, INFERENCE on costs)

- Customer: pipeline operator (team, not individual hobbyist).
- Pricing V1.5: $99/mo starter (3 APIs, 50 attestations) / $499/mo growth (20 APIs, 1k attestations + webhooks + reputation API) / overage $0.10–0.25 per attestation. Enterprise (SSO, audit retention 12-mo, custom SLO types): $2k+/mo. No token — GEN is fee/bond utility only.
- Cost to serve per attestation: GEN consumed (~1.3e-4 × GEN price) + validator LLM inference (borne by network via fees, not our infra) + our infra (poller + Worker + cache + webhook delivery, estimated <$0.01 at 1k attestations/mo scale) + support amortized. INFERENCE: dominant cost is our off-chain infra + support, not chain fees, because batching amortizes on-chain cost (100 probes → 1 attestation).
- Gross margin: positive from first paid tier if poller cost stays <$20/customer/mo at starter volume; improves with batching. Must re-measure on mainnet fee policy before locking overage price.
- Volume/break-even: at $99 × 30 customers ≈ $3k MRR; infra <$500/mo at that scale → covers one founder part-time. 100 growth-tier customers ≈ $30–50k MRR = real company. Attestation volume follows breach frequency (low per customer) + scheduled digests (predictable) — model on seats+APIs, not per-breach spikes.

## Why this model and not the alternatives

Per-attestation-only: unpredictable for buyer, punishes proving breach (perverse). Platform-fee-only: leaves overage abuse open. Settlement-fee (% of credit): requires holding/observing money movement — premature before relay exists; revisit at V2 when VerdictRegistry has consumers. Reputation/API-fee: needs graph density first. Chosen hybrid (base + overage) matches Datadog/Uptrends buying motion with an attestation premium justified by credit-claim ROI (one $5k recovery covers 10 mo starter — INFERENCE from `final-product.md` case math, needs interview validation).

## Value loop (claimed only if real)

Better verification → trusted failover/routing → fewer $50K incidents → more pipeline volume on verified APIs → more attestations → richer reputation → better routing → lower failure cost → more demand for verification. This loop is PLAUSIBLE but UNPROVEN (needs ≥10 APIs × 90d history). Do not present as fact before P1-6 data exists. Leading indicator: reputation queries per attestation (if nobody reads reputation, loop is broken).
