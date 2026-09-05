# Frontend HCI Audit — Scorecard (current `frontend/index.html`, 158 lines)

**Method:** Heuristic evaluation against Nielsen's 10 + WCAG 2.2 AA + trust-UX review of actual code (not assumptions). Static code inspection only — no browser automation available (see §16 limitation in task; documented, not pretended).
**Scale:** 0–10. Below 8 requires why + concrete issue + fix + difficulty + priority.

## Scores

| # | Criterion | Score | Verdict |
|---|---|---|---|
| 1 | Clarity | 5 | ❌ below 8 |
| 2 | Learnability | 5 | ❌ |
| 3 | Discoverability | 4 | ❌ |
| 4 | Hierarchy | 4 | ❌ |
| 5 | Consistency | 5 | ❌ |
| 6 | Feedback | 4 | ❌ |
| 7 | Error handling | 4 | ❌ |
| 8 | Trust communication | 6 | ❌ |
| 9 | Accessibility | 5 | ❌ |
| 10 | Responsiveness | 4 | ❌ |
| 11 | Visual quality | 5 | ❌ |
| 12 | Density | 6 | ❌ |
| 13 | Cognitive load | 5 | ❌ |
| 14 | Copy quality | 5 | ❌ |
| 15 | Task efficiency | 5 | ❌ |

**Mean: 4.8.** Honest reading: a working demo page with real data, not a product UI. Every criterion needs work; none is catastrophic (functionality is real and labeled).

## Below-8 details

### 1. Clarity — 5
- **Why:** Four cards compete at equal visual weight (setup / attestation / verdict / presets+essay). The verdict — the product — is card 3 of 4, same border, same size as the essay card.
- **Concrete:** `index.html:38-56` — verdict card and "Demo Presets" explanation card are visually identical containers; a first-time user cannot tell which one is the product.
- **Fix:** Apply design.md §4.1 + §13: verdict card gets dominant scale (24px result), explanation cards become collapsed `<details>`. Difficulty: easy (CSS + tags). Priority: P0.

### 2. Learnability — 5
- **Why:** No onboarding path; the page assumes the reader knows what an SLO bundle is. Card 1 drops raw SLO JSON on a first-time user with no example of what happens next.
- **Concrete:** `index.html:27` — `sloJson` textarea prefilled with thresholds but zero explanation of what each threshold does until the presets card far below.
- **Fix:** One-line hint per threshold + preset select shows consequences ("breach — expect BREACH") per design.md §15; add 3-step orientation strip (Define → Verify → Act). Difficulty: easy. Priority: P1.

### 3. Discoverability — 4
- **Why:** The two primary actions (Register, Request Attestation) look identical to decorative buttons; nothing indicates the page auto-loads live results on open, and the wallet path is a dead-end paragraph.
- **Concrete:** `index.html:140-155` — attest handler without wallet only re-runs reads; a user clicking "Request Attestation" expecting action gets a lecture.
- **Fix:** Split actions: "View live results" (reads, always works) vs "Request new attestation" (wallet/script-gated, disabled with reason when unavailable) per design.md §14. Difficulty: easy. Priority: P0.

### 4. Hierarchy — 4
- **Why:** H1 + four H3 cards + essay paragraphs all share one column at similar sizes; evidence hashes (secondary) render at the same prominence as verdict labels (primary).
- **Concrete:** `index.html:110` — hash + summary string runs inline at 0.85em directly under verdict with no grouping or collapse.
- **Fix:** design.md §5/§13/§19: verdict block → reason sentence → confidence bar → collapsible evidence. Difficulty: easy. Priority: P0.

### 5. Consistency — 5
- **Why:** Status communicated three different ways: colored spans (verdict), plain text (registerStatus), and paragraphs (attestStatus). No shared badge component.
- **Concrete:** `verdictHtml` (line 103) vs `registerStatus.textContent` (line 89) vs `attestStatus.innerHTML` (line 144) — three visual languages for "system state".
- **Fix:** Single badge component per design.md §18 used by all three. Difficulty: easy. Priority: P0.

### 6. Feedback — 4
- **Why:** `liveRead()` fires on load with no loading state — the verdict card shows stale "No attestation yet." for seconds, then silently populates. Writes show a static paragraph, not progress.
- **Concrete:** `index.html:40` initial text + no skeleton; `index.html:102-135` no pending branch during reads.
- **Fix:** Skeleton rows on load + 4-step tracker for writes per design.md §22. Difficulty: medium (async state machine). Priority: P0.

