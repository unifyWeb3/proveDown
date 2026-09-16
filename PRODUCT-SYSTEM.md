# PRODUCT-SYSTEM.md — ProveDown Product Layers (2026-09-11)

Loop: **Agreement → Evidence → Adjudication → Attestation → Downstream action.** Every feature must reinforce this loop or be deferred/rejected.

Status today (FACT, `EVIDENCE.md` + `contracts/provedown.py`): Layers 1–5 implemented and proven on Studio Next 61997. Layers 6–8 specified, partially mocked.

---

## Layer 1 — Agreement: what was promised?

Content: SLA record `{sla_id, api_url, bundle_url, slo_json, owner, created_at}`. SLO JSON today: `p95_threshold, error_threshold, fill_threshold, match_threshold` (+ p50 informational). Tolerance (+500ms p95) lives in the jury prompt, versioned with the contract.

State: CORE NOW (proven: `register_sla` deterministic validation, HTTPS-only, duplicate-guard, `EVIDENCE.md` 3 registers FINALIZED).

Near-term hardening (not new primitive): SLO presets per vertical (enrichment vs inference vs payments), tolerance as explicit SLO field instead of prompt constant, agreement versioning (SLO change = new version, old attestations stay pinned to old version).

## Layer 2 — Evidence: what proves what happened?

Content: pre-computed quality bundle JSON `{p50, p95, error, fill, match, probes, window}` served by Worker; jury fetches via `web.render mode=text`, sanitizes (`greybox_sanitize` + DATA framing, injection 2/2 resisted FACT), truncates 3000 chars, SHA-256 hashes.

State: CORE NOW but SYNTHESIZED (FACT: Worker `provedown-bundle.../bundle` serves 4 deterministic presets, hash-stable `b4fc2013...` 2/2). Honest label: proves adjudication, not collection.

Near-term: poller that aggregates real probes off-chain and serves hourly bundle JSON (same jury logic unchanged — `DEMO.md:34-36` already specifies this migration). Later: signed logs from provider + independent probes (matches track's "signed logs or decentralized monitoring" — we do decentralized monitoring first, signed logs second).

## Layer 3 — Adjudication: what decision must GenLayer make?

Content: single question — "did this bundle breach this SLO?" — answered by independent validators each fetching + judging, consensus on **breach bool only** (reason/confidence are UI, not consensus — validated 3/3 stable vs reason drift FACT).

State: CORE NOW (proven: `run_nondet_default`, `validator_fn` breach-only + unanimous-refusal rule, 3/3 FINALIZED).

Why GenLayer is load-bearing (FACT per docs.genlayer.com + genlayer.com): Optimistic Democracy, independent web + LLM calls inside the contract, and protocol-level finality/appeal mechanics. The current ProveDown application does not implement its own appeal method or bond/slash policy; those remain future work. The live slice demonstrates neutral consensus, not complete economic enforcement.

## Layer 4 — Attestation: what verifiable result is produced?

Content: `Attestation{attestation_id, sla_id, requester, timestamp, breach, reason, confidence, evidence_hash, evidence_summary, p50/p95, status}`. Explorer-verifiable (`/tx/0x...` FINALIZED + FINISHED_WITH_RETURN + isSuccessful). `evidence_hash == sha256(sanitized-and-truncated bundle bytes)`; the prompt judges normalized numeric metrics, so do not describe this as an exact raw-provider snapshot.

State: CORE NOW (proven A/B/C cases plus browser attestation 4). The frontend now surfaces deposit/consumed/refund fields when the finalized receipt returns them and shows an explicit unavailable state otherwise.

## Layer 5 — Reputation: how does history affect trust?

Content: Bayesian `score = (good+2)/(total+3)*100` per api_url, resolved attestations only (inconclusive excluded FACT). `get_reputation` view. Current live read is 66/3/1 after browser attestation 4; the canonical three-case snapshot was 60/2/1.

State: CORE NOW (storage + update proven) but THIN (2 resolved samples). Value unlocks with volume: routing ("pick fill≥80% provider"), trend ("down after breach"), history list. No formula in UI (design.md §21).

Near-term: reputation query API + history per attestation + trend line (needs >10 attestations to be meaningful — do not build sparkline on 3 samples).

## Layer 6 — Automation: what action can systems take?

Content: poller anomaly → auto-`request_attestation`; BREACH webhook → failover / error-budget block / PagerDuty; NO_BREACH → continue; INCONCLUSIVE → retry-with-backoff.

State: NEAR-TERM (30–90d). MVP is human-clicks-Attest (correct: proves loop before automating it). Prerequisite: real poller (Layer 2) + idempotency (don't attest the same bundle twice) + cost guard (max attestations per SLO per day).

## Layer 7 — Settlement: what financial consequence occurs?

Content: attestation as machine-readable input to money movement: credit claim with proof → escrow release/hold → parametric insurance payout.

State: LATER (90–180d+), MOCK today (FACT: bridge arrow + `bridgeProof` hash diagram, explicitly labeled mock `DEMO.md:25-26`). Track asks for "API escrow that releases against signed logs or decentralized monitoring" — OUR DESIGN: attestation is the release condition; we do NOT build the escrow itself in V1. Escrow already exists (Internet Court, AgentEscrow patterns); we become the verdict feed they call. Building our own escrow now = competing with the protocol team's flagship + splitting focus.

Order inside Layer 7: (1) VerdictRegistry read API others can call → (2) credit-claim helper (generates claim packet: attestation + hash + explorer link) → (3) real Hyperlane/LayerZero relay → (4) escrow/insurance integrations. Skip (3) until a partner escrow asks for it.

## Layer 8 — Interoperability: how do others consume attestation?

Content: read API (`get_attestation`, `get_reputation`), webhook events, MCP tool (`attest_sla`), SDK sidecar (`npm install provedown-sidecar`), VerdictRegistry on Base, policy-hash anchoring (ENS text record for SLO governance).

State: PLATFORM VISION (V3). Only exception: keep `get_*` views stable and documented from V1 — they are the future public API, cost nothing to preserve.

---

## Classification summary

| Layer | Now | 30–90d | 180d+ / Vision |
|---|---|---|---|
| 1 Agreement | CORE NOW (proven) | presets, tolerance field, versioning | machine-readable SLA standard |
| 2 Evidence | CORE NOW (synthesized, labeled) | real poller, hourly bundles | signed-log + probe hybrid |
| 3 Adjudication | CORE NOW (proven) | surface protocol appeal status when the app supports it | multi-round / high-value fast finality |
| 4 Attestation | CORE NOW (proven, including receipt fee panel) | claim packet | cross-chain attestation standard |
| 5 Reputation | CORE NOW (thin) | query API, history, trend | reputation marketplace / routing |
| 6 Automation | — | poller→attest, webhooks, failover | autonomous failover / procurement |
| 7 Settlement | MOCK (labeled) | VerdictRegistry read API, claim helper | real relay, escrow/insurance integrations |
| 8 Interop | views stable | MCP tool, sidecar SDK | verified-service marketplace, x402 conditions |

Rule: Layers 6–8 may be *designed for* (stable IDs, JSON schemas, view signatures) but not *built* until Layers 1–5 have >10 real customers attesting weekly.
