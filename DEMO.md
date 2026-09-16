# DEMO — Deterministic 3-Case Functional Attestation (60–90s)

**Goal:** In 60–90 seconds the audience understands: HTTP 200 does not mean the service fulfilled the agreement. Jury fetches **our synthetic Worker fixture** (deterministic 132–155 byte presets, 1/8-style stability), not live customer APIs.
**Live:** Studio Next 61997, hardened contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` (deploy `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb` FINALIZED FINISHED_WITH_RETURN). Worker `https://provedown-bundle.contentbounty.workers.dev/bundle` (200, full SHA-256 stable across repeated reads).

## The 3 cases (all real, explorer-verifiable)

| # | Case | Bundle (HTTP 200 always) | SLO | Jury verdict (real tx) |
|---|---|---|---|---|
| 1 | **Healthy** | `?preset=no_breach` → p50 320, p95 1600, error 0.004, fill 0.95 | P95≤2000+500, error<0.01, fill≥0.80 | **NO_BREACH** OK conf 1000, hash `64e6c84f01418b89` — tx `0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf` |
| 2 | **Functionally broken** | `?preset=breach` → p50 1561, p95 4800, error 0.02, fill 0.72 | same | **BREACH** ERROR_QUALITY conf 1000, hash `b4fc2013862e316e` — tx `0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505` |
| 3 | **Bad evidence** | `?preset=empty` → all metrics null | same | **INCONCLUSIVE** UNAVAILABLE conf 0 — tx `0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a`. Missing evidence never becomes definitive. |

Canonical first-three reputation after A+B (+C inconclusive, no rep change) was `60 / 100`, `2 checks`, `1 breach`. The later finalized browser run added attestation 4 (NO_BREACH), so the current live reputation is `66 / 100`, `3 checks`, `1 breach`; registration `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a`, attestation `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110`.

## Script (60–90s)

1. **Hook (15s):** "Both APIs returned HTTP 200. Uptime says both are UP. But one delivered 72% fill against an agreed 80% — your agent just scored 800 leads on empty data. Who decides, neutrally, at machine speed?"
2. **Run (45s):** Open the public demo `https://provedowngen.vercel.app/` (or local `frontend/index.html`) → live reads show Case 1 NO_BREACH + Case 2 BREACH + Case 3 INCONCLUSIVE with evidence hashes → click through to `https://explorer-studio-dev.genlayer.com/tx/0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505` (FINALIZED FINISHED_WITH_RETURN, `isSuccessful`).
3. **Why GenLayer (15s):** Remove GenLayer → biased dashboard; replace with oracle/single AI → single bribe target. Independent jury consensus is the neutral adjudication primitive demonstrated here. Appeals and bond/slash are deferred, not implemented. Bridge arrow to Base is mock (labeled) — attestation, hash, reputation, consensus are real.
4. **Beyond (15s):** Same jury pattern extends to procurement/RFP, reputation marketplace, temporal rechecks (documented, not built — no kitchen-sink).

## Honesty labels

**REAL:** Studio Next contract, jury consensus, attestations 1/2/3 plus browser attestation 4, evidence hashes, current reputation, explorer transactions, Worker bundles.
**MOCK (labeled):** Base relay / cross-chain settlement arrow, future poller (bundles synthesized), `NEXT_PUBLIC_LIVE_JURY=false` SSE fallback.

**Do NOT fake verdicts.** If studio-dev congested, show these exact prior real txs (they remain verifiable) — never present SSE fallback as live.

## Verification

Every verdict: `get_attestation` → breach bool, `evidence_hash` == `sha256(sanitized-and-truncated bundle bytes)` (the clean presets also match the fetched Worker bytes), explorer `/tx/0x...` FINALIZED + FINISHED_WITH_RETURN + `isSuccessful`. Reputation: `get_reputation("https://example.com")`.

## Bundle synthesis vs live probe

Hackathon bundles synthesized (probes:100 window:1h, no timestamps → hash-stable). Post-hackathon: poller aggregates real probes off-chain, serves bundle JSON hourly. Verdict logic unchanged.
