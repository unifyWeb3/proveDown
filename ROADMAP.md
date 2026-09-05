# ROADMAP.md — Explicit Build Order with Priorities (2026-09-05)

Priorities: P0 = hackathon-blocking. P1 = first-real-users blocking. P2 = commercial. P3 = vision. Ranked by business/product leverage, not coolness.

## Hackathon Sep 3–17 (P0)

| # | Feature | Problem | User | Dependency | Complexity | Value | Why now | GenLayer? |
|---|---|---|---|---|---|---|---|---|
| P0-1 | 3-case E2E kept green (re-run on reset) | Demo dies if studio-dev resets | Judge | faucet + scripts | Low | Existential | Submission | Yes |
| P0-2 | Frontend P0-1..P0-7 (HCI agent) | Verdict unreadable / trust unclear | Judge, first user | design.md | Med | Existential | Submission | Reads only |
| P0-3 | Fee panel (deposit/consumed/refund) | "What does it cost?" unanswered | Judge, buyer | receipt data (have) | Low | High | Credibility | Yes |
| P0-4 | Claim packet (static copy block) | BREACH with no next action | Buyer | attestation JSON | Low | High | Shows Layer-7 path free | No |
| P0-5 | Submission packaging + video | Unverifiable = unevaluated | Judge | EVIDENCE.md | Low | Existential | Sep 17 | Proof links |

Will NOT build: §CORE_NOW exclusion list (poller, Merkle, escrow, relay, ENS, VRF, guards, procurement, token, 2nd SLO type).

## 30 days (V1.5 — first real users, P1)

| # | Feature | Problem | User | Dependency | Complexity | Value |
|---|---|---|---|---|---|---|
| P1-1 | 5 pipeline-owner interviews + 2 design partners | Unknown willingness to pay (kill criterion) | Founder | demo | Low | Existential |
| P1-2 | Real poller v1 (5-min probes → hourly bundle JSON) | Synthesized evidence not credible outside demo | Buyer | Worker + cheap infra | Med | High |
| P1-3 | SLO presets + tolerance field + versioning | Raw JSON blocks non-expert adoption | Buyer | contract update + redeploy | Med | High |
| P1-4 | Real appeal path (`appealTransaction`) | Disputes have no trust-closing mechanism | Provider | GenLayer surface | Med | High |
| P1-5 | Webhooks + claim-packet API | Verdict trapped in UI | Buyer eng | backend | Low-Med | High |
| P1-6 | Reputation history + trend (≥10 samples) | Score without history is trivia | Buyer | volume | Low | Med |

## 90 days (V2 — commercial, P2)

P2-1 Merkle batch (100 probes → one rootHash attestation, amortized <$0.001/probe). P2-2 VerdictRegistry read API + MCP tool + sidecar SDK (first integrations). P2-3 Reputation query API + selection helper. P2-4 Procurement pilot ONLY if SLA kill criteria trigger (same jury, invoice verifier; scoped to public-signal invoices, no bank auth). P2-5 Real Hyperlane relay ONLY on partner-escrow pull.

## 180 days (P2 cont.)

Randomized recheck (`next_check_at`), 12-mo audit retention, downtime-insurance design with capital partner, SLO policy standard draft with 2 integrators.

## 365 days (V3/V4 — infrastructure, P3)

Multi-verifier platform (SLA + procurement + code review judges on one jury infra), cross-chain attestation reads, verified-service marketplace with reputation-priced routing, x402 payment-condition integration. Only if V2 revenue + retention justify platform spend.

## Primitive dispositions (prior pool absorbed or rejected)

CORE kept: functional jury, bundle hash, breach-bool consensus, attestation+reputation, INCONCLUSIVE/NO_CONSENSUS, mock bridge, sanitize. NEXT (P1/P2): automation trigger, SLO policy, poller, Merkle, reputation API, dispute appeal, temporal recheck, claim helper. LATER (P3): settlement real, cross-chain real, procurement, security/code, delegation, x402, insurance, failover. REJECT: betting, stigmergy, carbon, health.
