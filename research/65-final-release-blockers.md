# Final Release Blockers

Date checked: 2026-09-12

Release reconciliation update: the injected-wallet browser smoke is now complete. The current Studio Next registration and attestation receipts, on-chain readbacks, and current reputation are recorded in `EVIDENCE.md` and `research/RELEASE-INVENTORY.md`.

## P0

1. **RESOLVED in current source: malformed judge output fails closed.** `parse_llm_json()` returns `None`, and malformed/partial judge fields become explicit `inconclusive` (`contracts/provedown.py:74-85`, `311-379`). The 13-test analog suite and the current Studio empty-evidence case cover the fail-closed state. Keep this historical blocker for traceability; it is not an open release defect.
2. **RESOLVED in current source: reputation follows the selected agreement.** `resolveReputationSubject()` reads the selected SLA's on-chain `api_url` before `get_reputation` (`frontend/index.html:453-476`), and the frontend release test rejects the old hardcoded call. Keep the old finding only as historical context.
3. **RESOLVED 2026-09-11: wallet-backed browser E2E.** Registration `0x63f386...` and attestation `0xfe160a...` both finalized successfully; `get_sla`, `get_attestation`, and `get_reputation` readbacks matched the submitted/current state. Full hashes and Explorer links are in `EVIDENCE.md`.
4. **RESOLVED for the current release copy: submission truth boundary.** Judge-facing copy labels the Worker as synthetic, the relay as mocked, and application appeal/bond/slash plus mainnet/fiat and accuracy claims as absent, deferred, unknown, or unproven. Historical Bradbury and pre-build material is explicitly labeled.
5. **OPEN: public package is not submission-ready.** The frontend polish and runtime smoke are complete, but the mission still requires a curated public GitHub repository plus a final scan of the assembled publication package. Keep the repository private until that checkpoint is explicitly authorized.

## P1

- Fetch receipt status dynamically for transaction links or scope finality language to pinned evidence.
- Add immutable/content-addressed evidence snapshots; current Worker content is mutable fixture data.
- Add owner, rate, and duplicate policy for public registration/attestation writes after the MVP path is stable.
- **RESOLVED in current UI:** `Timestamp unavailable on Studio Next` is displayed for the live reputation read.
- **DOCUMENTED:** the two nested `genvm-lint` reachability warnings are an analyzer limitation for the deployed callback structure; changing it would require redeployment and semantic re-verification.
- **RESOLVED 2026-09-12:** CDP accessibility-tree pass and dynamic read-only browser smoke completed; static Chromium shell renders at 390/768/1280 and the injected-wallet browser proof remain recorded.

## P2

- Capture a live no-consensus fixture.
- Improve structured error codes and next actions.
- Review the explicitly labeled historical addresses, abbreviated links, and old test counts when assembling the public package; the active release path is reconciled.
