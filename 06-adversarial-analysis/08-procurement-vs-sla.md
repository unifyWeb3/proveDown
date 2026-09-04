# 08 — Procurement vs SLA: Same Evidence Standard (Task 4)

**Date:** 2026-09-02
**Goal:** Compare primary expansion fallback Procurement (#3) vs current winner SLA (#8) on same standard, decide pivot only if SLA materially weaker.

---

## Head-to-Head on 7 Dimensions

| Dimension | SLA #8 (current) | Procurement #3 (fallback) | Winner for wedge before Sep 3 |
|---|---|---|---|
| **Payer clarity** | Buyer pipeline owner suffers $50K vs $125 credit [S37]; pays to stop pipeline bad decisions + win credits. But provider may not accept proof → billing monetization weak, must reframe to error-budget. | CFO pays to stop 0.35% leakage = $3.5M/B [S30], 5% revenue lost [S29], recovery audit already pays 15-25% fee → prevention 10% is clear ROI $1M saved vs $5k cost. Payer is CFO + accounting firm channel. | **Procurement** — clearer, quantified leakage, existing fee model, CFO budget holder obvious. |
| **Frequency** | On-demand spot + hourly bundles, QPM≥200 burst [S37], 86 outages/yr. But per-buyer breach maybe quarterly if SLO loose (A5). | Daily per-invoice, 14% exception rate [S30], 481M invoices analyzed [S30], 13 attempts/yr 44% hit [S30] → daily repeated. | **Procurement** — higher frequency, more subscription revenue. |
| **Why now** | Agent protocols Jan 2026 + x402 165M payments + reliability down 60% [S36] while dependence up → second-order peak now. | Evergreen but accelerating with agents 10× volume; CSDDD procurement 2025 action plan requires mapping, but not as time-locked as Jan 2026 agent protocols. | **SLA** — timing stronger (Jan 2026 protocols, holiday pilots). |
| **Technical feasibility (hack)** | High (8.5→7.5 after kill) — 3 public HTTPS probes we control, stable JSON like httpbin/json hash-stable 1/8, not dynamic /get 5/5 variance — bundle poller solves variance. No auth needed. | Medium (7.5→6.5) — supplier data often authenticated (tax registry, bank change) not fetchable via web.render (no secrets). Need allowlist hosts; anti-bot walls higher for supplier portals (Inc. Playbook). | **SLA** — more hack-feasible before Sep 17. |
| **GenLayer necessity** | Independent probes + diverse LLMs + slash vs single AI API bias + provider fast-path; bridge to Base for auto-credit; reputation marketplace. Strong. | Independent supplier attestation + diverse LLMs vs centralized AP tool (Xelix) bribery; appeal doubling vs central operator; supplier reputation graph shared not vendor silo. Also strong. Tie. | **Tie** — both need neutral jury where $10k+ disputed, but SLA's trust gap (provider vs buyer) more acute per S36-37 illusory SLA; procurement's Xelix also has 481M data but still single vendor. |
| **Distribution first 10** | Emerging: inference marketplaces + agent orchestration via MCP (need BD, no existing channel). | Channel exists: accounting firms already do recovery audits (15-25% fee) → can sell through them; AP automation marketplaces (Medius, Xelix partners). | **Procurement** — channel more mature, but enterprise sales cycle longer (CFO needs procurement/IT/security). SLA direct buyer self-serve faster. |
| **Competitive saturation** | White space: only AgentEscrow has SLA monitoring per-escrow, no standalone sidecar; not saturated vs 9 escrow clones. | White space for AP *verification* (OpenDeal is procurement *escrow* not AP invoice verification at scale) — also white space, but Xelix/Medius incumbents have 481M invoices data + ERP integrations (stronger incumbency than Uptrends). | **SLA** slightly less incumbency data moat (Uptrends 233 loc but not 481M invoices). |

**Score:** SLA wins 3 (why now, hack feasibility, slight incumbency), Procurement wins 3 (payer, frequency, distribution channel), 1 tie. Close.

---

## Pivot Condition: When would we pivot to procurement wedge?

Pivot only if **A1 and A3 falsify** for SLA:

- **Pivot trigger #1:** 5 interviews (A1) → pipeline owners say "we wouldn't pay for SLA attestation" (≤1/5 pay) BUT CFO interviews (run 3 procurement buyer interviews as check) → 2-3 say "we would pay $0.10/invoice to stop duplicate/supplier fake" → then procurement is materially stronger payer.
- **Pivot trigger #2:** Provider ToS reads (A3) → 4/5 say exclusive provider measurement → SLA billing wedge contractually irrelevant, must reframe to error-budget; but procurement's leakage is not contractually limited (it's internal P&L, not SLA contract) → procurement monetization more robust.
- **Pivot trigger #3:** Technical re-measure with bundle poller still shows SLA jury `UNDETERMINED` >30% near threshold → latency wedge unreliable, but procurement's invoice judge is discrete (duplicate vs not) not threshold — more stable verdict.

**Do NOT pivot automatically** on Payer alone — SLA's Why Now + Hack feasibility are genuine advantages for Sep 3 deadline.

**Current evidence (without new interviews):** SLA's why now + hack feasibility edge is real and time-locked to Sep 3; procurement's payer edge is real but needs ERP auth work that cannot be proven in hackathon. So **preserve SLA** as wedge for hackathon, keep procurement as 90d expansion (final-product §21) — this is already the thesis's explicit fallback (05-final-2, final-product §24 #1). No new pivot needed unless A1 fails.

---

## Alternative truth: Could we do *both* wedges with same contract?

No — need to narrow vertical slice (implementation-readiness). Doing both would be "multi-chain system" speculative infrastructure forbidden by task 8. Choose one. Our choice remains SLA with procurement code reuse later (same jury pattern, different prompts).

---

## Evidence Preservation

- This file + 07 wedge challenge + 06 assumptions + 05 technical together preserve full comparison.
- Next competitor scan (Task 5) will re-check both niches: API SLA attestation + procurement invoice attestation competitors (conventional Web2 not just crypto).

**Decision: NO PIVOT *before* interviews.** Validated wedge is SLA with reframing (SLO, error-budget, on-chain native first, sidecar). Procurement stays as documented fallback with same evidence standard, ready to swap if A1/A3 falsify within 7 days.
