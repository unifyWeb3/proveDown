# CORE_NOW.md — What Is Necessary to Make the Current Product Compelling (2026-09-05)

Mandatory distinction: this file is the build boundary. Everything else lives in `PLATFORM_VISION.md`. If it is not here, do not build it before Sep 17.

## In scope (P0 — must work by Sep 17)

1. **3-case deterministic demo on Studio Next** — healthy→NO_BREACH, breach→BREACH, empty→INCONCLUSIVE, all FINALIZED + explorer links. FACT: already proven (`EVIDENCE.md`). Keep contract address `0xeE85...` current; re-run `attest-studio-dev.mjs` if studio-dev resets.
2. **Frontend productization P0-1..P0-7** (`frontend-gap-analysis.md`) — verdict dominance, loading/skeleton + 4-step tracker, single badge component, plain-language errors, REAL/MOCK visual language, a11y baseline, observed-vs-limit rows. Owner: HCI agent. This agent does not touch it.
3. **Fee transparency** — show deposit vs consumed vs refunded per attestation (FACT: measured ~0.1 deposit, ~7.9e-5 deploy, ~1.3e-4 attest consumed). Kills the "what does it cost?" judge question with real numbers.
4. **Claim packet (static, no chain)** — per BREACH, one copyable block: attestation_id + evidence_hash + SLO snapshot + explorer URL + reputation snapshot. No relay, no USDC. Proves downstream usefulness without building settlement.
5. **Appeal documented as mocked** — do not implement `appeal_attestation` before Sep 17 unless a full free day appears; label honestly, reference `appealTransaction` path for V1.5.
6. **Submission packaging** — repo public at submission point, README/DEMO/EVIDENCE/SUBMISSION-CHECKLIST current, demo video 60–90s script (`DEMO.md`), backup: prior real txs shown as recorded (never SSE mock as live).

## Explicitly NOT in scope (do not build Sep 3–17)

Continuous poller, Merkle batch, USDC escrow / `emit_transfer`, real Hyperlane/LayerZero relay, residential-IP probing, ENS policy hash, Gateway/CCTP, VRF work, 16-guard Playbook, procurement/code/security verifiers, token/DAO, second SLO type, composite multi-service SLA, paywalled/login/captcha sources (Gym 6.3% unresolvable FACT).

## Acceptance bar

Judge can (a) state the Uptime difference in one sentence, (b) click any verdict → explorer FINALIZED tx, (c) recompute `sha256(bundle) == evidence_hash`, (d) distinguish REAL from MOCK at a glance, (e) quote cost per verification in GEN. If all five hold, CORE_NOW is done.
