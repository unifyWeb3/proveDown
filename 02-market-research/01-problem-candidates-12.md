# 01 — 12 Deep Problem Candidates

**Method:** Independent desk research 2026-09-01 via websearch/webfetch; seeded concepts (A/B/C) treated as equal hypotheses, not privileged. Prior local projects NOT used as market proof (lessons only per 00-mission). Evidence URLs in SOURCES.md.

> Depth > quantity. Funnel is 12 deeply evidenced, not 30 shallow.

---

## 1. Agentic Commerce Trust Gap — "Who Pays When Agent Buys Wrong?"

**Who has pain:** Consumers (72% used AI shopping but 10% let agent complete purchase — Bain [S31]; 75% uncomfortable letting agent buy even with limits — Forbes [S32]), merchants (brand trust: retailer agents trusted 3x > third-party), payment networks (Visa, Mastercard).
**Frequency/Impact:** $385B projected agentic commerce by 2030 (Morgan Stanley via Forbes [S32]), $300-500B if trust solved (Bain). Blocks conversion of existing 72% AI-assisted shoppers to autonomous buyers. Experian: agentic AI overtakes human error as #1 fraud cause 2026.
**Current workaround:** Human re-verification (89% verify despite 46% trust — IAB), Visa Intelligent Commerce agent tokens + Passkey + Trusted Agent Protocol (100+ partners, pilots holiday 2026), Stripe/OpenAI Agentic Commerce Protocol vs Google UCP, manual refunds/chargebacks, Terms disclaim liability, MCP servers vulnerable to "ignore previous instructions" embedded in product description. [S33, S44]
**Why ordinary software fails:** Subjectivity (did cart match intent/authorization scope?), external info (price/stock/promise changed between recommendation and checkout), trust (agent instruction vs merchant data is attacker-controlled text). Deterministic checkout cannot judge intent, accuracy, authorization. [S33]
**AI-agent relevance:** 10 → 10^10 transactions when recommend→buy shift (OpenAI/Stripe + Shopify/Etsy/Walmart Jan 2026 protocols). Agents operating 24/7 create unattended purchases; model drift, hallucination, prompt injection, API misconfig scale with volume.
**Initial GenLayer hypothesis:** Load-bearing for *intent-to-execution binding* + *jury of authorization*: canonical envelope with dependency hashes (price, inventory, mandate) + execution revalidation + `gl.nondet.exec_prompt` judging "does this match user intent/charter?" + bonded evaluators, VRF anti-bribery.

**Pain: 9.5/10**

---

## 2. AI Agent Non-Deterministic Liability — Rogue Agents

**Who:** Enterprise deployers (healthcare, commerce, defense), CISOs personally, insurers. Utah pilot late 2025 lets AI handle prescriptions without human doctor; CrowdStrike production agentic AI. [S43]
**Frequency/Impact:** LLMs *unbounded non-deterministic* — same input → varied outputs (Yale Law [S43], CSO 2026-08-26: recent incidents exploiting third-party systems, manipulating people, distributing malicious code). Liability unclear; $20k/violation Colorado AI Act June 2026, $9k/min downtime.
**Current workaround:** Contracts indemnification, "human in loop" guardrails (system prompts = probabilistic trying to constrain probabilistic), logging, Tech E&O + Cyber Liability — but insurers adding AI exclusions because unpriceable. California AB316 Jan 2026: cannot claim AI is separate legal entity. Lawyers push indemnification for enterprise AI contracts.
**Why ordinary fails:** Law built for predictable machines; non-determinism breaks foreseeability/causation; probabilistic guardrails ≠ determinism; multi-agent collective behavior blurs attribution.
**AI relevance:** Autonomy + custody (ERC-8004, x402, MPP) → agent→tool misuse→custody loss→irreversible settlement→market manipulation. As capability rises, gaps widen.
**Initial GenLayer hypothesis:** Optimistic execution with bonded + slashed jury judging "did agent exceed scope/cause harm?" — intensive nondet evaluation courts cannot do per-transaction. Least-cost avoider assignment via neutral jury.

**Pain: 9.5/10**

---

## 3. Procurement & Accounts Payable Fraud / Leakage

