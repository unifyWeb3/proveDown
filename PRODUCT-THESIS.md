# PRODUCT-THESIS.md — ProveDown Product Thesis (2026-09-05)

**Status:** Productization decision, not research. Supersedes discussion; does not supersede `07-final-thesis/final-product.md` evidence.
**Evidence labels:** FACT = verified in repo or official source. INFERENCE = reasoned. OUR DESIGN = product choice.

**Current release boundary:** the Worker is synthetic fixture evidence, the Base/Hyperlane relay is mocked, and ProveDown has no application-level appeal, bond, or slashing flow. Current deployment facts are authoritative in `EVIDENCE.md`.

---

## 1. What is ProveDown? (one sentence)

**ProveDown is the neutral functional-attestation layer that decides whether a machine-to-machine service agreement was actually fulfilled — not whether the server responded.**

## 2. Primary customer (one specific customer first)

**The operator of an agent pipeline that pays for a third-party API and is accountable when that API silently degrades.**

Concretely for V1: a team running an enrichment / inference / data API inside an automated pipeline (lead scoring, agent orchestration, inference marketplace buyer) where a bad response still returns HTTP 200.

Why this customer and not the others — FACT: `07-final-thesis/final-product.md:124` already names buyer/pipeline owner as payer; `design.md:2` independently converges on "pipeline/service owner" as primary user from HCI analysis. INFERENCE: this is the only candidate who (a) feels $50K-scale damage from 72%-fill responses, (b) can self-serve a register→attest flow without enterprise procurement, (c) already lives inside the agentic-commerce stack the hackathon track targets.

Explicitly NOT first: API providers (disincentivized to buy proof they breached), generic enterprises (sales cycle too long), DAOs (no budget holder), "all AI agents" (not a buyer).

## 3. Painful job (one specific job)

**"When my provider says 'we were up' and my pipeline produced garbage, give me neutral proof of what was actually delivered so I can failover, claim credit, or switch providers without an argument."**

## 4. What happens without ProveDown?

FACT (repo evidence): provider dashboards define "available" to limit liability; buyer monitoring is dismissed as biased (`README.md:10-12`). The pipeline owner eats the loss: example 800 leads scored on empty enrichment → 47 enterprise leads skipped → ~$50K damage vs $125 credit (`README.md:6`). Status pages lag tens of minutes; threshold tricks (70/80 failed = 87% error but "100% SLA") are documented in `07-final-thesis/final-product.md:35`.

Result: disputes revert to screenshots, Slack threads, and manual audit — months, not minutes — or are abandoned because the credit is not worth fighting without proof.

## 5. Why existing monitoring/observability/SLA tooling is insufficient

| Tool class | What it does | Why it fails this job |
|---|---|---|
| Provider dashboard / status page | Self-reported uptime | FACT: defines success to limit liability; excluded maintenance, 400/429, threshold tricks (`final-product.md:35`) |
| Datadog / Uptrends / Pingdom | Buyer's probes, pings, APM | INFERENCE + FACT: hired by buyer → provider distrusts it in a dispute; deterministic ping cannot judge functional integrity (fill 72% vs 80%) |
| Uptime (live GenLayer project) | FACT: `strict_eq` on `is_up` bool, `GET 200` → up (`uptime-gap-analysis.md:1-3`) | Necessary but not sufficient: answers "reachable?", never "fulfilled?" — no p95/fill/match, no tolerance, no confidence, no reputation |
| Chainlink / staking oracles | Objective data feeds | Cannot judge subjective "does 15s latency / 72% fill count as breach for this agreement?" — needs LLM judgment with tolerance |
| Single AI API judge | One model verdict | Single bribe/censor target, no independent recomputation, no bond/slash, no appeal |
| Humans / legal arbitration | Manual audit, chargeback | 2.6 years / $43K scale (genlayer.com FACT); defeats machine-speed automation |

## 6. What does ProveDown uniquely verify?

**Whether the agreed functional outcome was satisfied, judged by an independent jury against a versioned agreement and a content-hashed evidence bundle.**

FACT (proven on Studio Next 61997, `EVIDENCE.md`): jury fetches bundle → `exec_prompt` judges `BREACH if p95>threshold+500 OR error>=threshold OR fill<threshold OR match<threshold` → consensus on breach bool only → stores `{breach, reason, confidence 0-1000, evidence_hash sha256, p50/p95, status}` + Bayesian reputation.

The canonical demonstration (FACT, current Studio tx `0xf566...`): HTTP 200 + p95 4800 + fill 0.72 vs SLO p95≤2000+500/fill≥0.80 → **BREACH, confidence 1000**. Uptime-style logic says UP. ProveDown says the agreement was not fulfilled. That gap IS the product.

Three verdict states are first-class (FACT, `contracts/provedown.py:290-369`): `resolved` (BREACH/NO_BREACH), `inconclusive` (evidence missing — never a definitive judgment), `no_consensus` (honest validator split at threshold).

## 7. What happens after a verdict?

| Verdict | Machine meaning | Downstream action (V1 → later) |
|---|---|---|
| BREACH | Agreement not fulfilled, proof attached | V1: failover / switch provider, file credit claim with explorer link + hash, reputation updates (current live read 66/3/1 after attestation 4). Later: auto-claim, escrow release-hold, insurance trigger |
| NO_BREACH | Agreement fulfilled | Continue routing, reputation increments, proof retained for audit window |
| INCONCLUSIVE | Nothing was decided about quality | Retry with fixed bundle; explicitly NOT a pass/fail (design.md §25). No reputation change (FACT: inconclusive excluded) |
| NO_CONSENSUS | Validators honestly disagreed | Retry or adjust SLO tolerance; framed as system working, not failure |

## 8. Framing challenge (resolved)

Candidate framings tested: "monitoring" (REJECT — implies polling dashboards, invites comparison with Datadog/Uptime on their terms), "oracle" (REJECT — implies objective data feed), "escrow" (REJECT for V1 — implies holding funds, which we do not do yet), "insurance" (REJECT for V1 — needs capital pool).

Locked framing: **verification of machine-to-machine service agreements.** It survives the challenge because (a) agreement→evidence→adjudication→attestation is the actual implemented loop, (b) every layer in §PRODUCT-SYSTEM maps to it, (c) it extends to escrow/insurance/settlement as *consumers* of attestation without claiming to be them today.

## 9. Productization rule answers (thesis-level)

- Problem: silent functional degradation with no neutral arbiter.
- Who: pipeline operators buying API capacity consumed by agents.
- Why now: FACT — hackathon track explicitly asks "SLA and uptime enforcement" (portal, Sep 2026); agents multiply call volume 10–100× while reliability falls 99.66→99.46%; x402/ERC-8004/A2A ship happy path with no adjudication (docs.genlayer.com FACT).
- Why ProveDown: consensus-backed subjective adjudication with independently fetched evidence both sides can cite.
- Why existing software fails: §5 table.
- Does GenLayer matter: YES, load-bearing — remove it → biased dashboard; replace with single oracle/AI → single bribe target (`06-adversarial-analysis/02` PASS verdicts).
- Unlocks: credit claims with proof, reputation-based routing, eventual conditional settlement.
- Complexity cost: one jury run per attestation (~1.3e-4 GEN consumed FACT); async minutes-scale finality acceptable because attestation is not in the hot request path.
