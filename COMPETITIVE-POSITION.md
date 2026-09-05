# COMPETITIVE-POSITION.md — Rigorous Product Map (2026-09-05)

## Map (FACT where cited)

**Uptime** (live, `genlayer-foundation/uptime`, `uptime-gap-analysis.md`): verifies factual reachability of 7 hard-coded infra services via `strict_eq` on `is_up` bool from `GET 200` / JSON-RPC `result` presence. Stores every check + `uptime_pct` + linear/tiered/full penalty math + 10% fee. No latency percentile, no fill/match, no tolerance, no confidence, no hash, no reputation, no amber states.

**ProveDown**: verifies functional obligation fulfillment for arbitrary buyer-registered APIs via LLM jury with tolerance, evidence SHA-256, breach reason, confidence 0–1000, Bayesian reputation, INCONCLUSIVE/NO_CONSENSUS first-class. One decisive demo: HTTP 200 + fill 72% → Uptime says UP, ProveDown says BREACH (tx `0xe04d...` FACT).

**Observability (Datadog/Uptrends/Pingdom/Statuspage)**: best probes, charts, alerts, error budgets. Biased-by-construction in disputes (buyer-hired or provider-owned), no bonded neutrality, no settlement-grade proof, deterministic thresholds only.

**SLA tools (provider dashboards, SLA calculators)**: define terms to limit liability (exclusions, thresholds, claim windows). Counterparty to the dispute, not arbiter.

**Oracles (Chainlink Functions/Data Feeds, staking oracles)**: objective data with crypto-economic security. No subjective judgment ("is 72% fill a breach of *this* agreement?"), no web-rendered bundle interpretation, no appeal doubling on semantics.

**Human/legal arbitration (Internet Court generic, courts, chargebacks)**: handles full generality at human speed/cost. Internet Court is complementary infrastructure (we can be a verdict feed it calls for SLA facts) — do not compete with it generically; win the functional-SLO fact question specifically.

## Why use ProveDown instead of monitoring + database + workflow automation?

Economic + functional (not ideological): monitoring tells you a number moved; database stores your version of events; automation acts on your version. None produces a version the *counterparty* accepts. ProveDown's output is the only artifact in this map that (a) neither party authored, (b) is staked and appealable, (c) content-binds the exact evidence judged (hash), (d) carries calibrated confidence and honest abstention states. That is what converts a $125 write-off into a $5k claim and what lets an agent failover without waking a human — the automation you already own becomes trustworthy to act on.

## Defensibility — real vs fake moats

Real: (1) attestation + evidence-hash history per API (time + volume; a cloner starts at zero and cannot backfill trust); (2) workflow lock-in (SLO versions, webhooks, claim packets, reputation-gated routing embedded in pipelines — switching means re-instrumenting error budgets); (3) evaluation tuning (tolerance design, inconclusive guards, injection hardening iterated against live adversarial bundles); (4) integration pull (once an escrow/billing tool reads our VerdictRegistry, changing verifiers breaks their audits).

Fake: being first, using GenLayer, nicer UI, "decentralized" as slogan, token, patent on prompt text. A well-funded clone copies the MVP in weeks — acknowledge it. We win by converting the head start into history density + integrations before they catch up, exactly like the value loop requires.
