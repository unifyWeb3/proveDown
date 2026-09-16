# ProveDown Thesis Check — Strong Framing

> **Historical thesis stress test.** Business numbers, settlement language, bridge plans, and appeal/bond assumptions below are research context, not current product evidence. Use `PRODUCT-THESIS.md`, `EVIDENCE.md`, and `CLAIM-PACKET.md` for current claims.

**Date:** 2026-09-03
**Test:** Is stronger framing “verification/attestation layer for agreements between autonomous systems, beginning with API/service SLAs as wedge” correct vs “uptime monitoring” or “SLA dashboard”? Challenge it.

---

## Restated Strong Framing

**ProveDown is verification/attestation layer for agreements between autonomous systems, beginning with functional SLOs for API/service bundles as initial wedge.**

Not monitoring (Pingoru polls status page, Updog aggregates APM), not dashboard (Datadog shows p95), but **neutral jury that turns a synthesized quality bundle into a settlement-grade verdict with evidence hash, confidence, and reputation, bridged for downstream action**.

## Challenge

| Question | Strong framing answer | Weak framing (“uptime monitoring”) answer | Which is true per evidence? |
|---|---|---|---|
| **Actual customer** | Pipeline owner (agent pipeline, enrichment 800 leads → 47 skipped → $50K [S37]) who suffers $300k/hr [S36] and whose agent makes bad decisions on empty fill, not just human viewing dashboard | Anyone who wants uptime ping 99.9% (mass market, $15 Pingoru covers) | **Strong** — customer suffers pipeline bad decisions, not just dashboard viewing |
| **What they pay for** | **Error-budget correctness + failover correctness + stingy credit recovery** — pay $99/mo sidecar on top of Datadog + $0.10/breach amortized $0.001/probe batched (90d) to know *which* API breached composite pipeline (99.5% for 5×99.9% [S45]) and to have neutral proof provider cannot dismiss as buyer-hired | Pay $15 to see status page 5 min polling (Pingoru) | **Strong** — they already pay Datadog $15; new payment is for neutral proof + quality (fill/match) where ping says 200 but fill 72% still breach |
| **Exact failure solved** | **Functional quality breach**: p95 >2000+500 OR error≥1% OR fill<80% OR match<85% — e.g., `breach` preset p95 4800 fill 0.72, not 200 vs 500. Ping 200 but enrichment empty still breach for agent that needs fill. | Simple uptime 200 vs 500 | **Strong** — Gym proves GenLayer good at direct fetch + LLM judge, not at threshold trick ping; technical validation shows latency variance 1-2.7s range would flip pure p95 verdict, so quality not pure p95. |
| **Evidence generated** | Bundle `{"p50":1561,"p95":4800,"error":0.02,"fill":0.72, ...}` 116 chars stable 1/8 hash `9566a8b5` + sanitized `clean[:3000]` + `sha256` + `evidence_summary p95=4800` + `timestamp` from `gl.message_raw["datetime"]` | Status page start/end components | **Strong** — evidence is quality histogram not status page incident |
| **What GenLayer decides** | `breach` bool (LATENCY|ERROR_QUALITY) with confidence 0-1000 via `gl.nondet.exec_prompt(judge_prompt, json)` + `run_nondet_unsafe` consensus on breach only (reason ignored per technical validation reason drift) — not `strict_eq` whole JSON | Validators agree 200/500? No LLM needed | **Strong** — Gym prompt horizontal today, our vertical SLO prompt is genuine LLM judge with tolerance, not deterministic threshold |
| **Downstream action** | `store Attestation {breach, evidence_hash, p50/p95, reputation score Bayesian}` + `BridgeProof hash` → Relay→Base VerdictRegistry (AgentEscrow pattern, mocked) → auto-router picks best provider by reputation, or insurance, or failover — not just ticket to support | Manual support ticket with screenshot | **Strong** — downstream is programmable trust (reputation, auto-credit, router) not human ticket |
| **Useful before fully autonomous** | Yes — current enrichment pipeline (human-triggered but agent-scored 800 leads) already suffers $50K from empty fill; `agent hires other agents` second-order not needed; QPM≥200 burst already | Only when agents fully autonomous | **Strong** — why now is Jan 2026 ACP + x402 165M payments already, not future |
| **More valuable as agentic commerce grows** | Composite 99.5% multiplies as 10-100× calls, x402 per-call SLA on Arc (ArcSLA live 9 providers) + `Optional DisputeModule for subjective` gap — ProveDown becomes that module | Linear with uptime need | **Strong** — growth is multiplicative not linear |

## If strong framing wrong, correct it

**Potential correction:** If customer actually pays only for *detection* (Updog 32 min before AWS), not attestation, then strong framing overclaims settlement. Check: Pingoru already solves detection 5 min at $15; Updog solves before status page at $0. For detection-only, ProveDown's jury is overkill — centralized neutral Pingoru $15 wins.

**Test against 06-wedge-challenge Q1-Q6:** Q1 says buyer pays for error-budget correctness + failover not credit; Q3 says provider SLA exclusive measurement means billing wedge contractually irrelevant → reframe SLO not SLA; Q4 says 80% Datadog sufficient, wedge is high-stakes settlement; Q5 says Catchpoint neutral solves objective ping, our wedge must emphasize quality; Q6 says on-chain material when settlement on-chain (x402/Arc) — for pure Web2 stripe billing, on-chain overkill.

**Corrected nuance:** Strong framing is **correct but must be narrowed**: not general agreements between autonomous systems yet, but **functional SLO quality verification for agent pipelines where buyer and provider disagree and evidence is a synthesized quality bundle, first for on-chain native (x402/Arc) where bridge to Base is live settlement**. For pure Web2 with stripe billing, value is reputation/error-budget not auto-credit — still verification/attestation but settlement is off-chain.

**Therefore final thesis wording:**

> ProveDown is **neutral functional attestation for service quality agreements, beginning with API enrichment SLOs (quality bundle) as wedge**, verifiable on GenLayer and bridged for programmable trust (reputation/router), useful now for $50K pipeline enrichment failures and increasingly valuable as agentic commerce multiplies API calls and needs quality not just uptime.

This is **not** "uptime monitoring" (Pingoru), not "SLA dashboard" (Datadog), but **verification/attestation with evidence hash**. Strong framing stands after narrowing to quality bundle + on-chain native first + sidecar not replacement.

**Wrong framings to avoid:** Calling it uptime monitoring would invite comparison to Pingoru $15 / Updog free where we lose on price and coverage (we are 116-char synthetic not 6k status pages). Calling it generic verification for all autonomous agreements would be kitchen-sink (procurement, code, carbon) — correctly deferred per feature synthesis.
