# 04 — Final 4

## 1. Procurement/AP Fraud & Leakage — `#3`

**Customer:** CFO / AP controller, mid-market $100M-1B, 44% hit 13 attempts/yr.
**Problem:** 5% revenue lost [S29], 0.35% spend leaked [S30], 9.2 days processing, 14% exception rate, 79% hit fraud, recovery audits 15-25% fee reactive.
**Current:** 3-way matching, samples, human controls (53%), training (50%), 20% no analytics, 28% automated detection.
**Why fails:** Subjective price/discount/tax + external supplier legitimacy + trust (ERP misses near-duplicates).
**Product:** Intensive jury verifying invoice truth: `web.render` supplier attestation (tax registry, supplier portal, bank details) + `exec_prompt` judging "is this legitimate / price/tax correct / duplicate?" + bonded verification before release + slash false approval. Escrow or attest-and-release bridge to ERP (Odoo [S03 agentic map: OpenDeal uses Odoo]).
**MVP:** Upload invoice PDF + PO + supplier URL, jury returns VERIFIED / FLAGGED + reason + confidence, attestation hash on GenLayer; ERP webhook blocks payment if flagged.
**Distribution:** Accounting firm partners (already do recovery audits) + AP automation marketplaces. First 10 via design partners (2 mid-market co's with leaked 0.35%).
**Expansion:** Full procure-to-pay verification (RFP, vendor KYS, CSDDD, carbon), reputation graph of suppliers.
**Moat:** Supplier reputation graph + historical leakage data + workflow lock-in (ERP plugin).

## 2. API/LLM SLA Enforcement Illusion — `#8`

**Customer:** AI agent pipeline owner, inference marketplace, B2B data API buyer.
**Problem:** Uptime 99.66→99.46% (+60% downtime) [S36], OpenAI 99.31% (30h/6mo) [S37], SLA credits 5-25% vs $300k/hr loss, provider self-reports status, composite SLA multiplies failures.
**Current:** On-call, third-party monitoring (status pages lag tens mins), circuit breakers, fallback, error budget.
**Why fails:** Subjective "what is downtime?" (slow vs error vs empty), external incident not observable on-chain, trust poisoned (provider defines SLA to limit liability).
**Product:** Neutral SLA enforcement sidecar: globally distributed checkpoints via `web.render` probes (html/text mode probes to API docs/status + live probe endpoints), `exec_prompt` judging data quality (match≥85% fill≥80%), `run_nondet_unsafe` consensus on BREACH/NO_BREACH + evidence bundle, `emit_transfer` or attested credit claim anchored for billing dispute, cross-chain proof to billing contract (like AgentEscrow BridgeSender→Relay→Base VerdictRegistry). [S24 pattern]
**MVP:** Register API + SLA (P50≤500ms P95≤2s, error<1%), jury probes 3 URLs (status page + 2 live probes), returns ATTESTED_UP / BREACH with latency histogram + evidence hashes, attestation on GenLayer, frontend shows $50K damage vs $125 credit story.
**Distribution:** Agent orchestration platforms, inference marketplaces (already monitor). First 10: design partners with pipeline $50K pipeline damage story [S37 Explorium].
**Expansion:** SLA marketplace (multiple APIs → composite SLA product), reputation scores for APIs (like RelAI), insurance for API downtime.
**Moat:** Probe network + historical SLA data + reputation scores + billing integrations.

## 3. Agentic Commerce Trust Gap — `#1`

**Customer:** Merchants + payment networks (+ consumers).
**Problem:** 72% use AI shopping but 10% let agent buy [S31], 75% uncomfortable letting agent buy [S32], $385B at risk, Mell/3x trust retailer vs third-party, 165M x402 payments already flowing ($0.3 avg) but trust missing at verification layer.
**Current:** Human re-verify, Visa agent tokens + Trusted Agent Protocol, Stripe/OpenAI ACP vs Google UCP, manual refunds, Terms disclaim.
**Why fails:** Intent vs execution mismatch, external price/stock changed, MCP injection in product description (attacker-controlled text).
**Product:** Intent-to-execution binding + authority jury: canonical envelope (budget, mandate, price/inventory hashes at recommendation time) + execution revalidation (web.render merchant page again) + jury judging "does checkout match intent + authority + freshness?" + settlement/rollback or attested dispute, VRF anti-bribery, appeal.
**MVP:** Shopping agent demo: user mandate ("buy X ≤$50, no substitutes"), agent checkout attempt, jury shows PRICE_CHANGED / SUBSTITUTED / AUTHORITY_EXCEEDED vs OK, attestation before settlement on Base (via Hyperlane/LayerZero to merchant). Simplified: one merchant + one wallet + one jury check.
**Distribution:** Shopify/WooCommerce plugins via Stripe MCP + wallet providers — heavy BD. Needs partnership.
**Expansion:** Full agentic commerce infrastructure (identity→recovery stack 02-market-research/03) — verification layer for every agent payment.
**Moat:** Intent graph + merchant integrations + authority schema + network effects (more checkouts → better injection detection).

## 4. Fake Reviews Poisoning — `#7`

**Customer:** Consumers (indirect), but payer = honest mid-market sellers + brand protection agencies (those losing -4.4% units to fakers [S35]).
**Problem:** 30% fake avg, 43% Amazon suspicious, $770B cost 2025 → $1.07T 2030 [S34], 275M removed by Amazon (spent $500M/8k staff) but 53-day lag, FTC 1,900% ROI for fakers, indistinguishable AI reviews (42% vs 39%).
**Current:** Humans monitoring Facebook groups, platform AI filters (53-day lag mean 100+ days), FTC ban $51k/violation, lawsuits.
**Why fails:** Subjective authenticity needs taste + external info (reviewer graph, Facebook solicitation linkage) + trust (verified purchase) — small number causes majority harm but generates revenue → misaligned.
**Product:** Authenticity jury: reviewer graph overlap (web.render of reviewer profiles + graph analysis) + Facebook solicitation linkage + purchase IP/timing + content-vs-external-source `exec_prompt` judge "is this trustworthy?" staking, VRF, optimistic dispute. For sellers: "is my competitor's review spike inorganic?"
**MVP:** Submit Amazon product URL + review set, jury fetches reviewer profiles + product history, returns AUTHENTIC / SUSPICIOUS / FAKE with evidence (graph overlap, timing burst, incentivized language), attestation for takedown request/FTC complaint.
**Distribution:** Mid-market sellers losing units, brand protection agencies. First 10 via Amazon seller communities.
**Expansion:** Reputation registry for products/sellers, procurement supplier review verification (connects to #3).
**Moat:** Reviewer graph data + detection patterns + agency partnerships.

## Next: 4 → 2 Adversarial Test

All 4 go to `06-adversarial-analysis/` for: kill test, GenLayer necessity (remove/replace/unique), security models, economic models. Need to find which 2 survive economically important load-bearing test.
