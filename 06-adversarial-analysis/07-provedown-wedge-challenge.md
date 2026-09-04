# 07 — Wedge Challenge: Is SLA Attestation Strong Enough? (Task 3)

**Date:** 2026-09-02
**Goal:** Don't weaken thesis to preserve wording. Test if wedge is strong enough on its own, or merely first wedge into broader verification infrastructure.

---

## Q1 — Why would an API buyer pay for independent SLA attestation?

**Evidence for:**
- Pain $300k/hr [S36], $50K story [S37] real but *perceived* as engineering cost not finance billing; buyer who suffers lead-skipped $50K would pay $99/mo to prevent recurrence (like paying Datadog $15/host to see outage). But credit recovery ($125→$5k) is weaker monetization: many buyers don't bother claiming credits (status pages lag, but they just fallback).
- Analog that buyers pay for *prevention* not recovery: Procurement recovery audit 15-25% fee [S30] → prevention 10% works because leak is measurable and recouped quickly. For API, equivalent is *error-budget burn* (SLO 99.95% = 22min/mo) — buyer pays to know *truth* for internal attribution (which service caused pipeline to miss SLA, so they can blame correctly and prioritize fallback), not just billing.
- Missing: No interview yet (A1). Could be that buyer says "We'd rather pay for second provider fallback than dispute first."

**Honest answer:** Buyer pays **if** attestation is framed as **error-budget correctness + reputation-selected APIs**, not just billing dispute. Credit win is bonus, not core. The error-budget story is stronger: agent pipeline has SLO (p95≤2s) as internal error budget (like SRE); when breached, need neutral truth to decide *whether to failover, degrade, or retry* — not argue with provider. That's *operational* value, paid like PagerDuty ($29/user) for on-call correctness, not finance recovery.

**Test (from 06):** 5 interviews must ask both framings — "pay to win credits?" vs "pay to know *which* API breached your composite pipeline so you failover correctly?" If second scores higher, reword wedge from "SLA attestation for billing" to "SLA attestation for error-budget + failover" — same tech, different buyer present (eng vs finance).

---

## Q2 — Why would an agent marketplace integrate it?

**Evidence for:**
- Marketplaces (Autonome, AgentRouter, OpenDeal patterns in `03-hackathon-intelligence/02`) already integrate x402, ENS, reputation. SLA enforcement is natural plugin: marketplace takes % of inference, provider reliability directly impacts their take rate.
- For marketplace, integration is MCP tool `attest_sla` — low cost, marketplace gets trust brag: "our marketplace verifies SLA" vs competing marketplace that doesn't.

