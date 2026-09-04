# Uptime Gap Analysis — Direct Benchmark We Must Beat

**Date:** 2026-09-04 (launch-day alignment)
**Sources:** `https://github.com/genlayer-foundation/uptime` (README + `contracts/uptime_monitor.py`, `sla_verifier.py`, `sla_agreement.py` via raw.githubusercontent, fetched 2026-09-04), live `https://uptime.dev.genlayer.foundation`, `startup/01-genlayer-recon/05-benchmark-alignment.md`
**Rule:** Design intelligence, not template. Do NOT copy code/branding/UX.

## 1. What Uptime Verifies

Factual reachability/health of GenLayer infra services (7 hard-coded services: zksync_bridge, studionet_rpc, asimov_rpc, bradbury_rpc, explorer_studio/asimov/bradbury). Each check is `is_up: bool`:

- `rpc` type: `POST` JSON-RPC `eth_blockNumber` via `gl.nondet.web.post`, `status==200` + `"result" in body` → up, else `HTTP {status}` or `rpc_error`.
- `http` type: `gl.nondet.web.get(url)`, `status==200` → up, else `HTTP {status}`.
- Exception → `is_up=False, extra_data=str(e)[:200]`.

No latency percentile, no fill rate, no response quality, no composite functional thresholds.

## 2. What Data It Collects

Per `run_checks(timestamp: u256)`: loops `SERVICES`, stores `CheckResult{timestamp, is_up, extra_data}` under key `service_id:index`, increments `check_count[service_id]`. Views: `get_checks(service_id, offset, limit)`, `get_latest_check`, `get_all_latest`, `get_uptime_stats(service_id, last_n)` → `{total, up, uptime_pct (up*10000//n)}`. Cron: Vercel cron calls `run_checks()` at interval, off-chain Vercel KV cache syncs for dashboard.

## 3. Consensus Mode

`gl.eq_principle.strict_eq(do_check)` in `_check_service` — exact equality on `{is_up, extra_data}` dict. Deterministic/factual, no LLM. Correct for reachability where all honest validators should see same 200 + result field.

ProveDown uses `gl.vm.run_nondet_unsafe(run_judgment, validator_fn)` with `validator_fn` comparing `breach` bool only (reason ignored per technical validation). Requires `gl.nondet.exec_prompt(judge_prompt(bundle,slo), response_format="json")` LLM judge.

## 4. Strict vs Subjective Evaluation

- Uptime: **strict only**. No `exec_prompt`, no tolerance, no confidence, no reasoning. `extra_data` is `HTTP {status}` or empty — deterministic.
- ProveDown: **subjective with tolerance**. Prompt: `BREACH if p95 > p95_threshold+500 OR error >= threshold OR fill < threshold OR match < threshold`, returns `{breach, reason:LATENCY|ERROR_QUALITY|UNAVAILABLE|OK, confidence:0-1000, reasoning}`. Validates Gym open question (vertical-specific prompts).

## 5. What Counts as Failure

- Uptime: `is_up==False` (non-200, missing `result`, exception). Single binary per service per timestamp.
- ProveDown: `breach==True` with `reason` + `confidence` + `evidence_hash sha256:9566a...` + `p50/p95`. Ambiguous (p95 2100 vs 2500) → low conf 800 or `no_consensus` honest split, not forced. `empty` bundle → `INCONCLUSIVE`.

## 6. What Gets Stored

- Uptime: every check result on-chain (trustless SLA proof) + `check_count`, plus `SlaVerifier.VerificationResult{agreement_id, period_start/end, measured_uptime_bps, target_uptime_bps, sla_met, penalty_amount, timestamp}` and `SlaAgreement.PeriodSettlement{... net_payout, settled_by:"auto"|"internet_court"}`.
- ProveDown: `Attestation{attestation_id, sla_id, requester, timestamp, breach, reason, confidence u16, evidence_hash, evidence_summary, p50/p95, status:resolved|no_consensus|inconclusive}` + `Sla{sla_id, api_url, bundle_url, slo_json, owner, created_at}` + `reputation TreeMap[api_url] -> json{score,total,breaches}` Bayesian `(good+2)/(total+3)*100`.

## 7. Functional SLOs?

- Uptime: **No**. Only `is_up` bool. `sla_verifier.verify_uptime(service_id, last_n, target_uptime_bps)` checks `measured_uptime_bps >= target`, penalty models `linear|tiered|full` + 10% protocol fee. No p50/p95, no error/fill/match, no tolerance.
- ProveDown: **Yes**. Bundle `{p50:1561,p95:4800,error:0.02,fill:0.72,match:0.82,probes:100,window:"1h"}` judged against SLO JSON `{p95_threshold:2000,error_threshold:0.01,fill_threshold:0.80,match_threshold:0.85}` with +500ms tolerance.

## 8. Composite SLAs?

