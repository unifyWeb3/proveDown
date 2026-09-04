# 00 — Mission

## Objective
> What real problem can we solve today that becomes significantly more valuable because GenLayer can adjudicate subjective outcomes, interact with external information, coordinate/verify autonomous agents, and create trust at machine speed?

Product must have real users, real pain, real workflow, real economic value, credible distribution, defensibility, expansion room, believable architecture, credible GenLayer reason — and still be a real company on Sep 18, 2026.

## Non-Goals
- Generic AI agent, chatbot, AI wrapper, superficial blockchain app, dashboard with fake activity, basic escrow clone, simple arbitration demo, "AI+blockchain" gimmick that only looks good during judging.

## Working Principle
We continue until done properly. Every run is treated as if it will succeed because we learn from failures and consult best information before proceeding. We do not plan for failure.

## Methodology Adjustments (per approval 2026-09-01)
1. **Timeline compressed:** Thesis before Sep 3; 12-day plan parallelized, not sequential. Deeper research continues during implementation.
2. **Solo research:** Make reasonable assumptions; document for human veto; no blocking clarification loops.
3. **Verticals open:** No bias toward DeFi/AI/Web3/healthcare. Problem quality first.
4. **Distribution second:** Consider creator channels for GTM but do not bias discovery.
5. **Budget:** Prefer free/open (docs, GitHub, Bradbury faucet, local GenVM/Studio/GLSim). Flag paid APIs.
6. **Prior projects = lessons:** `genlayer-jury` / `contentbounty` are personal experiments. Inspect for technical lessons, mistakes, limitations, reusable patterns, failed assumptions. Do NOT use as saturation/market/ownership evidence. That requires independent external research.
7. **Independent discovery ≥ seeded concepts:** A/B/C and founder signals (auto-research, agentic commerce stack) are hypotheses, not destinations. If strongest opportunity is unrelated, choose it.
8. **Depth > quantity:** 12 deep > 30 shallow. Funnel is guideline: 12 → 8 → 4 → 2 → 1.
9. **Critical requirement:** Per finalist, answer technically specific: why GenLayer vs normal backend + AI API + Base/Ethereum/oracle? Is it economically important enough for a startup?
10. **No product build yet:** Research system, evidence, adversarial, thesis first. First `contracts/` only after MVP boundary defensible.

## Evidence Types
- **Verified fact:** observed on-chain, in docs/code, or 2+ independent sources.
- **Strong inference:** single authoritative source + consistent behavior.
- **Weak signal:** single source, anecdotal, or marketing copy.
- **Speculation:** hypothesis without evidence — labeled, never presented as fact.

## Prior Projects — Lesson Extraction (not market proof)
- `genlayer-jury`: 3 contracts (DisputeCourt generic, DisputeCourtV2 evidence-first with mode map, FlightDelay strict). Lessons: Strict/Comparative/Non-comparative mode selection; `gl.nondet.web.render` independent fetch + sanitize + hash; `run_nondet_unsafe` decision-field equality; `UNDETERMINED` first-class; why v1 cosmetic dependency rightly rejected (no on-chain tx).
- `contentbounty`: v2.2 bounties lifecycle, `post_bounty → submit_content (web.render + SHA256) → evaluate (exec_prompt 2-stage) → challenge → claim_reward`, claim-tag `cb-` + Keccak, 16k char limit, challenge windows 2d, allowlist hosts. Lessons: evidence pipeline determinism, retryable INCONCLUSIVE vs REJECTED, challenge bond economics, attempt limits.

Details in `01-genlayer-recon/` and `03-hackathon-intelligence/`.

## Funnel
```
12 deeply evidenced (02-market-research/01-problem-candidates-12.md)
  → 8 scored (05-opportunity-map/02-ranked-8.md)
  → 4 finalists (05-opportunity-map/03-final-4.md)
  → 2 adversarially tested (06-adversarial-analysis/)
  → 1 thesis (07-final-thesis/final-product.md, 25 sections)
```

## Quality Bar (§27)
Would founder believe we understand problem? GenLayer engineer recognize protocol depth? Investor not find obvious hole? Competitor not see how to destroy us? Solves real problem post-hackathon? Someone pays? Can become company? GenLayer genuinely important? More than demo? If NO → continue research.
