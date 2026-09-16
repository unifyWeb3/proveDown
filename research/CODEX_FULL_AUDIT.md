# ProveDown Full Reality Audit

Date: 2026-09-09

Reconciliation addendum (2026-09-11): the previously open injected-wallet browser gate is resolved by registration `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a` and attestation `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110`, both finalized and successfully read back. Current reputation is `66/3/1`. The original audit below remains a dated snapshot; use `research/RELEASE-INVENTORY.md` and `EVIDENCE.md` for the current reconciliation.

This is a repository/application audit with a narrow fail-closed hardening pass. The permanent constitution is in `AGENTS.md`; the current contract and frontend were re-verified after deployment.

## Executive result

ProveDown has a real Studio Next deployment and a verified script-driven path through Worker fetch, GenLayer nondeterministic web/LLM evaluation, consensus, finalized storage, evidence hash, reputation, and Explorer proof. The current hardened contract is `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` on chain `61997`.

The frontend now contains a real wallet write path using pinned `genlayer-js@2.0.0-rc.1`, fee estimation, finalized receipt polling, `isSuccessful`, and on-chain readback. That path is code-complete but not runtime-proven with an injected wallet in this environment. The Worker remains synthesized fixture evidence and the downstream Base relay remains mocked.

Final verdict: **GO WITH CONSTRAINTS** for continued build and controlled demo; **BLOCKED** for submission-ready or finished claims until the P0 items below are resolved or explicitly bounded.

## 1. What is proven

- Studio Devnet RPC is reachable; `studioDevnet.id` is `61997` and the configured RPC is `https://studio-dev.genlayer.com/api`.
- The hardened contract reads successfully and its deploy receipt is `FINALIZED`, `FINISHED_WITH_RETURN`, `isSuccessful=true`.
- Canonical live cases remain present:
  - Attestation `1`: `NO_BREACH`, confidence `1000`, p95 `1600`, evidence hash `64e6c84f...`.
  - Attestation `2`: `BREACH`, reason `ERROR_QUALITY`, confidence `1000`, p95 `4800`, evidence hash `b4fc2013...`.
  - Attestation `3`: `INCONCLUSIVE`, reason `UNAVAILABLE`, confidence `0`, no evidence hash.
- The canonical receipts for deploy and attestations 1-3 all return `FINALIZED` / `FINISHED_WITH_RETURN` / successful.
- Worker presets are reachable with HTTP 200 and stable hashes: `no_breach` `64e6c84f...`, `breach` `b4fc2013...`, `ambig` `c4c35654...`, `empty` `3e4005b2...`.
- Reputation was persisted on-chain. At this audit's 2026-09-09 snapshot, the deployment read `{"score":60,"total":2,"breaches":1}` for `https://example.com`; the 2026-09-11 reconciliation addendum records the later current read of `66/3/1`.
- Local verification passes: 13 analog tests, Python compilation, frontend tests, and 15 static frontend release checks.
- Headless Chromium renders produced a populated page shell at 390px, 768px, and 1280px. The shell and setup form are visually present; the remote `genlayer-js` module and injected-wallet transaction path were not runtime-proven by this smoke.

## 2. What is not proven

- No MetaMask or injected-wallet browser transaction has been executed in this environment.
- No live `NO_CONSENSUS` transaction has been captured; the branch is implemented and analog-tested only.
- The Worker is explicitly synthesized and does not prove real customer-service measurements or probe provenance.
- No Base/Hyperlane settlement transaction exists; the relay is a labeled mock boundary.
- No application-level `appeal_attestation` method exists. Protocol-level `appealTransaction` support must not be presented as a ProveDown appeal workflow.
- Studio timestamps read as empty strings for the pinned state.
- No per-SLO accuracy backtest exists. Gym coverage is not accuracy.
- The current public submission package, screenshots/video, and public-repository release scan are not verified.

## 3. Actual architecture

```text
User/browser
  -> static frontend/index.html
  -> Worker preview or wallet-backed genlayer-js write
  -> ProveDown Intelligent Contract
  -> web.render + exec_prompt inside run_nondet_default
  -> validator agreement on breach bool
  -> finalized attestation storage
  -> evidence hash + reputation update
  -> frontend readback + Explorer link
  -> mocked Base relay boundary
```

Authoritative state is contract storage. Derived state is UI formatting, evidence rows, confidence bars, labels, and the reputation presentation. Ephemeral state is form/query/loading state. External dependencies are Studio RPC, Explorer, Worker, esm.sh SDK delivery, and an injected wallet for writes.

## 4. Backend and consensus audit

The contract validates HTTPS URLs, required numeric SLO fields, finite/nonnegative ranges, fraction bounds, canonical SLO storage, and conflicting reuse of an SLA ID before nondeterministic work (`contracts/provedown.py:88-187`). Evidence must be a JSON object containing all five numeric metrics and valid ranges; empty, malformed, incomplete, or out-of-range evidence is stored as `inconclusive` (`contracts/provedown.py:240-301`). Consensus compares a strict boolean breach field and preserves `no_consensus` rather than forcing a verdict (`contracts/provedown.py:336-383`). The stored hash, metrics, reason, confidence, and reasoning are leader-observed fields; they are not independently compared by `validator_fn`. The hash is over the sanitized/truncated bundle, while the prompt receives a normalized five-metric subset, so “exact judged bytes” must not be claimed without further contract work.

