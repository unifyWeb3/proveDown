# Hackathon Alignment — Agentic Commerce Infrastructure (SLA Enforcement Track)

**Date:** 2026-09-04
**Sources:** Hackathon page (Track: Agentic Commerce Infrastructure, Requested: SLA and uptime enforcement — API escrow that releases against signed logs or decentralized monitoring, Live project: Uptime), `04-competitive-intelligence/uptime-gap-analysis.md`, `01-genlayer-recon/05-benchmark-alignment.md` + `06-consensus-v06-migration.md`, `https://docs.genlayer.com/developers/consensus-v06-migration`
**Rule:** Do NOT reopen funnel. Adapt validated thesis to actual track + env.

## 1. Track Fit

Track explicitly asks for **SLA and uptime enforcement — API escrow that releases against signed logs or decentralized monitoring**. ProveDown is **neutral functional attestation for service-quality agreements (bundle p95>2000+500 OR error/fill/match), beginning with API functional SLOs** — clearly within track, but NOT a clone of Uptime:

- Uptime verifies factual reachability (`is_up` via `strict_eq`, `gen_dbg_ping`/`GET 200`) for GenLayer infra, stores `CheckResult`, verifies `uptime_pct` vs target, calculates `linear|tiered|full` penalty + 10% fee.
- ProveDown verifies richer obligation was fulfilled (latency percentile + fill rate + response quality + composite thresholds + evidence bundle + ambiguous outcomes + breach reason + reputation + eventual settlement) via LLM jury `run_nondet_unsafe` on `breach` bool.

## 2. Decisive Difference (why not just Uptime with nicer UI)

**One decisive, demonstrable difference:** Uptime answers “was it reachable?” with strict consensus; ProveDown answers “was the service-quality obligation fulfilled?” with tolerant LLM consensus + evidence hash + reputation.

Technically demonstrable in 60s:
- Same bundle `p95 4800 fill 0.72` → Uptime-style `GET 200` would say UP (HTTP 200), ProveDown jury says BREACH (LATENCY+ERROR_QUALITY, confidence 900, hash `b4fc2013...`) because fill <80% even though reachable.
- `no_breach` preset (p95 1600 fill 0.95, HTTP 200) → both say OK, but only ProveDown stores `evidence_hash sha256:64e6...` + `confidence 1000` + Bayesian reputation 75.
- `ambig` (p95 2100 near 2500 tolerance) → Uptime has no amber; ProveDown returns low-conf 800 or `no_consensus` honest split.

Useful to customers (pipeline owner $50K enrichment failure where 200 but empty still breach), relevant to agentic commerce (QPM≥200 burst, composite 99.5%, x402/Arc per-call SLA needs quality not just ping), difficult to dismiss as cosmetic (different consensus `strict_eq` vs `run_nondet_unsafe` + `exec_prompt`, different stored fields, different downstream: reputation/router vs uptime % chart).

If we cannot show this live on studio-dev, escalate before expansion (per §9).

## 3. Environment Target

- **Primary:** Studio-dev `https://studio-dev.genlayer.com/api` 61997 with `genlayer@0.40.0-rc.3` + `genlayer-js@2.0.0-rc.1` + `genlayer-py==0.19.0rc2` + `genlayer-test==0.30.0rc2` + `genvm-linter==0.11.1rc2` + `fee-profile.json` + Transaction Kit. All new writes must carry `distribution` + `feeValue` from live estimate, checked via `isSuccessful` (ACCEPTED/FINALIZED + FINISHED_WITH_RETURN).
- **Compatibility/reference:** Bradbury `0x72a67E0cF59bCb526AEF0D81391e399C56703590` (deploy tx `0x89f1...`, healthy register `0x0947...`, healthy att `0xed5a...`) remains as prior real evidence, but NOT primary hackathon target until v0.6 promoted there. Studio-dev may reset — note reset risk in demo.
- **Worker:** Live `https://provedown-bundle.contentbounty.workers.dev/bundle` (200, 4 presets, hash stable `b4fc2013...` twice, no timestamp/random/secret, verified 2026-09-04) — Gym direct, not paywall/captcha (avoids 6.3% currently unresolvable).

## 4. Fee Economics (revalidated, not reused)

Old `$0.04–0.08` in `final-product.md` is **INVALID** under v0.6. New model: deposit covers consensus time units + execution (receipt/storage/rollup) + child messages + appeal/rotation posture; unused refunded at finalization. Must measure via `gltest --fee-profile` on studio-dev for `register_sla` (cheap deterministic) vs `request_attestation` (expensive: 1×web.render + 1×exec_prompt + breach bool consensus) vs appeal (bond + 1.5× profit = 2.5× total). Display deposit vs consumed vs refund separately. Until profile measured, economics are **UNKNOWN** — do NOT quote old number to judges.

## 5. What Must Be Built Today (narrow, no kitchen-sink)

Agreement (`register_sla` with SLO JSON) → evidence (Worker bundle 116 chars stable) → independent evaluation (`web.render` + `exec_prompt` jury, breach bool only) → attestation (`Attestation` + `evidence_hash` + `confidence` + `reputation`) → downstream action (mock BridgeProof arrow to Base VerdictRegistry, reputation panel). No continuous poller, Merkle batch, USDC escrow, DAO/token, multi-chain real, ENS, Gateway, Playbook guards, procurement 90d.

## 6. What Must NOT Be Built

Generic uptime ping (Uptime already does), deterministic per-call marketplace (ArcSLA live), pure status-page scraper (Pingoru $15), betting, stigmergy, carbon/health. From Gym: no paywalled/login/captcha fetching (would be currently unresolvable 6.3%).
