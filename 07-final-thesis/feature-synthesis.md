# Feature Synthesis — Primitives Pool → ProveDown

> **Historical feature-selection record.** Only the narrow functional-SLO attestation path described in `CORE_NOW.md` is implemented. Appeals, polling, settlement, cross-chain, procurement, and other extensions below remain deferred unless explicitly marked current elsewhere.

**Date:** 2026-09-03
**Rule:** Combine strongest primitives from multiple researched ideas *around ONE customer/problem/workflow* (pipeline owner, functional SLO breach, neutral attestation). Do not bolt features because they sound impressive.

**Pool evaluated:** agentic research / contribution verification, dispute resolution, multi-party settlement, code/security verification, procurement/RFP verification, reputation, cross-chain attestations, agent SLA verification, incident-response guards.

---

## Classification — Per Second Requirement (CORE / REINFORCING / 90-DAY / LONG-TERM / IRRELEVANT)

### CORE — Required to prove thesis (must build Sep 3-17, strengthens SAME workflow)

| Primitive | Source | Why CORE | Where in MVP |
|---|---|---|---|
| **Functional SLO jury** (not status page ping) | Procurement #3 repurposed as quality SLO, plus ArcSLA missing DisputeModule | Thesis: quality fill/match not uptime is where LLM jury adds beyond Pingoru $15 / Updog free | `contracts/provedown.py: request_attestation` 1× web.render bundle + exec_prompt breach bool, `hosting/bundle-worker` 116-char presets |
| **Evidence bundle hash** | ContentBounty SHA256, dispute_court_v2 3k per source, TrustTrace Merkle | Proves bundle being judged is bundle returned by worker | `evidence_hash sha256:9566a...` explorer |
| **Consensus on breach bool only** | Technical validation 05 §3 reason drift | Reason noisy, breach stable 3/3 → bool not reason | `validator_fn:244` breach only |
| **Neutral attestation + reputation** | ArcSLA Bayesian `(good+2)/(total+3)`, RelAI | Settlement-grade + selection signal | `TreeMap reputation` 66→60/75 |
| **INCONCLUSIVE / UNDETERMINED first-class** | Gym currently unresolvable honesty | Honest split at threshold (2100 ambig) not false definitive | `no_consensus`/`inconclusive` amber |
| **Mock bridge proof** | AgentEscrow BridgeSender→Relay→Base | Shows downstream without multi-chain | `BridgeProof` hash mocked per readiness §9 |
| **Sanitize + DATA framing** | dispute_court_v2 greybox_sanitize, injection 2/2 resisted | Prevent `ignore previous` → false verdict | `greybox_sanitize` + `<SYSTEM><BUNDLE>` |

**All 7 CORE already in `contracts/provedown.py:1` 362 lines + `worker.js:1` + `tests:5` passed.** No kitchen-sink.

### REINFORCING — Could strengthen same core workflow without being MVP, but must earn place

| Primitive | Source | Why REINFORCING same workflow | Decision |
|---|---|---|---|
| **Automation** (auto attestation when bundle breaches) | Agent workflows, second-order effects (agents hire agents) | Pipeline owner defines SLO once, agent auto-requests attestation when poller detects p95>threshold+500 — same verify→attest flow, just automated trigger | REINFORCING — not MVP (MVP human clicks Attest), but 30d `agent workflows` after MVP proves loop |
| **Policy** (SLO as policy, not hardcoded JSON) | Policy 02-market-research/03, procurement policy hash | SLO JSON is already policy; could be ENS text record like EQLTY policy hash for governance without redeploy — same customer, same bundle, just policy storage | REINFORCING — not MVP (TreeMap SLO is fine), but ENS policy 90d if SLO governance needed |
| **Observability** (bundle histogram shown) | Observability 04-competitive, Datadog Updog aggregated APM | Showing p50/p95/error/fill histogram in verdict card strengthens same workflow (evidence transparency) without new primitive | REINFORCING — MVP already shows p50/p95 + evidence_summary, so already included as core observability |
| **Dispute resolution** (appeal bond doubling) | Gym appeals double validators, ContentBounty 5% bond | Same attestation workflow: provider can dispute BREACH via bond, jury doubles — strengthens neutrality for same pipeline owner, not new customer | REINFORCING — MVP has simple re-jury (no bond), full doubling is 90d if dispute frequency high |

