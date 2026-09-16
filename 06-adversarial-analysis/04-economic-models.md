# 04 — Economic Models

> **Historical economic research.** Pricing, margins, bonds, appeal economics, and dollar costs below are scenarios, not current release claims. Current measured Studio fees are in `FEE-ECONOMICS.md` and remain GEN-denominated.

**No token unless necessary (per §22).** Here: GEN is utility (fees, bonds, appeal) not product token.

## Procurement/AP (#3)

| Item | Value | Source |
|---|---|---|
| **Who pays** | CFO/AP team (buyer) indirectly via leakage prevented; or accounting firm partner who monetizes 15-25% recovery fee → can charge 10% prevention fee | S30 Xelix, ACFE |
| **Why they pay** | 0.35% leak = $3.5M/B → attestation prevents duplicates, fake suppliers (BEC avg $1.2M/yr [S30]), tax errors | S29-30 |
| **Cost to serve** | LLM 2 calls (~$0.01 OpenAI) + WebDriver 1-3 renders (~$0.001) + GenLayer gas (~0.05 GEN ≈ $0.005-0.02, estimate via `estimate-fees` [S13]) + probe/monitor hidden = ~$0.02-0.05 per invoice | S06 cost drivers |
| **Price** | $0.10-0.50 per invoice or 10% of prevented leakage or $2k/mo subscription for 10k invoices. Benchmark: manual cost $9.40 invoice [S30] → 20-90× margin. Recovery audit 15-25% fee → prevention can claim 10%. | S30 |
| **Gross margin** | (0.30-0.10)/0.30 = 66-90% if batch attestations; lower if per-invoice immediate finality (fast finality costs more). Without batching: ($0.30 price - $0.05 cost)/$0.30 = 83% | Derived |
| **Incentives** | Submitter (AP clerk) not incentivized to fake; supplier incentive to be VERIFIED (get paid faster); challenger (supplier) posts bond to dispute FLAG → loses bond if jury upholds FLAG | ContentBounty bond 5% [S18] |
| **Abuse vectors** | Invoice flooding to farm reputation → rate limit per supplier; supplier faking domain (new domain) → reputation 0 not trusted; collusion buyer+supplier vs jury → need appeal to double validators | S33 |
| **Agent economics** | AP agent (if autonomous) pays per-check from budget; checks become machine-speed (10× volume). At $0.05/check, 100k invoices = $5k cost to prevent $350k leakage — ROI 70×. | Derived |
| **Break-even** | Need $3.5M leakage/B → $350k at $100M spend; even 100 leaks caught at $10k = $1M saved vs $5k cost. | |

**Sensitive:** If supplier data is authenticated (bank), web.render fails → must scope MVP to public-signal invoices (duplicate, price, tax) where web suffices; bank-BEC wedge deferred.

## API SLA (#8)

| Item | Value | Source |
|---|---|---|
| **Who pays** | API buyer / pipeline owner (suffers $50K pipeline damage vs $125 credit [S37]) or agent orchestration marketplace (takes % of inference). Not provider (disincentivized). | S37 |
| **Why they pay** | Downtime $9k/min [S45], $300k/hr [S36], composite SLA 99.5% for 5 services [S45]; attested breach unlocks credit dispute from saturating to winning; plus selection (choose better API via reputation). | S36-37, S45 |
| **Cost to serve** | 3 web renders + 1 LLM per spot-check (~$0.02) + gas (~0.05 GEN) + bridge relay to Base (~$0.01) = ~$0.04-0.08 per spot-check. Continuous per-minute (52k checks/provider H1 [S37]) would be $2k/provider/6mo on-chain — not viable per-minute. So batch hourly/daily bundles off-chain, attest bundle hash on-chain (like AgentVault rootHash). | S37, S06 |
| **Price** | Subscription $99-499/mo for 10 APIs + $0.10 per attested spot-check or $500/mo for continuous polling (off-chain probe free, on-chain attestation per-breach only). Benchmark: Datadog $15/host/mo, Uptrends $20/mo, PagerDuty $29/user — our premium is *attested* vs just ping. Buyer who recovers one $5k credit covers 10mo sub. | Market |
| **Gross margin** | Off-chain probes (free on startup's infra) + on-chain only on breach: e.g., 100 probes off-chain ($0.001 each) bundle → one jury attestation $0.07 → amortized $0.0007/probe. Price $0.10 breaches-perceived = 99% margin on probes, 30% on attestation. | Derived |
| **Incentives** | Buyer incentivized to trigger spot-check when suspect breach (cost $0.10 to claim $5k); provider incentivized to challenge false breach (bond). Honest buyer not farming because false claim loses appeal bond + reputation. | |
| **Abuse** | Buyer fabricates breach by probing from degraded region → need global distributed probes not buyer-controlled; provider front-runs assignment [S33] → VRF. Rate limit per buyer. | S33 |
| **Agent economics** | Agent pipeline pays per-attestation from error budget; burst QPM≥200 [S37] at $0.10/breach amortized negligible vs $300k/hr loss. | |

## Shared Notes

- **Appeal cost:** Gas pre-paid via tip or topped [S04]; need to quote `estimate-fees --fee-preset standard --appeal-rounds 2` for MVP fee-profile (ContentBounty challenge windows 2d [S18] give time).
- **Inflation funding:** Not relevant (no token). Use GEN faucet for hackathon, then mainnet fees paid by customer (included in subscription).
- **No token:** Do not invent token; GEN is GenLayer native. If reputation token needed later, use soul-bound NFT or ENS text record (like AgentTrust), not tradable.
- **Budget constraint per 00-mission:** Prefer free/open — probes and LLM via open providers (Ollama, Heurist) for hackathon; flag if paid OpenRouter needed live jury.

## Which Is More Robust?

| Dimension | Procurement | API SLA |
|---|---|---|
| Payer clarity | **Strong** — CFO pays to stop leakage (0.35% measurable) | Medium-strong — buyer pays to enforce, but leverage vs provider varies |
| Frequency | Daily, per-invoice | On-demand spot + hourly bundles |
| Distribution | Channel via accounting firms (exists) | Marketplace via agent platforms (emerging) |
| Build cost | ERP plugin + allowlist hosts | Probe sidecar + bridge (reuses AgentEscrow pattern) |
| GenLayer fee sensitivity | Low (invoice $10k >> $0.05) | Low if batched, but per-minute naive is high |
| **Edge for startup:** | Procurement has **clearer payer + measurable leakage** but needs ERP + auth data scoping. API SLA has **clearer technical fit + more hack-feasible** but payer leverage weaker. |

Both survive economics. Final thesis will weigh.
