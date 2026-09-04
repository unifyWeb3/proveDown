# DEMO — Deterministic 3-Case Functional Attestation (60–90s)

**Goal:** In 60–90 seconds the audience understands: HTTP 200 does not mean the service fulfilled the agreement. Jury fetches **our Worker** (hash-stable 116 chars, 1/8 not 5/5), not live flaky APIs.
**Live:** Studio Next 61997, contract `0xeE85DFbB4C419dD27D730D105EEeEA213DD7c0FF` (deploy `0x5a34f359d575b4e74742ccc3ec7ea2e1d919911be90c47b9fdb125b53837a782` FINALIZED FINISHED_WITH_RETURN). Worker `https://provedown-bundle.contentbounty.workers.dev/bundle` (200, hash stable `b4fc2013...` twice).

## The 3 cases (all real, explorer-verifiable)

| # | Case | Bundle (HTTP 200 always) | SLO | Jury verdict (real tx) |
|---|---|---|---|---|
| 1 | **Healthy** | `?preset=no_breach` → p50 320, p95 1600, error 0.004, fill 0.95 | P95≤2000+500, error<0.01, fill≥0.80 | **NO_BREACH** OK conf 980, hash `64e6c84f01418b89` — tx `0x5b1cb325b5b27d6d0603a6cea6a33c1b4cb173788093bb87036609314d7ac497` |
| 2 | **Functionally broken** | `?preset=breach` → p50 1561, p95 4800, error 0.02, fill 0.72 | same | **BREACH** LATENCY conf 1000, hash `b4fc2013862e316e` — tx `0xe04dae35608f65b703cfcd2f80a197cb402330c5776f5e634e419f9519bc7383` |
| 3 | **Bad evidence** | `?preset=empty` → all metrics null | same | **INCONCLUSIVE** UNAVAILABLE conf 0 — tx `0xa218c962dbe7aa23dee7d705e5a7ec8a2dcdf5bdbbc9bdfdfef01dd2a7cdea43`. Missing evidence never becomes definitive. |

Reputation after A+B (+C inconclusive, no rep change): `{"score":60,"total":2,"breaches":1}`.

## Script (60–90s)

1. **Hook (15s):** "Both APIs returned HTTP 200. Uptime says both are UP. But one delivered 72% fill against an agreed 80% — your agent just scored 800 leads on empty data. Who decides, neutrally, at machine speed?"
2. **Run (45s):** Open `frontend/index.html` → live reads show Case 1 NO_BREACH + Case 2 BREACH + Case 3 INCONCLUSIVE with evidence hashes → click through to `https://explorer-studio-dev.genlayer.com/tx/0xe04d...` (FINALIZED FINISHED_WITH_RETURN, `isSuccessful`).
3. **Why GenLayer (15s):** Remove GenLayer → biased dashboard; replace with oracle/single AI → single bribe target. Only independent jury + bond/slash + appeal is neutral to both sides. Bridge arrow to Base is mock (labeled) — attestation, hash, reputation, consensus are real.
4. **Beyond (15s):** Same jury pattern extends to procurement/RFP, reputation marketplace, temporal rechecks (documented, not built — no kitchen-sink).

## Honesty labels

**REAL:** Studio Next contract, jury consensus, attestations 1/2/3, evidence hashes, reputation, explorer txs above, Worker bundles.
**MOCK (labeled):** Base relay / cross-chain settlement arrow, future poller (bundles synthesized), `NEXT_PUBLIC_LIVE_JURY=false` SSE fallback.

**Do NOT fake verdicts.** If studio-dev congested, show these exact prior real txs (they remain verifiable) — never present SSE fallback as live.

## Verification

Every verdict: `get_attestation` → breach bool, `evidence_hash` == `sha256(bundle)`, explorer `/tx/0x...` FINALIZED + FINISHED_WITH_RETURN + `isSuccessful`. Reputation: `get_reputation("https://example.com")`.

## Bundle synthesis vs live probe

Hackathon bundles synthesized (probes:100 window:1h, no timestamps → hash-stable). Post-hackathon: poller aggregates real probes off-chain, serves bundle JSON hourly. Verdict logic unchanged.
