# PRODUCT-INTERFACE-CONTRACT.md — Backend/UI Interface Contract (2026-09-11)

**Purpose:** exact shapes the frontend consumes. No guessing. Verified against live Studio Next contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`, chain 61997, `genlayer-js@2.0.0-rc.1`. Re-verified 2026-09-11: canonical attestations 1/2/3 and browser attestation 4 are finalized.

## Connection

- Chain: `studioDevnet` from `genlayer-js/chains`, id **61997**, RPC `https://studio-dev.genlayer.com/api`.
- Contract: `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` (env `NEXT_PUBLIC_PROVEDOWN_CONTRACT_STUDIO_DEV`).
- Explorer base: `https://explorer-studio-dev.genlayer.com` — address `/address/0x…`, tx `/tx/0x…`.
- Reads: `client.readContract({ address, functionName, args })`. Retry on transient `fetch failed` (observed 2026-09-05: `sim_getFeeConfig` flake, succeeds on retry).
- Writes: estimate first — `client.estimateTransactionFees({ preset: 'standard' })` → `client.writeContract({ address, functionName, args, fees: { distribution: est.distribution, feeValue: est.feeValue } })` → `client.waitForTransactionReceipt({ hash, waitUntil: 'finalized', retries: 60+ })` → gate on `isSuccessful(receipt)` (ACCEPTED alone is NOT final — show pending tracker).
- Measured latency (2026-09-05): 111s / 44s / 43s request→FINALIZED. Design for 60–180s.

## Reads

### `get_attestation(attestation_id: str) -> Attestation`
```json
{
  "attestation_id": "2", "sla_id": "demo-breach",
  "requester": "0x3211…", "timestamp": "",
  "breach": true, "reason": "ERROR_QUALITY", "confidence": 1000,
  "evidence_hash": "b4fc2013862e316e…(64 hex)",
  "evidence_summary": "<bundle_url>: 155 chars sha256:b4fc2013862e316e p95=4800",
  "p50": "1561", "p95": "4800",
  "status": "resolved | inconclusive | no_consensus"
}
```
Notes: `timestamp` is `""` on studio-dev (known P1 — use tx time from explorer). `p50/p95` are strings. Unknown id → **throws** (`[EXPECTED] attestation not found` surfaced as RPC `execution failed`) — catch, do not treat as null. Current deployment contains canonical ids 1/2/3 plus browser-smoke attestation 4; later ids are absent until another attestation is written.

### `get_reputation(api_url: str) -> Reputation`
```json
{ "api_url": "https://example.com", "score": 66, "total": 3, "breaches": 1 }
```
Notes: never throws (unknown API → `{score: 66, total: 0, breaches: 0}`). Formula: `score = round((total-breaches+2)/(total+3)*100)` — do NOT show formula in UI (design.md §21). Only `resolved` attestations count (inconclusive excluded — verified: attestation 6 changed nothing except id counter).

### `get_sla(sla_id: str) -> SLA`
```json
{ "sla_id": "demo-breach", "api_url": "https://example.com",
  "bundle_url": "https://…/bundle?preset=breach",
  "slo_json": "{\"p95_threshold\":2000,…}", "owner": "0x3211…", "created_at": "" }
```
Unknown id → throws `[EXPECTED] sla not found`.

## Writes

### `register_sla(sla_id, api_url, bundle_url, slo_json) -> SLA`
Validation (all `[EXPECTED] UserError`, catch → plain-language message per design.md §23): non-empty unique `sla_id`; `api_url`/`bundle_url` must start `https://`; `slo_json` ≤2000 chars, valid JSON with **all four** keys `p95_threshold, error_threshold, fill_threshold, match_threshold`. Duplicate `sla_id` → returns existing (idempotent, no throw). Canonical SLO: `{"p95_threshold":2000,"error_threshold":0.01,"fill_threshold":0.80,"match_threshold":0.85}`.

### `request_attestation(sla_id) -> Attestation`
Unknown `sla_id` → throws `[EXPECTED] unknown sla_id` (disable attest button until SLA known — design.md P0: prevent the misclick). Always mints a **new** attestation id (`next_attestation_id` increments even for inconclusive). Return value is the stored attestation; re-read via `get_attestation` for display.

## Status model (exhaustive — UI must branch all four)

| `status` | `breach` | `confidence` | Meaning | Badge |
|---|---|---|---|---|
| `resolved` + breach true | true | 0–1000 (950–1000 observed) | Agreement NOT fulfilled | red BREACH + reason tag |
| `resolved` + breach false | false | 950–1000 observed | Agreement fulfilled | green NO_BREACH |
| `inconclusive` | false (ignore) | 0 | Nothing decided; `reason` = `UNAVAILABLE`; `evidence_summary` says why (`incomplete evidence: missing metrics` / `malformed bundle` / `fetch failed: …`) | amber INCONCLUSIVE + missing-metric text + retry |
| `no_consensus` | false (ignore) | 0 | Honest validator split; `evidence_summary` = `no consensus (UNDETERMINED)` | amber outline NO_CONSENSUS + retry/adjust-SLO |

`reason` enum: `LATENCY | ERROR_QUALITY | UNAVAILABLE | OK`. Confidence: integer 0–1000 → display as % bar.

## Worker API

- Base: `https://provedown-bundle.contentbounty.workers.dev/bundle` (env `NEXT_PUBLIC_BUNDLE_WORKER_URL`).
- `GET /bundle?preset=no_breach|breach|ambig|empty` → 200 JSON `{sla, p50, p95, error, fill, match, probes, window, note}`. Unknown preset → breach fallback (do not rely on it).
- Live digests (2026-09-05): `no_breach` 132 chars `sha256:64e6c84f…`, `breach` 155 chars `sha256:b4fc2013…`, `ambig` 152 chars, `empty` 144 chars (nulls). Hash-stable across fetches (verified 2/2). No timestamps/secrets in body.
- Browser note: working tree adds `Access-Control-Allow-Origin: *` (HCI session change, uncommitted) — required for in-browser bundle preview/hash recompute; redeploy Worker if browser fetch fails CORS.

## Env vars (public only — never `*PRIVATE*`/`*SECRET*` under `NEXT_PUBLIC_`)

`NEXT_PUBLIC_PROVEDOWN_CONTRACT_STUDIO_DEV`, `NEXT_PUBLIC_BUNDLE_WORKER_URL`, `NEXT_PUBLIC_LIVE_JURY` (`false` = prewritten SSE fallback, must be labeled mock + link prior real txs).

## Fee data for UI (measured 2026-09-05)

Per write: `feeValue=100000000000010352` (~0.1 GEN deposit, refunded majority at finalization); consumed ≈1.3e-4 GEN/attestation (prior receipts, `EVIDENCE.md`); deploy consumed ≈7.9e-5 GEN. Display three rows: deposited / consumed / refunded. Fiat: UNKNOWN — never display dollars for chain cost.