The malformed-judge-output defect is fixed: `parse_llm_json()` now returns `None`, and invalid breach/reason/confidence shapes become explicit `inconclusive` results (`contracts/provedown.py:74-85`, `311-379`). Analog regression coverage is 13 tests, and a fresh Studio deployment produced healthy, breach, and missing-evidence cases with the expected statuses.

Other backend risks are bounded but real: agreement IDs can be squatted before the intended owner registers them, any caller can request repeated attestations, reputation is globally keyed by API URL, and no rate/duplicate policy protects the public write surface.

## 5. Frontend truth audit

The register and attest controls now use the real SDK write path in source. They estimate fees, request a signature, wait for finality, verify `isSuccessful`, read back the stored state, and show no-wallet/no-success messages when those conditions are absent (`frontend/index.html:241-283`, `350-377`, `496-525`). This satisfies the code-level lifecycle design, but wallet runtime proof remains pending.

The frontend now resolves reputation through the selected agreement's on-chain `get_sla` record before calling `get_reputation` (`frontend/index.html:453-480`). Runtime receipt lookup for arbitrary query-string cases remains bounded to the pinned demo IDs; custom IDs must carry their own live transaction path before being described as finalized.

Evidence rows re-fetch the current Worker and compare its raw SHA-256 to the stored hash before showing observed values (`frontend/index.html:408-440`). This prevents a visible mismatch, but the Worker is still mutable and the frontend does not have an immutable snapshot of the judged bytes.

## 6. GenLayer necessity

GenLayer is load-bearing for the narrow dispute-grade claim: independent validators fetch external evidence, diverse validators run the judgment, consensus stores a shared outcome, and the receipt/hash can be inspected independently. A centralized backend can calculate the same arithmetic, but it cannot provide the same neutral multi-validator execution and on-chain finality. The claim must stay narrow; GenLayer does not by itself provide real probes, truthful Worker provenance, payment settlement, or customer demand.

## 7. Current competitive reality

GenLayer Uptime checks whether infrastructure endpoints are reachable and computes uptime/SLA settlement. ProveDown's actual wedge is functional quality: a reachable HTTP 200 can still breach p95, error, fill, or match obligations. The Mission 83 API reported 48 submissions and the entries endpoint returned 47 records on 2026-09-09, including AgentSLA, AgentzProof, x402Proof, ModelSeal, Agent Escrow Court, FirstFault, AgentPact, ProofGuard Change, recourse, and other adjacent proof/escrow/policy projects. The API total and entries-page length differ by one and are both time-sensitive. The demo must open with the 200-but-72%-fill breach and show the hash/reputation consequence inside ten seconds.

The five requested GitHub profiles reinforce the same quality bar: Clasp and Vestra prove invariants and real receipts; SealRail, StateMirror, and Veyctum gate actions on durable state/effects; ValidatorBriberyTrap and Crucible expose simulation boundaries and injected faults; TrustLens, AuditGen, Nodea, and Synapse Fleet make consensus/state transitions legible; Recourse and Vouch make fail-closed outcomes, consensus-field boundaries, and consequential-action gating explicit. None of their code or branding was copied.

## 8. Economics and startup reality

Measured Studio values are configuration-specific: roughly `0.1 GEN` deposit, about `1.3e-4 GEN` consumed per attestation, and 43-111 seconds request-to-finalized in the recorded run. Fiat and mainnet cost are unknown. No customer, poller, willingness-to-pay, settlement demand, or durable moat was proven in this audit.

## 9. P0 - must resolve before submission claims

1. Complete one injected-wallet browser smoke for register and attest, including wallet network switch, signature, final receipt, readback, and Explorer link.
2. Keep synthetic Worker evidence and mocked relay visibly disclosed in the submission; do not claim authoritative monitoring or settlement.
3. Remove unsupported appeal, bond/slash, and dollar/dispute-value language from judge-facing copy unless implemented and measured.
4. Assemble the public repository/full-application submission package and scan every direct link, address, receipt, and secret before publication.

## 10. P1 - important

- Verify receipt status dynamically for any transaction claimed as finalized; do not infer finality from a pinned ID alone.
- Add a durable evidence snapshot or an immutable content-addressed retrieval path.
- Add owner/rate/duplicate policy after the narrow demo is stable; quantify reputation-spam impact first.
- Display `timestamp unavailable on Studio Next` rather than an empty/implicit timestamp.
- Resolve the two `genvm-lint` nested nondeterministic reachability warnings against current official tooling, or retain the documented exception with deployment evidence.
- Add the injected-wallet browser smoke and a screen-reader/accessibility pass; the static 390/768/1280 shell render has now been captured.

## 11. P2 - polish

- Capture a safe live no-consensus fixture.
- Improve structured error codes and next actions for wallet, RPC, Worker, malformed input, and contract errors.
- Clean stale historical docs and helper scripts before the submission checkpoint.

## 12. Things not to touch

Do not expand into continuous polling, Merkle batching, USDC escrow, production bridges, ENS, VRF, residential IPs, Gateway, procurement automation, or a general observability/security suite before the functional-attestation wedge is proven and a documented checkpoint authorizes it.

## Final verdict

**GO WITH CONSTRAINTS** for continued implementation and a controlled Studio demo. **BLOCKED** for "finished", "demo-ready" without wallet qualification, or "submission-ready" until the P0 findings and public-package gates are closed.
