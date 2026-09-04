# Feature Synthesis — Primitives Pool → ProveDown

**Date:** 2026-09-03
**Rule:** Combine strongest primitives from multiple researched ideas *around ONE customer/problem/workflow* (pipeline owner, functional SLO breach, neutral attestation). Do not bolt features because they sound impressive.

**Pool evaluated:** agentic research / contribution verification, dispute resolution, multi-party settlement, code/security verification, procurement/RFP verification, reputation, cross-chain attestations, agent SLA verification, incident-response guards.

---

## Classification

### Core MVP (required to prove thesis — must build Sep 3-17)

| Primitive | Source | Why core | Where in MVP |
|---|---|---|---|
| **Functional SLO jury** (not status page ping) | Procurement #3 repurposed as quality SLO, plus ArcSLA missing DisputeModule | Thesis: quality fill/match not uptime is where LLM jury adds beyond Pingoru $15 / Updog free | `contracts/provedown.py: request_attestation` 1× web.render bundle + exec_prompt breach bool, `hosting/bundle-worker` 116-char presets |
| **Evidence bundle hash** | ContentBounty SHA256, dispute_court_v2 3k per source, TrustTrace Merkle 10min | Proves bundle being judged is bundle returned by worker, not after-the-fact edited | `evidence_hash sha256:9566a...` stored + shown + explorer link |
| **Consensus on breach bool only** | Technical validation 05 §3 reason drift, Gym MVP horizontal prompt | Reason noisy, breach stable 3/3 → agree on bool not reason | `validator_fn` line 244 `breach` only |
| **Neutral attestation + reputation** | ArcSLA Bayesian `(good+2)/(total+3)`, RelAI | Settlement-grade + selection signal beyond one attestation | `TreeMap reputation` score 66→60/75 + `get_reputation` view |
| **INCONCLUSIVE / UNDETERMINED first-class** | Gym currently unresolvable honesty, ContentBounty 1-16000 | Honest split at threshold (2100 ambig) not false definitive | `no_consensus`/`inconclusive` statuses amber (to implement) |
| **Mock bridge proof** | AgentEscrow BridgeSender→Relay→Base VerdictRegistry | Shows downstream action without building multi-chain | `BridgeProof` hash + arrow diagram, mocked per readiness §9 |
| **Sanitize + DATA framing** | dispute_court_v2 greybox_sanitize, technical validation injection 2/2 resisted | Prevent bundle `ignore previous` → false verdict | `greybox_sanitize` + `<SYSTEM><BUNDLE>` |

**All core primitives already in `contracts/provedown.py:1` 362 lines + `worker.js:1` + `tests/test_provedown.py:1` 5 passed.** No kitchen-sink.

### Near-term Extension (90d, strong fit after MVP proves)

| Primitive | Source | Why near-term | Not in MVP |
|---|---|---|---|
| **Temporal randomized recheck** (`next_check_at`) | SponsorGuard 3-tranche recheck, saturation white space | Continuous monitoring not one-shot; proves not one-shot escrow | 180d roadmap, not hackathon |
| **Merkle batch bundles** (100 probes → one rootHash hourly) | TrustTrace 10min Merkle + IPFS, Pulse hourly Merkle, logic 30d plan, cost $0.001/probe batched | Scales attestation without per-minute on-chain cost (batch) | Post-hackathon, single attestation anchored now sufficient |
| **Aggregated global intelligence** (like Updog.ai but for quality) | Datadog Updog aggregated APM Bayesian, our 04 review | Once 10 pipeline customers attest, aggregate their attestations into global quality view (premium for reliable APIs) | Needs 10 customers, not MVP |
| **Aggregated reputation marketplace** (queryable API scores) | ArcSLA reputation live, RelAI | Turns per-attestation score into market-discovered price (like AgentRouter) | Post-hackathon after reputation TreeMap proven |

### Long-term Platform Primitive (could become company, not MVP)

| Primitive | Source | Why long-term | Why not now |
|---|---|---|---|
| **Multi-party settlement** | Agentic commerce stack 02-market-research/03 (Discovery→Recovery) | Full Discovery→Recovery needs identity→recovery 11 layers; ProveDown is verification→dispute slice | Keep verification slice narrow; expand to settlement when trust layer proven |
| **Code/security verification** | Code audit #9, bug bounty #11, Gym verification not yet for code | Jury could verify code PR `observability` → `criteria bits` like ContentBounty, but payer is niche | Procurement expansion already 90d, code is separate vertical — keep as primitive pool not product |
| **Procurement/RFP verification** | Candidate #3 (8.05 vs 8.17), 05-final-2, 08 procurement-vs-sla | Same jury pattern `supplier attestation` reusing `evidence_hash` + `web.render` but needs authenticated tax registry (blocked) | 90d roadmap after SLA wedge validates jury pattern; not both wedges now (would be 2 products) |
| **Cross-chain attestations** (Hyperlane/LayerZero real) | InternetCourt Base+LayerZero, AgentEscrow BridgeSender | Real Hyperlane to Base Sepolia VerdictRegistry needs mailbox, relay gas, and Base deploy — mocked for hackathon is sufficient | Mocked bridge diagram proves thesis without multi-chain infra time |
| **Incident-response guards** (16-contract Playbook: URL Rot, Prompt Injection, API Key Leakage, anti-bot wall) | `0x03sol/Incident-Response-Playbook` saturated shallow pattern | Guards harden not prove thesis; anti-bot wall handling for bundle Worker we control not needed | Harden post-hackathon if bundle becomes adversarial host |

### Irrelevant (do not include)

| Primitive | Why irrelevant | Do not include even as long-term |
|---|---|---|
| **Betting / parimutuel** (Gotham Court) | Gambling surface, regulatory, not verification | Never |
| **Stigmergy pheromone** (GenSwarm) | Coordination not attestation | No |
| **Carbon credit verification** | Niche 90k markets vs API daily, needs satellite + ground truth not bundle | No (keep as separate thesis if pivot) |
| **Health insurance $262B adjudication** | HIPAA + provider data + 3 rounds 70% overturned → not hack-f feasible 5.0/4.5 tech/hack (see 05-final-2) | No (explicitly cut at 8→4) |

---

## Decision: What strengthens ProveDown without kitchen-sink

**Add to core MVP:** Nothing beyond already narrow slice — all 7 core primitives are already in contract/worker/tests. Any addition would violate `implementation-readiness.md:2` (no poller/merkle/escrow/ENS) and Gym alignment (public direct, not paywall).

**Allow as near-term (documented, not built):** Temporal recheck + Merkle batch + aggregated reputation — all reuse same `evidence_hash` + `reputation` TreeMap pattern around SAME workflow (pipeline owner → bundle → jury → reputation). They strengthen retention/network effects without new customer.

**Keep as long-term platform:** Multi-party settlement + code verification + procurement verification + cross-chain + guards — all are **same jury pattern different verifier prompt** (SLO judge vs invoice judge vs code judge). They become horizontal infrastructure only after wedge proves jury pattern at scale. Correct to keep as pool not product.

**Irrelevant stays out** even if sounds impressive — no betting, no carbon, no stigmergy.

**Result:** ProveDown remains **ONE coherent customer/problem/workflow** — pipeline owner suffering $50K pipeline damage from $500/mo API where Pingoru $15 status page + Updog free detect uptime but not functional quality; we provide functional SLO jury + evidence_hash + reputation + mock bridge — with 3 near-term extensions that deepen same workflow, not 7 products.
