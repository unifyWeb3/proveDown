# Final Product Thesis — ProveDown: Attested SLA Enforcement for Agent Pipelines

**Thesis before Sep 3, 2026. Build Mode after.**
**Author:** GenLayer Startup Discovery (solo research, human decision-maker)
**Date:** 2026-09-02 (compressed sprint)
**Workspace:** `/home/unify/startup` — full evidence in `01-06` + `SOURCES.md`

---

## 1. Executive Summary

**ProveDown** is a neutral, economically-secured SLA attestation sidecar for AI agent pipelines that depend on third-party APIs.

**Problem:** APIs that power agent pipelines are less reliable than promised. Average uptime fell 99.66%→99.46% (+60% downtime) [S36]; OpenAI 99.31% (30h/6mo) [S37]; provider SLAs are illusory (5-15% monthly fee credit, exclusions 2-8 hrs, threshold tricks where 70/80 failed = 87% error but SLA 100% [S36-37]); status pages lag tens of minutes [S45]. When your agent pipeline at QPM≥200 [S37] hits a 15-second latency spike, it doesn't backlog — it makes a pipeline of bad decisions (800 leads scored as low priority with no enrichment → 47 enterprise leads skipped → $50K damage for a $500/mo API [S37]) while the provider's credit is $125 (25%). 86 outages/yr avg [S45], $300k/hr loss [S36].

**Current workaround fails:** Third-party monitoring (Uptrends 233 locations) is *the buyer's tool* — provider says "your dashboard is biased, you want credits." Provider's dashboard is *provider-biased* — defines "available" to limit liability. No neutral third party, no slash for lying, no attested proof for billing dispute or insurance.

**Product:** Register an API + SLO (P50≤500ms P95≤2s, error<1%, enrichment fill≥80%). ProveDown's independent validator jury (diverse LLMs, independent `gl.nondet.web.render` probes to status page + 2 live probe endpoints, `gl.nondet.exec_prompt` judging data quality, `gl.vm.run_nondet_unsafe` consensus on `BREACH/NO_BREACH + reason`) produces an attested breach evidence bundle hashed and anchored on GenLayer, with cross-chain proof to Base for automated billing dispute/insurance. Buyers get neutral proof to turn $125→$5k credit; providers get appeal via bond if false; marketplace gets reputation scores.

**Why GenLayer (load-bearing):** Multiple independent validators with independent probes + diverse LLMs + greybox opacity vs single backend LLM = cannot be bribed/censored by buyer or provider; subjective judgment ("does 15s count as downtime for agent that needs <2s? does 82% fill count as breach?") requires LLM, not deterministic oracle; appeal doubling validators vs provider's self-report is the trust primitive when $50K is at stake. Remove GenLayer → you have a dashboard, not a settlement-grade attestation.

**Wedge → Expansion:** Wedge is API/LLM SLA (most hack-feasible, most second-order with agents, clear buyer payer, $300k/hr quantifiable). Once jury pattern validates, expand same primitive to procurement supplier attestation (same verify-external-truth-with-jury), review authenticity, carbon — all reuse verification infrastructure.

**Economics:** ~$0.04-0.08 per spot-check (3 renders + 1 LLM + gas + bridge), batched hourly off-chain probes with on-chain attestation only on suspected breach → amortized <$0.001/probe. Sell $99-499/mo + $0.10/breach bundle (99% probe margin, 30% attestation margin). Buyer who recovers one $5k credit covers 10 months. No product token; GEN for fees/bonds only.

**Ask kill criteria before scaling:** 5 pipeline owner interviews before Sep 10 must say they'd pay for neutral attestation; `web.render` latency must measure within tolerance (not WebDriver overhead); bridge cost must stay < credit value.

---

## 2. Problem

**The SLA Illusion Blocks Agent Scale.**

- **Reliability down:** 2B checks Q1 2024 vs 2025: 99.66%→99.46% [S36] = 34→55 min/week downtime, +18 hrs/yr. API Reliability Index avg 63/100. 67% monitoring errors are API errors.
- **Provider defines success:** SLA allows 43 min/mo downtime at 99.9% [S37], but effective worse: maintenance 2-8 hrs/mo excluded, partial degradation not counted, 400/429/throttling excluded, threshold tricks (80 req 70 failed = 87% error but SLA 100% because <100 req/min). Credits 5-15% monthly fee (capped 30-50%, claim-based within 30d, future invoice not refund) [S36-37]. Example: $2.1M loss 6 hrs → $3,200 credits 0.15%.
- **Agent amplification:** Dataku H1 2025 15 AI providers 52,560 checks: only Anthropic 99.72% beats 99.9%; OpenAI 99.31% 30h 18 incidents max 4h38m; Google 99.14%, Mistral 98.87%, composite 5 services at 99.9%→99.5% (3h36m/mo) [S37]. Peak outages 10am-2pm US 29% [S37]. AI agents 10-100× calls, burst QPM≥200, 15s latency = pipeline of bad decisions not queue. 800 leads scored with empty enrichment → 47 leads skipped → $50K damage [S37].
- **No neutral truth:** Status pages lag tens mins, third-party monitoring is buyer's, provider's is vendor's. When dispute arises, no third party both sides trust.

**This is the bottleneck Verification→Dispute layer** of agentic commerce stack (02-market-research/03): identity/authority/settlement progressing (x402 165M payments $50M, Visa 100+ partners), verification/dispute/accountability missing.

---

## 3. Evidence