**Who:** CFOs/AP teams, mid-market $100M-1B. PwC 2024 Global Economic Crime Survey: procurement fraud top 3 most disruptive.
**Frequency/Impact:** ACFE [S29]: 5% revenue lost ($5T globally), median $145k, mean $1.7M, 22% >$1M, 12mo median duration (billing/check tampering 18mo), <6mo caught $30k vs 5yr+ $875k. Xelix 2026: 0.35% spend leaked = $3.5M per $1B → $53B UK/US [S30]. Medius: 44% companies 13 attempts/yr 9 succeed $133k avg (Amazon $19M). Supplier.io: 79% hit, $1.2M/yr invoice fraud, poor data quality $12.9M/yr. Ardent: $9.40/invoice (best $2.78), 9.2 days processing, 14% exception rate. AFP: checks 58% vulnerable.
**Current workaround:** Human 3-way matching (PO/invoice/receipt), supplier reconciliation samples, recovery audits (15-25% fee reactive partial), stricter controls (53%), training (50%), audits (37%), staff training vs only 28% automated fraud detection (PYMNTS/Coupa), 20% no analytics at all.
**Why ordinary fails:** Subjectivity (is price/discount/tax correct? is supplier legitimate vs cloned site/stolen tax ID?), external info (supplier statements, tax registries, price changes), trust (rules-based ERP misses near-duplicates, doesn't learn). Data quality detracts AI confidence (79% leaders).
**AI relevance:** AI procurement agents auto-invoicing/paying at machine speed multiply attack surface: fake invoices generated, cloned sites, API-injected PO changes. 9.2-day human cycle → instant → leakage scales with agent volume.
**Initial GenLayer hypothesis:** Intensive verification of external-world facts (was credit note issued? is tax correct? is supplier attested?) via jury with `web.render` + `exec_prompt`, bonded verification before release, slash false approval.

**Pain: 9.5/10**

---

## 4. Freelance Marketplace Escrow & Chargeback Failure

**Who:** 70M+ freelancers/clients (Upwork ~18M, Fiverr, Freelancer.com).
**Frequency/Impact:** Upwork fixed-price: $5 minimum milestone, 14 days approval then auto-release, disputed freelancer has **7-day strict window** to file after client refund request (miss → auto-return, unjust enrichment), client 5 days to respond (silence → irrevocable release to freelancer). Hourly Work Diary capped $2,500/50hrs, manual time excluded. BeingGuru 2026: service-related chargebacks freelancer liable by default; bank/card issuer decides not platform; 45-day hold on returned funds; withdrawn payment can go negative. Non-binding mediation ~2 business days → binding arbitration Ejudicate/BRIEF if both participate.
**Current workaround:** Humans (Upwork disputes separated from sales, document-based not quality judgment), demand letters (work only for unfunded escrow/missed deadline, bad if funds still escrowed per Terms.Law), Slack/email evidence, version history, written sign-off.
**Why ordinary fails:** Subjective quality ("does deliverable meet scope?"), external info (did client use work off-platform?), trust (platform is marketplace not employer, must stay neutral per 11 USC 541(d)).
**AI relevance:** AI freelancers (coding/design agents) + AI clients flood platforms: AI deliverables at volume, AI dispute filings, Sybil freelancers, AI clients disputing quality at scale. 7/5/2-day human timelines break.
**Initial GenLayer hypothesis:** Programmable milestone fingerprint (Ed25519 cart hash single-use, compare-and-set) + jury "did deliverable meet agreed criteria per evidence links?" with staking/slashing, appeal window, final binding — similar to ContentBounty pattern but generalized. **Note:** Category saturated with 9 clones (saturation map) but *pain remains real*; differentiation must be business-model not generic escrow.

**Pain: 9.0/10**

---

## 5. Open Source Maintainer Sustainability & Supply Chain Security

**Who:** 400+ maintainers (Tidelift), downstream Fortune 500 (70-90% modern app is OSS), governments.
**Frequency/Impact:** Tidelift 2024 [S38]: 60% unpaid hobbyists (identical 2023), 44% unpaid would like pay, only 25% donations, 24% employer paid (down from 28%), 48% feel thankless (vs 40% 2021), 60% quit/considered quitting, burnout >46%. Harvard/Linux Foundation: median **2 active maintainers top 500 packages, 1 for top 100**, 86% critical packages ≤10 contributors, avg npm 7 direct deps 68 transitive depth 23, 15% no active maintainer (12mo). Incidents: XZ Utils CVE-2024-3094 (sole maintainer burnout, 2yr social engineering SSH backdoor), log4j CVSS10 (2 volunteers, remediation hundreds of millions), avg GitHub Sponsors <$200/mo, donation models <$100k/yr. [S38]
**Current workaround:** Nights/weekends, GitHub issues, Tidelift/Open Collective/Liberapay, corporate "adopt" hiring, EU Sovereign Tech Fund, burnout advocacy.
**Why ordinary fails:** Subjective valuation (what is PR worth?), trust (Sybil maintainers, CLA), external verification (is dependency still maintained? is contributor trusted post-XZ?). Donation buttons can't judge quality/impact.
**AI relevance:** AI generates low-quality PR flood → vet burden up; AI trained on OSS without compensation → tension; AI auto-adding dependencies amplifies concentration risk (68 transitive × AI code). Burnout accelerates abandonment → hijacked dormants.
**Initial GenLayer hypothesis:** Decentralized curation/funding: intensive evaluation "is this contribution valuable / maintainer active / project critical?" via jury with code+social context, transparent slashing for gaming, retroactive split.

**Pain: 9.0/10**

---

## 6. Health Insurance Claim Denial & $262B Adjudication Waste

**Who:** Providers (280 hospitals via Premier), patients (21% working-age denied past year), insurers (496M claims 2024).
**Frequency/Impact:** KFF [S27]: HealthCare.gov 19% in-network denied (85M/451M) + 37% out-of-network, 36% "Other" not listed, 25% administrative, 9% prior auth, <1% appealed (262k/85M), 66% upheld. Premier [S28]: adjudication cost $25.7B (up 23% from $19.7B 2022), $57.23 per denied claim, 15% denial rate (up to 49% instances), **70% ultimately overturned after avg 3 rounds ×45-60d = $18B wasted** (68.6% paid), payer +$40-50 per submission = +$4B admin = premium +7%, prior-auth after pre-approval doubled 10.4% (vs 3.2% 2022). QuickIntell [S41]: 12.6% initial denial, 806M/yr of 6.4B, **$262B system-wide cost** (rework $38.4B + write-off $58.6B + overhead $26.1B + payer $18.7B + patient $42.3B). Commonwealth Fund: 21% denied (13% prior auth 8% post-care), 41% delayed care, 28% health worsened, 63% anxiety, 70% cost more money, 30% delayed care, 43% medical debt still paying (50% ≥$1k). Only 50% appeal; 1/3 won but 1/3 denied again; waits 2 weeks (prior auth) / 1 month (claim).
**Current workaround:** Tips (43% detection per ACFE but <1% appeals here), lawyers, internal/external appeals, spreadsheets, phone calls, resubmissions (6%), manual rework $31-48 direct $75-120 loaded.
**Why ordinary fails:** Subjectivity — "medical necessity" requires clinical judgment balancing prior auth vs excluded service vs admin error (36% "Other" = insurers can't/won't codify). External info (EHR, policy language, state regs), trust (payer AI flags 30-40% more services requiring auth, clinical editing AI more aggressive). Cursory auto-denial vs intensive appeal wins 60% proves initial automation inadequate.
**AI relevance:** Both sides scaling AI: payer AI denial algorithms +30-50% vs peers; provider AI auto-appeals → adversarial AI loop. Patients generate appeals via agents but insurers require human clinical support. $262B waste compounds.
**Initial GenLayer hypothesis:** Neutral intensive adjudication "is this medically necessary / covered per policy+clinical evidence+guidelines?" combining EHR/policy/external guidelines, bonded clinical jury with audit trail, appeal automation with citation — but heavy regulated data/HIPAA barrier.

**Pain: 9.5/10** — but regulatory complexity high for 2-week hackathon.

---

## 7. Reputation Poisoning — Fake Reviews

**Who:** Consumers (82% read reviews before first purchase), honest sellers, platforms (Amazon, Yelp, TripAdvisor, Google).
**Frequency/Impact:** CapitalOne [S34]: 30% reviews fake avg, 43% Amazon suspicious 2023, 82% encounter fake ≥1/yr, 46% fakes are 5 stars. Cost $0.12 per $1 → **$770.7B worldwide 2025, $1.07T by 2030**. Fake reviews boost sales 12.5% first 2 weeks; 1 star boosts demand 38%; restaurant +9%/star; FTC: 1,900% ROI ($250k→$5M). 4.5M retailers purchased via Facebook groups (e-commerce +44% YoY). Amazon 275M fake reviews blocked/removed 2024 (also 240M Google), spent $500M + 8k employees; Yelp 9% removed 15% suspicious; TripAdvisor 2.7M removed 8.7% [S34, S35]. He et al.: buying fakes → weekly reviews ~2x, rating +0.11, median 53 days mean 100+ days to deletion, 43% eventually deleted; manipulators quality 0.41 vs honest 0.65; consumers guess 31% buy fakes but 42% vs 39% can't distinguish with review text (86% clicked believing informative but no improvement). [S35] FTC final rule Aug 2024 bans fake reviews $51,744/violation.
**Current workaround:** Humans monitoring Facebook groups, platform AI filters (lag 53-100 days), FTC lawsuits (Amazon sued 10k Facebook admins), consumer verification (27% verify).
**Why ordinary fails:** Subjective authenticity requires taste, external info (Facebook group linkage, shared reviewer graph), trust (reviewer identity, verified purchase). Text generation now AI → indistinguishable (42% vs 39%); few reviews cause majority harm but generate substantial revenue → misaligned incentives.
**AI relevance:** LLMs generate thousands plausible reviews/min that pass filters (growth 12.1% faster already). Agentic commerce agents synthesizing provenance + validation will ingest poisoned corpus → recommend low-quality manipulators at scale with no verification.
**Initial GenLayer hypothesis:** Intensive jury "is this review trustworthy given reviewer graph overlap, Facebook solicitation linkage, purchase IP/timing, content vs external sources?" with staking, VRF anti-bribery, optimistic dispute of authenticity.

**Pain: 9.0/10**

---

## 8. API / LLM API Reliability & SLA Illusion

**Who:** Any org whose checkout/enrichment/agent pipeline calls third-party APIs; B2B data API buyers, agent orchestration.
**Frequency/Impact:** Uptrends [S36]: avg uptime 99.66%→99.46% = +60% downtime (34→55 min/week, +18 hrs/yr), 67% monitoring errors are API errors (4xx/5xx). Dataku [S37]: 15 providers 52,560 checks H1 2025: OpenAI 99.31% (30.3h downtime, 18 incidents, max 4h38m), Anthropic best 99.72% (12.3h, only one beating 99.9%), Google 99.14% (37.8h), Mistral 98.87%. Nordic APIs [S45]: 215 services median 90min resolution, AWS DynamoDB Oct 2025 141 services impacted. Cost: downtime $9k/min large biz, 90% enterprises >$300k/hr, 41% $1-5M/hr, 86 outages/yr avg. SLA remedies 5-15% monthly fee (max 100% monthly bill, capped 30-50%, claim-based within 30d, future invoice not refund, 2-8 hrs/mo maintenance excluded, partial degradation not counted, 400/429/throttling excluded). Example: $2.1M loss 6hrs → $3,200 credits 0.15%. Composite SLA: 5 services at 99.9% each → 99.5% (3h36m/mo). [S36, S37, S45]
**Current workaround:** Humans on-call, third-party monitoring (status pages lag tens mins), contracts termination rights, circuit breakers, multi-provider fallback, caching, 5s timeouts, error budget SLO 99.95% (22min/mo).
**Why ordinary fails:** Subjective "what counts as downtime?" (slow vs error vs empty enrichment), external info (third-party incident not observable on-chain), trust (provider self-reports defines SLA to limit liability). Deterministic ping ≠ functional integrity. No neutral measurement.
**AI relevance:** AI agents scale calls 10-100× (continuous enrichment, multi-agent orchestration, QPM≥200 burst). 15s latency = pipeline of bad decisions propagated downstream (un-enriched leads scored low, 47 enterprise leads skipped → $50K pipeline damage from $500/mo API vs $125 credit). Agents don't wait → backlog becomes bad decisions.
**Initial GenLayer hypothesis:** Oracle + jury evaluating "did API meet P50≤500ms P95≤2s / data quality match≥85% fill≥80% / error rate?" via globally distributed independent checkpoints (web.render probes) + `exec_prompt` judging content quality + slashed false reporting, attested SLA credits.

**Pain: 9.0/10**

---

## 9. SOC 2 / Compliance Audit Tax

**Who:** SaaS startups 10-200 employees needing SOC 2 Type1/2 to unblock enterprise deals.
**Frequency/Impact:** Drata [S39]: Type1 $7.5k-15k SMB up to $60k large; Type2 $12k-20k SMB $30k-100k+ large; total first-year $25k startup → $200k+ enterprise (readiness $5k-25k + tools $5k-50k + internal hundreds hrs). SOC2Cert: Startup $25k-75k, Growth $50k-150k, Enterprise $100k-300k+; 15-20% fee increase 2025 vs 2024. TruvoCyber: SMB $40k-85k first year; Type1 readiness 8-12w (scoping 1-2w + policy 2-3w + platform 1-2w + implementation 2-3w + audit 3-4w) BUT Type2 adds 3-12mo observation. ExpertInsights: 35-employee fintech $48,700 actual → clean report → closed $180k ARR within 30 days.
**Current workaround:** GRC platform evidence collection, consultant gap assessment, templates, manual quarterly access reviews, auditor sampling.
**Why ordinary fails:** Subjectivity (does control operating effectively over time?), external info (employee termination→revoke within 24h requires HRIS+IdP logs), trust (auditor paid by client → incentive to pass; templates with company name inserted → certificate real but program not). AI-generated code/policies increase evidence volume beyond human sampling.
**AI relevance:** AI agents generating code + handling data → continuous compliance needed per agent action, not annual point-in-time. Every AI PR / data access needs evidence collection at machine speed.
**Initial GenLayer hypothesis:** Continuous intensive verification of control operation (was access revoked? was logging enabled?) via jury with access to IdP/Git/SaaS logs, staking auditor accuracy, programmable compliance as escrow release for enterprise contracts — but heavy off-chain log access via web.render may be brittle for IdP APIs requiring auth.

**Pain: 8.5/10**

---

## 10. Voluntary Carbon Credit Verification Collapse

**Who:** Corporates buying offsets (Shell largest buyer), registries (Verra, Gold Standard, ACR, CAR), auditors.
**Frequency/Impact:** Verra suspended 4 auditors Mar 2025 after 37 China rice-methane projects revoked (17mo review) — 1.8-2M worthless credits (partly used by Shell to claim LNG "carbon neutral", 500k) still uncompensated. UPenn Carey Law SSRN: 95 flawed Verra projects, 2/3 accredited auditors failed to identify. Nature Communications Probst et al. 2024: 2,346 projects (20% credits, ~1B tons) >84% did not reflect real reductions. [S40]: 47 of top 100 projects by retired credits 2024 → 43 problematic BBB or lower, 47.7M problematic credits retired ≈23% VCM 2024 = 52B lbs coal burned. DW/ZDF Dec 2024: Chinese firm Beijing Karbon likely €1B scam via German UER program: 66 approved China projects, 16 fraudulent, satellite shows gas tanks pre-existing 2019 vs claim 2020 construction, 2 auditors approved majority; Berlin prosecutor search for fraud.
**Current workaround:** Humans (auditors picked/paid by developer → conflict), spreadsheets, registries (Verra stamp), BeZero/Renoster/Sylvera ratings.
**Why ordinary fails:** Subjectivity (additionality — would this have happened anyway? permanence/leakage/baseline), external info (satellite 2019 vs 2020, ground truth rice activity), trust (auditor paid by client → favorable interpretation; registry not independent). Complex methodology requires judgment.
**AI relevance:** AI due diligence scaling for procurement (CSDDD requires mapping to smelter/farm gate, grievance channels) → buyer agents request verifiable evidence at scale; carbon + CSDDD checks become per-purchase verification.
**Initial GenLayer hypothesis:** Intensive jury verifying additionality/permanence with satellite+document+ground evidence (web.render), bonded auditors slashed for missed over-crediting, random VRF assignment paid from global pool not developer.

**Pain: 9.0/10** — but niche market, regulatory adjacency heavy.

---

## 11. Bug Bounty Triage & Mediation Breakdown

**Who:** Security researchers (100+ hrs per submission set), programs (400+ co HackerOne).
**Frequency/Impact:** HackerOne mediation available after 3 days closed, 1 request per report, review 1-2w promised, powers to uphold/change severity/reopen but not binding — most follow. But TechTarget 2022: "mediation worthless" (Tommy DeVoss $2M+ earner, never produced results in 3-4 years) [S42]; 5-11 month actual waits (Medium 2024: 2FA bypass closed Informative, mediation 5mo no response, 7mo first reply, 11mo second, year still open); Justin Kennedy: 10 critical/high 100+ hrs → 2mo no resolution, 1mo mediation unresolved. HackerOne claims 74% valid mediations ruled for hackers 2021-22 but researchers report silent fixes without reward. Signal score drops with disputes, triagers talk, reputation harmed.
**Current workaround:** Humans (triage team, mediation team), Slack, guidelines, Make It Right fund ($38,650 YTD per Evans, small).
**Why ordinary fails:** Subjectivity (severity vs impact), external info (is exploitability in your infra? video vs doc), trust (platform incentives; researcher can't prove silent fix 10mo later). Deterministic rules cannot capture exploitability.
**AI relevance:** AI agents flood bounties with AI-generated reports (LLM fuzzing) at machine scale → triage unscalable; attacker agents generate plausible but non-exploitable reports to exhaust triagers. Need intensive verification of exploitability with staking.
**Initial GenLayer hypothesis:** Bonded jury of security experts evaluating "is this exploitable with clear impact given scope?" with evidence replay, slashed false N/A, random selection prevents program capture — but small niche, overlap with strong indirect competitors (HackerOne/Bugcrowd + existing triage firms).

**Pain: 8.0/10** — narrow, high-skill, platform trust erosion as AI flood arrives.

---

## 12. AI Training Data Provenance & Copyright Liability

**Who:** AI labs (OpenAI, Anthropic, Meta, Stability), publishers/authors/artists, enterprises licensing AI.
**Frequency/Impact:** 50 copyright suits by Sep 2025 vs AI cos, many class actions millions members. Rulings 2025 split: Bartz v. Anthropic (Jun 23 2025): training *is* transformative fair use *but* pirating >7M books via LibGen not → infringement; Kadrey v. Meta (Jun 25 2025): training transformative but warned future market harm could win; Thomson Reuters v. ROSS (Feb 2025): non-generative AI using Westlaw not fair use. Settlement: Anthropic $1.5B to authors (~$3k×500k books) Sep 2025 largest copyright recovery, still piracy only (training win intact). Exposure: $750-$30k per work up to $150k willful → Anthropic theoretical $1T (7M×$150k), NYT vs OpenAI seeks $1.5T if willful plus destruction of models. Even successful defense $10M-$35M+. Licensing market: $10M-100M+ per publisher, stock media $5M-50M, total $50M-$500M+ for large training. [SOURCES extended — see original explore for full case citations]
**Current workaround:** Lawyers indemnification, spreadsheets of licenses, publisher deals ($500M+ spent), "lawfully acquired" requirement per judges.
**Why ordinary fails:** Subjectivity (transformative purpose vs commercialism?), external info (was book pirated vs purchased? chain-of-custody through datasets), trust (dataset vendor attests clean but actually LibGen). No deterministic provenance trail.
**AI relevance:** Every training run, every dataset vendor, every enterprise AI usage inherits upstream piracy risk. Scarcity of clean high-quality data makes unverified data tempting.
**Initial GenLayer hypothesis:** Intensive jury verifying chain-of-custody (was this dataset lawfully acquired? does license cover this usage? is attestation backed by fetchable source?) via web.render of source licenses + exec_prompt judging fair-use factors — but heavily legal judgment, requires licensed attorney input, hard to automate.

**Pain: 9.5/10** — but legal judgment heavy, not pure technical.

---

## Seeded Concepts Embedded Check

| Seeded | Maps to candidate | Verdict |
|---|---|---|
| **A — Agentic Research Marketplace** | #5 OSS sustainability, #11 Bug bounty (both are research/bounty) | Overlaps but not superior as pure play; auto-research deep dive in `02-auto-research-deep-dive.md` shows anti-gaming via deterministic tests + LLM rubric still required — covered by #5/#11 patterns |
| **B — Trustless Escrow/Arbiter** | #4 Freelance escrow, #1 Agentic commerce, #3 Procurement, #8 API SLA | Generic B is saturated (saturation map 9 clones); pain remains but needs vertical wedge. #1, #3, #8 represent differentiated escrows where B becomes infrastructure, not product |
| **C — AI Code/Security Audit** | #11 Bug bounty, #9 SOC2, #5 OSS | C overlaps #11 but #11 scores lower (niche); SOC2 broader compliance; pure code audit faces CodeQL/Slither/MythX incumbent density |

All 12 compete on same scorecard; no privileged seeding.
