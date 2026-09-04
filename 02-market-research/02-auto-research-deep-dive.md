# 02 — Auto-Research Deep Dive

**Founder signal:** "A well-defined problem given to many agents continuously improving result (e.g., make LLM kernel faster). Once many untrusted contributors participate, they game incentives, submit fake contributions, manipulate benchmarks, exploit rewards, submit malicious code, claim credit. GenLayer as autonomous judge for PRs: legitimate? actually improves? meaningful? farming? Then assign points/rewards. How to align many agents toward larger goals?" [00-mission]

**Do not copy; find deeper primitive.**

## Primitive
Auto-research = *decentralized continuous improvement with adversarial participants* where evaluation function is partly subjective (is this *meaningful* improvement?) and incentives create Goodhart pressure. The primitive is **anti-gaming evaluation of subjective contribution quality under adversarial volume**.

## Investigation per Category

| Category | Objective definition | Contribution definition | Evaluation | Incentives | Anti-gaming | Verdict |
|---|---|---|---|---|---|---|
| **Software optimization** (LLM kernel, compiler) | Clear: latency/throughput benchmark | PR with code + reproducible bench | Deterministic benchmark (e.g., `llama.cpp` tok/s) + GenLayer judges improvement significance (not just 0.1% noise vs 10% real, code quality, no benchmark hack) | Points/rewards per improvement | Deterministic replay + LLM rubric for gaming (hardcoded bench vs real workload, test overfitting) | **High** GenLayer relevance — hybrid deterministic+subjective (ContentBounty pattern: observations→criteria) |
| **Model optimization** | Validation loss/accuracy | Weights + eval script | Holdout not visible to agents | Leaderboard bounty | Prevent test-set leakage (private holdout fetched via web.render at evaluation time) | High — but needs private data custody (GenLayer web.render not designed for secrets) |
| **Formal verification** | Spec + properties | Proof/counterexample | Deterministic checker (Lean/Coq) | Bounded rewards | Less gaming — verifier is formal, not subjective | Low GenLayer need — deterministic verifier sufficient, no jury |
| **Security research** | Bug/bounty scope | Report + PoC | Replay PoC + LLM judge exploitability | Bounty + reputation | Deterministic replay + LLM judges impact (like #11 bug bounty pain) | Medium — niche, but maps to #11 |
| **Protocol research** | RFC/spec improvement | Proposal + benchmark | Subjective (is design better? tradeoffs?) | Governance points | Needs domain expert jury, not generic LLM | Medium — needs specialized validators |
| **Benchmark markets** (AI evaluation) | Benchmark task set | Model predictions | Deterministic scoring | Leaderboard money | Gaming via overfitting, leakage, eval hacks | High if benchmark is evolving (LLM judges new tasks) — but limited payer |

## Deeper Analysis: What Could Actually Work?

**Best wedge:** Software optimization where improvement is *measurable but gaming-prone*. Example: "Optimize this Python/JS/SQL function for throughput, 10% improvement on held-out realistic workload, no micro-benchmark hacking, no code obfuscation." Evaluation = deterministic bench replay in sandbox + LLM jury checks "is this idiomatic, maintainable, does it generalize or memorize warmup data?" That's exactly ContentBounty's two-stage pattern (observations → criteria bits + score bucket).

**Why not full auto-research marketplace as startup?**
- **Cold start:** Need repo owners willing to escrow meaningful rewards ($5k-50k) for optimizations. Who pays before network effect? Reverse bounty vs existing: why not just use existing bounty platform + human review (10× cheaper)?
- **Distribution:** Developers live on GitHub; asking them to define goals in a new marketplace adds friction. GitHub-native integration (GitHub App) required — heavy.
- **Incumbents:** Hugging Face, Kaggle, bounty platforms, internal performance teams already solve parts. AI code assistants (Copilot/Cursor) already optimize locally without marketplace.
- **Gaming arms race:** Even with jury, sophisticated agents will optimize for jury's prompt (prompt injection via PR description, adversarial code that passes deterministic bench but hides backdoor). Requires ongoing prompt hardening (Lesson from `01-genlayer-recon/03-constraints.md`: greybox sanitization).

**GenLayer necessity (preliminary):**
- Remove GenLayer → centralized backend with LLM API could judge PRs, but who trusts the judge when money is at stake? Centralized operator can be bribed (choose favored contributor), censored, or hacked. For open collaboration, trust-minimized jury matters.
- Replace with Base/Ethereum + oracle → can escrow + deterministic bench, but cannot judge *meaningful improvement* (subjective). Chainlink oracle is for objective data (price, result), not for "is this 0.1% noise or real architectural improvement?"
- Unique primitive: *Decentralized subjective evaluation with appeal* — multiple independent LLM validators + web-rendered bench logs + equivalence on `verdict=MEANINGFUL_IMPROVEMENT` + `remedy_follows`. Economically important if bounty pool >$10k (secures via appeal bond vs central operator trust cost).

**Score:** Pain 6/10 (real but niche: optimization enthusiasts + performance-sensitive co's), AI relevance 9/10, GenLayer relevance 8/10, **Startup potential 5/10** — strong technical fit, weak GTM as standalone company vs feature of existing GitHub/bounty infra. Better as *component* of larger thesis (e.g., OSS sustainability #5 where optimization bounties are one funding mechanism among many, not the product).

## Conclusion
Auto-research is genuine primitive but **not top startup pain** on its own. Carry forward lessons into finalists: use hybrid deterministic+LLM evaluation pattern, holdout via web.render, compare-and-set milestone hashes, challenge windows. Do not build "generic auto-research marketplace" as product — embed primitive where real payer already exists (OSS maintenance, procurement, API SLA).

**Sources:** S02-08 (primitives), S15-S18 (ContentBounty pattern), S25 (GenSwarm zero-token avoidance), S29-30 (procurement analog).
