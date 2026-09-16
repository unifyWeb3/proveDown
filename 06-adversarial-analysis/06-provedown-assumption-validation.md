# 06 — ProveDown Assumption Validation (Final Gate Task 1)

> **Historical assumption audit.** Customer willingness, pricing, settlement, poller, and bridge statements below are hypotheses or kill criteria, not implemented or validated release claims.

**Date:** 2026-09-02
**Source thesis:** `startup/07-final-thesis/final-product.md`
**Method:** Identify 5 most critical assumptions; for each: evidence supports / missing / falsify / cheapest highest-signal test. No manufactured certainty.

---

## A1 — Buyer Will Pay for Neutral SLA Attestation ($99-499/mo + $0.10/breach)

**Why critical:** Without payer, no business even if tech works. Thesis says buyer suffers $50K damage vs $125 credit [S37], downtime $300k/hr [S36], composite 99.5% [S45] → attestation unlocks 40× credit, one $5k recovery covers 10 months.

**Evidence that supports:**
- Pain magnitude real: S36 (Uptrends 2B checks 99.66→99.46% = +60% downtime), S37 (Dataku 15 providers only Anthropic beats 99.9% → most breach 99.9%), S45 (215 services median 90min), S37 Explorium $50K pipeline story (800 leads empty enrichment → 47 skipped), J. Chang Law $9k/min large, 90% >$300k/hr.
- SLA illusory real: S36-37 credits 5-15% capped, exclusions 2-8hrs, threshold tricks (70/80 failed = 87% but SLA 100%), status pages lag tens mins [S45].
- Existing willingness proxy: Datadog $15/host, Uptrends $20/mo, PagerDuty $29/user — buyers already pay for *monitoring* alone; premium for *attested* vs ping is plausible if attestation wins disputes. Procurement recovery audit analogy: CFO pays 15-25% of found leakage [S30] → prevention can claim 10% → same logic for API: pay 10% of recovered credit.
- Agent scale intensifies: QPM≥200 burst, composite 99.5% [S37, S45] — failure is pipeline-wide not single ping.

**Evidence MISSING (gap):**
- **No direct interview:** 0 pipeline owners have been asked "would you pay $99/mo for neutral proof to turn $125→$5k credit?" All willingness is *inferred* from adjacent spend (Datadog) and recovery audit analogy, not stated preference.
- **Leverage asymmetry unproven:** Small buyer vs OpenAI/AWS has no leverage to demand credits even with perfect proof; credit contract may say provider's dashboard is source-of-truth, not third party. Even attested breach may be legally irrelevant if contract defines "available" as provider's metric.
- **Credit value variance:** $5k credit story is strong inference from Explorium 40× ($125→$5000) but not verified how often credits actually scale that way vs capped at 5-15% fee. If most buyers are small ($500/mo API) then 25% credit = $125, even 40× is not worth $99/mo subscription + attestation gas + integration.
- **Who in buyer org pays?** Buyer is "pipeline owner" — is that eng, finance, or procurement? Budget holder unclear. Eng may care about p95 not billing disputes; finance may not connect $50K lead-skipped damage to API breach causa.

**What falsifies:**
- ≤1 of 5 interviews says they'd pay (kill criteria §24 #1). Stronger falsify: Pipeline owners say "We trust Datadog enough; provider would never accept third-party proof; credits aren't worth fighting; we'd rather fallback to second provider than dispute" → willingness = 0.
- If average disputed credit for target segment (AI-native 10-20 person teams) is <$50 (not $5k), price $99/mo never ROI-positive.
- If contracts explicitly say provider's SLA dashboard is exclusive source-of-truth (check 5 real ToS) → attestation has no contractual standing.

**Cheapest highest-signal test (≤1 day, free):**
1. **5 interviews** (killer test already in §24): Script: "Show $50K story, ask: Would you pay $99/mo for neutral proof that turns $125 into $5k credit? If no, why? If yes, what would make you trust it more than Datadog? Would your provider accept it?" Record verbatim, score willingness 0-10.
2. **5 ToS reads** (free): Pull OpenAI, Anthropic, AWS Bedrock, B2B data API (Explorium-like) ToS SLA sections. Highlight clause "availability as measured by [provider]" vs "customer measurement". If ≥3 say exclusive provider measurement, note contractual standing gap → wedge must be *reputation/error-budget* not billing dispute.
3. **Landing page test** (free): One-page "Neutral SLA attestation → win credits" + email capture + "$99/mo" price anchor. Drive 50 visitors via HN / X agent community, measure 10% capture as proxy demand before building.

**Cost:** 1 day interviews + 2 hrs ToS reading. No code, no gas.

