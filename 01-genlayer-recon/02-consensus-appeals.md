# 02 — Consensus, Equivalence, Validators, Appeals, Finality

**Sources:** S03, S04, S08, S09, S13, S15 (High confidence: docs)

## Optimistic Democracy
- Thesis: Bitcoin trustless money, Ethereum trustless computation, **GenLayer trustless adjudication**. Gap: x402, ERC-8004, A2A, ACP, Visa, Google AP2, Mastercard Agent Pay engineer happy path, none ship adjudication. [S04]
- **dPoS + Neural Consensus.** Delegation, deterministic `f(x)` selects **Leader + Validators per tx** weighted by `Weight=(0.6*Self+0.4*Delegated)^0.5` (sqrt damping, +50% self). Up to 1000 active per epoch (highest stake). `validatorPrime()` each epoch (permissionless, 1% of slashed). [S04, S09]

## Equivalence Principle
Decision tree: `Can validators reproduce exact normalized output? YES→ strict_eq, NO→ custom validator_fn (default)`. [S03]

| Mode | API | How validators operate | Cost | When | Example |
|---|---|---|---|---|---|
| Strict | `strict_eq(fn)` | Same fn, outputs match exactly | Cheapest | Deterministic/stable: API stable fields, single-word verdicts | FlightDelay `UPHELD/DISMISSED` [S17] |
| Comparative | `prompt_comparative(fn, principle)` or `EqComparative` template | Each runs fn independently, LLM judges equivalence vs principle (e.g., "`outcome` must match. Reasoning may differ") | Medium (+1 LLM compare) | Rich text where natural equivalence needed | V2 comparative verdict+remedy_follows [S15] |
| Non-comparative | `prompt_non_comparative` or `EqNonComparative*` templates | Validators **do not reproduce** — judge leader output vs same input/source+criteria via templates | Cheapest for open-ended but must verify substance | Summarization etc. | V2 non-comparative (actually reruns + checks both fields) |

**Warning (repeated in docs):** Validator must verify substance via source/independent computation, not schema-only (`verdict in {…} + 0≤conf≤100 + non-empty summary` = insecure, format ≠ correctness). `return True` = defeats consensus. [S03]
Templates `EqComparative`, `EqNonComparativeLeader/Validator` are customizable per validator (Lua `prompt_templates`) without contract change. Greybox opacity exposes LLMs used but not model/template/filter per validator → harder to target injection. [S04]

## Roles per Tx
- **Leader** proposes receipt via `leader_fn` (fetch+LLM). **Consensus validators** commit votes+cost, reveal. If majority → `Accepted`; else rotate leader → retry → if still no majority → `Undetermined` (state unchanged, first-class outcome). [S04, S08]

## Appeals & Slashing
- **Finality Window** after `Accepted` before `Finalized` — anyone can `genlayer appeal <txId> --bond 500gen` (bond auto-calc, `genlayer appeal-bond`). Gas pre-paid via tip or topped during window; insufficient → appeal fails. New validators added, double each round until majority or all validators. Correct appellant rewarded, incorrect loses bond. CLI: `genlayer receipt --status FINALIZED`, `trace --round N`. [S04, S13]
- **Slashing:** triggers missing Transaction/Appeal Execution Window (liveness), not wrong AI judgment (covered via disagreement → UNDETERMINED). Stake reduction, final after Window, +24h governance delay. [S09]
- **Finality:** Deterministic short window; non-deterministic longer (LLM/web variability). Subsequent deterministic txs contingent if prior nondet within Window. **Fast finality:** pay all validators immediate — costly, only if no prior nondet in Window. [S08]

## Latency/Costs (Medium confidence — inferred, not benchmarked table)
- Direct mode ms/test; Studio/integration min/test; testnet `receipt --interval 5000 --retries 100` → up to 500s (8min) for FINALIZED; ContentBounty `CHALLENGE_WINDOW=172800` (2d) long. [S08, S18]
- **Gas:** `genlayer estimate-fees` with `distribution{leaderTimeunits, validatorTimeunits, rotations}` + `messageAllocations`. Split: 10% validator owners, 75% total stake, 10% developers, 5% DeepThought AI-DAO; within 75% self vs delegated via shares. Sources = fees + inflation 15%→4% APR. [S09]
- **Staking:** 42k GEN validator, 42 delegator, epoch 1d, +2 activation, 7-epoch unbonding, 1:1 bootstrap epoch 0, sqrt damping limits whale (+41% weight for 2× stake). [S09]
- **Cost drivers:** Each `exec_prompt`+`web.render` = LLM + WebDriver. Minimize calls. [S06]
