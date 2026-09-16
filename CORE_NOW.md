# CORE_NOW.md — What Is Necessary to Make the Current Product Compelling (2026-09-05)

Mandatory distinction: this file is the build boundary. Everything else lives in `PLATFORM_VISION.md`. If it is not here, do not build it before Sep 17.

## In scope (P0 — must work by Sep 17)

1. **3-case deterministic demo on Studio Next** — healthy→NO_BREACH, breach→BREACH, empty→INCONCLUSIVE, all FINALIZED + explorer links. FACT: already proven (`EVIDENCE.md`). Current contract is `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`; re-run `attest-studio-dev.mjs` if studio-dev resets.
2. **Frontend productization P0-1..P0-7** (`frontend-gap-analysis.md`) — verdict dominance, loading/skeleton + 4-step tracker, single badge component, plain-language errors, REAL/MOCK visual language, a11y baseline, observed-vs-limit rows. Owner: HCI agent. This agent does not touch it.
3. **Fee transparency** — show deposit vs consumed vs refunded per finalized write (FACT: measured in GEN; the frontend now shows the estimate and only receipt fields returned by Studio, with an explicit unavailable state).
4. **Claim packet (static, no chain)** — per BREACH, one copyable block: attestation_id + evidence_hash + SLO snapshot + explorer URL + reputation snapshot. No relay, no USDC. Proves downstream usefulness without building settlement.
5. **Appeal documented as mocked** — do not implement `appeal_attestation` before Sep 17 unless a full free day appears; label honestly, reference `appealTransaction` path for V1.5.
6. **Submission packaging** — repo public at submission point, README/DEMO/EVIDENCE/SUBMISSION-CHECKLIST current, demo video 60–90s script (`DEMO.md`), backup: prior real txs shown as recorded (never SSE mock as live).

## Explicitly NOT in scope (do not build Sep 3–17)

Continuous poller, Merkle batch, USDC escrow / `emit_transfer`, real Hyperlane/LayerZero relay, residential-IP probing, ENS policy hash, Gateway/CCTP, VRF work, 16-guard Playbook, procurement/code/security verifiers, token/DAO, second SLO type, composite multi-service SLA, paywalled/login/captcha sources (Gym 6.3% unresolvable FACT).

## Acceptance bar

Judge can (a) state the Uptime difference in one sentence, (b) click any verdict → explorer FINALIZED tx, (c) recompute `sha256(sanitized-and-truncated bundle bytes) == evidence_hash`, (d) distinguish REAL from MOCK at a glance, and (e) quote cost per verification in GEN from the fee estimate and finalized receipt panel. The browser wallet lifecycle is now proven on Studio 61997; public-package scanning remains open.
