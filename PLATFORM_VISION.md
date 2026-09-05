# PLATFORM_VISION.md — Where ProveDown Could Go (NOT the Build List) (2026-09-05)

Vision: **the trusted verification layer for machine-to-machine agreements** — any agent framework calls ProveDown before/after settlement the way apps call a payments API. This file is direction, not commitment. Nothing here is approved for build until it passes the productization rule against the live loop.

## Territory map (from prior primitives pool, `feature-synthesis.md`)

| Primitive | Vision role | Why it belongs eventually | Gate to enter roadmap |
|---|---|---|---|
| Real poller + temporal recheck | Evidence becomes continuous, not spot | Turns attestation from incident tool into monitoring replacement with proof | 10 customers attesting weekly |
| Merkle batch + auditability (12-mo) | Cost scales sub-linearly; credit windows covered | $0.0007/probe amortized economics | Poller live + fee data stable |
| Reputation marketplace / routing | Scores become selection signal + price premium | Network effect: more attestations → better scores → more demand | 100+ resolved attestations across ≥10 APIs |
| VerdictRegistry + claim helper → real relay | Attestation becomes money-relevant | Escrow/insurance partners pull verdicts | A partner escrow requests integration |
| Procurement verification | Same jury, invoice verifier prompt | CFO payer, daily frequency, 0.35% leakage pool | SLA wedge validated OR kill criteria trigger pivot (see PRODUCT-METRICS) |
| Code/security verification, agent delegation, x402 conditions | Same jury, different verifier | Horizontal infrastructure | Reputation + relay proven first |
| Insurance (parametric downtime) | Attestation triggers payout | Natural Layer-7 consumer | Capital partner + 90d loss history |
| Cross-chain attestations | Verdict readable on Base/L2s | Agentic commerce is multi-chain | Partner chain demand |
| Policy engine (versioned SLO standard, ENS anchor) | Agreements become machine-readable standard | Governance without redeploy | ≥3 integrators asking for SLO governance |

## Explicitly never (REJECT retained)

Betting/parimutuel (regulatory), stigmergy pheromones (coordination ≠ attestation), carbon/health as ProveDown features (separate theses; health needs HIPAA sandbox, carbon needs satellite — neither reuses the bundle/jury without a rewrite).

## Coherence test for any future addition

Must answer YES to all four: same customer (pipeline/service operator or their agent)? same evidence→verdict primitive? reuses jury + hash + reputation architecture? strengthens agreement→attestation loop instead of adding a second loop? Otherwise it is a new product wearing ProveDown's name — reject or spin out.
