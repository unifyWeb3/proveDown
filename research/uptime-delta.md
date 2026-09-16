# Uptime Delta Audit

Date checked: 2026-09-09

Sources:

- Uptime README: https://raw.githubusercontent.com/genlayer-foundation/uptime/main/README.md
- Uptime monitor contract: https://raw.githubusercontent.com/genlayer-foundation/uptime/main/contracts/uptime_monitor.py
- Uptime SLA verifier: https://raw.githubusercontent.com/genlayer-foundation/uptime/main/contracts/sla_verifier.py
- ProveDown contract: `contracts/provedown.py`
- Live Agent Tank entries: https://portal-admin.genlayer.foundation/api/v1/missions/83/entries/

| Dimension | Uptime | ProveDown | Who wins | Evidence |
|---|---|---|---|---|
| Primary question | Is a GenLayer infrastructure endpoint reachable/healthy? | Did an agreed API functional-quality bundle satisfy p95, error, fill, and match thresholds? | ProveDown for functional quality; Uptime for infrastructure reachability | Uptime `is_up` and `extra_data`; ProveDown prompt and stored fields |
| Data source | Hard-coded GenLayer RPC/explorer checks | Buyer-registered HTTPS Worker bundle | Neither universally; ProveDown is currently demo-synthesized | Uptime `SERVICES`; Worker README says synthesize for hackathon |
| Consensus | `gl.eq_principle.strict_eq(do_check)` | `gl.vm.run_nondet_default` with independent judgment and consensus on breach bool | Different problem, not a UI delta | Source contracts |
| LLM judgment | None | `gl.nondet.exec_prompt` judges bundle against SLO | ProveDown for subjective/semantic quality | `contracts/provedown.py:239-285` |
| Tolerance/confidence | No tolerance or confidence field | +500ms p95 tolerance and 0-1000 confidence | ProveDown | Prompt and attestation schema |
| Evidence | HTTP status/RPC error text | SHA-256 of sanitized bundle, summary, p50/p95 | ProveDown | `evidence_hash` live reads |
| Missing evidence | Check becomes `is_up=false` | Explicit `inconclusive`, confidence 0, no hash | ProveDown for non-definitive handling | Live attestation 3/6 |
| Reputation | Uptime percentage/history | Bayesian API reliability score | ProveDown for provider selection | `get_reputation` live read |
| Settlement | SLA verifier calculates uptime penalty/payout | Cross-chain relay is mock; no payment settlement in current contract | Uptime currently has a more explicit settlement calculation | Uptime `record_verification`; ProveDown docs/UI |
| Scope | GenLayer infrastructure services | One registered API agreement and one bundle per attestation | Complementary | Source code |
| Current ecosystem overlap | Direct benchmark | Current entries include AgentSLA, AgentzProof, x402Proof, ModelSeal, Agent Escrow Court, and FirstFault | Uptime is not the only competitor; ProveDown needs a sharper wedge | Live Agent Tank entries endpoint |

## Ten-second explanation that survives scrutiny

"Uptime can prove an endpoint was reachable. ProveDown can prove a reachable API still failed the buyer's functional obligation, such as returning HTTP 200 while fill was 72% against an 80% requirement, and it records a hash of the sanitized/truncated evidence bytes used by the contract."

That statement is supported by the current code and pinned live attestations. It must not expand into claims of real polling, production data, or settlement, because the current Worker is synthesized and the bridge is mocked.

## Differentiation risk

The delta from Uptime is technically real, but the live Agent Tank feed contains multiple projects describing generic AI-judged work/SLA/proof/escrow. A judge can still see ProveDown as another evidence-to-verdict product unless the demo spends its first 10 seconds on the HTTP-200-but-functional-breach case and then shows the hash and reputation consequences.
