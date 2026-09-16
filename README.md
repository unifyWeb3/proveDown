# ProveDown — Neutral Functional Attestation for Service-Quality Agreements

**Track:** Agentic Commerce Infrastructure (SLA and uptime enforcement).
**Live target:** Studio Next 61997 (Consensus v0.6 RC). Bradbury deployment kept as compatibility evidence only.

## 1. The problem

Agent pipelines depend on third-party APIs. When an API degrades, the pipeline doesn't just slow down — it makes a pipeline of bad decisions (800 leads scored with empty enrichment → 47 enterprise leads skipped → $50K damage from a $500/mo API vs a $125 credit). Downtime costs $9k/min for large businesses; average API uptime fell 99.66% → 99.46% (+60% downtime). See `02-market-research/`, `SOURCES.md`.

## 2. Why existing uptime monitoring is insufficient

Provider dashboards define "available" to limit liability (threshold tricks: 70/80 failed = 87% error but SLA 100% because <100 req/min; maintenance exclusions; 400/429 excluded). Buyer-hired monitoring (Datadog, Pingoru $15, Updog free) is dismissed by providers as biased when credits are disputed. Neither side's measurement is accepted when $50K is at stake — and neither judges *functional quality* (a 200 response with 72% fill is "up" but useless to an agent that needs 80%). The live Uptime project (`genlayer-foundation/uptime`) proves factual reachability via strict consensus — necessary but not sufficient. See `04-competitive-intelligence/uptime-gap-analysis.md`.

## 3. What ProveDown does

A consensus-backed attestation sidecar: register an API + SLO (P50/P95 latency, error, fill, match thresholds) → independent GenLayer validators fetch a stable evidence bundle, judge breach vs SLO with tolerance, and anchor the attestation (verdict + evidence SHA-256 + confidence + reputation update) on-chain with Explorer proof. Three deterministic demo cases: healthy → NO_BREACH, functionally broken (HTTP 200 + fill 72% < 80%) → BREACH, missing/invalid evidence → INCONCLUSIVE (never a definitive judgment). The Worker is synthesized fixture evidence for this MVP; the downstream relay is mocked. See `07-final-thesis/final-product.md`, `DEMO.md`.

## 4. Why GenLayer matters

GenLayer is load-bearing here because independent validators fetch external evidence, run the nondeterministic judgment, reach consensus on the breach boolean, and store a shared final record. Remove GenLayer and the result becomes a centralized dashboard; replace it with a single oracle or AI API and independent recomputation disappears. Application-level appeals, bond/slash, and cross-chain settlement are deferred and are not part of this live MVP. See `06-adversarial-analysis/02-genlayer-necessity-tests.md`.

## 5. How to run it

```bash
# toolchain (exact RC set)
node --version # 22.x
genlayer --version # CLI 0.39.2 is retained for compatibility; live writes use pinned genlayer-js@2.0.0-rc.1 per KEYCHAIN-WLS2.md
PYTHONPATH=/tmp/provedown-linter /tmp/provedown-linter/bin/genvm-lint lint contracts/provedown.py # two nested nondet reachability advisories; runtime/deploy verified
python3 -m pytest tests/test_provedown.py -q # 13 passed (analog/local logic)

# live E2E on Studio Next 61997 (needs funded studio-dev account — built-in faucet 💧 in studio-dev.genlayer.com)
# Load the ignored local env file without printing it; never paste a key into a command or commit it.
set -a; source .env.local; set +a
node scripts/deploy-with-js.mjs # GENLAYER_NETWORK=studio-dev (default) → contract 0x... FINALIZED FINISHED_WITH_RETURN
node scripts/attest-studio-dev.mjs # registers demo-healthy/breach/empty → attestations + reputation

# frontend (static source; validated production artifact via `npm --prefix frontend run build`)
open frontend/index.html # or any static server; live reads via esm.sh genlayer-js@2.0.0-rc.1
```

**Public demo (verified 2026-09-16):** `https://provedowngen.vercel.app/` — routes `/`, `/verify`, `/proof` (+ query variants, e.g. `/verify?contract=0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1&cases=4,1,2`) serve the same static shell; unknown paths 404. Release commit `1e26af6` on private branch `provedown-app-shell` (repo still private; publication is a separate authorized step).

## 6. Real vs mocked

**REAL:** Studio Next contract, GenLayer jury consensus, attestations, evidence hashes, reputation, explorer-studio-dev transactions, and the Bundle Worker transport.
**SYNTHETIC FIXTURE:** Worker payloads are deterministic demo bundles, not measurements collected from a live customer API.
**MOCK:** Base relay / cross-chain settlement (arrow + `bridgeProof` hash diagram, AgentEscrow pattern — not a real Hyperlane tx), future poller (bundles synthesized, hash-stable), `NEXT_PUBLIC_LIVE_JURY=false` prewired SSE fallback (labeled mock, links to prior real txs).
Never blur the boundary — see `DEMO.md`, `FINAL-PREFLIGHT-AUDIT.md`.

## Research archive

Full discovery trail (12 problems → funnel → thesis → validation → migration): `00-mission.md`, `01-genlayer-recon/`, `02-market-research/`, `03-hackathon-intelligence/`, `04-competitive-intelligence/`, `05-opportunity-map/`, `06-adversarial-analysis/`, `07-final-thesis/`, `SOURCES.md`, `memory.md`, `CHANGELOG.md`.