| Evidence | Source | Type |
|---|---|---|
| 99.66→99.46% uptime, 67% API errors, 233 locations | S36 Uptrends 2B checks | verified fact |
| 15 AI providers H1 52k checks, OpenAI 99.31% 30h | S37 Dataku | verified fact |
| 215 services median 90min, AWS DynamoDB 141 services Oct 2025 | S45 Nordic APIs | verified fact |
| Downtime $9k/min large, 90% >$300k/hr, 86 outages/yr | S36-37 (J. Chang Law, Forbes) | strong inference |
| SLA credits 5-15% vs $2.1M loss→$3,200, threshold tricks | S36-37 | verified fact |
| $50K pipeline damage 47 leads from $500/mo API vs $125 credit | S37 Explorium | strong inference |
| 10-100× agent calls, QPM≥200 burst, composite 99.5% | S37, S33 SoK | verified |
| 165M x402 payments $0.3 avg, Visa 100+ partners, agentic commerce $385B at risk | S31-32, S44 | verified |
| Prior GenLayer: only AgentEscrow has SLA monitoring, no standalone sidecar | S24, 03-hackathon/03 | verified |

**Evidence quality: High** — multiple independent reports (Uptrends, Dataku, Nordic APIs) converge on reliability down + SLA illusory. Second-order effect (agents multiply) is inference but supported by x402 volume and agent protocols.

---

## 4. Market

**TAM archetype:** Every org whose agent pipeline calls third-party APIs — B2B data APIs (explorium), LLM APIs (inference marketplaces), payment/marketplace APIs. Adjacent ETHGlobal winners (AgentVault, EQLTY, OpenDeal) already serve agent pipelines but lack SLA enforcement.

**Serviceable now:** AI-native agent orchestration platforms, inference marketplaces (where latency directly impacts token streaming cost), B2B enrichment pipelines (lead scoring, data APIs). Market expanding with 10-20% e-commerce $385B agentic [S32] and 165M x402 payments already flowing.

**Pricing benchmark:** Datadog $15/host/mo, Uptrends $20/mo, PagerDuty $29/user/mo — monitoring alone. Attested enforcement premium justifies $99-499/mo because credit dispute ROI is 10-100× (one $5k recovery covers 10mo). TAM not $770B fake reviews-scale but deeper per-customer value.

---

## 5. Existing Solutions

**How they solve today:** Human on-call + third-party monitoring (status pages lag) + circuit breakers + multi-provider fallback + caching + 5s timeouts + error budget SLO 99.95% (22min/mo) + contracts with termination rights + aggressive audit docs (J. Chang Law: $9k/min requires audit trail).

See `04-competitive-intelligence/01` for full table: Uptrends/Datadog/Pingdom (probes), provider SLA dashboards (self-report), Chainlink/staking oracles (objective not subjective), TEE receipts (execution not functional quality), humans (spreadsheets/Slack).

---

## 6. Competitive Landscape

**Direct:** Uptrends (2B checks 233 loc), Datadog, Pingdom, Statuspage, provider dashboards. Indirect: Chainlink Functions (objective data), staking/slashing inference oracles (AgentRouter HBAR), TEE attested execution (0G/iExec). Substitutes: on-call humans. Emerging: `AgentEscrow` SLA monitoring (per-escrow not sidecar), `Cadence`, OpenDeal (procurement not SLA).

See `04-competitive-intelligence/02`: Tomorrow team with existing probe network beats us on data, but not on neutrality (they are *the* probe vendor — buyer vs provider trust gap remains). GenLayer's diversity (Heurist/Comput3/Chutes) + independent fetches + bond/slash is differentiator they cannot claim without becoming decentralized themselves.

---

## 7. Why Current Solutions Fail

1. **Trust poisoned:** Provider defines SLA to limit liability (thresholds, exclusions). Buyer tool is buyer's. No neutral third party. When $50K dispute arises, neither side's measurement is accepted.
2. **Subjective not objective:** "What counts as downtime?" Slow (15s) vs error (5xx) vs empty enrichment (200 but fill 40%) — deterministic ping cannot judge functional integrity. Needs LLM judging content quality (match≥85% fill≥80%) with external evidence.
3. **No economic security:** Central monitoring can be gamed: buyer cherry-picks slow region, provider serves fast path to known validator IPs. No stake, no slash, no VRF random assignment, no appeal doubling validators.
4. **No attested proof:** Even if monitoring shows breach, no hash-anchored evidence bundle buyer can bridge to billing contract for automated credit. It's a dashboard screenshot, not settlement-grade attestation.
5. **Composite & burst complexity:** 5 services at 99.9%→99.5% [S45]; burst QPM≥200 [S37] — failure multiplies as agent scale grows, but current tools report per-service, not pipeline-attributed.

---

## 8. Why Now

- **Reliability down while dependence up:** 99.66→99.46% as agents scale (counter-trend to need for five-nines).
- **Agent protocols launched Jan 2026:** OpenAI/Stripe ACP + Shopify/Etsy/Walmart + Google UCP + Visa Trusted Agent (100+ partners, pilots holiday 2026) [S44] — agentic commerce moving from recommendation to purchase, with 165M x402 payments already [S44]. Every purchase is API calls that need SLA.
- **x402 volume proves rail ready but verification gap acknowledged:** Docs say x402/ERC-8004/A2A "engineer happy path, none ship adjudication" [S04]; our stack map (03) shows verification is the missing layer.
- **Incident peak:** OpenAI 11 incidents Jan 2026 every 2.5 days [S37]; AWS DynamoDB Oct 2025 141 services; Cloudflare Nov 2025 2h [S45] — awareness high, buyer appetite for neutral verification exists now vs 2024 when uptime was better.
- **GenLayer tooling ready:** GenVM + Studio + `genlayer-js` + `estimate-fees` + Bradbury persistent (4221) now stable enough for demo (not 2024 archived `genvm` limbo) — before Sep 3 window.

