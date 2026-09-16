# ROADMAP-DECISION.md — Final Productization Decision (2026-09-05)

> **Historical decision record with current-state addendum.** The original decision remains useful for scope; current deployment facts and receipts are authoritative in `EVIDENCE.md`.

## What ProveDown is today (FACT)

Neutral functional-attestation sidecar on Studio Next 61997: buyer registers API+SLO → jury fetches hash-stable bundle → `exec_prompt` judges breach vs SLO with tolerance → consensus on breach bool → attestation `{breach, reason, confidence, evidence_hash, p50/p95}` + Bayesian reputation, all FINALIZED with explorer proof. The canonical three-case run is retained as history; the current deployment also has browser attestation 4 (NO_BREACH), 13 analog tests, Worker live, frontend reads live, and a mocked/labeled relay.

## What it must become during this hackathon (Sep 5–17)

A submission a stranger can verify in 10 minutes: green 3-case E2E + productized frontend (HCI P0-1..P0-7) + GEN fee panel + static claim packet + honest mock labels + video. Nothing else. See `CORE_NOW.md`, `IMPLEMENTATION-ORDER.md` Phases 0–3.

## What should be built immediately after (30 days, V1.5)

Interviews (willingness evidence) → real poller → SLO presets/versioning → real appeal → webhooks/claim API → reputation history. In that order, each gated on the prior. See `ROADMAP.md` P1.

## What should be built within 90 days (V2)

Merkle batch, VerdictRegistry read API + MCP/sidecar SDK, reputation query API, real relay ONLY on partner pull, procurement pilot ONLY on SLA kill trigger. See `ROADMAP.md` P2.

## What should be built within 12 months (V3/V4)

Multi-verifier platform, cross-chain reads, verified-service marketplace, x402 conditions — only if V2 retention + margin justify platform spend. See `PLATFORM_VISION.md`.

## What should never be built

Betting/parimutuel, stigmergy coordination, carbon/health as ProveDown features, product token/DAO, own escrow-or-insurance balance sheet, paywalled-source fetching (Gym-unresolvable). See `PLATFORM_VISION.md` REJECT + `feature-synthesis.md`.

## Why each decision was made

Thesis locked by live proof (200-but-breach) + track fit ("SLA enforcement via decentralized monitoring", portal FACT) + GenLayer load-bearing test (remove → biased dashboard; replace → single bribe target). Customer locked by pain×budget×self-serve. Buyer-initiated ordering by incentive logic. No-escrow by focus + flagship-collision avoidance. GEN-denominated economics by v0.6 measurement. Full chain in `PRODUCT-THESIS.md`, `DECISION-LOG.md` D-01..D-06.

## Previous concepts absorbed

Functional jury, bundle hash, breach-bool consensus, reputation, amber states, mock bridge, sanitize (CORE); automation trigger, SLO policy, poller, Merkle, appeal, recheck, claim helper (NEXT); settlement-real, cross-chain-real, procurement, security/code, delegation, x402, insurance, failover (LATER). Source pool: `feature-synthesis.md` + primitives list in prompt — all classified, none discarded silently.

## Previous concepts rejected (with reason)

Betting (regulatory), stigmergy (≠ attestation), carbon/health (separate theses, no primitive reuse), token (no necessity), per-request hot-path attestation (uneconomic + unnecessary latency), provider-signed-first (adversarial sales cycle), own escrow V1 (flagship collision + scope).

## What the moat becomes

History density (per-API attestation + hash archive) + workflow lock-in (SLO versions, webhooks, claim packets, reputation-gated routing) + eval tuning (tolerance, guards, hardening) + integration pull (escrows/billing reading our registry). Not first-mover, not UI, not slogan. See `COMPETITIVE-POSITION.md`.

## What the business becomes

Base subscription ($99/$499) + overage per attestation; enterprise audit tier; later reputation-API + integration fees. Margin from batching (100 probes → 1 attestation). 30 customers ≈ founder-sustainable; 100 growth-tier ≈ real company. No token. See `BUSINESS-MODEL.md`.

## What the company could become

If the loop compounds (verification → trust → volume → reputation → routing → demand): **the trusted verification layer for machine-to-machine agreements** — the adjudication call inside every agentic-commerce stack (x402 payments, ERC-8004 identity, A2Ainterop all FACT-shipped without dispute resolution per docs.genlayer.com). If it does not compound, the honest fallback is a sustainable SLO-proof tool + redeployable jury assets — decided by `PRODUCT-METRICS.md` kill/validate thresholds, not hope.

---

## Final quality test (answered honestly)

- One coherent problem? YES — silent functional breach with no neutral arbiter; every P0/P1 reinforces agreement→evidence→adjudication→attestation.
- Product or feature pile? PRODUCT — layers 1–5 shipped as a loop; 6–8 gated consumers, not bundled features.
- First customer obvious? YES — pipeline operator buying API capacity (named, budgeted, reachable).
- Willingness to pay plausible? PLAUSIBLE, UNPROVEN — $99 vs $5k-claim ROI + failover value; kill criterion (3/5 interviews) is the falsification test.
- GenLayer load-bearing? YES — neutrality, independent fetches, and protocol-level finality/appeal mechanics; ProveDown's application-level appeal, bond, and slashing remain deferred. Removal/replace tests PASS (`02-genlayer-necessity-tests.md`).
- Survives without hackathon? YES as V1.5 tool (poller + presets + webhooks serve real pipelines); hackathon accelerates trust proof, not existence.
- Real company? PATH EXISTS — 100 growth-tier customers on batched economics; platform only on retention evidence.
- Copyable MVP? YES — acknowledge; advantage converts to history + integrations (moat section).
- Stronger or bigger? STRONGER — roadmap deepens the same loop; breadth lives in VISION, gated.
