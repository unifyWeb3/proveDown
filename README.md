# ProveDown — Neutral Functional Attestation for Service-Quality Agreements

**Track:** Agentic Commerce Infrastructure (SLA and uptime enforcement).
**Live target:** Studio Next 61997 (Consensus v0.6 RC). Bradbury deployment kept as compatibility evidence only.

## 1. The problem

Agent pipelines depend on third-party APIs. When an API degrades, the pipeline doesn't just slow down — it makes a pipeline of bad decisions (800 leads scored with empty enrichment → 47 enterprise leads skipped → $50K damage from a $500/mo API vs a $125 credit). Downtime costs $9k/min for large businesses; average API uptime fell 99.66% → 99.46% (+60% downtime). See `02-market-research/`, `SOURCES.md`.

## 2. Why existing uptime monitoring is insufficient

Provider dashboards define "available" to limit liability (threshold tricks: 70/80 failed = 87% error but SLA 100% because <100 req/min; maintenance exclusions; 400/429 excluded). Buyer-hired monitoring (Datadog, Pingoru $15, Updog free) is dismissed by providers as biased when credits are disputed. Neither side's measurement is accepted when $50K is at stake — and neither judges *functional quality* (a 200 response with 72% fill is "up" but useless to an agent that needs 80%). The live Uptime project (`genlayer-foundation/uptime`) proves factual reachability via strict consensus — necessary but not sufficient. See `04-competitive-intelligence/uptime-gap-analysis.md`.

## 3. What ProveDown does

A neutral, economically-secured attestation sidecar: register an API + SLO (P50/P95 latency, error, fill, match thresholds) → independent GenLayer validator jury fetches a stable evidence bundle, judges breach vs SLO with tolerance, anchors the attestation (verdict + evidence SHA-256 + confidence + reputation update) on-chain with explorer proof. Three deterministic demo cases: healthy → NO_BREACH, functionally broken (HTTP 200 + fill 72% < 80%) → BREACH, missing/invalid evidence → INCONCLUSIVE (never a definitive judgment). See `07-final-thesis/final-product.md`, `DEMO.md`.

## 4. Why GenLayer matters

Only a decentralized jury with independent fetches + diverse LLMs + bond/slash + appeal doubling is neutral to *both* buyer and provider. Remove GenLayer → biased dashboard; replace with Chainlink/single AI API → single bribe target with no independent recomputation. The unique primitive is economically-secured subjective adjudication with external data (`web.render` + `exec_prompt` + `run_nondet_default` consensus on breach bool + evidence hash + bridge proof). See `06-adversarial-analysis/02-genlayer-necessity-tests.md`.

## 5. How to run it

```bash
# toolchain (exact RC set)
node --version # 22.x
genlayer --version # 0.40.0-rc.3 (deploys via scripts/deploy-with-js.mjs, WSL-safe per KEYCHAIN-WLS2.md)
/tmp/provedown-rc-venv/bin/genvm-lint lint contracts/provedown.py # reachability advisory is false-positive (proven on-chain)
python3 -m pytest tests/test_provedown.py -q # 9 passed

# live E2E on Studio Next 61997 (needs funded studio-dev account — built-in faucet 💧 in studio-dev.genlayer.com)
export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY .env.local | cut -d= -f2 | tr -d '\r\n ')
node scripts/deploy-with-js.mjs # GENLAYER_NETWORK=studio-dev (default) → contract 0x... FINALIZED FINISHED_WITH_RETURN
node scripts/attest-studio-dev.mjs # registers demo-healthy/breach/empty → attestations + reputation

# frontend (static, reads live studio-dev, no build)
open frontend/index.html # or any static server; live reads via esm.sh genlayer-js@2.0.0-rc.1
```

## 6. Real vs mocked

**REAL:** Studio Next contract, GenLayer jury consensus, attestations, evidence hashes, reputation, explorer-studio-dev transactions, Bundle Worker HTTPS bundles.
**MOCK:** Base relay / cross-chain settlement (arrow + `bridgeProof` hash diagram, AgentEscrow pattern — not a real Hyperlane tx), future poller (bundles synthesized, hash-stable), `NEXT_PUBLIC_LIVE_JURY=false` prewired SSE fallback (labeled mock, links to prior real txs).
Never blur the boundary — see `DEMO.md`, `FINAL-PREFLIGHT-AUDIT.md`.

## Research archive

Full discovery trail (12 problems → funnel → thesis → validation → migration): `00-mission.md`, `01-genlayer-recon/`, `02-market-research/`, `03-hackathon-intelligence/`, `04-competitive-intelligence/`, `05-opportunity-map/`, `06-adversarial-analysis/`, `07-final-thesis/`, `SOURCES.md`, `memory.md`, `CHANGELOG.md`.
