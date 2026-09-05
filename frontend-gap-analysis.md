# Frontend Gap Analysis — P0/P1/P2

**Rule applied:** Every item justified by HCI principle + user need + product context + observed behavior. Taste-only preferences excluded.
**Reference implementation target:** `design.md`. No architecture/product changes.

## P0 — Confusing or broken core interaction (fix before productization)

### P0-1. Verdict is not visually dominant; essay card competes with product
- **Principle:** Nielsen #8 (minimalist) + #1 (visibility of status); user need: know the result in 1s.
- **Context:** Core thesis is neutral verdicts; demo must land in 60–90s.
- **Observed:** `index.html:38-56` — verdict and presets-essay cards are identical containers; verdict is card 3 of 4.
- **Fix:** design.md §4.1/§13/§16 — dominant verdict block, collapse explanations into `<details>`. Difficulty: easy.

### P0-2. No loading state; stale "No attestation yet." then silent populate
- **Principle:** Nielsen #1; user need: trust that the page is working during 2–10s reads.
- **Context:** Studio-dev reads are async; silence reads as broken.
- **Observed:** `index.html:40` + `liveRead()` has no pending branch.
- **Fix:** Skeleton rows + step tracker per design.md §22. Difficulty: medium.

### P0-3. Three visual languages for system state
- **Principle:** Nielsen #4 consistency; user need: one glance = one meaning.
- **Context:** Trust product with 5 truth states (real/pending/mock/inconclusive/failed).
- **Observed:** `verdictHtml` spans vs `registerStatus.textContent` vs `attestStatus.innerHTML`.
- **Fix:** Single badge component (design.md §18) everywhere. Difficulty: easy.

### P0-4. Raw engine errors shown to users
- **Principle:** Nielsen #9 (plain-language recovery); user need: know what to do next.
- **Context:** A pipeline owner seeing "Missing or invalid parameters. Double check..." concludes the *product* is broken, not their input — fatal for a neutrality story.
- **Observed:** `index.html:126,133` catch blocks dump truncated RPC errors.
- **Fix:** design.md §23 pattern × 5 failure classes. Difficulty: medium.

### P0-5. REAL vs MOCK carried by one paragraph
- **Principle:** Trust UX (core product = trust); user need: never wonder "is this real?".
- **Context:** Judges explicitly test this boundary.
- **Observed:** `index.html:54` paragraph; no badges, borders, or verified markers.
- **Fix:** design.md §31 blocks (green left-border + `✓ VERIFIED`, gray dashed + `○ MOCK`). Difficulty: easy.

### P0-6. Missing accessibility baseline
- **Principle:** WCAG 2.2 AA (not optional); user need: keyboard/screen-reader operability.
- **Context:** Hackathon judges include accessibility-aware reviewers; async verdicts are invisible to screen readers today.
- **Observed:** No `:focus-visible`, no `aria-live`, `#999` meta text ≈4.2:1, no reduced-motion rule.
- **Fix:** design.md §28 checklist. Difficulty: easy.

### P0-7. Cognitive recall burden (thresholds far from verdicts)
- **Principle:** Nielsen #6 recognition over recall; user need: understand *why* without scrolling.
- **Context:** "Why" is the differentiator vs Uptime.
- **Observed:** Verdict shows `p95 1600`, limits live two cards above.
- **Fix:** Observed-vs-limit rows per design.md §17. Difficulty: easy.

## P1 — Meaningfully degrades usability/trust

### P1-1. No onboarding strip (Define → Verify → Act)
Principle #2/#10; new users meet raw SLO JSON first. Fix: 3-step strip + per-threshold hints (design.md §15). Easy.

### P1-2. Attest button dead-ends without wallet
Principle #3 (no dead ends); observed `index.html:140-155` lecture-paragraph. Fix: split "View live results" vs "Request new attestation" with disabled-reason states. Easy.

### P1-3. Untested responsive behavior
Principle: responsive hierarchy; observed: no breakpoints, full hashes overflow at 390px. Fix: design.md §9/§32. Easy.

### P1-4. Engineer-voiced copy in primary UI
Principle #2; observed lines 80/94/144. Fix: design.md §29 rewrite. Easy (no code).

### P1-5. No one-click 3-case demo
Principle #7 efficiency; observed: manual preset switching per case. Fix: "Run demo" renders all three blocks (data already loaded). Medium.

### P1-6. Visual system unrefined (9 CSS declarations)
Principle #8 + trust aesthetics; observed lines 8-15. Fix: design.md §10–§12 tokens. Easy.

### P1-7. Dense essay card outranks product density
Principle #8; observed card 4 longest. Fix: collapse + spend density on evidence rows. Easy.

## P2 — Polish (post-hackathon)

- Sticky mini verdict bar on mobile scroll (design.md §32).
- Confidence bar animation (respecting reduced-motion).
- Copy-button microcopy + toasts for hashes/tx ids.
- Reputation trend sparkline (needs history beyond 3 attestations).
- Light mode / theming (explicitly out of scope in design.md appendix).
- `prefers-contrast: more` tuning pass.
- Transaction Kit full wallet-write UI (currently script path; needs pinned RC package + design review).

## What must be fixed before productization (minimal set)

P0-1 through P0-7. That is the whole list: dominance, loading, badges, errors, REAL/MOCK visuals, a11y baseline, observed-vs-limit rows. Everything else is P1 polish that does not block a credible demo.
