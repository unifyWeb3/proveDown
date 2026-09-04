# 05 — Benchmark Alignment (Gym)

**Date:** 2026-09-03
**Sources:** https://gym.genlayer.foundation/ , `/benchmarks/polymarket`, `/benchmarks/sources-bench`, `/about`, `/methodology` (fetched 2026-09-03), cumulative since May 5 2026

## What Gym measures

Gym is foundation-published benchmark evidence (not marketing page): each benchmark picks one real workload and answers one question with pipelines, daily data, classifiers, dashboards reproducible.

- **Polymarket benchmark** — “which prediction-market questions GenLayer can resolve from public URLs”. Funnel: on-chain feed (Chainlink/Pyth) → source URL exists → accessibility (direct family route or verified alternative, else currently unresolvable). Live cumulative May 5 → Sep 1 2026.
- **Sources benchmark** — “every web source GenLayer has classified — direct, alternative, blocked”. Funnel: tracked → probed (one of 4 renders: direct render, raw API, alternate reroute, streaming-rebind) → verified (deployed via GenLayer against representative market, decoded validator result matched source). Colors independent of funnel.

## Key results (evidence, not marketing)

**Polymarket:** 1,695,390 universe in cumulative window, 351,173 handed to Chainlink/Pyth, 25,103 no source URL, **1,319,114 (100%) IO-addressable** → **611,009 (46%) direct + 624,486 (47%) alt + 83,619 (6.3%) currently unresolvable** → **93.7% resolvable via Intelligent Oracle**. Cumulative Aug 19 2026 snapshot per day varies (e.g., Aug 22 48k markets 66.6% alt, Aug 31 13k 37.6% alt). Currently unresolvable breakdown: paywalled 5,072, hard blocked/no alternate 56,694, not yetclassified 21,853, unusable source 0.

**Sources:** 182 tracked → **121 (66%) direct, 42 (23%) alternative, 19 (10%) blocked** → 89.6% reachable. Verified means deployed via GenLayer on representative market and outcome matched source.

## What GenLayer is demonstrably good at

- Fetching **public URLs where source URL is named** and host is directly reachable or has verified alternative (alternative is like Liquipedia, bo3.gg, Flashscore, ESPN Cricket, Wikipedia for Polymarket) — 93.7% of addressable.
- When direct host blocks validator infra, routing to **verified alternative containing same fact** (47% of Polymarket, 23% of sources) — e.g., not official Polymarket named host but equivalent fact.
- Specific-page URL shapes (multi-segment) and source-family navigation from shallow homepage to deeper page (off-chain deeper-page agent picks page, hands URL to on-chain oracle — agent off-chain, oracle on-chain).
- Separating **deterministic price-feed markets** (Chainlink/Pyth 20.5% of Polymarket) where chain already has answer — Intelligent Oracle steps aside (correctly not used).

## What it struggles with (exposed limitations)

- **Currently unresolvable 6.3% (83,619) / 10% blocked sources:** paywall/login-wall/captcha, hard blocked/no known alternate (56,694), not yet classified, pure-consensus subjective markets. Gym explicitly does not ship best-effort scraping for these.
- **Alternate is agent-chosen not hardened whitelist:** `* Alternate is currently agent-chosen, not a hardened whitelist. Anyone publishing a blog post could in principle pass this gate. Reputation and approved-alternate lists are still open product work.` — trust risk for alternative routing.
- **Off-chain deeper-page agent:** When market names host but not specific URL, off-chain agent picks page; oracle runs on-chain. Quality depends on off-chain agent, not yet validated per-market on Bradbury.
- **TLS notary not shipped:** Paywalled/logged-in/rate-limited/IP-locked pages wait for TLS notary (cryptographic receipt that bytes came from HTTPS origin) — pilot in Twitter bounty, not shipped for Gym. Would unlock most currently unresolvable.
- **Accuracy backtest not done:** Headline is **coverage**, not per-market accuracy. Open question: replay closed markets through oracle on Bradbury and publish per-category accuracy. Next: hardened alternates, Bradbury in production (currently Studio runs for representative family checks), vertical-specific prompts (oracle prompt horizontal today).
- **Source-family route model:** Multi-segment path counts as specific but does not assert literal URL was executed; may use another page or official API within family — so coverage is modeled not per-market executed on Bradbury.

## What the methodology rewards

- **Having a source URL** in resolution criteria/description — without URL, no fetch (25k markets no URL go to human). Rewards explicit source design.
- **Public host directly reachable** (no paywall/login/captcha) — rewards public API/page choice.
- **Host family with supported route** (including official API when appropriate) — rewards using stable host families, not one-off blog.

## Whether ProveDown is aligned

ProveDown jury fetches **pre-computed bundle JSON from our own Worker** (`https://provedown-bundle.../bundle?preset=...`) via `gl.nondet.web.render(mode='text')`, not an arbitrary Polymarket source host. That bundle is:

- **Public host we control** with supported direct route — would be **Direct source** per Gym (validators reach host cleanly). Not an alternative reroute.
- **Stable 116-char JSON** (sanitized, 1/8 hash stable like `httpbin/json` not 5/5 dynamic) — not JS-heavy, not paywall, not captcha → not in currently unresolvable bucket.
- **Official API-like** (JSON) — Gym notes direct includes official API routes.