### 7. Error handling — 4
- **Why:** Only the happy path is rendered. RPC failure shows raw `e.message.slice(0,120)`; reverted txs, malformed SLO JSON, and worker failure have no designed states despite the contract defining them.
- **Concrete:** `index.html:126,133` — catch blocks dump truncated engine errors to users ("Missing or invalid parameters. Double check...").
- **Fix:** design.md §23 pattern (plain cause → impact → next action → `<details>` technical) for all five failure classes. Difficulty: medium. Priority: P0 (trust-critical: raw errors destroy the neutrality story).

### 8. Trust communication — 6 (highest score)
- **Why:** Real-vs-mock is stated in text and explorer links are real — the honesty is present but only typographic. No visual REAL/MOCK language, no verified badges, confidence is a bare number.
- **Concrete:** `index.html:54` paragraph carries the entire REAL/MOCK burden; `conf 980/1000` has no bar or meaning.
- **Fix:** design.md §31 blocks + §20 confidence bar. Difficulty: easy. Priority: P0 (core product = trust).

### 9. Accessibility — 5
- **Why:** Semantic bones exist (`lang`, labels, buttons) but: no `:focus-visible` styles, no `aria-live` for async verdict updates (screen-reader users never hear results arrive), hash text `--text-2 #999` ≈ 4.2:1 (fails 4.5:1), no reduced-motion rule, status conveyed partly by color-adjacent spans (text present, so 1.4.1 holds — barely).
- **Concrete:** `index.html:7-16` CSS has zero focus, media-query, or aria rules.
- **Fix:** design.md §28 checklist (focus ring, live region, `#a8a8a8`, reduced-motion, 44px targets). Difficulty: easy. Priority: P0 (baseline, not polish).

### 10. Responsiveness — 4
- **Why:** `max-width:900px + 1rem padding` degrades gracefully but nothing is designed: full tx hashes overflow narrow screens, textarea SLO JSON requires horizontal scroll, no breakpoint rules exist.
- **Concrete:** `tx.slice(0,10)` truncation exists only in links; evidence summary strings run full-width.
- **Fix:** design.md §9/§32 (definition rows, truncated hash + copy, 640px breakpoint). Difficulty: easy. Priority: P1.

### 11. Visual quality — 5
- **Why:** Coherent dark terminal aesthetic (fits GenLayer/Clasp references) but unrefined: one border color, one radius, no surface steps, no status treatments. Reads "prototype with taste" — acceptable for hackathon only if hierarchy is fixed.
- **Concrete:** Entire visual system is 9 CSS declarations (lines 8-15).
- **Fix:** design.md §10–§12 tokens (no new aesthetic direction needed). Difficulty: easy. Priority: P1.

### 12. Density — 6
- **Why:** Information per pixel is reasonable; the failure is *ordering*, not volume. The presets essay card is the densest and least important — invert that.
- **Concrete:** Card 4 (`index.html:45-56`) is the longest card and contains marketing copy, not product.
- **Fix:** Collapse explanation cards; spend density budget on observed-vs-limit rows. Difficulty: easy. Priority: P1.