**Rule applied:** All REINFORCING primitives keep pipeline-owner workflow (SLO breach → neutral attestation → reputation/bridge) — they narrow the same path, not widen.

### 90-DAY EXTENSION — Natural 30–90 day product expansion after MVP proves

| Primitive | Source | Why 90d | Not in MVP |
|---|---|---|---|
| **Temporal randomized recheck** (`next_check_at`) | SponsorGuard 3-tranche, saturation white space | Continuous not one-shot; proves not one-shot escrow — same workflow extended temporally | 90d |
| **Reliability** (Merkle batch 100→one rootHash hourly, cost $0.001/probe) | TrustTrace 10min Merkle + Pulse hourly | Scales attestation without per-minute on-chain cost — same workflow batch | 90d |
| **Reputation marketplace** (queryable API scores) | ArcSLA live, RelAI, aggregated global intelligence like Updog | Turns per-attestation score into market price (like AgentRouter) — same API reputation strengthening | 90d after TreeMap proven |
| **Auditability** (12-month history like Pingoru, 90d Updog) | Pingoru 12 months, Updog 90d, Verifiable-SLAs merkle | Long history for SLA credit windows (30-90d) — same evidence, longer retention | 90d |
| **Procurement verification** (supplier attestation) | Candidate #3 (8.05 vs 8.17) | Same jury pattern `supplier attestation` reusing `evidence_hash` + `web.render` but needs authenticated tax registry (blocked) — same infrastructure different verifier prompt | 90d after SLA wedge validates jury |

### LONG-TERM PLATFORM — Could become infrastructure later, same jury pattern different verifier

| Primitive | Source | Why long-term | Why not now |
|---|---|---|---|
| **Multi-party settlement** | Agentic commerce 02-03 (11 layers) | Full Discovery→Recovery needs 11 layers; ProveDown is verification→dispute slice | Keep narrow |
| **Security verification** (code audit, bug bounty) | Code audit #9, bug bounty #11 | Jury could verify code PR → criteria bits like ContentBounty, but payer niche | Keep as pool |
| **Cross-chain attestations** (Hyperlane/LayerZero real) | InternetCourt, AgentEscrow | Real Hyperlane to Base needs mailbox/relay/Base deploy — mocked sufficient | Mocked proves thesis |
| **Agent workflows** (multi-agent delegation) | GenSwarm stigmergy, Clasp delegation | Multi-agent hires sub-agent and attests quality — same pattern but needs delegation framework (Clasp-like) | Keep pool |
| **Payments** (x402, CCTP, USDC escrow `emit_transfer`) | ArcSLA per-call USDC, Vestra x402 self | Payments are settlement layer on top of attestation — attestation must prove first | Payments 180d after trust proven |
| **Incident-response guards** (16-contract Playbook) | `0x03sol/Incident-Response-Playbook` | Guards harden, not prove thesis; bundle we control not adversarial | Harden post-hackathon |

### IRRELEVANT / REJECT — Do not build even long-term

| Primitive | Why irrelevant | Do not include |
|---|---|---|
| **Betting / parimutuel** (Gotham Court) | Gambling regulatory, not verification | Never (REJECT) |
| **Stigmergy pheromone** (GenSwarm) | Coordination not attestation | No (REJECT) |
| **Carbon credit verification** | Niche 90k vs API daily, needs satellite | Keep separate thesis if pivot (REJECT for ProveDown) |
| **Health insurance $262B** | HIPAA, not hack-f feasible 5.0/4.5 | Explicitly cut (REJECT) |

---

## Addendum 2026-09-04 — Hackathon Track Synthesis (CORE / REINFORCING / 90-DAY / LONG-TERM PLATFORM / REJECT)