**Conclusion:** ProveDown asks GenLayer to do **what Gym proves it does well** — fetch a public stable URL directly and have validators agree on JSON verdict via `exec_prompt` on bundle vs SLO with tolerance. It does **not** ask for paywalled, login, hard-blocked, or pure-consensus subjective without URL. If ProveDown later fetches arbitrary customer API status pages with paywall/captcha, that would be outside strongest capability (would be 6.3% currently unresolvable).

## Remaining gap

- **Accuracy vs coverage:** Gym coverage 93.7% does not prove **LLM judge accuracy** on breach criteria (p95+500 etc.). That is our jury prompt accuracy, not yet backtested per-category (Gym open question). Our `05-provedown-technical-validation.md` analog showed breach/no_breach 3/3 stable, injection 2/2 resisted, but ambig reason drift — needs per-preset Bradbury backtest.
- **Hardened alternates:** Not needed for our Worker (direct), but if we fallback to alternative source for real probes post-hackathon, need approved-alternate list (open work).
- **TLS notary not needed for MVP** (public bundle) — correctly out-of-scope per `implementation-readiness.md:2`.

## Benchmark-to-Product Mapping

| Gym capability | ProveDown requirement | Mechanism used | Confidence | Remaining gap |
|---|---|---|---|---|
| **External source retrieval** (fetch public URL) | Fetch bundle JSON for jury | `gl.nondet.web.render(bundle_url, mode='text')` independent per validator, like Gym direct source | **High** — Gym proves 89.6% direct reachable; our Worker 116 chars stable 1/8 not 5/5 | None for MVP (public Worker). Post-hackathon if fetching arbitrary customer API with JS-heavy status page may need `mode='html'` or deeper-page agent |
| **Source accessibility handling** (direct vs alt vs blocked) | Bundle must be directly reachable, not paywall/captcha | Worker public HTTPS with `Cache-Control: no-store`, no auth — Gym direct bucket | **High** — not in 10% blocked or 5k paywalled | None. If later fetch arbitrary customer status page that is paywalled, would be Gym currently unresolvable → need TLS notary (not shipped) — correctly deferred |
| **Multi-validator reasoning** (agree on answer) | 5 validators agree breach bool | `gl.vm.run_nondet_unsafe(run_judgment, validator_fn)` where `validator_fn` compares `breach` bool only (reason ignored per technical validation) | **High** — Gym alternative reroute proves validators can reach different hosts but agree on fact via alternative; we reach same host but agree on breach | **WARN:** Gym does not yet measure per-market accuracy on Bradbury (open question). Our breach/no_breach 3/3 stable analog is not Bradbury backtest. Needs Studio/Bradbury per-preset run to confirm agreement rate >95% for clear presets |
| **Subjective/qualitative resolution** (LLM judges criteria) | Judge `p95 > p95_threshold+500 OR error>=threshold OR fill<...` — subjective threshold with tolerance | `gl.nondet.exec_prompt(judge_prompt(bundle, slo), response_format='json')` → `{breach, reason, confidence, reasoning}` with `<SYSTEM><SLO><BUNDLE>` DATA framing + `FORBIDDEN→[filtered]` | **Medium** — Gym oracle prompt is horizontal today, vertical-specific prompts are open question. Our prompt is vertical (SLO quality) and tested analog 3/3 stable for clear, but not yet Gym vertical. | Needs per-SLO backtest: near-threshold ambig (2100 vs 2500) correctly low conf 800 but reason drift (see 05 technical validation §3). Gap is confidence calibration for ambiguous |
| **Evidence normalization** (sanitize + hash) | Normalize bundle before hashing for summary | `greybox_sanitize` printable filter + `FORBIDDEN`→`[filtered]` + truncate 3000 + `sha256` like `dispute_court_v2.py:60` | **High** — matches Gym's need to handle variance (Gym alternative reroute handles host variance; we handle char variance) | None for bundle (stable JSON). Post-hackathon poller bundle may drift (window field) — need deterministic hash excludes timestamp |
| **Disagreement/inconclusive handling** (honest split) | Honest split at threshold → not false BREACH | `run_judgment` returns `status: inconclusive` on fetch fail/empty → `validator_fn` returns False if mine inconclusive → `result` not dict → store `no_consensus` per `provedown.py:258` (like Jury `UNDETERMINED` first-class) | **High** — Gym currently unresolvable bucket explicitly waits for TLS notary / human review rather than best-effort scraping — same honesty principle. | Frontend must show amber `no_consensus`/`inconclusive` not green/red — not yet built (P1 blocker) |

**Forced alignment check:** No forced alignment — all 6 map cleanly because MVP deliberately chooses **public stable JSON we control** (Gym direct) not paywalled/arbitrary host (Gym blocked 10%). If ProveDown later claimed to adjudicate arbitrary paywalled API status pages at fetch time, that would be **outside** Gym's strongest demonstrated capability and would be RED.

**What GenLayer is not yet good at (and we avoid):** Paywall/login/captcha (5k), hard blocked/no alternate 56k, pure-consensus subjective without URL — all gym currently unresolvable. ProveDown avoids all three.

**What methodology rewards that we exploit:** Having a source URL (SLO bundle URL) — without URL, Gym says no fetch (25k markets). We always have a bundle URL, even worker mock. Stable host family with supported route — we use our own host family (provedown-bundle) not one-off blog, so no hardened-alternate risk.

