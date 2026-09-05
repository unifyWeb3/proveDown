# DECISION-LOG.md — Important Product Decisions (2026-09-05 onward)

Append-only. Each entry: decision, why, evidence, alternatives rejected.

## D-01 (2026-09-05): Lock thesis as functional attestation, not monitoring

Decision: "neutral functional attestation for machine-to-machine service agreements."
Why: proven differentiator (200-but-breach tx `0xe04d...`); monitoring framing loses to Uptime/Datadog on their terms.
Evidence: `EVIDENCE.md` 3 cases; `uptime-gap-analysis.md:14`.
Rejected: "decentralized uptime monitoring", "oracle", "escrow" (V1).

## D-02 (2026-09-05): First customer = pipeline operator buying API capacity

Why: only candidate with pain + budget + self-serve motion; converged from thesis + HCI (`design.md:2`).
Evidence: `final-product.md:124`, interview kill criterion pending.
Rejected: providers, generic enterprise, DAOs, "all agents" as first.

## D-03 (2026-09-05): Buyer-initiated decentralized monitoring before provider-signed logs

Why: one signature, works against uncooperative providers; provider enters at dispute (appeal bond) — correct incentive order. Track allows either (portal FACT).
Rejected: provider-signature-first (slow, adversarial incentive).

## D-04 (2026-09-05): No own escrow in V1; attestation as release condition others consume

Why: escrow exists (Internet Court, AgentEscrow); building ours splits focus + competes with protocol flagship.
Evidence: track ecosystem listing (portal FACT).
Rejected: ProveDown escrow / USDC holding before relay demand exists.

## D-05 (2026-09-05): Retire dollar fee estimates; model in GEN until mainnet pricing

Why: v0.6 fee lifecycle refunds majority; old $0.04–0.08 invalid.
Evidence: `EVIDENCE.md` fee accounting; `hackathon-alignment.md:4`.
Rejected: quoting old numbers to judges/customers.

## D-06 (2026-09-05): Procurement stays fallback, not parallel build

Why: same jury pattern, different verifier; SLA wins timing + hack-feasibility, procurement wins payer clarity (`08-procurement-vs-sla.md` 3-3-1).
Trigger: pivot only on SLA kill criteria (PRODUCT-METRICS).
Rejected: dual-wedge build; premature pivot on payer argument alone.
