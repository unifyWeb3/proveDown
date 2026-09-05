# IMPLEMENTATION-ORDER.md — Exact Sequence with Acceptance Criteria (2026-09-05)

Rule: no phase starts until prior acceptance holds. Frontend phases owned by HCI agent; listed here as interface dependencies only.

## Phase 0 — Freeze + green (Sep 5–6)

Build: re-verify E2E (`check-env`, `run-tests`, bundle curl, 3 `get_attestation` reads); pin versions.
Why: studio-dev may reset; everything downstream assumes green.
Acceptance: 3 txs FINALIZED + `pytest` 9 passed + Worker 200 × presets.
Tests: `bash scripts/run-tests.sh`, `node scripts/check-env.mjs`, `bash scripts/check-bundle.sh`.
Customer value: demo cannot silently rot.
Breaks: reset → re-run `attest-studio-dev.mjs`, update contract addr in frontend + EVIDENCE.

## Phase 1 — Frontend productization (Sep 6–10, HCI agent)

Build: P0-1..P0-7 per design.md + fee panel slot + claim-packet slot (this agent specifies data, HCI renders).
Why: verdict is the product; current mean score 4.8 (`frontend-hci-audit.md`).
Acceptance: §CORE_NOW 5-point bar (Uptime sentence, explorer click, hash recompute, REAL/MOCK glance, GEN cost quote).
Customer value: 60-second comprehension → failover/claim.

## Phase 2 — Fee panel + claim packet (Sep 10–12)

Build: read `fee_accounting` from receipts; render deposit/consumed/refund per attestation; static claim-packet copy block.
Why: cheapest credibility + usefulness per hour remaining.
Acceptance: numbers match `EVIDENCE.md` receipts; packet contains attestation_id + hash + SLO snapshot + explorer + reputation.
Breaks: fee field names change across RC → read from live receipt, don't hardcode.

## Phase 3 — Submission (Sep 12–17)

Build: public repo at submission point, video, form text (`SUBMISSION-CHECKLIST.md`), backup-tx strategy.
Acceptance: stranger can clone → test → open frontend → verify 3 txs in <10 min.
Do not: add features after Sep 14. Only re-verification commits.

## Phase 4 — V1.5 interviews + poller (post-hackathon month 1)

Build: 5 interviews → poller v1 → SLO presets/versioning → real appeal → webhooks.
Order logic: willingness evidence before poller spend; poller before presets (real data shapes preset design); appeal before webhooks (dispute path must exist before automation amplifies volume).
Acceptance per feature in ROADMAP P1 rows; kill criteria evaluated (PRODUCT-METRICS).

## Phase 5+ — V2 commercial (90d) → V3 platform (12mo)

Gated: Phase 5 starts only with ≥2 design partners attesting weekly + gross margin positive on GEN-measured costs. Platform phases gated on V2 retention.
