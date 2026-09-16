# Frontend to Backend Contract Audit

Date checked: 2026-09-11

| UI action | Handler and backend call | Current result |
|---|---|---|
| Initial load | `liveRead()` -> `get_reputation` + `get_attestation` on Studio Next | Connected read path; canonical IDs 1-3 load live |
| Refresh | `refreshBtn` -> `liveRead()` | Connected |
| Agreement/SLO edit | `validateSetup()` | Local validation; the API URL is submitted during registration and the live reputation read resolves the stored on-chain SLA subject |
| Preview/register | Worker `fetch()` then, with wallet, `writeFinalized(..., 'register_sla', ...)` | Code-level write path exists; no-wallet path truthfully says no transaction was created |
| Attestation | wallet client -> `get_sla` -> `writeFinalized(..., 'request_attestation', ...)` -> finalized receipt -> on-chain scan for created ID | Browser smoke completed for attestation 4; finalized readback is recorded in `EVIDENCE.md` |
| Pending | `writeFinalized` phase callback | Shows fee estimation, signature, and finality phases |
| Finalized result | `isSuccessful(receipt)` then `findCreatedAttestation` and `liveRead()` | Does not show a success until receipt and readback pass |
| Verdict | `verdictHtml()` | Handles resolved, inconclusive, and no-consensus states |
| Evidence | `fillEvidenceRows()` -> `get_sla` + Worker refetch + exact SHA-256 comparison | Shows rows only on hash match; mutable Worker remains a provenance limitation |
| Reputation | `get_sla(selectedSla)` -> `get_reputation(stored.api_url)` | Connected to the selected on-chain agreement; no reputation is guessed from the editable form |
| Explorer | `txLink()` | Direct full tx link for pinned IDs and live-created IDs; arbitrary query IDs may have no tx mapping |
| Error/retry | Explicit error blocks and retry buttons | Connected, but registration errors are broadly labeled evidence failures |

## Truth classification

- **REAL:** Studio contract reads, canonical stored attestations, finalized receipts, Worker availability, and script-driven writes.
- **DERIVED:** confidence bars, observed-vs-limit rows, score formatting, labels, and query-string selection.
- **LOCAL/EPHEMERAL:** form values, skeletons, phase text, and wallet prompt state.
- **MOCK:** synthesized Worker measurement generation, Base relay/settlement, future poller, and SSE fallback.
- **UNPROVEN:** runtime receipt lookup for every pinned case and authoritative customer data. The injected-wallet browser registration/attestation path is proven for the pinned smoke run.

## Findings

1. The code-level browser lifecycle is now implemented; the prior report that both buttons were dead is stale.
2. **Fixed in current source:** `liveRead()` resolves the reputation subject through the selected agreement's stored `api_url` (`frontend/index.html:453-476`). The release test rejects the prior hardcoded call.
3. `liveRead()` uses repository-known tx IDs and labels the pinned demo records as finalized without re-fetching each receipt in the browser. Keep the pinned demo label scoped or add dynamic receipt checks before generalizing this path.
4. Registration catches wallet, contract, and RPC errors under a broad user-facing error block (`frontend/index.html:374-376`), which can still mislead operators. Split Worker preview failures from transaction failures before submission.
5. Evidence preview hashes raw Worker bytes while the contract hashes sanitized/truncated judged bytes. Current presets match; hostile or oversized content should be disclosed as a mismatch, not represented as equivalent.
