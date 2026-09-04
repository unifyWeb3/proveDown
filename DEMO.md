# DEMO — Stable Presets (no live flakiness)

**Goal:** Demo does not depend on unreliable live APIs. Jury fetches **our Worker** (hash-stable), not OpenAI status page (would be 5/5 variance).

## Presets (same as hosting/bundle-worker/README.md)

| # | Case | Preset URL (append to `NEXT_PUBLIC_BUNDLE_WORKER_URL`) | SLO (default) | Expected verdict | Explorer |
|---|---|---|---|---|---|
| 1 | **Healthy** | `?sla=demo-healthy&preset=no_breach` → `p95 1600 fill 0.95` | P95≤2000+500, error<0.01, fill≥0.80 | **NO_BREACH** `OK` conf 1000 | `get_attestation` shows breach false, reason OK, score 66→~75 |
| 2 | **Breach** | `?sla=demo-breach&preset=breach` → `p95 4800 fill 0.72` | same | **BREACH** `LATENCY` or `ERROR_QUALITY` conf 900 | breach true, reputation breaches+1, score down |
| 3 | **Ambiguous** (if practical) | `?sla=demo-ambig&preset=ambig` → `p95 2100` near 2500 tolerance | same | **BREACH** but low conf 800, reason may drift `OK` vs `LATENCY` (see technical validation) — shows honest threshold sensitivity | or `no_consensus` if jury splits — shown as amber "honest split" not error |

## Demo script (5 min, per implementation-readiness §12)

1. Register SLA (preset `breach`) → tx ACCEPTED → explorer `https://explorer-bradbury.genlayer.com/tx/0x...`
2. `request_attestation` → 5 validators fetch bundle → judge → verdict BREACH + evidence `sha256:9566a8b5...` + p50/p95 → explorer link
3. Show `get_reputation(api_url)` decrement (66→~60) — reputation marketplace
4. Switch preset to `no_breach` → second attestation → NO_BREACH → reputation recovery
5. Live sandbox: type any api_url + SLO → same contract, real tx (proves generic not preset-only)
6. Mock bridge: show `bridgeProof` hash `keccak(attestation_id+evidence_hash)` + "Relay→Base VerdictRegistry" arrow (AgentEscrow [S24] pattern, mocked per readiness §9)

**Do NOT fake GenLayer verdict** — verdict is real jury consensus. Mock only bridge/relay boundary (explicitly documented). If Bradbury congested, use mocked frontend toggle (`NEXT_PUBLIC_LIVE_JURY=false` prewrites SSE) but still show one preset's real tx from earlier.

## Bundle synthesis vs live probe

For hackathon, bundle is synthesized (probes:100 window:1h). Post-hackathon, replace Worker with poller that aggregates real probes per-minute off-chain and serves bundle JSON hourly. Verdict logic unchanged.

## Verification

Every verdict checkable: `genlayer receipt <txId>` → `ACCEPTED`, `get_attestation` → breach bool, `evidence_hash` matches `sha256(bundle)`, `explorer` link live.