**Current verdict:** **Unproven but testable before code.** Do not build contract until interviews done.

---

## A2 — Measurement Feasibility: `web.render` Can Distinguish Breach Within SLO Tolerance

**Why critical:** If WebDriver overhead variance > SLO tolerance (±200ms at P95=2s), jury cannot reliably say BREACH vs NO_BREACH. Thesis hinge is `§24 Kill #2`.

**Evidence that supports:**
- Design assumed tolerant equivalence: validators agree on `breach+reason` not raw latency numbers [01-primitives]; ContentBounty stores hash not raw [S18]; V2 truncates 3k per source [S15] → variance already anticipated, not relied on exact ms.
- Workaround in plan: Jury judges *quality* (fill≥80% match≥85%) more than precise p50/p95; latency measured via off-chain poller not on-chain `web.render` timing, jury judges bundle [06-economic-models]. So precise p95 not needed for MVP.
- Similar: DisputeCourtV2 fetches evidence independently and still reaches consensus on verdict label despite bytes differ [S15] — shows tolerance pattern works for discrete verdicts.

**Evidence MISSING:**
- **Actual variance unmeasured:** No data on `gl.nondet.web.render(mode='text')` added latency (WebDriver container shm 2gb [S14] → may add 100-500ms). If added latency is 300ms ±200ms, distinguishing 500ms vs 2s is fine, but distinguishing 1.8s vs 2.0s (10% margin) is not.
- **Content variance unmeasured:** Does same URL return byte-identical text across 3 independent validators, or does it include timestamp, request ID, A/B price, nonce? Need hash stability test. If hashes diverge often, `INCONCLUSIVE/DIGEST_MISMATCH` retries [S18] may dominate.
- **Failure rate unmeasured:** Does `web.render` to status pages have high 4xx vs live probe 2xx? Anti-bot walls per Incident Playbook [S24] may block WebDriver (missing Access Control, Anti-bot Wall). If 2 of 3 probes fail often → `UNDETERMINED`.
- **Latency measurement inside nondet viable?** Docs say storage writes only after consensus [S07], but can we capture `time.time()` inside leader_fn and validate? Or must use external poller? Not tested.

