# 01 — Scoring Framework

**Scale:** 0-10 per criterion. Weighted ranking moves candidates; hackathon feasibility deliberately **not** dominant (0.7×) per 00-mission.

## Criteria (15, per §17)

| # | Criterion | Weight | What 10 means |
|---|---|---|---|
| 1 | **Pain** | 1.5× | Universal, severe, emotional + financial, daily |
| 2 | **Frequency** | 1.2× | Daily/hourly repeated transaction, not one-off |
| 3 | **Financial impact** | 1.3× | Billions at stake, direct P&L or $300k/hr |
| 4 | **Current solution weakness** | 1.3× | Human/spreadsheet/lawyer/14-day window/53-day lag, brittle |
| 5 | **Urgency** | 1.0× | Regulatory deadline, AI flood happening now |
| 6 | **AI-agent relevance** | 1.4× | Problem gets *more* important as agents scale (second-order) |
| 7 | **GenLayer relevance** | 1.5× | Needs subjective adjudication + external info + trust simultaneously |
| 8 | **Technical feasibility** | 1.0× | Buildable with web.render + exec_prompt + run_nondet_unsafe + emit_transfer; within GenVM limits (16k chars, 3k per source, no secrets) |
| 9 | **Startup potential** | 1.2× | Real payer, repeat transaction, expansion room |
| 10 | **Distribution** | 1.0× | Credible first-10 acquisition (not "post on X") |
| 11 | **Defensibility** | 1.0× | Moat beyond first-mover/UX (data, network effects, reputation graph, workflow lock-in) |
| 12 | **Expansion potential** | 1.0× | Wedge to bigger infrastructure |
| 13 | **Hackathon feasibility** | 0.7× | MVP demonstrable Sep 3-17 on Bradbury without heavy external licenses |
| 14 | **Evidence quality** | 1.0× | Multiple verified facts vs weak signal |
| 15 | **Competitive saturation** | 1.0× | Inverse: 10 = least saturated (white space) — high score is good |

**Weighted score** = Σ(criterion × weight) / Σ(weights) normalized to 0-10 (weights sum = 16.6).

## How Applied
- Initial scoring based on desk evidence (02-market-research/01).
- Re-scored after adversarial (06-adversarial-analysis) — economics/security findings can downgrade feasibility/genlayer relevance.
- Funnel: 12 → 8 (cut lowest weighted), 8 → 4 (finalists), 4 → 2 (adversarially tested), 2 → 1 (thesis).

## Guardrails
- Do not anchor on seeded concepts; score identically.
- Do not treat prior local projects as saturation proof; saturation scored from 03-hackathon-intelligence external research only.
- If hackathon feasibility is sole reason for low score but pain/genlayer very high, keep in funnel — implementation can simplify MVP.