**Evidence against / missing:**
- Marketplace may prefer to *own* reputation vs integrate third party (they'd build internal). Why give us fee? Need to answer: our reputation graph is **public GenLayer attestations** composable across marketplaces (like AgentTrust soul-bound NFT shared), not siloed per marketplace. Marketplace that builds internal loses cross-marketplace composability.
- No design partner yet. Need to find one marketplace willing to test MCP.

**Cheapest test:** Pitch 2 marketplaces (ETHGlobal alumni EQLTY/AgentVault contacts, or x402 forum) with one-pager "Add `attest_sla` MCP, get neutral SLA proof for your users, pay per attestation $0.10". Measure response: "nice-to-have vs must-have."

**Current verdict:** Plausible but not proven; channel is emerging, not mature. Better near-term is direct buyer (first 10) not marketplace integration; marketplace is 90d channel.

---

## Q3 — Why isn't existing SLA contract + provider monitoring sufficient?

**Evidence:** S36-37 provider defines SLA to limit liability (exclusions, thresholds), credits 5-15% capped, status pages lag tens mins [S45]. SLA contract as written says provider's dashboard is truth — so by definition provider monitoring *is* sufficient *per contract*, but contract is adversarial to buyer. Provider has incentive to define "available" as 100 req threshold trick.

**Honest answer:** **It *is* sufficient if buyer accepts provider's definition and doesn't dispute.** Many buyers do — they just accept 99.9% and don't fight. The wedge only matters for buyers who *do* dispute or have internal SLO stricter than provider SLA (e.g., agent needs <2s but provider promises <5s → breach for buyer is not breach for provider). So market is **buyers with stricter SLO than provider SLA** + those who want neutral error-budget.

**Check:** ToS reads in A3: if 3 of 5 provider SLAs say exclusive provider measurement, then our proof is contractually irrelevant for billing — must reframe to internal SLO, not provider SLA. That's wedge challenge: wording "SLA attestation" may be misleading if it's actually "SLO attestation".

**Action:** Rename wedge internally to **SLO attestation** (buyer-defined) not SLA (provider-defined). Same tech.

---

## Q4 — Why aren't Datadog, Better Uptime, Cloudflare, Statuspage, observability sufficient?

**Direct comparison:**

| Tool | What it does | Why it fails for neutral adjudication | Why it *does* suffice for 80% |
|---|---|---|---|
| Datadog (APM) | Buyer-hired, deep traces, alerting | Bias: hired by buyer, provider says "you want credits" + no stake/slash + no bridge proof | For internal debugging, Datadog *is* sufficient — 80% of buyers just need to see outage, not prove to provider |
| Better Uptime / UptimeRobot / Statuspage | Buyer-hired ping, status page | Same bias + ping only (200/500) not functional quality (fill/match) | For simple uptime, 80% suffices |
| Cloudflare Radar | Neutral third party (Cloudflare is neither buyer nor provider for many) | Closer to neutral, but centralized (Cloudflare is operator) + no LLM judging functional quality + no bond/slash + no appeal double | For network-level uptime, may be seen as neutral enough |
| ThousandEyes / Catchpoint | Explicitly marketed as neutral (hired by no one in transaction) | Best centralized neutral — many enterprises trust Catchpoint | **This is the hardest competitor.** If buyer says Catchpoint neutral proof would be accepted, centralized neutral already solves trust without blockchain. |

**Honest answer:** **For 80% of buyers, Datadog/Better Uptime *are* sufficient for internal use.** ProveDown's 20% where they're not is: **high-stakes billing/insurance/composite pipeline attribution where both sides need to *agree* on breach and buyer needs proof that provider can't dismiss as buyer-hired.** That's narrower than "every API". It's "every pipeline where failure cost >$5k and dispute needs settlement."

**So wedge is not "replace Datadog" — it's "attested proof on top of Datadog for high-stakes transactions"** — sidecar not replacement. Pricing must reflect that: $20/mo for monitoring (they keep Datadog) + $0.10 per attested high-stakes check.

**Cheapest test:** Interview question add: "Do you use Datadog/Better Uptime? When you showed provider its data, what happened? Would Cloudflare Radar neutral be enough vs our decentralized jury?"

---

## Q5 — Why isn't a neutral third-party monitoring service enough?

Same as Q4 but centralized neutral variant.

**Evidence for centralized neutral sufficiency:**
- Catchpoint/ThousandEyes have global nodes (like Uptrends 233), are not hired by buyer in transaction, are enterprise-trusted. For *objective* ping, they are neutral enough.
- Cheaper: $20/mo vs $0.05 GenLayer gas + LLM.

**Why GenLayer still adds:**

1. **Subjectivity:** Catchpoint judges 200/500, not "does 82% fill count as breach for this agent's SLO?" Needs LLM. Could Catchpoint add LLM? Yes, but then same single-operator LLM bias vs diverse jury.
2. **Economic security:** Catchpoint is single operator → bribe Catchpoint vs bribe 3 of 5 staked validators [S33, S09]. No slash, no appeal double.
3. **Composability:** Catchpoint report is per-vendor silo (PDF). GenLayer attestations are public `TreeMap` + bridge proof to Base — composable across marketplaces (like AgentTrust). Future reputation marketplace needs shared graph.

**But if buyer says "Catchpoint is enough and provider would accept Catchpoint", then GenLayer premium is not justified** — we are over-engineering.

**Cheapest test:** Search provider support docs (A3) + ask buyers premium question (A4) — already in assumption tests.

**Current verdict:** Centralized neutral solves **objective uptime** 80%, but not **subjective functional quality + economic security + composable reputation**. Wedge must emphasize quality (fill/match) not just uptime — that's where LLM jury is distinct.

---

## Q6 — Why does on-chain/GenLayer-backed adjudication materially change outcome?

**Material change:** 
- **Settlement:** Attestation anchored on GenLayer can be bridged to Base VerdictRegistry for *automated* billing claim (AgentEscrow BridgeSender→Relay→Base pattern [S24]) — provider's contract can verify proof and auto-credit. Datadog screenshot cannot be verified on-chain; manual support ticket.
- **Appeal:** Provider can dispute by posting bond and doubling validators — on-chain, not support-ticket tennis. Evidence bundle hashes audited.
- **Reputation:** Public attestations form shared reputation graph not vendor silo.

**If buyer and provider don't have on-chain billing contract**, on-chain changes *nothing* vs centralized neutral + PDF. So wedge needs buyer/provider to have **on-chain settlement** or **error-budget that benefits from public reputation**.

**Honest:** For pure Web2 buyer with stripe billing, on-chain proof is overkill — centralized neutral with attested PDF signed by neutral org (like Catchpoint report) may change outcome similarly. On-chain matters when settlement is on-chain (Base) or when reputation needs composability.

**Check:** How many target buyers have on-chain billing? Agent marketplaces with x402 do (165M payments already on-chain). For those, on-chain changes outcome materially (auto-credit via VerdictRegistry). For pure Web2 B2B data API buyers (Explorium story), on-chain is nice but not material — they could use centralized neutral. So wedge is stronger for **on-chain native agent pipelines** (where settlement is Base) than pure Web2.

**Action:** Position wedge initially for **agent marketplaces + x402 pipelines** where bridge to Base is live settlement, not just audit. For Web2 pure, pitch reputation/error-budget not billing auto-credit.

---

## Q7 — Is product really "SLA attestation" company or first wedge into broader verification/settlement?

**Evidence from funnel:** 05-final-2 shows SLA (8.17) narrowly beats procurement (8.05) on hack feasibility, but procurement has clearer payer + measurable leakage $3.5M/B [S30] and recovery audit channel. SLA's payer leverage is weaker (provider won't accept), frequency per-buyer uncertain (A5).

