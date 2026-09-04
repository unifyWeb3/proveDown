# 05 — Final 2 (After Adversarial)

**From 06-adversarial-analysis/01:** #1 Agentic Commerce and #7 Fake Reviews cut (High / Medium-High kill: broad + foundation + merchant integration; fragmented payer). Survivors: **#3 Procurement/AP** and **#8 API SLA**.

Re-score after kill + necessity + security + economics to decide **1 thesis**.

| Criterion (weight) | #3 Procurement | Δ after adversarial | #8 API SLA | Δ after |
|---|---|---|---|---|
| Pain 1.5 | 9.5 | hold | 9.0 | hold |
| Frequency 1.2 | 9.5 | hold | 9.5 | hold (but spot/batched not per-minute; slight -0.2 → 9.3) |
| Financial 1.3 | 9.5 | hold | 9.0 | hold |
| Weakness 1.3 | 9.0 | hold | 8.5 | hold |
| Urgency 1.0 | 8.0 | hold | 8.0 | hold |
| AI relevance 1.4 | 9.0 | hold | 9.5 | hold |
| GenLayer 1.5 | 9.0 | hold (pass) | 9.5 | hold (pass) |
| Tech feasibility 1.0 | 7.5 → **6.5** | **-1.0** (authenticated bank data not fetchable via web.render; anti-bot walls per Incident Playbook) | 8.5 → **8.0** | **-0.5** (probe network needs off-chain before on-chain batch; provider IP detection) |
| Startup potential 1.2 | 9.5 → **8.5** | **-1.0** (enterprise sales cycle long even via channel) | 9.0 → **8.5** | **-0.5** (provider won't pay; buyer leverage varies by size) |
| Distribution 1.0 | 8.0 → **7.0** | **-1.0** (needs ERP partnership) | 8.0 → **7.5** | **-0.5** (needs agent platform partnership but lighter) |
| Defensibility 1.0 | 7.5 → **7.0** | **-0.5** (Xelix already has 481M invoices data) | 7.0 → **7.0** | hold (probe history is fresh, not incumbency heavy) |
| Expansion 1.0 | 9.0 | hold (CSDDD, carbon, RFP all reuse verification) | 9.0 | hold (SLA marketplace → reputation → insurance) |
| Hack feasibility 0.7 | 7.0 → **5.5** | **-1.5** (SAP heavy; PDF invoice + allowlist demo doable but real ERP gap) | 8.5 → **7.5** | **-1.0** (needs 3 probes + bridge; but AgentEscrow pattern reusable) |
| Evidence 1.0 | 9.5 | hold | 9.0 | hold |
| SatInv 1.0 | 8.5 | hold (white space) | 8.0 | hold |
| **New weighted** | **8.63 → 8.05** | **-0.58** | **8.58 → 8.17** | **-0.41** |

**Winner by weighted after adversarial: #8 API SLA (8.17) narrowly over #3 (8.05).**

But weighted difference is small (0.12) — need founder/investor judgment beyond math.

## Beyond Math: Why #8 Is Better Wedge Before Sep 3

1. **Hackathon demonstrability:** API SLA can be shown with 3 real public URLs (status page + 2 live probe endpoints returning JSON) + jury returning BREACH with latency histogram + evidence hashes, bridged proof to Base. No PHI, no ERP auth, no private tax registry. Procurement needs PDF invoice + PO + supplier URL + possibly authenticated tax lookup — demo is heavier and riskier (anti-bot wall may block validator fetch → UNDETERMINED demo fails live).

2. **Payer who can act fast:** Agent pipeline owner / inference marketplace can sign up self-serve ($99/mo). CFO needs procurement, IT, security, ERP admin — cycle months, not days. For Sep 3-17 hackathon and Sep 18 startup continuity, #8 gives *real users faster*.

3. **Second-order timing:** AI agents 10-100× API calls is happening *now* (Jan 2026 protocols, 165M x402 payments, OpenAI 11 incidents Jan 2026 every 2.5 days [S37]). Procurement leakage is evergreen but not accelerating with agent volume as directly.

4. **GenLayer narrative:** #8 maps 1:1 to docs gap "SLA enforcement on agent work" under Agentic-Commerce Adjudication (02-market-research/03). Internet Court does generic escrow; SLA enforcement is *underexplored* (only AgentEscrow touches it, not standalone sidecar). Procurement is also underexplored but less docs-aligned.

5. **Expansion still covers #3:** API SLA's probe + jury + reputation pattern generalizes: once we have attested SLA for APIs, same primitive verifies *supplier portal availability*, *invoice host reachability*, *review host authenticity* — horizontal expansion into procurement verification without needing ERP from day one.

## Counter-argument: Why #3 Still Strong

- Clearer payer willing to quantify leakage ($3.5M/B → model is ROI obvious vs $50K damage story which needs buyer to connect $300k/hr to single API call).
- Channel via accounting firms is real (recovery audits exist), not hypothetical.
- If we solve authenticated bank data scoping now, moat via supplier reputation graph is stronger than probe history (which Uptrends could replicate).

**Mitigation:** Keep #3 as **explicit post-hackathon roadmap #2** (90-day expansion after SLA wedge validates jury pattern). Thesis can note: "wedge is SLA, second vertical is procurement — same jury, different verifiers."

## Decision

**1 thesis = #8 API/LLM SLA Enforcement Illusion — Attested SLA sidecar**

- Name placeholder: **ProveDown** (or **AttestSLA**) — neutral SLA attestation for agent pipelines (working title, not final brand).
- #3 becomes `07-final-thesis/03-roadmap.md` Phase 2 (90d) expansion, with kill criteria if procurement authenticated data proves required (then pivot to Odoo-only niche or drop).

**Kill criteria for chosen thesis (to be detailed in final-product.md):**
- If buyer interviews (5 pipeline owners before Sep 10) say they would never pay for neutral attestation (they trust Datadog or provider credits are not worth fighting) → pivot to #3.
- If `web.render` cannot measure latency correctly (WebDriver adds variable overhead vs raw fetch) and variance exceeds tolerance → need alternative probe (direct `web.request` with timing? but then not via GenVM) → deprioritize latency wedge, focus on data-quality/enrichment where 15s latency matters less than fill rate.
- If bridge cost (GenLayer → Base) exceeds value of single credit dispute → make attestation off-chain with optional anchor, still useful but GenLayer less load-bearing → reassess economics.

**Lock before Sep 3:** Workflow, MVP boundary, architecture, demo strategy for #8. Research on #3 paused but notes preserved for 90d.