- Uptime: Partial. `SlaAgreement.service_ids: DynArray[str]` + `check_compliance(checks_to_evaluate)` loops services, `all_met` AND, worst-shortfall penalty via `calculate_penalty`. Still worst-of-uptimes, not functional composite (e.g., 5 APIs at 99.9→99.5 with fill dependencies).
- ProveDown: MVP single bundle per SLA (MAX_URLS=1), but bundle itself is composite histogram (100 probes window 1h). Post-hackathon Merkle batch 100→one rootHash is 90-DAY, not MVP.

## 9. Agent-Service Agreements?

- Uptime: Example agreements are infra-to-infra (GenLayer Labs pays Matter Labs for bridge, Foundation pays Labs for RPC). Customer/provider names + addresses, `service_ids_json`, target_bps, penalty_model, payment_schedule monthly/yearly. Readable by Internet Court (`check_compliance` is what Court validators call).
- ProveDown: Pipeline owner defines functional SLO for enrichment API used by agents (agent hires, QPM≥200 burst, 800 leads→47 skipped $50K). Agreement is `register_sla(sla_id, api_url, bundle_url, slo_json)` with owner = `gl.message.sender_address`. Same Internet Court readability pattern, but wedge is agent pipeline quality, not infra uptime.

## 10. Downstream Settlement?

- Uptime: Yes, deterministic. `record_verification` stores penalty/payout/protocol_fee, `settle_period` records `net_payout`, `settled_by`. No USDC transfer in MVP (calculation only), but `base_payment_monthly/yearly` + penalty math is settlement-ready. Internet Court can call `check_compliance`.
- ProveDown: Mock for hackathon per `implementation-readiness.md:9` — frontend shows `bridgeProof hash + Relay→Base VerdictRegistry` arrow (AgentEscrow pattern), not real Hyperlane tx. No `emit_transfer`. Real settlement is 90-DAY (same as Uptime's calculation-only today).

## 11. Reputation?

- Uptime: No reputation score. Only `uptime_pct` history + charts. No Bayesian score, no cross-service selection.
- ProveDown: **Yes**. `TreeMap[api_url]` confidence-weighted Bayesian like ArcSLA, `get_reputation` view, score 66→60/75. This is a decisive difference for agent downstream (auto-router picks best provider).

## 12. Rich Evidence?

- Uptime: `extra_data: "HTTP {status}"` or `""` or `rpc_error`. No hash, no bundle, no reasoning, no confidence.
- ProveDown: `evidence_hash sha256(clean[:3000])`, `evidence_summary "{url}: {len} chars sha256:{digest[:16]} p95={p95}"`, `p50/p95` fields, `reasoning[:500]`, `confidence 0-1000`, `timestamp gl.message_raw["datetime"]`. Hash-stable 116 chars 1/8 (b4fc2013... twice same, verified 2026-09-04).

## 13. UX / Architecture

- Uptime: Next.js 16 + React 19 + TS + Tailwind v4 + Radix + TanStack Query + Vercel KV cache + genlayer-js, Vercel cron → `run_checks(timestamp)` → on-chain → KV sync → dashboard (status, uptime %, charts, SLA compliance). Deployed studionet/asimov/bradbury.
- ProveDown: Static `frontend/index.html` 7.5K minimal (no Next build hang) for demo `register→attest→explorer→hash→reputation` + bundle preview + hash via `crypto.subtle`. Live mode would use `genlayer-js` writes to Bradbury 4221 (currently 1.1.8, must migrate to 2.0 RC per v0.6). Mock bridge arrow labeled mock.

## 14. What Uptime Does NOT Solve (ProveDown whitespace)

1. Functional quality (p95+500, error/fill/match) — only is_up.
2. Subjective tolerance + confidence + breach reason — only strict_eq.
3. Ambiguous outcomes as first-class (no_consensus/inconclusive amber) — only up/down.
4. Evidence bundle hash for independent re-validation — only HTTP status string.
5. Reputation for selection — only uptime % history.
6. Agent pipeline quality (enrichment fill where 200 but empty still breach) — only infra RPC/explorer.
7. Prompt-injection hardened jury (FORBIDDEN→[filtered] + DATA framing, 2/2 resisted) — no LLM, no need, but also no capability.

## Positioning Verdict

Candidate positioning **“neutral functional attestation for machine-to-machine service-quality agreements, beginning with API functional SLOs”** is **VALIDATED** against actual Uptime code. It is NOT “decentralized uptime monitoring” or “another consensus uptime service”:

- Uptime = factual reachability via strict_eq, deterministic penalty math.
- ProveDown = richer service-quality obligation via LLM jury with tolerance, evidence hash, breach reason, reputation.

Do NOT relabel ProveDown as uptime. Keep wedge language: functional SLO quality bundle, sidecar on top of Datadog/Pingoru not replacement, on-chain native (x402/Arc) first.
