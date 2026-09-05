# DOWNSTREAM-ACTION.md — What "ACT" Means (2026-09-05)

Loop ends: agreement → evidence → adjudication → attestation → **action**. First four proven; this file defines the fifth without building it prematurely.

## Chosen first action: route-away + alert on BREACH (failover recommendation)

- **Action:** on `resolved` BREACH, produce a machine-readable failover recommendation + human alert: `{attestation_id, sla_id, api_url, reason, confidence, evidence_hash, explorer_url, recommended_action: "failover|retry|shed-load", reputation_after}` delivered as (a) copyable claim packet in UI, (b) webhook POST (V1.5).
- **Trigger:** `status==resolved && breach==true && confidence>=800` only. Below 800 → "review" not "failover". INCONCLUSIVE/NO_CONSENSUS never trigger action — they trigger retry paths.
- **Required data:** attestation JSON + prior reputation + SLO snapshot (all already on-chain/readable; see `PRODUCT-INTERFACE-CONTRACT.md`).
- **Safety conditions:** never auto-execute traffic shifts in V1 (recommend, don't actuate — a false BREACH must cost an annoyed human, not an outage); idempotency key = `attestation_id` (same verdict never alerts twice); rate cap (max N actions per SLO per day — bounds jury-cost amplification); human override always one click.
- **Why it matters:** this is the job the customer hired us for (`PRODUCT-THESIS.md` §3) — "failover/claim/switch without an argument." A verdict with no next step is a dashboard; verdict → recommendation is a product.
- **Why NOT in current MVP:** hackathon MVP must prove *neutral judgment* (the hard, GenLayer-load-bearing part). Actuation without trust is worthless, and auto-actuation without volume data is dangerous. The static claim packet (copy block) delivers 80% of the value with 0% of the actuation risk — that IS in scope (`CORE_NOW.md` P0-4).
- **Later implementation (V1.5+):** webhook emitter + `attest_sla` MCP tool + error-budget connector (flip provider weight in caller's router on BREACH, restore on sustained NO_BREACH). Settlement-adjacent triggers (credit-claim filing, escrow hold) only after a partner escrow pulls the VerdictRegistry — never speculative.

## Evaluated and deferred

| Candidate | Verdict | Reason |
|---|---|---|
| Reputation penalty | KEEP (already automatic) | Deterministic on-chain update; the one action already shipped |
| Alert to human | KEEP (V1.5 webhook) | Zero-risk, direct failover enabler |
| Failover recommendation | CHOSEN (packet now, automation later) | Core wedge reinforcement |
| Auto-retry with backoff | DEFER to poller (V1.5) | Needs scheduler that doesn't exist yet |
| Credit/settlement trigger | DEFER to partner pull | Requires relay + counterparty escrow; mocked arrow suffices for hackathon |
| Route-away executed automatically | REJECT until volume-validated | False-positive blast radius unacceptable without overturn-rate data |