---

## 9. Core Insight

**Non-obvious discovery:** The SLA problem is *not* monitoring vs provider status page. It's **who gets to be the neutral adjudicator when buyer and provider disagree and money is on the line — and why neither side can be that adjudicator.** The missing primitive is *economically-secured subjective adjudication with independently fetched external evidence*, not faster polling.

- Uptrends can probe globally but is *hired by buyer* → provider distrusts it.
- Provider's dashboard can say 99.9% but is *provider-controlled* → buyer distrusts it.
- Single AI API can judge breach but is *central operator* → can be bribed/censored (bribe evaluator cluster [S33]) and has no independent recomputation.
- Only jury of independent validators with independent `web.render` probes + diverse LLMs + `run_nondet_unsafe` agreement on `BREACH/NO_BREACH+reason` + evidence bundle hash + bond/slash + appeal doubling provides *settlement-grade* neutrality where $50K credit disputes are economically rational. That's not a feature — it's the *trust* layer agents need to transact at machine speed without human verification (which defeats the automation).

Second-order: As agents multiply calls 10-100×, *attested* SLA becomes reputation (like RelAI) — APIs with high reputation command premium; composite pipelines can select best. So wedge is breach proof, expansion is reputation marketplace.

---

## 10. Product

**ProveDown — Attested SLA sidecar**

**For:** Buyer / agent pipeline owner who suffers when APIs degrade.

**Does:**
1. Register API + SLO: endpoint(s), P50/P95 latency thresholds, error<% threshold, data-quality thresholds (match/fill), probe interval, evidence URLs (status page + live probe endpoints).
2. **Spot-check on demand or batched hourly:** Independent validator jury probes (3 URLs via `gl.nondet.web.render` mode='text'), LLM judges (`gl.nondet.exec_prompt` returning `{"breach":bool, "reason": LATENCY|ERROR_QUALITY|UNAVAILABLE, "p50":int, "p95":int, "match":float, "fill":float, "confidence":0-1000}`), validators agree on `breach+reason` only, anchor attestation (breach bool + evidence hashes + histogram) on GenLayer, emit bridge proof to Base for billing/insurance.
3. **Dispute:** If provider says false breach, they post bond and appeal (new validators, double). If jury was wrong, provider wins bond; else buyer keeps attestation for credit.
4. **Reputation:** Historical attestations form public reputation graph per API (uptime, p95, error, fill) weighted by confidence, like RelAI/AgentTrust but for APIs.

**Not monitoring:** Off-chain probes collect per-minute off-chain (cheap), on-chain attestation only on suspected breach or batched bundle hash (see economics). This respects cost model (minimize nondet calls [S06]).

---

## 11. Workflow

**Sequence (happy path):**

```
Buyer (frontend) → register_sla(api_url, status_url, probe1, probe2, slo_json) → GenLayer Intelligent Contract stores SLA, emits SLOHash (deterministic)

# Off-chain continuous (startup backend, not GenLayer): every minute fetch probes, store latency/quality histogram, detect anomaly (p95>threshold)

Buyer → request_attestation(sla_id) // on demand or auto when anomaly
  → GenLayer IC: leader_fn fetches 3 URLs via gl.nondet.web.render(mode='text'), exec_prompt judges breach vs SLO, returns json
  → validators independently fetch + judge, compare breach+reason via run_nondet_unsafe
  → if consensus: tx ACCEPTED → store attestation {sla_id, timestamp(gl.message_raw['datetime']), breach, reason, confidence, evidence_hashes(sha256 of 3 probe texts truncated 3k each), p50/p95, histogram bucket, retry}
  → emit BridgeSender message → Relay → Base Sepolia VerdictRegistry (AgentEscrow pattern) with proof
  → frontend shows ATTESTED_UP or BREACH + evidence + explorer links

Provider → appeal_attestation(attestation_id, bond) if disputes → new validators double, judge same evidence bundle + fresh probes, slashing if needed

Buyer → claim_credit(bridge_proof) on Base billing contract → credit emitted

# Reputation: every attestation updates TreeMap[api][metric] with confidence-weighted score, queryable via readContract
```

**Evidence pipeline:** Per `01-genlayer-recon/01`: normalize CRLF→LF outer whitespace, require 1-16k chars (else INCONCLUSIVE not REJECTED per ContentBounty lesson [S18]), sha256 truncated to 16 hex for summary, dedup URLs, HTTPS only, max 3 URLs, allowlist host not needed (API is buyer-specified, but still validate). Greybox sanitize `FORBIDDEN_TOKENS` before LLM [S15].

**MVP simplifies:** No continuous off-chain poller yet; just on-demand spot-check (3 URLs single jury run). Continuous batched bundles added 30d roadmap.

---

## 12. Why GenLayer (Load-Bearing Test)

### Remove GenLayer → What disappears?
Dashboard remains but loses neutrality: buyer's tool vs provider's dashboard, neither trusted for settlement. No bonded validators, no VRF random selection, no independent recomputation, no appeal doubling, no slash for false attestation. When buyer claims $50K damage vs provider's $125 credit, dispute reverts to manual audit (40% detection via tips per ACFE but <1% appeals [S27] analog) or bank chargeback — months, not minutes. Trust math collapses to "trust my server."