Central workflow remains **agreement → evidence → independent evaluation → attestation → downstream action**. Classified per 2026-09-04 track update (Agentic Commerce Infrastructure, SLA enforcement via signed logs/decentralized monitoring):

| Primitive | Class | Why (same-workflow test) |
|---|---|---|
| automation (auto-request attestation on breach signal) | REINFORCING | Same verify→attest flow, automated trigger; not MVP (human clicks Attest) |
| policy (SLO JSON as versioned policy) | REINFORCING | TreeMap SLO is policy; ENS text-record governance is 90d if needed |
| reliability (Merkle batch 100→one rootHash, temporal recheck) | 90-DAY | Scales same workflow, not MVP single attestation |
| observability (p50/p95/error/fill histogram + evidence_summary in verdict card) | CORE | Already in MVP verdict card + `evidence_summary`; transparency without new primitive |
| auditability (12-mo history, Explorer fee panel, deposit vs consumed vs refund) | 90-DAY | Same evidence, longer retention + v0.6 fee panels |
| reputation (Bayesian TreeMap, queryable scores) | CORE | Settlement-grade + selection signal, already in contract |
| payments (x402/CCTP/USDC escrow `emit_transfer`) | LONG-TERM PLATFORM | Settlement layer on top of attestation; attestation must prove first |
| dispute resolution (appeal bond doubling via `appealTransaction`) | REINFORCING | Same attestation workflow, provider disputes BREACH; full doubling 90d if frequency high |
| agent workflows (multi-agent delegation, Clasp-like attenuation) | LONG-TERM PLATFORM | Same pattern but needs delegation framework |
| temporal rechecks (`next_check_at` randomized, Vercel cron like Uptime) | 90-DAY | Continuous not one-shot; proves not one-shot escrow |
| settlement (mock BridgeProof arrow → Base VerdictRegistry) | CORE (mock) / LONG-TERM PLATFORM (real Hyperlane) | Mock proves downstream without multi-chain; real Hyperlane post-hackathon |
| procurement verification (supplier attestation) | 90-DAY | Same jury different verifier prompt; needs authenticated registry (blocked) |
| security verification (code audit, bug bounty, 16-contract Playbook guards) | LONG-TERM PLATFORM | Same jury different prompt; payer niche, harden post-hackathon |
| cross-chain attestations (Hyperlane/LayerZero real) | LONG-TERM PLATFORM | Mocked proves thesis; real needs mailbox/relay/Base deploy |
| continuous poller (5-min) | REJECT for MVP / 90-DAY extension | Would violate narrow slice; keep as 90d only |

**Result unchanged:** ProveDown stays ONE coherent workflow. No kitchen-sink. New labels map 1:1 to existing CORE/REINFORCING/90-DAY/LONG-TERM/IRRELEVANT.

---

## Decision: What strengthens ProveDown without kitchen-sink

**Add to core MVP:** Nothing beyond already narrow slice — all 7 core primitives are already in contract/worker/tests. Any addition would violate `implementation-readiness.md:2` (no poller/merkle/escrow/ENS) and Gym alignment (public direct, not paywall).

**Allow as near-term (documented, not built):** Temporal recheck + Merkle batch + aggregated reputation — all reuse same `evidence_hash` + `reputation` TreeMap pattern around SAME workflow (pipeline owner → bundle → jury → reputation). They strengthen retention/network effects without new customer.

**Keep as long-term platform:** Multi-party settlement + code verification + procurement verification + cross-chain + guards — all are **same jury pattern different verifier prompt** (SLO judge vs invoice judge vs code judge). They become horizontal infrastructure only after wedge proves jury pattern at scale. Correct to keep as pool not product.

**Irrelevant stays out** even if sounds impressive — no betting, no carbon, no stigmergy.

**Result:** ProveDown remains **ONE coherent customer/problem/workflow** — pipeline owner suffering $50K pipeline damage from $500/mo API where Pingoru $15 status page + Updog free detect uptime but not functional quality; we provide functional SLO jury + evidence_hash + reputation + mock bridge — with 3 near-term extensions that deepen same workflow, not 7 products.
