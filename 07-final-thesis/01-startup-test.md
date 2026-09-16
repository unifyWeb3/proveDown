# 01 — Startup Test for ProveDown (API SLA Sidecar)

> **Historical pre-build hypothesis.** Pricing, customer, bridge, poller, appeal, and bond/slash statements below are research assumptions, not shipped behavior. Use `EVIDENCE.md` and `CLAIM-PACKET.md` for current release claims.

## Customer
AI agent pipeline owner / inference marketplace operator / B2B data API buyer who suffers when third-party APIs degrade. Not provider (disincentivized).

## Problem
APIs promised 99.9% (43min/mo downtime) but average fell 99.66→99.46% (+60% downtime, 34→55 min/week) [S36]; OpenAI 99.31% 30h H1 [S37]; SLA credits 5-15% (capped, exclusions 2-8hrs, threshold tricks) vs $300k/hr loss [S36]; 15s latency spike at QPM≥200 [S37] creates pipeline of bad decisions: 800 leads scored empty → 47 skipped → $50K damage for $500/mo API vs $125 credit [S37]; status pages lag tens mins [S45]; composite 5×99.9%→99.5% [S45].

## Current Solution
On-call + third-party monitoring (Uptrends 233 loc), provider SLA dashboards, circuit breakers, fallback, caching, 5s timeouts, error budget SLO 99.95%, contracts with termination rights.

## Why Existing Solutions Fail
Trust poisoned (buyer vs provider bias), subjective "what is downtime?" needs LLM not ping, no economic security (bribe/cherry-pick), no attested proof (dashboard ≠ settlement), composite/burst complexity as agents scale.

## Product
Neutral attestation sidecar: register API+SLO, jury (3 web.render probes + exec_prompt judge + run_nondet_unsafe consensus on breach+reason + evidence hashes) anchors attestation on GenLayer + bridges to Base for billing claim, builds reputation graph.

## MVP
Contract `ProveDownSla` (register_sla, request_attestation, appeal, get_attestation, get_reputation) + Frontend (register form, attest button, 5-validator jury, explorer links, reputation panel) + Mock relay (diagram real Hyperlane to Base). 3 public HTTPS endpoints, spot-check not continuous.

## Distribution
First 10: 2 inference marketplaces + 3 agent orchestration platforms via MCP + 5 B2B buyers via enrichment communities. Farcaster/Base, ETHGlobal alumni channels.

## Revenue
$99-499/mo + $0.10/breach bundle, batched amortized <$0.001/probe, gross 80%+. Buyer who recovers $5k covers 10mo.

## Retention
One won credit dispute → stick; reputation becomes selection signal (choose better APIs) → network effect.

## Expansion
Batch bundles → procurement invoice verification (#3) reuse same jury (Odoo plugin) → insurance → agentic commerce infrastructure (every agent payment's trust layer).

## Moat
Reputation graph + probe history + workflow lock-in (sidecar npm) + evaluation prompt moat + bridge integrations — not first-mover/UX.

## Why GenLayer (load-bearing)
Independent probes + diverse LLMs + greybox + consensus on breach+reason + bond/slash + appeal doubling + bridge proof = neutral settlement-grade vs biased dashboard. $0.08 attestation unlocking $5k is economically justified.
