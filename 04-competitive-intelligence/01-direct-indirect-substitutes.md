# 01 — Direct / Indirect / Substitutes per Finalist

## 1. Procurement/AP (#3)

| Type | Competitor | How they solve | Why they fail where GenLayer helps |
|---|---|---|---|
| **Direct** | Xelix (481M invoices), Medius, Stampli, Tipalti, Coupa | AP automation + duplicate detection + recovery audit (15-25% fee) | Rules-based near-duplicate miss; no external supplier attestation (tax registry, bank change); no bounded jury with slash for false approval; centralized model can be bribed (auditor paid by client) |
| **Direct** | Traditional recovery audit firms (KPMG/PwC) | Post-hoc manual sampling, spreadsheet, human judgment | Reactive, samples not exhaustive, 12-18mo duration, $250k-$875k if >5yr [S29] |
| **Indirect** | ERP 3-way matching (SAP, Oracle, NetSuite) | PO/invoice/receipt match deterministically | Deterministic match cannot judge price/tax correctness or clone supplier site |
| **Indirect** | Chainlink + backend AI API | Oracle for price feed + LLM judge | Chainlink for objective data (price feed) not subjective "is this legitimate supplier?" + no appeal/slashing; single AI API = trust the operator (bribery, censorship) |
| **Substitute** | Humans: AP clerk + Slack + spreadsheet, stricter controls (53%) [S30] | Manual review, 9.2 days, 14% exception | Doesn't scale, 20% no analytics, agent volume 10× breaks it |
| **Emerging** | AI agent AP tools (e.g., UpLink, Vic.ai) plus agentic ERP (OpenDeal pattern — Odoo + ENS AuditAnchor) [S24 adjacent] | AI classifies invoices, auto-codes GL | AI classifies but doesn't *prove* external truth; no neutral attestation for payment release |
| **Emerging** | Agentic commerce stack (02-market-research/03) | Odoo + x402 + ERC-8004 | Close but verification gap remains — fits GenLayer as infrastructure |

## 2. API SLA (#8)

| Type | Competitor | How | Failure |
|---|---|---|---|
| **Direct** | Uptrends (2B checks), Datadog, Pingdom, Statuspage, PagerDuty | Global probes, APM, uptime status, error budget SLO | Provider self-reports defines SLA to limit liability; status page lags tens mins; deterministic ping ≠ functional integrity (slow 15s vs error vs empty); no attested credit claim |
| **Direct** | B2B data API providers' own SLA dashboards | Self-reported 99.9% (maintenance 2-8 hrs excluded, partial degradation not counted) [S36-37] | Defines "available" as <100 req/min or counts 5xx only — illusory; example 80 req 70 failed = 87% error but SLA 100% because threshold not hit |
| **Indirect** | Chainlink + staking/slashing oracle (AgentRouter pattern) | Staked verifiers replay inference, slash on divergence | For inference exchange, but not for general API P95 latency/data-quality subjective judgment; probe diversity still needed |
| **Substitute** | Humans: on-call + third-party monitoring because status pages lag [S45] | Manual failover, aggressive caching, 5s timeouts | Backlog becomes bad decisions not delays (agent scores 800 leads as low priority with no enrichment [S38 Explorium]) |
| **Emerging** | 0G Storage / iExec attested execution, TEE inference (P1X3LZ) | Cryptographic receipts, transcript hash anchored | Receipt = execution happened, not that SLA met (needs external probe consensus); complementary not substitute |

## 3. Agentic Commerce Trust Gap (#1)

| Type | Competitor | How | Failure |
|---|---|---|---|
| **Direct** | Visa Intelligent Commerce (Trusted Agent Protocol, 100+ partners, agent tokens), Mastercard Agent Pay, Stripe/OpenAI ACP vs Google UCP | Agent tokens, Passkey, consent framework, payment rails | Happy path (holiday 2026 pilots) but **no adjudication** — docs say x402/ERC-8004/A2A "engineer happy path, none ship adjudication" [S04]; when agent buys wrong, who pays? Terms disclaim; bank decides chargeback |
| **Direct** | Internet Court (genlayer-foundation, 27 firms, LayerZero, Base USDC) [S20] | Base escrow + GenLayer jury 2-of-2 or 1-of-1 AI jury | Foundation flagship — competing directly with generic jury is competing with protocol team; but it's *infrastructure* not vertical wedge — startup must differentiate via one verification (intent/authority) |
| **Indirect** | Coinbase x402 Foundation (MS, Cloudflare, Google), AgentTrust/RelAI reputation | Identity + reputation gated escrow | Identity/reputation progress but verification/dispute still missing (stack map: payments mature, verification high gap) [S03 agentic map] |
| **Substitute** | Humans re-verify (89% verify despite 46% trust), manual refunds/chargebacks | Defeats automation purpose (why have agent if human checks?) | 3% trust before use — first failure = permanent churn [S44] |
| **Emerging** | AgentEscrow (most sophisticated GenLayer clone: multi-milestone SLA + per-dispute + Bridge to Base) [S24] | Closest to needed but still demo, not production distribution | Validates pattern but not yet infrastucture; opportunity to wed GenLayer verification to existing x402 volume ($50M already) |

## 4. Fake Reviews (#7)

| Type | Competitor | How | Failure |
|---|---|---|---|
| **Direct** | Amazon $500M + 8k staff filter, Yelp 9% + 15% suspicious, TripAdvisor 2.7M removed, Trustpilot 4.5M | Platform AI filters | 53-day median lag mean 100+ days to deletion, 43% eventually deleted but harm done; indistinguishable AI reviews (42% vs 39%); misaligned revenue (Amazon slightly loses if quietly eliminating) [S34-35] |
| **Direct** | Fake review detection startups (Fakespot (bought by Mozilla), ReviewMeta, Copyleaks AI detector) | Text pattern analysis | Pattern match fails on LLM-generated plausible reviews (growth 12.1% faster than all reviews); no graph/Facebook linkage + no attestation |
| **Indirect** | FTC rule Aug 2024 ($51k/violation) + Amazon lawsuit 10k Facebook admins | Legal enforcement | Sparse, private Facebook groups (4.5M retailers), lag large |
| **Substitute** | Consumer verification (27% verify manually per Salsify) + spreadsheets of suspicious sellers | Manual research | Doesn't scale; 86% clicked believing informative but no improvement (He et al.) |
| **Emerging** | AI detection + graph analytics (NBER Wharton reviewer graph overlap) [S35] | Structural model: shared Facebook linker, 275M removed | Graph alone not adjudicated; needs bonded jury with VRF to resist bribery + appeal for contested authenticity |
