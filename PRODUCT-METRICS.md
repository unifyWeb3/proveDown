# PRODUCT-METRICS.md — Metrics That Actually Matter (2026-09-05)

No vanity (registered users, page views, total txs on testnet). Every metric has a decision attached.

## Reliability (is the jury trustworthy?)

- `resolved_rate` (resolved / total attestations) — target >90%. Decision: <80% → tolerance/guard redesign.
- `inconclusive_rate` — target <10%. Decision: rising → bundle/poller quality problem, not jury problem.
- `no_consensus_rate` — target <5%. Decision: persistent >10% at a threshold → SLO preset tolerance wrong.
- `validator_disagreement_rate` (appeals + no_consensus) — target falling with tuning.
- `verification_latency_p50/p95` (request → FINALIZED) — target p95 <15 min on current network. Decision: exceeds buyer failover window → async-only positioning, never hot-path.
- `hash_match_rate` (independent recompute == stored) — must be 100%, else critical bug.

## Business (will anyone pay?)

- Design partners attesting weekly (target: 2 by day 30, 10 by day 90). Decision: miss → kill/scale-down.
- Attestations per customer per week (target: ≥2 — proves repeat use, not demo curiosity).
- Paid conversion + gross margin per customer on GEN-measured costs (target: margin-positive by customer 10).
- Retention: % partners still attesting at day 60 (target ≥70%). Expansion: APIs per customer growth.

## Trust (is the graph becoming valuable?)

- APIs with ≥10 resolved attestations (target: 5 by day 90 — minimum for reputation credibility).
- Reputation queries per attestation (target ≥1 — proves someone reads the score; if ~0, value loop broken).
- Disputes filed + overturn rate (healthy: few disputes, low overturn; high overturn → jury miscalibrated).
- Claim packets generated per BREACH (proves downstream action, not verdict collection).

## Economics (can this be a business?)

- GEN consumed per attestation (FACT baseline ~1.3e-4; track per release).
- Infra cost per attestation (poller + Worker + delivery).
- Revenue per attestation (blended subscription + overage).
- Gross margin per tier (decision: negative → reprice before scaling volume).

## Kill / validate thresholds (from `final-product.md:24` hardened)

KILL (any one triggers pivot-or-stop review): ≤1/5 interviews would pay $99/mo; `no_consensus+inconclusive` >30% on stable endpoints over 20 runs; zero design partners attesting weekly by day 45; reputation queries ≈0 after 50 attestations (nobody uses the graph); mainnet fee ×10 vs testnet destroying margin with no pricing power.
VALIDATE (all needed to proceed to V2 spend): ≥3/5 interviews pay; resolved >90% on presets + real poller bundles; 2 partners weekly; ≥1 credit claim or failover executed with claim packet; margin-positive on measured costs.