**Honest:** **SLA attestation is wedge, not company.** Company is **verification infrastructure** for machine-to-machine commerce (final-product §22). SLA is best wedge because most hack-feasible, most second-order, most neutral gap, but not necessarily largest TAM or most defensible long-term vs procurement.

**If wedge proves weak (interviews say pay for procurement not SLA), pivot is not failure — it's *expansion order* swap.** Infrastructure (jury with web.render + exec_prompt + run_nondet_unsafe + evidence hashes + bridge) is identical; only verifier prompts differ (SLA judge vs invoice judge). This is intentional: we built funnel to keep procurement as 90d expansion precisely for this.

**Current verdict: Preserve wording "SLA attestation" for hackathon wedge, but thesis already states "verification infrastructure" as company (final-product §22, §21 roadmap procurement 90d). No reword needed unless tests falsify.**

---

## Summary: Wedge Strength

| Question | Answer | Risk if unaddressed |
|---|---|---|
| Q1 Buyer pay | Pay for error-budget + failover, not just credits — reframe SLO not SLA, interview test | A1 |
| Q2 Marketplace integrate | Plausible but 90d channel, not wedge — direct buyer first | Medium |
| Q3 Contract sufficient | Yes if buyer accepts provider definition — wedge is buyers with stricter SLO (agent needs <2s vs provider 5s) | Rename SLO attestation |
| Q4 Datadog sufficient | 80% sufficient for debugging; wedge is high-stakes settlement not monitoring — sidecar not replacement | Positioning risk |
| Q5 Neutral centralized sufficient | For objective ping yes; for quality + slash + composable reputation no — wedge must emphasize quality | A4 premium question |
| Q6 On-chain material | Material when settlement on-chain (x402/Base) or public reputation needed; overkill for pure Web2 | Target on-chain native first |
| Q7 Company vs wedge | Wedge, not company — correct, procurement 90d expansion preserved | Not kill, but keep pivot option |

**Overall:** Wedge is **strong enough if reframed** (SLO not SLA, error-budget/failover not billing, on-chain native first, sidecar not replacement, quality not just uptime). Without reframing, risk of "nice dashboard, why pay?" is high. With reframing, tests in A1/A3/A4 will validate.

**Action for implementation-readiness:** Update MVP scope to reflect these learnings (bundle poller, tolerance, SLO wording, target on-chain pipeline buyers first).