**What falsifies:**
- Repeated experiment (Task 2): 10 repeated `request_attestation` on same stable endpoint → if p95 variance across validators > ±200ms *and* jury then disagree (UNDETERMINED rate >30%) → Measurement kill triggers (de-scope latency wedge, keep quality wedge per §24 #2).
- If `web.render` to typical status pages (status.openai.com, statusrow) returns >16k chars (over limit → INCONCLUSIVE) or fails due to anti-bot (403/429) >20% → evidence pipeline insufficient for SLA niche.

**Cheapest test (Task 2):**
- Run controlled experiment (see `05-provedown-technical-validation.md`): script with `genlayer up` localnet 5 validators (or GLSim if `up` too heavy) → contract that does 3× `web.render(mode='text')` to 3 public HTTPS endpoints (we control 2 probe endpoints we own, e.g., httpbin or our own Worker) → measure p50/p95/min/max/variance/failure/disagreement/total time/cost across 30 runs. Use `genvm-lint` + `gltest` pattern from boilerplate. If localnet not available, analog via `curl --trace-time` 30× plus mock `exec_prompt` with fixed verdict to isolate render variance.

**Cost:** Half day to set up localnet or analog. No paid API if using local Ollama or mocked LLM.

**Current verdict:** **Mitigable by design** (judge quality not precise ms; off-chain poller fallback), but must measure before promising latency SLA. Keep quality wedge regardless.

---

## A3 — Trust Differential: Existing Monitoring + SLA Contract Insufficient Because Both Sides Biased

**Why critical:** If buyers are happy with Datadog + provider SLA dashboard and providers accept Datadog as neutral enough, no problem exists. Thesis insight is "who is neutral adjudicator when $50K at stake?"

**Evidence that supports:**
- Provider self-report defines SLA to limit liability: exclusions 2-8hrs, thresholds, 400/429 excluded → buyer distrusts [S36-37, 04-competitive 01].
- Buyer tool bias: Uptrends hired by buyer → provider says "your dashboard wants credits" [final-product §7]. No stake/slash/VRF/random.
- Status pages lag tens mins [S45] → neither side's ping is accepted in real-time dispute.
- Agent scale quote: "nothing ships adjudication" for x402/ERC-8004/A2A [S04] → verification gap acknowledged by docs, not just our inference.

**Evidence MISSING:**
- **Provider acceptance of neutral third party unproven:** Even if neutral exists, will provider accept its proof as basis for credit? Need evidence: do providers have *dispute* process that considers third-party evidence, or strictly "our dashboard"? ToS reading from A1 test answers this.
- **Buyer perception of trust poison:** Do buyers *feel* distrusted when claiming credits? Interviews needed: "Have you ever disputed a credit and been told provider's dashboard is truth? Did you have third-party proof and was it rejected?" If answer is "we never dispute, we just fallback" → trust gap exists but not monetized via credits.
- **Direct competitor who is already neutral:** Is there already a neutral third-party monitoring *that both sides accept* (e.g., Catchpoint, ThousandEyes, Cloudflare Radar) that is *perceived* neutral because neither buyer nor provider hires them exclusively? If so, centralized neutral already solves 80% without GenLayer.

**What falsifies:**
- Providers say "We accept Catchpoint/ThousandEyes neutral reports" and have process for it (search provider support docs). If true, neutral monitoring service (centralized) already fills gap, and GenLayer's decentralized jury is nice-to-have but not economic (premium over Catchpoint not justified).
- Buyers say "We don't dispute credits; we just switch providers / add fallback; SLA credits are small vs switching cost" → monetization via credits weak; remaining value is error-budget/reputation only (still real but narrower).

**Cheapest test:**
1. **Provider support docs search (2 hrs, free):** Search "OpenAI SLA credit dispute third-party evidence", "AWS SLA credit evidence", "Cloudflare SLA dispute". If docs say "credits based solely on our service health dashboard", then neutral not accepted → our wedge must be *reputation/error-budget* not billing.
2. **Buyer interviews (same 5 as A1, add trust question):** "When you disputed CL or had $50K damage, did you try to use Datadog as proof? What did provider say?" If 3 say provider rejected Datadog as biased → trust differential validated.

**Current verdict:** **Strong inference but provider acceptance is the hole.** If providers don't accept any third-party proof, we must reframe wedge from "win credits" to "error-budget correctness + reputation-selected APIs + insurance" — still valuable but different revenue (subscription for correctness not credit multiplier).

---

## A4 — GenLayer Necessity Over Centralized Neutral Monitoring Service

**Why critical:** Even if trust gap exists, why does decentralized jury onchain beat centralized neutral like UptimeRobot-neutral, Catchpoint, or even a single AI API with attested probes? Thesis says GenLayer is load-bearing (§12). If replacement with `backend + AI API + neutral monitoring` gives 80% value at 20% cost, no startup on GenLayer.

**Evidence that supports:**
- SoK evaluator attacks: bribery, Sybil cluster, provider-evaluator collusion, front-running assignment [S33] + solutions VRF random, bond/slash, diversity, greybox opacity. Centralized neutral has single operator → single bribe target; provider could bribe Catchpoint (or Catchpoint incompetence). No stake/slash.
- ContentBounty pattern: appeal doubles validators, bond 5% [S18], evidence hashes for audit — centralized service has no appeal that *adds* validators, just support ticket.
- Independent fetches: leader + validators each fetch via `web.render` [S15] → not relying on one probe network (Uptrends 233 loc is still one vendor's network, still single IP pool provider could fast-path). GenLayer diversity (Heurist/Comput3/Chutes etc.) [S04] hard for provider to target.
- Settlement: Bridge to Base VerdictRegistry [S24] for automated billing claim — centralized neutral would need integration per provider; GenLayer's public attestation is composable.

**Evidence MISSING / Weak:**
- **Cost comparison unmeasured:** What does it *actually* cost to run GenLayer attestation (gas + LLM + WebDriver + bridge) vs centralized neutral ($20/mo Uptrends)? If GenLayer is 10× more expensive for same neutrality perceived by buyer, not justified.
- **Does buyer care about decentralization?** Buyer may think "UptimeRobot is neutral enough; I don't need blockchain." We haven't tested willingness to pay premium for *decentralized* vs *centralized neutral* specifically (A1 tests $99/mo for neutral, not $99 vs $20 for decentralized premium).
- **Is stake actually credible?** 42k GEN validator stake [S09] — what's $ value? If GEN price low, bribery cheap. No data on current GEN price / validator stake $ value vs disputed $5k credit. If bribery cheap, decentralization is theater.

**What falsifies:**
- Centralized neutral already has *reputation* that both sides accept (Catchpoint is hired by neither buyer nor provider, enterprise trusts it). If interviews show buyers say "Catchpoint neutral proof would be enough, provider would accept Catchpoint", then GenLayer premium is not load-bearing — we are over-engineering.
- If `estimate-fees` shows attestation gas >$1 (not $0.05) and appeal doubles → cost per attestation >$2 → centralized neutral at $0.001/probe is 100× cheaper → economics fail unless disputed value high (>$10k).
- If validator selection is not actually VRF random / not diverse in practice (all localnet validators use same OpenAI mock), then GenLayer is *simulated* decentralization, not real — trust math collapses until mainnet with diverse providers.

**Cheapest test:**
1. **Cost measurement (Task 2):** `genlayer estimate-fees --contract --method request_attestation` on localnet/Studio to get actual gas. Compare to Uptrends $20/mo pro-rata per-check.
2. **Interview premium question (add to A1):** "Would you pay $99/mo for decentralized jury proof vs $20/mo for Catchpoint neutral proof? What would decentralized need to prove to be worth 5×?"
3. **Stake value check (free):** Look up GEN price (if testnet) and validator stake 42k GEN → $ value. Compare to disputed $5k credit. If stake <$5k, bribery rational for large disputed amount → need scaled bond per §24 #5.

**Current verdict:** **Strongest technical moat but weakest *perceived* value.** Buyers may not value decentralization premium; need to price on *outcome* (credit win rate, reputation) not mechanism.

---

## A5 — Frequency/Magnitude: Failures Often Enough to Sustain Repeated Business

**Why critical:** If APIs were actually reliable 99.99% (only 4min/mo downtime), there would be no recurring revenue — one attestation per year not business. Thesis says +60% downtime, 86 outages/yr, 99.31% OpenAI [S36-37].

**Evidence that supports:**
- Frequency: 86 outages/yr avg [S45] → weekly; OpenAI 11 incidents Jan 2026 every 2.5 days [S37]; QPM≥200 burst [S37] means even sub-outage latency spikes are frequent.
- Magnitude: $300k/hr [S36], $50K pipeline story [S37], composite 99.5% for 5 services [S45] → need attestation often.
- Second-order: Agent calls 10-100× → more exposure, not less [S33].

**Evidence MISSING:**
- **Per-buyer frequency:** Dataku is aggregate across providers. For *one* buyer with *one* API (e.g., OpenAI), how often does *that* buyer hit breach? If buyer has 96% uptime still "good enough" and only hits breach quarterly, subscription $99/mo may be charged quarterly not monthly.
- **Data quality failure frequency (fill/match):** Thesis adds data-quality SLO (fill≥80%) but evidence for fill-rate failures is only Explorium anecdote (800 leads empty enrichment) — not statistically quantified like uptime. If fill failures are rare (say 1/mo), less repeat.

**What falsifies:**
- If per-buyer breach rate is <1/mo and each breach credit is $125, monthly subscription never ROI; need pay-per-breach not subscription → model shifts to $0.10 per attestation only, still viable but smaller LTV.
- If after 30d of off-chain poller (roadmap) we see brechas 0 for our 2 design partners → thesis frequency overestimated for their stack.

**Cheapest test:**
1. **Offer off-chain poller free for 7 days to design partners** (before on-chain): collect histograms, count breaches per SLO. If 0 breaches in week across 2 partners → frequency doubt.
2. **Ask in interviews: "How often do you hit API degradation that you would have wanted neutral proof last month?"** If answer "1-2×/week" → supports; if "maybe once a quarter" → need larger TAM or lower price.

**Current verdict:** **Likely true at aggregate but must validate per-buyer with poller data quickly (7-day free).**

---

## Summary Table

| Assumption | Status | Killer Falsifier | Test Cost |
|---|---|---|---|
| **A1 Payer willingness** | Unknown — inferred only | ≤1/5 pay | 1 day interviews |
| **A2 Measurement feasibility** | Mitigable but unmeasured | Variance >±200ms → UNDETERMINED >30% | 0.5 day experiment (05-technical) |
| **A3 Trust differential (existing insufficient)** | Strong inference but provider acceptance hole | Provider ToS says exclusive provider dashboard | 2 hrs ToS reads + interview trust question |
| **A4 GenLayer necessity vs centralized neutral** | Moat real but premium unproven | Buyer says Catchpoint enough + cost 10× | Cost measure + premium interview |
| **A5 Frequency/magnitude** | Aggregate true, per-buyer unknown | 0 breaches/week per partner | 7-day poller free |

**Decision before contract code:** Run A1+A3 interviews + ToS reads (Day 1) AND A2 experiment (Day 1-2) AND A4 cost + premium question. If ≥2 assumptions falsify → reopen selection (but not whole funnel — pivot to #3 procurement where frequency/payer clearer per 05-final-2).

**No manufactured certainty:** Current evidence is strong for A3/A5 aggregate, weak for A1/A2/A4 specific. Tests are cheap, high-signal, must happen before `contracts/provedown.py`.
