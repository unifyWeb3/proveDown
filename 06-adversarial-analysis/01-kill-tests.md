# 01 — Kill Tests: Why NOT Build Each Finalist?

> **Historical research record.** This compares pre-build concepts and hypothetical economics; it does not describe current ProveDown runtime or release capabilities.

## 1. Procurement/AP (#3) — Kill Evidence

| Kill hypothesis | Evidence that kills | Severity | Survivable? |
|---|---|---|---|
| Enterprise sales cycle too long for startup (12-18mo Type2 pattern [S39] analog) | Mid-market CFO needs ERP integration + security review + procurement approval; pilot → rollout 6mo. Hackathon team without ERP partnership stalls. | High | Survivable via channel: accounting firm partners already do recovery audits (15-25% fee) → sell through them, not direct. But still need proof. |
| Supplier data not public web | Bank detail change, tax ID verification requires authenticated tax registry/API, not scrapeable via `web.render` (GenVM limit: only public HTTPS, no secrets). `web.render mode='text'` fails for authenticated portals. | **Critical** | Partial: many signals *are* public (company registry, domain age, supplier portal public pages, breach databases). But bank-detail BEC (largest loss) needs bank confirmation → not verifiable via web. Could scope to *duplicate/tax/price* not bank. |
| ERP integration heavy, not hackathon demo | SAP/Oracle not sandbox-friendly; need Odoo demo [S24 OpenDeal] to mimic but enterprise uses SAP. | Medium | MVP can demo with Odoo + PDF upload, but real GTM needs SAP plugin — extra engineering. |
| Incumbents add internal LLM cheaper | Xelix already has 481M invoices + ML; adding jury internally costs 0 gas vs GenLayer fees + appeal window. Why pay for decentralized? | High | **Core necessity test later** — must prove bond/slash vs centralized bribery matters when $ disputed (supplier impersonation). |

**Kill score: Medium-High.** Biggest risk is not technical but *distribution* + *authenticated data*.

## 2. API SLA (#8) — Kill Evidence

