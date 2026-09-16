# CUSTOMER-WORKFLOW.md — Commercial Workflow Design (2026-09-05)

> **Design / future-state document.** This describes the intended commercial workflow, not a claim that every step is implemented today. The current MVP has a synthetic Worker fixture, no application-level appeal method, no bond/slash policy, and a mocked downstream relay. See `research/CODEX_FULL_AUDIT.md` for current evidence.

Actor: **pipeline operator (buyer)**. Counterparty: **API provider** (does not need to sign up for V1 — attestation is buyer-initiated, provider participates only in dispute).

---

## Optimal workflow (OUR DESIGN, derived from proven loop)

```
1. DEFINE   buyer registers agreement (api_url + bundle_url + slo_json) → SLA stored, owner = buyer address
2. OPERATE  buyer's pipeline calls provider API normally (ProveDown NOT in hot path)
3. COLLECT  poller aggregates probes → hourly bundle JSON (V1: synthesized Worker preset; V1.5: real poller)
4. REQUEST  buyer (or poller agent) calls request_attestation(sla_id) + pays fee deposit (~0.1 GEN deposit, ~1.3e-4 consumed FACT)
5. JUDGE    validators independently fetch bundle + exec_prompt vs SLO → consensus on breach bool
6. FINALIZE buyer waits ACCEPTED → FINALIZED (minutes; pending tracker in UI, never a dead spinner)
7. ACT      BREACH → failover + claim packet; NO_BREACH → continue + log; INCONCLUSIVE/NO_CONSENSUS → retry path
8. ACCUMULATE reputation updates (resolved only) → routing + trend
```

Why this sequence and not provider-signed-first: FACT — track allows "signed logs OR decentralized monitoring"; provider signatures require provider cooperation (slow sales cycle, adversarial incentive). Buyer-initiated decentralized monitoring needs only one signature (buyer's) and works against uncooperative providers. Provider enters at dispute time (appeal with bond), which is the correct incentive order.

## Who initiates / pays / signs

- Initiates: buyer (human V1, agent V1.5+).
- Pays: buyer pays the attestation fee (subscription covers it; per-attestation overage possible). Any future appeal bond is a protocol/application design decision, not a current ProveDown payment.
- Signs: buyer signs `register_sla` + `request_attestation`. Validators' consensus IS the counterparty-neutral signature. No provider signature required for attestation validity.

## Evidence collected (per attestation)

Bundle `{p50, p95, error, fill, match, probes, window}` + `evidence_hash = sha256(sanitized-and-truncated bundle bytes)` + `evidence_summary` + tx timestamp. Retention: attestation + hash on-chain permanently; full bundle bytes via Worker/cache 90d minimum (matches SLA credit windows), 12-mo later.

## When verification happens (not per request)

Per-request attestation is uneconomic and unnecessary. Verification happens (a) on demand when buyer suspects breach, (b) on poller anomaly (p95>threshold+500 or fill drop), (c) scheduled (hourly bundle hash, on-chain attestation only on suspected breach or daily digest). Hot-path latency is never blocked on consensus.

## Dispute path

Provider (or anyone) may eventually dispute a BREACH through GenLayer's protocol appeal surface. The current ProveDown contract exposes no application-level appeal method or bond policy, so V1 treats this as documented future work; it does not claim an appeal transaction occurred.

## After-state table

| After BREACH | After NO_BREACH | After INCONCLUSIVE | After NO_CONSENSUS |
|---|---|---|---|
| Red verdict + reason tag + confidence bar; one-sentence plain-language cause; observed-vs-limit rows; claim packet (hash + explorer + SLO snapshot); reputation −; webhook `breach` | Green verdict + proof retained; reputation +; continue routing | Amber, "nothing was decided about quality" + missing-metric list + [Retry with fixed bundle]; no reputation change | Amber outline, "validators honestly disagreed at threshold" + [Retry] [Adjust SLO tolerance]; no reputation change |

## Minimal UI contract for HCI agent (no implementation here)

Screens: setup (register) → workspace (request) → verdict (result+reason+confidence) → evidence (observed-vs-limit + hash + bundle preview) → reputation (score+trend+history) → proof (explorer links, fee panel). Data required per verdict: pill, reason tag, plain sentence, confidence 0–1000 as bar+%, 4 observed-vs-limit rows, truncated hash + copy + full-on-explorer, p50/p95, tx link with FINALIZED state, step tracker during pending. States: all four verdicts + 5 failure classes (revert, RPC, worker, wallet, malformed SLO) per design.md §23.
