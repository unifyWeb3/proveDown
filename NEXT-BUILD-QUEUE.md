# NEXT-BUILD-QUEUE.md — Build Queues (2026-09-05)

Derived from `CORE_NOW.md` + `ROADMAP.md` + `IMPLEMENTATION-ORDER.md` + `PRODUCT-SYSTEM.md`. Narrow by design.

## BUILD NOW (before Sep 17 — hackathon-blocking)

### N-1. Keep 3-case E2E green (re-run on reset)
- Problem: studio-dev may reset; dead demo = failed submission. Customer: judge. Feature: re-run `attest-studio-dev.mjs`, update contract addr everywhere. Outcome: 3 FINALIZED txs <10 min verifiable. Dependency: faucet + Worker live. Acceptance: `get_attestation` 3 states + explorer FINALIZED + `pytest` 9 passed. Test: read-script + `check-bundle.sh`. Demo value: existential. Startup value: submission exists. Complexity: low. **Status 2026-09-05: GREEN (fresh atts 4/5/6 FINALIZED, rep 57/4/2).**

### N-2. Claim packet (static copy block) — backend shape + data
- Problem: BREACH with no next action. Customer: pipeline operator. Feature: per-BREACH copyable block `{attestation_id, evidence_hash, SLO snapshot, explorer URL, reputation snapshot}`. Outcome: buyer files a credit claim / failover ticket with proof in one copy. Dependency: attestation JSON (have). Acceptance: packet fields match on-chain reads byte-for-byte. Test: recompute hash from bundle, compare. Demo value: high ("and here's what you do with it"). Startup value: first Layer-7 artifact, zero actuation risk. Complexity: low. (Rendering owned by HCI agent.)

### N-3. Fee panel data wiring
- Problem: "what does it cost?" unanswered. Customer: judge + buyer. Feature: deposit/consumed/refund rows per attestation from measured receipts. Outcome: cost quoted in GEN with evidence link. Dependency: receipt data (have). Acceptance: numbers equal `EVIDENCE.md`/`FEE-ECONOMICS.md`. Test: cross-check one receipt. Demo/startup value: credibility + pricing input. Complexity: low.

### N-4. Submission packaging + video
- Problem: unverifiable = unevaluated. Outcome: stranger clones → tests → verifies 3 txs in <10 min. Acceptance: `SUBMISSION-CHECKLIST.md` all checked. Complexity: low. Freeze features after Sep 14.

## BUILD NEXT (post-hackathon, ordered)

1. **5 interviews + 2 design partners** (kill-criterion evidence before any build spend).
2. **Real poller v1** (5-min probes → hourly bundle; jury logic unchanged).
3. **SLO presets + tolerance field + versioning** (contract update + redeploy).
4. **Real appeal** (`appealTransaction` wiring; closes dispute loop).
5. **Webhooks + claim-packet API + MCP tool** (verdict leaves the UI).

## DEFER (gated, not scheduled)

Merkle batch (needs poller volume), VerdictRegistry consumers + real relay (needs partner pull), reputation query API marketplace surface (needs ≥100 attestations), procurement verifier (needs SLA kill trigger), insurance/failover-actuation (needs overturn-rate data + capital partner), cross-chain reads, policy standard.

## NEVER BUILD

Betting, stigmergy, carbon/health features, product token/DAO, own escrow balance sheet, paywalled-source fetching, hot-path per-request attestation, automatic traffic actuation without validation data.
