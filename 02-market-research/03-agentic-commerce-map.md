# 03 — Agentic Commerce Stack Deep Dive

**Founder signal:** Payments, identity, interoperability may be progressing but trust/dispute remains missing. Potential layers: Identity → Authority → Reputation → Discovery → Negotiation → Agreement → Execution → Verification → Settlement → Dispute → Accountability → Recovery. Find actual bottleneck; don't assume payments. [00-mission §5]

## Map per Layer

| Layer | What it does | Who builds it | Maturity | Underserved? | Evidence |
|---|---|---|---|---|---|
| **Identity** | Agent has verifiable ID | ERC-8004, ENS subnames (`alice.agent.eth`), DID, x402 `X-PAYMENT` header | Progressing | Low | ERC-8004 spec, ENS docs, Coinbase x402 (165M payments $50M total $0.3 avg) |
| **Authority** | Agent allowed to act for principal (scope, budget) | Delegated credentials, session tokens, UCAN, Visa Trusted Agent Protocol | Pilots | Medium | Visa 2025 holiday pilots 100+ partners [S44] |
| **Reputation** | Trust score, history | RelAI, AgentTrust soul-bound NFT, Rel 1-10, 0G Storage attestations | Emerging | **High** | ETHGlobal winners RelAI/AgentTrust; docs list "Reputation claims contested in ERC-8004" |
| **Discovery** | Find capable agents | AXL, KeeperHub MCP, Google AP2 Discovery | Early | Medium | AgentTrust uses AXL discovery |
| **Negotiation** | Terms via NL, signatures | P1X3LZ transcript hash on 0G Storage anchored in Hedera escrow | Research | Medium | Only P1X3LZ demonstrates |
| **Agreement** | Canonical terms both parties signed | Ed25519 cart hash, ENS policy text record (`policyHash`), OpenDeal AuditAnchor | Early | Medium | OpenDeal/EQLTY pattern: policy-as-ENS |
| **Execution** | Agent acts (call API, move funds) | MCP tools, A2A, x402 per-request settlement | Progressing | Low | x402 foundation (Coinbase/Cloudflare/Google) |
| **Verification** | Did agent fulfill agreement? | **Missing** — detached canonical envelope + dependency hashes + intensive jury | **Very High** | Best signal: Forrester 75% uncomfortable letting agent buy; Bain 72%→10% gap [S31-32] |
| **Settlement** | Money moves, attribution | Stablecoins, Stripe/ Visa agent tokens, Base Sepolia VerdictRegistry via LayerZero | Progressing | Low | Internet Court Base USDC escrow [S20], AgentEscrow bridge [S24] |
| **Dispute** | Disagree → who decides? | **Missing** — Internet Court, AgentEscrow per-dispute contracts | **Very High** | No GenLayer demos do rich disputes well; only AgentEscrow has per-dispute + bridge |
| **Accountability** | Who is liable, slashing, remediation | AgentRouter stake HBAR slashing, Yale Law wild animal analogy [S43] | Emerging | High | AgentRouter pattern; legal regime unsettled |
| **Recovery** | Get money back / correct | Chargebacks, appeal windows, fast finality vs finalization | Weak | High | ContentBounty challenge windows 2d [S18]; freelance 7-day strict window pain |

## Actual Bottleneck

**Not payments, identity, or discovery — those have funding + specs.**

**Bottleneck = Verification → Dispute → Accountability → Recovery** — the "trust" half.

Evidence:
- Shoppers trust retailer agents 3x > third-party (Bain) because verification is absent for third-party.
- 33% expect regular agentic shopping in 1yr (Visa) but 75% won't let agent pay → trust gap is conversion blocker for $385B [S32, S44].
- Agents become better → second-order problems compound (SoK [S33]): `agent holds money → what breaks?` Answer: not moving money (solved) but *proving fulfillment under subjective terms with external world data* (price was $x, stock was y, instruction was z, agent did q). This is exactly what Intelligent Contracts are for: `web.render` to fetch external prices + `exec_prompt` to judge fulfillment vs criteria + `run_nondet_unsafe` consensus + `emit_transfer` settlement + appeal.

## Can GenLayer Become Infrastructure Here?

**Yes, but not as generic escrow.** As **Verification + Dispute infrastructure** that other stacks call:

- **Pattern:** Frontend (Shopify/Wallet) + Backend (merchant) + x402/ERC-8004 (identity/payment) + **GenLayer (verification/dispute)** + Base/Ethereum (settlement) + Hyperlane/LayerZero (cross-chain proof). Product does NOT need to live entirely on GenLayer. [Per §7 architecture guidance: Base app → Hyperlane → GenLayer; Web2 SaaS → GenLayer adjudication; Agent framework → GenLayer trust layer]
- **Generic IC opportunity:** Internet Court already aims to be this — but it's foundation-level, undifferentiated. Startup wedge must pick **one vertical's verification** (e.g., procurement invoice truth, API SLA truth, procurement compliance) where verification is hard, repeated, valuable, and currently human/brittle. Then expand horizontally to other agentic commerce verifications (reputation graph, network effects).

**Next:** Need to map which vertical's verification is most painful/valuable/frequent. Candidates that are agentic commerce verification problems: #1 (checkout intent), #3 (procurement invoice), #8 (API SLA), #7 (review authenticity), #10 (carbon data). Scoring in `05-opportunity-map/`.

## SoK Attack Surface Relevant
- 12 cross-layer attack vectors: dependency confusion, MCP injection, authorization gap, etc. [S33]
- 4 evaluator attacks specifically: bribery, Sybil cluster, provider-evaluator collusion, front-running assignment → defenses: VRF selection, bond/slash, diversity, transparency. Direct input to `06-adversarial-analysis/03-security-models.md`.