### 13. Cognitive load — 5
- **Why:** User must hold SLO thresholds (card 1), preset meanings (card 4), and verdict numbers (card 3) in memory simultaneously — classic recall burden (Nielsen #6 violation).
- **Concrete:** Verdict shows `p95 1600` with no adjacent limit; user scrolls up to compare against `p95_threshold 2000`.
- **Fix:** Observed-vs-limit rows beside every verdict (design.md §17). Difficulty: easy. Priority: P0.

### 14. Copy quality — 5
- **Why:** Accurate but engineer-voiced: "Bundle URL will be…", "Fee-aware v2 write path (requires injected EIP-1193 wallet…)", "Hash would be sha256:…". A pipeline owner parses protocol, not outcomes.
- **Concrete:** `index.html:80,94,144` — three examples of implementation-language in primary UI.
- **Fix:** design.md §29 map (user sentence first, protocol in details). Difficulty: easy (rewrite only). Priority: P1.

### 15. Task efficiency — 5
- **Why:** Core task (understand verdict + evidence + next action) takes ~8 scrolls and 3 cards; expert shortcut (custom SLA JSON) exists but novice path (presets → result) is buried.
- **Concrete:** No "run the 3-case demo in one click" action; each case requires manual preset switching + reading.
- **Fix:** One-click "Run 3-case demo" that renders all three verdict blocks (data already loaded by `liveRead`). Difficulty: medium. Priority: P1.

## What scored relatively well (do not break)

- Honesty: real tx links + labeled mock + no fake success anywhere.
- Color+text verdict spans (not color-alone).
- Deterministic demo presets (no flakiness).
- No framework/build fragility (static page always opens).

---

# Re-audit (2026-09-05, after P0-1…P0-7 implementation)

**Method:** Same 15 criteria. Evidence: headless-Chromium screenshots at 1280px and 390px (read directly), CDP-driven interaction tests (validation states, focus, overflow — all passing), node unit tests of shipped `verdictHtml` branches (10/10 incl. XSS escaping and no_consensus), computed WCAG contrast ratios. No browser automation gap this round except: no real screen-reader run, no wallet-write E2E in sandbox (no wallet), tablet width inferred from breakpoints (not screenshotted).

## New scores

| # | Criterion | Before → After |
|---|---|---|
| 1 | Clarity | 5 → **8** |
| 2 | Learnability | 5 → **7** |
| 3 | Discoverability | 4 → **7** |
| 4 | Hierarchy | 4 → **8** |
| 5 | Consistency | 5 → **8** |
| 6 | Feedback | 4 → **8** |
| 7 | Error handling | 4 → **8** |
| 8 | Trust communication | 6 → **8** |
| 9 | Accessibility | 5 → **8** |
| 10 | Responsiveness | 4 → **8** |
| 11 | Visual quality | 5 → **7** |
| 12 | Density | 6 → **8** |
| 13 | Cognitive load | 5 → **8** |
| 14 | Copy quality | 5 → **7** |
| 15 | Task efficiency | 5 → **8** |

**Mean: 4.8 → 7.7.**

## Before / after (rendered proof)

- Verdict is now the dominant element (24px result + left-border state treatment); explanation cards collapsed into `<details>` — verified in desktop + mobile screenshots.
- Skeleton loaders replace the stale "No attestation yet." flash; tracker shows READING → VERIFIED states.
- One badge system (`●/■/◐/○/✓/✗` + text) across verdict, reputation, tracker, and mock blocks.
- All five failure classes render plain cause → impact → next action → `<details>` tech; verified for network failure path pattern; RPC-error copy no longer leaks engine text.
- REAL (`✓ VERIFIED`, green left-border) vs MOCK (gray dashed, `○ MOCK`) blocks are visually incompatible by construction.
- Focus ring solid on all interactives (CDP-verified); `aria-live` on verdict/reputation/status; `#a8a8a8` secondary text (7.8:1); inputs/buttons/borders at 3.2–5.0:1; reduced-motion disables pulse; 44px targets.
- Observed-vs-limit rows render live per case (desktop screenshot: 4/4 OVER ✗ on breach, 4/4 OK ✓ on healthy) after adding `Access-Control-Allow-Origin: *` to the Worker (redeployed 2026-09-05, bodies byte-identical so jury hashes unaffected).
- Copy rewritten to user language; protocol terms live in `<details>`.

## Remaining weaknesses (all ≤7, none blocking)

- **Learnability 7:** no guided tour; first-time users still meet SLO JSON (with hints now). Fix: 60-second interactive demo button (P1-5, medium).
- **Discoverability 7:** wallet write path untestable in sandbox; depends on Transaction Kit RC docs. Fix: wallet E2E dry-run with funded test wallet (P1).
- **Visual quality 7:** utilitarian by design; confidence bar uses accent for both outcomes. Fix: verdict-colored bars (P2, easy).
- **Copy quality 7:** residual protocol terms (`isSuccessful`, fee jargon) in write-path copy. Fix: rewrite after wallet E2E (P1).

## Unresolved issues

- No live `NO_CONSENSUS` example exists on-chain; branch verified by unit test of shipped code only — documented, not hidden.
- Reputation count drifted 60/3/1 → 57/4/2 during testing (shared studio-dev contract received outside attestations). Demo pins attestation IDs 1–3, so unaffected; noted for demo-day awareness.
- Tablet 768px not screenshotted (breakpoints cover 720/640; risk low).
- No screen-reader run (structure is semantic + live regions present; recommend NVDA/VoiceOver pass pre-submission).

## Recommended P1/P2 work

Per `frontend-gap-analysis.md` P1-1…P1-7 (onboarding strip is done via steps list; remaining: wallet E2E, responsive confirmation at 768px, copy polish, one-click demo, token tightening) and P2 (sticky verdict bar, bar colors, toasts, sparkline, light mode).