### Replace with Base/Ethereum + AI API + Chainlink/standard oracle
- **Base/Ethereum** stores SLA hash but cannot fetch live status page + live probe endpoints + judge functional quality — needs external web + LLM.
- **Chainlink** oracles objective data (price feed) not subjective "does 15s latency count as breach for agent needing <2s? does 82% fill count?" Chainlink Functions could fetch but single oracle operator = single bribe target.
- **Central AI API** = buyer's biased judge vs provider's self-report — same trust poison. No economic security, no independent fetches, no greybox opacity vs provider serving fast path to known IPs.
- **Why GenLayer still materially better:** Multiple independent validator probes + diverse LLM providers (Heurist/Comput3/Chutes etc.) + greybox opacity (attacker doesn't know which LLMs/templates each validator runs [S04]) + `run_nondet_unsafe` consensus on decision fields with tolerance + evidence bundle hash for appeal audit + bond/slash + VRF random assignment. This is not "call LLM twice" — it's *economically-secured neutral measurement* that both sides can cite. See detailed sketches in `06-adversarial-analysis/02-genlayer-necessity-tests.md`.

### Unique primitive that becomes possible
`gl.nondet.web.render` (independent fetches) + `gl.nondet.exec_prompt` (judge breach vs SLO with tolerance, return JSON) + `gl.vm.run_nondet_unsafe` (validators agree on `breach+reason`) + `emit_transfer`-like attestation (store breach + evidence hashes) + bridge proof (LayerZero/Hyperlane to Base) + appeal bond + reputation map. Equivalent to ContentBounty's evidence→observations→criteria pattern but for SLA truth.

### Is it economically important enough?
Yes per `06-adversarial-analysis/04`: $0.04-0.08 per spot-check vs $9.40 manual invoice analog and vs $50K damage vs $125 credit — attestation unlocks 40× credit, buyer who recovers one $5k credit covers 10 months subscription. If attestation only on breach (not per-minute), amortized <$0.001/probe due to off-chain batching, gross margin >80%. Without GenLayer, buyer cannot justify $5k credit claim (provider says biased). With GenLayer, $0.08 attestation is settlement-grade proof.

**If answer were weak → reject candidate. Here answer is strong → pass.**

---

## 13. Technical Architecture

```
Frontend (Next.js 16, React 19, TS strict, Tailwind) [like Jury]
   ↓ genlayer-js (createClient chain: simulator|studionet|testnetBradbury, readContract + writeContract)
Backend (Node, no custodial judge — only probe poller + cache, not settlement truth)
   → GenLayer Intelligent Contract (Python gl.Contract)
        * Storage: TreeMap[str,Sla], TreeMap[str,Attestation], TreeMap[str,Reputation], DynArray etc.
        * Methods: register_sla (payable? not needed for MVP — free register, fee per attestation via caller gas), request_attestation (nondet jury), appeal_attestation (bond), get_attestation, get_reputation
        * Nondet: gl.nondet.web.render ×3, gl.nondet.exec_prompt (judge), gl.vm.run_nondet_unsafe (consensus on breach+reason)
        * Deterministic post-consensus: store attestation, update reputation, emit BridgeSender message (callKey)
        * Linter: genvm-lint check — 20+ rules, avoid self capture, use primitives+JSON strings
   → GenLayer Chain (zkSync Elastic, Bradbury 4221 persistent, faucet) [S02]
        * Explorer links per attestation (like Jury/ContentBounty)
   → Bridge (Hyperlane or LayerZero V2 per Internet Court/AgentEscrow [S20, S24])
        → Relay (startup backend relay)
        → Base Sepolia (or Base) VerdictRegistry (Solidity, stores attestation proof, for billing claim)
   → APIs (buyer's APIs: status page, probe endpoints — public HTTPS, no secrets, mode='text' render)
   → Databases (postgres for off-chain probe cache/histogram, not truth — truth is on GenLayer)
   → Existing infra (buyer's agent pipeline, ERP, billing contracts)
```

**No need for entire product on GenLayer** — frontend/backend/agents/apis/databases are off-chain; GenLayer is trust layer for attestation (per §7: Web2 SaaS → GenLayer adjudication).

**Network choices:** Bradbury for hackathon demo (persistent, faucet, real validators, 30min finalize wait acceptable for async attestation). Studionet for zero-setup during dev (61999, temporary). Localnet/GLSim (61127, 1s) for unit tests. Base Sepolia for bridge demo (like AgentEscrow [S24]).

**Constraints respected:** Max 3 URLs 3k each 9k total [S15], 1-16k chars normalized [S18], no secrets in web.render (public endpoints only — authenticated APIs out-of-scope for MVP, kill criteria if needed), sanction `FORBIDDEN_TOKENS` → `[filtered]` [S15], handle `UNDETERMINED`/`INCONCLUSIVE` as retry not error (fetch failed → INCONCLUSIVE, digest mismatch → retry, genuine split → no consensus shown as Equivalence working [S15]).

---

## 14. Security

Full matrix in `06-adversarial-analysis/03`.

**Top 3 residual risks for this product:**
1. **Provider serves fast path to WebDriver IPs** (probe spoofing) → Mitigated via independent validators (different IPs), never trust status page alone (always include 2 live probes with latency measured at render time), surprise probes not announced, reputation weighted by confidence. Residual: provider with residential IP pool could still identify some validators — need future mix via diverse validator infra (Heurist/Comput3 distribution helps).
2. **Prompt injection in status page** (hidden `ignore previous…`) → Greybox sanitize + DATA framing (`<SYSTEM><EVIDENCE>`) + validator diversity. Residual: novel injection not in FORBIDDEN_TOKENS — need ongoing prompt hardening (Incident Playbook Lesson).
3. **Bribery/Sybil evaluator cluster** (SoK evaluator attacks [S33]) → Stake 42k + sqrt damping + VRF random selection + appeal double + evidence bundle hash audit for later slashing. Residual: if disputed amount >> stake (e.g., $1M claim vs 42k stake), bribery rational — need bond scaled to disputed value or require fast finality (pay all validators) for high-value attestations.

**Liveness:** Validator missing Window triggers slashing [S09] — but attestation not time-critical to seconds (async hours acceptable vs 86 outages/yr weekly).

**Failure as feature:** Genuine split (P95 exactly at threshold ± tolerance) → `UNDETERMINED` → shown as "validators split — honest disagreement at boundary" not error; buyer can retry with adjusted tolerance or escalate to human (like Jury field guide).

---

## 15. Economics

**Who pays:** Buyer / pipeline owner (not provider). Buyer suffers $50K damage, $300k/hr risk, composite failures; attestation unlocks credit + error-budget correctness.

**Cost to serve:** 3 web renders + 1 LLM per attestation (~$0.02) + gas (0.05 GEN ~$0.005) + bridge (~$0.01) = $0.04-0.08 spot. Batched hourly bundles (100 off-chain probes → one on-chain bundle hash) amortized <$0.001/probe.

**Price:** $99-499/mo subscription for 10 APIs + $0.10 per breach attestation or bundle. Benchmark vs Datadog $15/host/mo — premium justified by *attested* vs ping. One $5k credit recovery covers 10 months. Gross margin 80%+ probes, 30% attestations; rises with batching.

**Incentives:** Buyer posts attestation fee (gas); provider posts challenger bond (5% min per ContentBounty pattern [S18]) if they contest; false challenger loses bond; false attestation slashed via appeal. Rate limit per buyer prevents farming.

**No product token:** GEN for fees/bonds only. Reputation as TreeMap scores or soul-bound NFT (AgentTrust-like) not tradable.

See `06-adversarial-analysis/04` for full model including breakout for procurement comparison and procurement as 90d expansion.

---

## 16. Distribution

**First 10 (not "post on X"):**
1. **2 inference marketplace design partners** — already monitor AI APIs via Dataku pattern, suffer directly from 99.31% OpenAI downtime; offer free attested spot-checks for 1 month in exchange for logo + case study ($50K story).
2. **3 agent orchestration platforms** (e.g., Autonome/Coinbase x402 ecosystem) — integrate sidecar as MCP tool (`attest_sla`); they get trust layer for their users, we get distribution.
3. **5 B2B data API buyers** via Explorium-like enrichment pipeline communities (B2B lead scoring) — target Slack/Discord where "we scored 800 leads with empty enrichment" stories already shared.

**Channels:** ETHGlobal/Base hackathon alumni (EQLTY/AgentVault patterns show they already build with ENS/0G/Hyperlane — natural allies), Farcaster/Base App wallet distribution (Base winners show this matters), accounting for procurement expansion later via accounting firm recovery audit channel (not for wedge but for 90d).

**Retention:** Pipeline owners don't churn if attestation wins them one credit dispute; plus reputation scores become selection signal (choose better APIs) → network effect (more attestations → better reputation data → more value).

---

## 17. Differentiation

Why not just use Uptrends + Datadog?

- **Dedicated neutrality:** Uptrends is *hired* — provider distrusts; provider dashboard is *vendor* — buyer distrusts. ProveDown is *neither hired nor vendor* — jury stake-backed neutral.
- **Functional judgment:** Uptrends pings; ProveDown judges *functional integrity* (fill rate, match quality) via LLM, not just 200/month ratio.
- **Attested proof:** Dashboard screenshot vs hash-anchored evidence bundle + bridge proof to Base VerdictRegistry that billing contract can verify automatically (like AgentEscrow BridgeSender→Relay→Base [S24]).
- **Reputation:** Historical attestation-weighted reputation vs per-check ping list.

---

## 18. Defensibility

Do not accept "we were first / better UX / we use GenLayer" as moat (per 06).

| Moat | How built | Why hard to copy |
|---|---|---|
| **Probe + reputation graph** | Every attestation updates TreeMap reputation (confidence-weighted) public on GenLayer but enriched features private | Time + volume: more contracts attested → better graph (premium for reliable APIs, composite SLA prediction). Tomorrow team with probe network starts from zero on reputation. |
| **Workflow lock-in** | Probe sidecar npm/pip (`npm install provedown-sidecar` → config SLO in 5 min) + Base VerdictRegistry for billing auto-credit + ERP/webhook for pipeline error-budget block | Switching cost: already integrated into pipeline error budget + billing contract |
| **Network effects** | More buyers attesting → better reputation scores → better API selection → more buyers. This is EQLTY/RelAI pattern but for APIs not agents. | Two-sided: need both sides to replicate |
| **Evaluation mechanism** | Jury prompts tuned for SLA functional judgment (data-quality vs latency tolerance, breach categories) + greybox prompt hardening vs injections discovered via Incident Playbook | Prompt quality is iteration moat (ContentBounty 2-stage lesson); new team must replicate tuning + validator diversity |
| **Bridge/integrations** | Hyperlane/LayerZero to Base Sepolia like AgentEscrow, ENS policy hash for SLO (like EQLTY ENS policy) | Integration engineering + partnership moat (billing providers must accept proof) |

**Tomorrow team with strong engineers + funding beats us if:** They already own probe network (Uptrends) + enterprise trust + existing billing integrations. **Our advantage:** Neutrality (they are biased as vendor) + GenLayer-native reputation composability (public attestations anyone can read vs siloed per-vendor) + faster wedge into AI-native agent pipelines (they serve generic uptime, we serve agent-specific functional SLOs like enrichment fill).

---

## 19. MVP

**Goal:** Smallest product proving thesis: *neutral jury can attest BREACH vs NO_BREACH for an API and both buyer and provider accept proof more than dashboard screenshot* — and demonstrate GenLayer is load-bearing.

**Scope (Sep 3-17 hackathon):**

- **Contract (GenLayer, Bradbury 4221):** `ProveDownSla` (Python)
  - Storage: `TreeMap[str,Sla]`, `TreeMap[str,Attestation]`, `TreeMap[str,Reputation]`
  - Methods: `register_sla(sla_id, api_url, status_url, probe1, probe2, slo_json_str)` (deterministic validation: HTTPS only, dedup, max 3, slo parse), `request_attestation(sla_id)` (nondet jury via `run_nondet_unsafe` 3 renders + 1 exec_prompt, consensus on `breach+reason`), `appeal_attestation(attestation_id)` (bond), `get_attestation(id)`, `get_reputation(api)`. Linter clean, typed storage only.
  - Nondet pattern: V2 evidence-first style [S15] — plain locals, sanitize, truncate, sha256, `FORBIDDEN_TOKENS` filtered, `<SYSTEM><EVIDENCE>` framing, return JSON breach+reason+confidence+p50/p95, validators compare breach+reason, ignore reasoning text.
  - Deterministic post-consensus: store attestation, update reputation (confidence-weighted), emit bridge message (even if bridge mocked via event for hackathon, explain real Hyperlane path).

- **Frontend (Next.js, like Jury):** Register form (3 URLs + SLO JSON), "Attest now" button, jury deliberation (5 validators streaming reasoning, like Jury simulator), verdict BREACH/NO_BREACH/UNDETERMINED with confidence + evidence hashes + latency histogram (derived, not raw), explorer links (tx hash per Jury submission writeup), reputation panel (api score over time). Toggle mocked vs live (like Jury `NEXT_PUBLIC_LIVE_JURY`).

- **Bridge (mock + real path):** For hackathon, mock Relay (link proofs via tx hash); diagram real Hyperlane to Base Sepolia VerdictRegistry (AgentEscrow pattern [S24]) for judge technical depth, even if not fully deployed due to time.

- **Probes:** Use 3 public HTTPS endpoints (e.g., OpenAI status page + 2 demo probe endpoints we control that can simulate slow/error; not needing authenticated private API). This avoids GenVM secret limitation and anti-bot wall.

- **Tests:** Direct mode with `mock_web`/`mock_llm` (breach vs no breach, tolerance ±, prompt injection sanitized, consensus agreement test), 1 integration Studio test (real consensus minutes).

**Out-of-scope for MVP (but noted in roadmap):** Continuous off-chain poller, batch bundles, billing contract auto-credit claim, residential IP mix, ENS policy hash, full reputation marketplace.

**MVP success metric:** Buyer can register SLA, get attested breach with explorer-verifiable tx within hackathon demo (not instant but acceptance → finalization visible), and explain why removing GenLayer breaks trust (removal test passes).

---

## 20. Hackathon Demo Strategy

**5-minute judge flow (like Jury submission writeup):**

1. **Hook (30s):** "APIs lie about uptime. Your agent loses $50K while provider credits $125. Who decides?" Show S36-37 numbers.
2. **Run on GenLayer (90s):** Fill register form (OpenAI-like demo SLA: P95≤2s, error<1%), click "Attest now" — watch 5 validators fetch 3 URLs independently + judge breach, consensus reached, verdict BREACH with latency histogram p95=4.2s + evidence hashes. Click "View on GenLayer Explorer" → real Bradbury tx (proposal→commit→reveal→accepted).
3. **Why not backend AI? (60s):** Slide: remove GenLayer → no evidence hashes, provider says "your tool biased"; replace with chainlink → single oracle bribed; show jury validators use diverse LLMs (Heurist, Comput3) vs single API, appeal doubles validators, evidence bundle hash audit — trust math not promises.
4. **Bridge & reputation (60s):** Show bridge proof to Base VerdictRegistry (mock relay for now, diagram real), reputation graph updating per attestation, composite SLA demo (5 APIs at 99.9%→99.5% [S45]).
5. **Live sandbox (30s):** Type any API URL + SLO, get attestation — proves generic contract (like Jury sandbox: arbitrary dispute → real tx).
6. **Beyond hackathon (30s):** Roadmap + economics ($0.04 checks, $99/mo, one $5k credit covers 10mo, no token).

**Backup:** Mocked mode if Bradbury congested (like Jury handles Retry-After + timeout fallback), still shows on-chain links for preset case.

**Verifiability layer:** Every attestation links to Bradbury explorer + contract address, like Jury's "every claim checkable via tx hash" principle that fixed v1 cosmetic rejection [S19].

---

## 21. Post-Hackathon Roadmap

### 30 days (Oct 2026) — Prove buyer willingness + harden MVP
- 5 pipeline owner interviews (kill criteria test) + 2 design partners live
- Harden sanitization (more `FORBIDDEN_TOKENS`), add `INCONCLUSIVE` retry (fetch fail → retry not reject [S18])
- Off-chain probe poller v1 (every 5min to 3 endpoints, store histogram, anomaly auto-triggers attestation)
- Fee profile via `estimate-fees` for real cost; faucet → mainnet pricing
- Fix `web.render` latency measurement (if WebDriver overhead too variable, switch to `web.request` timing inside nondet or measure via backend poller + jury judges quality not raw latency)

### 90 days (Dec 2026) — Expansion wedge #2 + batching
- Launch batch bundles: 100 off-chain probes → one on-chain bundle attestation (rootHash like AgentVault [S24])
- **Procurement expansion (#3):** Add invoice verification jury reusing same pattern (register_invoice + supplier attestation). Target Odoo plugin (like OpenDeal Odoo [S24]) + 2 accounting firm pilots. Scope: duplicate/price/tax (public signals) not bank BEC (explicit out-of-scope until auth solution).
- Bridge live to Base Sepolia VerdictRegistry (full Hyperlane relay)
- Reputation marketplace v1: queryable API scores, like RelAI for APIs
- ENS policy hash for SLO (like EQLTY ENS policy text record) for governance without redeploy

### 180 days (Mar 2027) — Network effects + insurance
- Reputation scores premium for reliable APIs (APIs with high scores command higher price, like AgentRouter market-discovered price)
- API downtime insurance (premium vs reputation, attestation triggers payout) — need capital pool + partnership
- Randomized recheck (like SponsorGuard `next_check_at` [S26]) for continuous SLA not just spot
- Validator diversity program (incentivize providers to run nodes with different LLMs, greybox customization)

### 365 days (Sep 2027) — Become infrastructure
- **Infrastructure for agentic commerce:** Verification layer called by any x402/ERC-8004 agent payment (identity→recovery stack 03). Every agent payment registers intent hash, execution revalidation, jury attests authority/freshness.
- Expand to health claims (if HIPAA sandbox solved) and carbon (satellite) as additional verticals using same jury — horizontal infrastructure.
- Revenue: subscriptions + per-attestation + bridge fees + reputation premium + insurance — net negative churn if pipeline grows with agent volume.

---

## 22. Long-Term Vision (Company)

**If wedge is API SLA sidecar:** ProveDown becomes *the trust layer for machine-to-machine commerce* — neutral, stake-secured, external-data-aware adjudication that any agent framework (MCP, A2A, ACP, AP2) calls before settlement. Not a monitoring dashboard, not a payment rail, but the *someone else* that x402/ERC-8004 docs say is missing. Long-term: every agent transaction is optimistically executed and attested, with appeal-based reversal and reputation-selected counterparties, at machine speed.

**That is a real company on Sep 18, 2026 and Sep 18, 2027** because:
- Real users: every pipeline owner (now) → every agent commerce transaction (later)
- Real pain: $300k/hr loss is budget-holder pain, not developer curiosity
- Real utility: settlement-grade proof, not dashboard
- Real workflow: register SLO → attest → bridge → claim credit → reputation → select better APIs
- Real economic value: $0.08 attestation unlocking $5k credits, 80% margins batched
- Room for expansion: procurement → health → carbon → commerce infrastructure
- Defensibility: reputation graph + workflow lock-in + evaluation moat + network effects
- GenLayer genuinely load-bearing: decentralized jury with independent probes + appeal is the product; remove it → you have biased tool, not trust.

**If apocalypse scenario where API SLA price sensitivity proves wrong:** Pivot to procurement wedge (#3) — same jury infrastructure, same contract patterns (evidence bundle → observations → criteria bits pattern [S18]), different verifiers. Thesis is *verification infrastructure*, not single API.

---

## 23. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Buyer says never pay for neutral attestation (trust Datadog/provider) | Medium | High (kill thesis) | 5 interviews before Sep 10 kill criteria; if fails → pivot to #3 |
| `web.render` latency variance > tolerance (WebDriver overhead) | Medium | Medium | Jury judges quality (fill/match) not raw ms; fallback to `web.request` direct timing; backend poller measures, jury judges bundle |
| Anti-bot wall blocks validator fetch (Inc. Playbook URL Rot/Anti-bot) | Medium | Medium | Allowlist + `INCONCLUSIVE` retry + health-checked crawler whitelisting; MVP uses public endpoints we control, so demo avoids wall |
| Provider detects validator IPs, serves fast path | Medium | Medium | Independent validators diverse IPs + surprise probes + not trusting status page alone + reputation confidence decay |
| Prompt injection in status page causes jury obey | Medium | High | Greybox sanitize + DATA framing + diversity + ongoing hardening; treat as residual not zero |
| Enterprise sales cycle even for buyer (security review) | Low for buyer wedge (self-serve) | High for procurement expansion | Stick to buyer self-serve first; procurement via accounting channel not direct enterprise until 90d |
| Internet Court / Visa builds dispute layer and beats us | Low for SLA niche (they do generic escrow) | High if generic | We niche to functional SLA (fill rate) not generic escrow; expand to reputation marketplace not payment rail |
| GenLayer latency/cost kills UX (500s finalize) | High knowledge | Medium | Attestation is async (hours ok, not seconds); buyer submits, gets acceptance then finalization window — like ContentBounty 2d windows [S18]; use pending → accepted for immediate UX, finalization for settlement |

---

## 24. Kill Criteria

**We abandon/ pivot ProveDown if any of these trigger (all verifiable before scale):**

1. **Willingness kill:** ≤1 of 5 pipeline owner interviews (by Sep 10) say they'd pay $99/mo for neutral attestation (all say "Datadog enough" or "credits not worth fighting") → **pivot to #3 procurement** (stronger quantified leakage) or drop.
2. **Measurement kill:** `web.render` p95 variance across 10 repeated attests on same stable endpoint > ±200ms due to WebDriver overhead (confidence too low to distinguish breach vs no-breach at threshold). If jury cannot reliably measure latency within SLO tolerance → **de-scope latency wedge, keep data-quality wedge** (fill/match where 15s vs empty matters less than exact ms).
3. **Bridge cost kill:** GenLayer gas + Hyperlane relay fee > 50% of typical credit disputed ($125 small claim) for majority of buyers → **make attestation off-chain with optional anchor** (trust reduced but still useful for reputation; GenLayer less load-bearing → reassess thesis, maybe not startup-grade).
4. **Data access kill (for expansion):** If procurement pilot demands bank-detail verification (BEC) and we cannot with public `web.render` (needs auth) → **scope procurement to duplicate/price/tax only, or keep as 180d not 90d**.
5. **Collusion cost kill:** If $1M dispute emerges and bond 5% ($50k) < bribery cost to capture jury (e.g., 3 validators × 42k stake fiction) and provider rationally bribes → **require scaled bond (10-20% for high-value attestations) + fast finality (pay all validators) for >$100k disputes** — if buyers won't pay that premium, thesis fails for large claims.
6. **Incumbent replication kill:** If Uptrends/Datadog launches *neutral* attestation (diverse probes + stake) within 90d and signs 3 of our design partners → **our moat is reputation + workflow lock-in; if they beat us on integrations before we have 10 live customers → pivot to niche where their probe network not relevant (enrichment fill rate vs uptime ping)**.

**Explicitly not kill:** "Generic escrow is saturated" does not kill us — we are not generic escrow (saturation map proves). Local `contentbounty`/`jury` being not accepted does not kill — they are lessons not market proof (00-mission correction).

---

## 25. Final Pitch

**For a serious founder (30s):** APIs are less reliable as agents scale, SLAs lie, and neither buyer's dashboard nor provider's dashboard can be neutral when $50K is at stake. We turn GenLayer's jury — independent `web.render` probes + diverse LLM judges + `run_nondet_unsafe` consensus + evidence hashes + appeal + bridge — into settlement-grade SLA proof for agent pipelines. It's $0.08 to unlock a $5k credit. That's not a hackathon demo — that's the trust layer every agent payment will need.

**For a GenLayer engineer (30s):** We use the protocol as intended: not as database but as *adjudication*. Three `web.render(mode='text')` fetches inside `leader_fn`, one `exec_prompt(response_format='json')` judging breach vs SLO with tolerance, `run_nondet_unsafe` validators agree on `breach+reason` only (ignore reasoning text → tolerant equivalence), deterministic store of attestation + reputation `TreeMap`, bridge to Base via Hyperlane for credit settlement — exactly the evidence-first pattern from `dispute_court_v2.py` [S15] and two-stage pattern from `content_bounty.py` [S18], but for SLA truth. Every attestation is explorer-verifiable, `UNDETERMINED` is first-class, `INCONCLUSIVE` retryable [S18]. Remove GenLayer → no independent probes, no diversity, no bond/slash, no VerdictRegistry — you have a biased dashboard, not trust.

**For a skeptical investor (30s):** You've seen generic escrow clones (9) and prediction markets (11) saturate Bradbury [S21]. This is not that. TAM is every pipeline owner paying $300k/hr downtime risk [S36], wedge is $99/mo sidecar with 80% margins batched, expansion is verification infrastructure for procurement→health→carbon (same jury, different verifiers), moat is reputation graph + bridge + workflow lock-in (not first-mover). Five customer interviews before Sep 10 and `web.render` latency variance test are falsifiable kill criteria — if they fail, we pivot to procurement where leakage is $3.5M/B [S30] with accounting channel already monetizing 15-25% fees. Why now: reliability down 60% while 165M x402 agent payments already flow and OpenAI has 30h downtime per half [S37] — wait 12 months and Visa builds the trust layer.

---

## Appendix — File Map

- `00-mission.md` — mission + methodology corrections
- `01-genlayer-recon/01-primitives.md` — GenVM, nondet primitives, workflow
- `01-genlayer-recon/02-consensus-appeals.md` — Optimistic Democracy, Equivalence, validators, appeals, finality
- `01-genlayer-recon/03-constraints.md` — limitations, failure modes, trust
- `01-genlayer-recon/04-developer-workflow.md` — lint → direct → Studio → Bradbury → genlayer-js
- `02-market-research/01-problem-candidates-12.md` — 12 deep problems
- `02-market-research/02-auto-research-deep-dive.md` — why auto-research marketplace is feature not company
- `02-market-research/03-agentic-commerce-map.md` — 11-layer stack, verification is bottleneck
- `02-market-research/04-second-order-effects.md` — what breaks when agents scale
- `03-hackathon-intelligence/01-genlayer-ecosystem.md` — what has been built (90 projects)
- `03-hackathon-intelligence/02-adjacent-ecosystems.md` — ETHGlobal/Base/Solana patterns
- `03-hackathon-intelligence/03-saturation-map.md` — saturated vs white space
- `04-competitive-intelligence/01-direct-indirect-substitutes.md` — per-finalist 5 types
- `04-competitive-intelligence/02-emerging-competitors.md` — how tomorrow team beats us + defensibility
- `05-opportunity-map/01-scoring-framework.md` — 15 criteria weighted, hack feasibility 0.7×
- `05-opportunity-map/02-ranked-12.md` — weighted 8.63 top
- `05-opportunity-map/03-ranked-8.md` — cut logic to 4
- `05-opportunity-map/04-final-4.md` — finalist canvases
- `05-opportunity-map/05-final-2-adversarial.md` — 12→8→4→2 re-score after kill
- `06-adversarial-analysis/01-kill-tests.md` — why NOT build each
- `06-adversarial-analysis/02-genlayer-necessity-tests.md` — remove/replace/unique/economically important
- `06-adversarial-analysis/03-security-models.md` — 15 attacks × mitigations
- `06-adversarial-analysis/04-economic-models.md` — who pays, margins, agent economics
- `SOURCES.md` — 45 source IDs with URL/date/type/confidence/label

**Status:** Thesis is defensible for Sep 3. **No product code yet** — first build after thesis boundary. Next is verification: 5 interviews + latency variance test before committing contracts.
