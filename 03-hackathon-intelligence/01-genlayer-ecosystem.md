-# 01 — GenLayer Ecosystem: What Has Been Built

**Method:** webfetch/websearch 2026-09-01, DoraHacks + GitHub verified repos. **Not counting local prior experiments as market proof** (S15-S19 are lessons only). Confidence: High where 2+ repos, Medium where 1.

## Official & Docs Baseline
- **Org:** `genlayerlabs` 46 repos, 358 followers; pinned: `genlayer-studio` (155★), `genlayer-js` (57★), `genlayer-py` (44★), `genlayer-project-boilerplate` (football-bets), `genlayer-docs` (60★), `genvm` (archived 2026-07-22 → `genvm-manager`). `intelligent-oracle` factory (Next.js + OpenRouter). [S01-14]
- **Docs canonical uses:** 1) Performance/Milestone Adjudication (bounties, freelance, chargebacks), 2) Agentic-Commerce Adjudication (x402, ERC-8004, A2A, ACP/AP2 gap), 3) Rule/Constitution Verification, 4) Adjacent (insurance/flight, content verification, DAOs, compliance). Studio preloads: Storage, LLM Hello World, Wizard of Coin, For Web Content, Football Prediction Market.
- **Flagship:** `genlayer-foundation/internetcourt` — Base USDC escrow + GenLayer AI jury + LayerZero V2, 2-of-2 mutual agree or 1-of-1 AI jury, 27-firm consortium (MetaMask, OKX, Matter Labs, 0G, 2026-07-10). [S20]

## Early Hackathon (YeagerAI 2024-08-16, 7 teams internal)
| Project | Pattern | Verdict |
|---|---|---|
| Infinite Improbability Engineers — Flight Insurance | Parametric insurance, fetch flight data, auto payout | **Winner $1k** |
| ADRValidator | Validate ADRs | Participated |
| Constitutional DAO | AI governance 2 modes | Participated |
| Roko's Mansion Game | Text adventure + ERC721, LLM master | Participated |
| Social Sentiment Trading dApp | Sentiment → trading signals | Participated |
| GitHub Bounties | Reward PR merges | Participated |

## Bradbury Builders / Nov 2025 — Core Density (verified contracts)

**1. Generic Escrow / Freelance / Bounty — 9+ clones**
- `ODbeke/tribunal` — `create_escrow(provider,title,terms,deadline)->submit_work->approve/raise_dispute->arbitrate(PAYOUT/REFUND/SPLIT)` 10% tolerance [S22]
- `Ridwannurudeen/freelance-escrow` — tutorial same flow + Vue
- `clicheman/freelance-court` — fetches `gl.get_webpage()` live, 5 validators
- `kmgdz/bounty-hunter-genlayer` — `post_bounty(payable)->submit_solution(url)->judge_submission(web.get+exec_prompt+prompt_comparative)->emit_transfer`
- `Chinny070/consensus` — Consensus primitive + Freelance, criteria freeze, pull-claims
- `greyw0rks/genlayer-dispute-resolution` — GPT-4/Claude/Gemini 5 validators
- `Frankznation/genlayer-task-verifier`, `thorbh2/tribune`, `aspro45/tribune`, `assmore22/cadence` (SLA escrow)

**2. Prediction Markets / Oracle — 11+ clones (MOST saturated)**
- `Investorquab/prediction-market` / `GenMarket` (0x3CF8 Studionet), `hieuwb/Prediction-Arena-Genlayer` (3D, R3F), `Odig0/aleph-hackaton-hyphe` (hyphe_market/oracle/token), `PhiBao/predictify` (Polymarket Gamma→Supabase→Resolver), `LuanXich/genlayer-realworld-oracle` (strict_eq JSON), `yeagerai/intelligent-oracle` factory, `thorbh2/verdict` (30w/24r, claim→stake→review→challenge→appeal→resolve), variants `signalcourt` (0x941c), `arbiter` (0x7353 36+24), `aspro45/quorum` (0x7960), `assmore22/canon` fact registry, `demarco2016/genlayer-contracts`, `jforex/genlayer-hello-contract` FactChecker

**3. Sentiment Oracles — 5**
- `theonlysol/genlayer_sentimenet_oracle` (CoinGecko+CryptoPanic→BULLISH/BEARISH/NEUTRAL, run_nondet_unsafe), Rajuice AI Sentiment Oracle (1-10), `kmgdz/genlayer-ai` (5 toys), Social Sentiment Trading, tutorials 1-10 via `gl.call_llm`

**4. Moderation/Content — 6 shallow**
- Rajuice AI Content Moderator (SAFE/FLAGGED), Alice501 ContentModerator, said1235 ContentValidator, `Chinny070/EchoCourt` (meaning court: interpretation/intent/impact/charter/remedy 8-way), `typakon4/ai-dao-moderator`, `moltlayer.fun/GenLayer Moderation` (keep/limit/remove)

**5. Governance/DAO — 4**
- `typakon4/ai-dao-moderator` (Gatekeeper + Argument Scorer 1-10), Constitutional DAO, `congab91-maker/sponsorguard` (influencer 3-tranche, recheck after `next_check_at`, COMPLIANT/WARNING/MAJOR_VIOLATION/REMOVED) [S26]

**6. Agent Coordination/Agentic Commerce — 3-4 emerging**
- `zan-maker/genswarm-contract` / `GenSwarm` (0xe19e Bradbury, stigmergy pheromone, zero-token LLM-chat avoidance) [S25]
- `dorahacks.io/buidl/42088 AgentEscrow` — most sophisticated: multi-milestone + SLA monitoring `prompt_non_comparative` + per-dispute Internet Court contracts + BridgeSender→Relay→Base Sepolia VerdictRegistry (22 endpoints, 13 MCP) [S24]
- `genlayer-foundation/internetcourt` [S20]
- `Oragami/GenZLease` — RWA leasing (land/property) escrow/dispute

**7. Toys/Demos — low startup value**
- Wizard of Coin, 5-contract AI suite, Proof of Che cultural scoring, GitHubProfilesSummaries

**Gotham Court:** `PhiBao/gotham-court` (2026-03-26) — dispute + parimutuel betting: file→defense→bet GEN (Guilty/Not Guilty/Insufficient)→AI judgment `web.render`+`exec_prompt`→proportional payout `emit_transfer`. [S23]
**Crypto News Hub:** Not found as distinct GenLayer repo; likely sentiment-oracle variant/tutorial. Low confidence exists standalone.

## Scale
- Bradbury Builders (Mar 20-Apr 3 2026, DoraHacks, $5k+ prizes, dev-fee 10-20%) ~90 public projects (Surf AI estimate), 201 hackers (DoraHacks) [S21]
- `0x03sol/GenLayer-Incident-Response-Playbook` — 16 contracts, 8 vulnerable/patched pairs (URL Rot, Prompt Injection, API Key Leak, Wrong Equivalence, Missing Access Control, Anti-bot Wall, Validator Disagreement, URL Spoofing) — proves most demos ignore production guards.
