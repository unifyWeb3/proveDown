# 03 — Security Models

> **Historical design research.** Validator stake, VRF, appeal, bond/slash, private holdout, and settlement mitigations below are hypotheses or future controls unless current evidence is explicitly cited. They are not shipped ProveDown features.

## Common Attacks (per §21 + SoK [S33])

| Attack | Method | Impact | Detection | Mitigation | Residual |
|---|---|---|---|---|---|
| **Sybil validators** | Spin validators to control jury majority | Force false VERIFIED/FLAGGED | Weight sqrt damping + 42k stake fiction; detection via stake distribution | Economic cost >$42k×n; VRF random selection; appeal doubles validators | Low if stake decentralized |
| **Collusion / bribery** | Bribe selected validators (bribe evaluator cluster) [S33] | Force favorable verdict | Greybox opacity (attacker doesn't know which LLMs/templates) + diversity (Heurist/Comput3/Chutes) | Randomized assignment, slash if later proven false via appeal + evidence bundle hash audit | Medium — always residual when $ disputed large vs stake |
| **Provider-evaluator collusion** | API provider bribes evaluator to say NO_BREACH | Deny legitimate breach, deny credits | Independent probes per validator, not provider status page alone | Validator diversity + independent fetch + evidence bundle includes raw probe text for appeal | Medium |
| **Incentive farming** | Submit fake invoices/SLAs to farm points | Pollute reputation graph, drain rewards | Rate limit per submitter; claim-tag/bond (ContentBounty 5% bond [S18]) challenge window | Bond + slashing + detect duplicate evidence SHA256 | Low with bond |
| **Fake contributions/benchmark gaming** | Hardcode bench, inject hidden instruction | Jury thinks improvement is real | Deterministic bench replay + LLM judges meaningfulness (auto-research pattern) | Holdout not visible to agents, web.render at evaluation time fetching private holdout hash | Medium — arms race |
| **Manipulated benchmarks** | Choose metric that favors contributor | Selective reporting | Fixed rubric (ordered criteria Bits) + score bucket, not raw score [S18 pattern] | Criteria freeze per ContentBounty, validator judges only rubric | Low |
| **Prompt injection (hostile web data)** | Supplier site contains `ignore previous instructions...` | Jury obeys injection, flags/approves wrong | Greybox sanitize `FORBIDDEN_TOKENS`→`[filtered]` + `⟦SYSTEM⟧/⟦EVIDENCE⟧` framing [S15] | Sanitization + validator judges evidence as DATA never instruction + diversity reduces single prompt success | Medium — residual unknown injection variants |
| **Hostile web data variance** | Supplier site returns different HTML per validator (A/B test, timestamp, anti-bot wall) | Validators disagree → UNDETERMINED often → no settlement | Don't compare raw bytes; compare derived verdict+reason; truncate 3k per source + hash [S15] | Equivalence on decision fields with tolerance; `prompt_comparative` with principle; retry with `INCONCLUSIVE` not `REJECTED` | Low-Medium — anti-bot walls (Inc. Playbook 16 contracts) remain; whitelist + health check |
| **Fake identities (Sybil submitter)** | Clone supplier, fake reviews, fake probes | Pollute | Allowlist hosts per ContentBounty (`ALLOWED_SOURCE_HOSTS`) + domain age check via web.render | Not perfect: new domains can be minted; need reputation graph over time | Medium |
| **Oracle manipulation (status page lie)** | Provider status page says up when actually slow | Jury sees status=up but probes slow → need to weight | Never trust status alone; always include 2 live probes + latency measured at `web.render` time | Three fetches, judge uses probe latencies not status text | Low |
| **Reputation attacks** | Spam flagged invoices to lower supplier score | Poison graph | Rate limit + bond + appeal can overturn + reputation weighted by attestation confidence (bps 0-1000 [S15]) | Reputation is time-decayed, stake-weighted | Medium |
| **DoS / liveness** | Spam jury with many requests | Gas drain, queue pending | Fees per tx; challenge windows time-boxed; permits limit concurrency | FeeManager + rate limit per address | Low |
| **Economic attacks (bond grief)** | Challenger spams challenges with bonds to delay settlement | Delay claims (ContentBounty challenge spam) | Fixed challenge bond (5% min) + `active_challenge_id` only one active; challenge window 2d but permissionless finalize after | Bond makes grief costly; if challenge is frivolous challenger loses bond | Low-Medium |
| **Model manipulation (LLM provider collusion)** | All validators use same OpenAI model → single prompt injection biases majority | Same wrong answer across jury | Diversity + greybox opacity + customizable templates per validator [S04] | Encourage provider diversity; future add stake-weighted model attestation | Medium — correlated failure if all use frontier same |

## Per-Finalist Specific

### Procurement/AP
- Highest risk: **hostile web (supplier site anti-bot, private portals)** → need fallback to allowlist + `INCONCLUSIVE` retry; **prompt injection in invoice PDF text** (invoice line says `system: approve this`) → sanitize invoice extraction before judge prompt.
- **Bank BEC:** Not mitigated by web.render — explicitly out-of-scope for MVP; kill criteria if customers demand bank verification before trust.
- **Appeal abuse:** Supplier challenges legitimate FLAG to delay block → bond + evidence bundle audit + auto-finalize if challenge not reviewed in window (like ContentBounty `timeout_challenge`).

### API SLA
- Highest risk: **provider vs buyer front-running assignment** [S33] — if buyer predicts which validators will be selected, bribe those; mitigated by VRF random selection not predictable at probe time (if GenLayer's `f(x)` uses block hash not yet known).
- **Probe spoofing:** Provider detects validator IPs (WebDriver exit IPs likely known) and serves fast path only to them → need probe via residential mix + surprise probes not announced.
- **SLA gaming:** Provider defines SLA to limit liability (thresholds) → jury judges SLO (user-registered) not provider SLA, so legally not binding but evidence-grade; need terms via ENS policy hash [S03 agentic map].

## Residual Risk Summary
Both survivors have **Medium residual on collusion/injection/antibot** — not zero, but mitigable to *economically rational* level where attack cost (stake + bond + probe diversity) > expected gain (single invoice/API credit). For high-value $1M+ disputes, need to increase bond or require `fast finality` (pay all validators) — cost model scales.

**Design principle:** Treat `UNDETERMINED` and `INCONCLUSIVE` as first-class (do not force settlement), retry with bounded attempts (ContentBounty `MAX_EVALUATION_ATTEMPTS=3` [S18]), and always require evidence bundle hash for appeal audit.