| Kill | Evidence | Severity | Survivable? |
|---|---|---|---|
| Who pays? Providers don't want verifier; buyers need to fund | Provider defines SLA to limit liability [S36-37]; provider dashboard says 99.9% but excludes maintenance, partial degradation, <100 req threshold (80 req 70 failed = 87% error but SLA 100%). Provider incentivized *not* to have independent verifier. | **Critical** | Survive by selling to *buyer* side (pipeline owner) who suffers $50K damage vs $125 credit [S37 Explorium] — buyer pays to enforce, not provider. But buyer must have leverage to demand credits (small buyer vs OpenAI). |
| Probing cost scales, latency not hack-feasible for real-time | Need globally distributed probes + 5-min checks (52,560/provider H1 [S37]) → cost of fetch + LLM judges. On-chain per-check would be prohibitive. | High | MVP not per-minute: *attested spot checks* (3 URLs, single jury run) not continuous monitor. Defer continuous to post-hackathon infra (probe sidecar off-chain, jury attests bundles). Still defensible? |
| Status pages lag tens mins → actually helps us or hurts? | Uptrends already has 233 locations [S36]; they have probe network we don't. Tomorrow team with existing network beats us (02-emerging). | Medium | We are *neutral jury* not probe vendor; we consume probe data + judge quality, not replace ping. Positioning matters. |
| SLA is subjective by design (provider's definition) | Provider's contract says "available = <100 req threshold" → our jury saying BREACH is legally irrelevant if contract says otherwise. Need contract amendment. | Medium | Require user to register *their* SLO (P50/P95) not provider's SLA — attestation is for internal error budget/billing dispute evidence, not legally binding without agreement. |

**Kill score: Medium.** Payer is real (buyer suffers $300k/hr [S36]), neutral measurement is genuine gap (status page lag), but business model needs buyer leverage.

## 3. Agentic Commerce (#1) — Kill Evidence

| Kill | Evidence | Severity | Survivable? |
|---|---|---|---|
| Too broad — no wedge | Stack has 11 layers [S03 agentic map]; picking one innovation without wedge = generic. Visor says every hackathon team will pitch "agentic commerce trust". | High | Must wedge to *one* verification (price change authority, substitution). But is that narrow wedge enough for startup or just feature? |
| Visa/Mastercard/Foundation already building | Visa 100+ partners [S44], Internet Court 27 firms + LayerZero [S20], x402 165M payments [S44 + agentic map]. Backed by banks, cloud, wallet. | **Critical** | Competing with protocol foundation is high risk per saturation map. Even if technical, distribution vs Visa is unwinnable as small startup without partnership. |
| Requires merchant integration | Need Shopify/WooCommerce plugin + merchant to accept GenLayer-attested dispute vs their own Terms + bank chargeback system. Merchant has no incentive to accept third-party jury. | High | Could start with AI-native merchants (on-chain merchants) but that's small TAM early. |
| User not payer? | Consumer wants protection but won't pay per-transaction fee; merchant won't pay for extra friction; network must subsidize. Who funds gas/appeal bond? | High | Could be included in payment rail fee (basis points). But need rail partnership. |

**Kill score: High.** Largest market but also most competitive + requires integration with incumbents who already own payment rail. Could validate thesis later but not as first wedge before Sep 3.

## 4. Fake Reviews (#7) — Kill Evidence

| Kill | Evidence | Severity | Survivable? |
|---|---|---|---|
| Amazon owns data + filter + revenue misaligned | Amazon $500M/8k staff, 275M removed but Wharton [S35]: Amazon slightly *loses* revenue if quietly eliminating fakes (sales down) → incentive to appear but not fully solve. Why would platform pay startup to remove revenue? | High | Target *sellers* not platform — sellers losing -4.4% units to fakers pay for takedown evidence, not platform. Smaller but real. |
| Facebook private groups not scrapeable | 4.5M retailers purchased via private Facebook groups (e-commerce +44% YoY) [S34]; private groups require login → `web.render` cannot fetch without auth (GenVM no secrets). Graph linkage limited. | **Critical** | Survive by not needing Facebook linkage: use public reviewer graph overlap (same reviewers across products, burst timing, incentivized language) + purchase IP not needed. He et al. shows detection via daily scrape of Amazon alone (price/rating/search position) without Facebook. So still feasible but weaker. |
| Detection is text pattern → saturated | Fakespot/Mozilla, ReviewMeta already do text analysis; no evidence sellers will pay for slightly better LLM jury vs free tool. | Medium | Differentiation: *attested* authenticity for FTC complaint / takedown, not just score. But willingness to pay unproven: need brand protection agency interviews. |
| Frequency vs defensibility | Reviews per product ~weekly ~2x when buying fakes [S35] — not daily transaction like procurement. Retention lower. | Medium | Could be daily if monitoring many SKUs, but not as infrastructural as procurement/API. |

**Kill score: Medium-High.** Real pain $770B but payer is fragmented mid-market sellers (not enterprise), data access gated, competition includes platform itself.

## Summary Kill Ranking

| Finalist | Kill score | Highest kill | Proceed? |
|---|---|---|---|
| **#3 Procurement/AP** | Medium-High | Authenticated bank data + enterprise sales | Yes — but scope to public signals, sell via channel |
| **#8 API SLA** | Medium | Who pays (provider won't) | Yes — sell to buyer, spot-check MVP |
| **#1 Agentic Commerce** | **High** | Broad + foundation + merchant integration | **Cut** — best market but worst startup timing before Sep 3; defer as expansion after vertical wedge validates |
| **#7 Fake Reviews** | Medium-High | Private groups + payer fragmented | Cut — narrower than #3/#8, lower retention/infra potential |

**Decision: Carry #3 and #8 forward to 2 → adversarial depth. #1 and #7 become explicit non-winners for now — document kill criteria and keep as expansion candidates if thesis pivots.**
