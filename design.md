# design.md — ProveDown Frontend Source of Truth

**Status:** Design specification for the next build phase. Do NOT implement from memory — implement from this file.
**Scope:** Single static page (`frontend/index.html`) + live studio-dev reads + wallet write path. No framework change.
**Evidence base:** Nielsen's 10 heuristics (NN/g, Nielsen 1994, reviewed 2024), WCAG 2.2 AA baseline, teardown of Cairn (receipt/evidence hierarchy), Clasp (operational state clarity, security lab, honesty table), Vigil (JS-gated, minimal signal Retrieved).

---

## 1. Product personality

**Calm instrument panel for adversarial truth.** Technical, calm, trustworthy, precise, infrastructure-grade, minimal, observability-focused.

- *Why not "futuristic":* futuristic gradients/animations signal marketing, not measurement. A pipeline owner deciding whether to trust a $50K verdict needs an instrument, not a landing page. Dark surfaces + restrained accent = long dashboard sessions without fatigue (same reason Datadog, Grafana, Clasp ship dark).
- *Voice in one line:* "Here is what was agreed, what happened, why we believe it, and what you can do — with proof attached."

## 2. Primary user

**Pipeline / service owner** who buys API capacity consumed by agents and is accountable when it silently degrades.

- **Trying to accomplish:** define what "good service" means once (SLO), get a neutral verdict when it is disputed, act on it (failover, credit claim, switch provider).
- **Needs to know:** agreement terms, current result, why (evidence + reason), how confident, what next.
- **Already knows:** their API, their SLO numbers, what a breach costs them. Does NOT need to know: GenLayer internals, consensus rounds, fee mechanics, validator topology.
- **Should NOT need to know:** what `run_nondet_unsafe`, `FINALIZED`, `feeValue`, `u256`, chain IDs mean. These stay one click away (explorer), never in the primary flow.
- **Scares/confuses them:** a red BREACH with no reason; a hash with no explanation; "MOCK" that looks like "REAL"; a button that does nothing visible for 60s.
- **Action that matters most:** understand the verdict and its evidence in under 60 seconds, then failover/claim with proof in hand.

Not designed for: casual browsers, blockchain tourists, validator operators.

## 3. UX principles (HCI-derived, ProveDown-mapped)

1. **State first, always** (Nielsen #1 visibility of system status). Every view answers "what is happening right now?" within 1 second: explicit status pill + step tracker during waits, never a bare spinner or silence.
2. **User language, machine proof second** (Nielsen #2 match real world). Primary copy says "service met its agreement / breached / couldn't be judged"; protocol terms (`attestation`, `FINALIZED`, `evidence_hash`) appear as secondary labels with one-line explanations.
3. **No dead ends** (Nielsen #3 user control). Every state — including INCONCLUSIVE, NO_CONSENSUS, reverted, wallet-missing — offers exactly one clear next action (retry, adjust SLO, run script, refresh).
4. **One visual language for truth states** (Nielsen #4 consistency). REAL / PENDING / MOCK / INCONCLUSIVE / NO_CONSENSUS look the same everywhere (see §22).
5. **Prevent the $50K misclick** (Nielsen #5 error prevention). Destructive/confusing actions (register with empty ID, attest unknown SLA) are disabled or confirmed before submission, not scolded after.
6. **Show, don't recall** (Nielsen #6 recognition). SLO thresholds, bundle values, and verdicts sit side-by-side; the user never carries numbers between cards.
7. **One page, two speeds** (Nielsen #7 flexibility). Novice: read-only live verdicts + demo presets (zero setup). Expert: wallet writes, custom SLA JSON, explorer deep-dives.
8. **Evidence density with restraint** (Nielsen #8 minimalist). Hashes, tx ids, and validator detail are truncated + collapsible by default; verdict + reason + confidence are always visible.
9. **Errors in plain language with a way out** (Nielsen #9). Every failure states what happened, why it matters, and the single next step — plus the technical string in `<details>` for debugging.
10. **Help in context** (Nielsen #10). One-line explainers beside jargon ("Evidence hash — SHA-256 of the exact bundle the jury saw"), full docs linked once, not pasted everywhere.

Supporting: progressive disclosure (details → explorer), stable mental model (agreement → evidence → verdict → action, always in that order), feedback loops under 1s for every interaction (optimistic pending states).

## 4. Design principles

1. Verdict dominates; proof supports. The largest element on screen is always the current result, never the contract address.
2. Color never travels alone. Every color-coded state pairs with an icon + text label (WCAG 1.4.1).
3. Numbers carry units and context. `p95 4800` is meaningless; `p95 4800ms (limit 2000+500)` is a verdict explanation.
4. Real and mock are visually incompatible on purpose. A glance must separate them (see §22).
5. Boring is a feature. No decorative animation; motion budget is spent only on pending-state pulse (with `prefers-reduced-motion` off-switch).

## 5. Information hierarchy (global)

1. What is being verified (agreement: API + SLO summary)
2. What is the result (verdict pill + reason + confidence)
3. Why (evidence: bundle values vs thresholds, hash)
4. What next (failover/claim/retry + reputation context)
5. Proof (explorer links, tx hashes, fee/consumed) — accessible, secondary

Per screen: SLA card (agreement → status → actions) · Verdict card (result → reason → confidence → evidence → proof) · Reputation (score → trend → history) · Proof (explorer links, collapsed by default).

## 6. Navigation model

Single page, task-ordered sections with anchor nav: Overview → Service setup → Attestation workspace → Verdict → Evidence → Reputation → Proof. No router, no tabs hiding state. On mobile the same order stacks; verdict section gets a "back to top" link after long evidence blocks.

## 7. Typography

System stack only (`system-ui, -apple-system, "Segoe UI", sans-serif`; mono: `ui-monospace, SFMono-Regular, Menlo, monospace`). Reason: zero webfont dependency for a static hackathon page; system fonts render fastest and match OS conventions (Nielsen #4 external consistency).

Type scale (px / line-height / use): 12/16 micro-labels + hashes (never body text); 14/20 secondary text, form labels; 16/24 body + buttons; 20/28 card titles; 24/32 section verdicts; 32/40 page title only. Reason: 4px-grid-aligned scale keeps verdict (24) unambiguously dominant over body (16).

## 8. Spacing system

4px base: 4 (tight inline) / 8 (label-to-input) / 12 (card inner groups) / 16 (component padding) / 24 (card padding + inter-card) / 32 (section separation). Page max-width 960px, 16px gutters. Reason: current 1.5rem/1rem mix is close but inconsistent; a fixed scale makes density predictable and reviewable.

## 9. Grid / layout rules

Desktop: single 960px column, cards full-width; verdict card may split 2:1 (result | confidence meter) above 720px. Mobile (<640px): same order stacked; evidence definition lists replace any table; tx hashes truncate to 10 chars + copy button. Never shrink desktop tables — restructure into stacked label/value rows (progressive disclosure).

## 10. Color tokens

| Token | Value | Use | Reason |
|---|---|---|---|
| `--bg` | `#0a0a0a` | page | dark instrument baseline; matches GenLayer/Clasp aesthetic |
| `--surface` | `#141414` | cards | one step above bg; current `#111` kept within tolerance |
| `--surface-2` | `#1c1c1c` | inputs, nested wells | distinguish interactive from static surfaces |
| `--border` | `#333333` | card borders (decorative — cards delineated by spacing + surface step) | WCAG 1.4.11 does not require decorative boundaries to hit 3:1 |
| `--border-strong` | `#6b6b6b` | input/button boundaries | 3.2:1 vs inputs, 3.5:1 vs cards — meets 3:1 non-text contrast |
| `--text` | `#ededed` | primary text | max contrast on dark |
| `--text-2` | `#a8a8a8` | secondary, hashes, meta | 7.8:1 on surface (fixed from `#999` ≈ 4.2:1) |
| `--accent` | `#5a5ee6` | actions (white text 5.0:1 ✓) | indigo = interactive only, never status; links stay `#7c8cf8` (6.6:1) |
| `--ok` | `#22c55e` | NO_BREACH | |
| `--bad` | `#ef4444` | BREACH | |
| `--warn` | `#eab308` | pending, inconclusive, no-consensus, mock | |
| `--real` | `#22c55e` left-border treatment | verified-live blocks | |
| `--mock` | gray dashed treatment | mocked blocks | deliberately un-prestigious |

Contrast audit (must hold): white on `#4f46e5` ≈ 4.6:1 ✓; `#60a5fa` on `#0a0a0a` ≈ 7:1 ✓; `#a8a8a8` on `#141414` ≈ 7:1 ✓ (fix from `#999`).

## 11. Background / surface rules

One background (`--bg`), two surfaces max per view (`--surface` cards, `--surface-2` inputs/wells). Status is communicated by left-border + badge, never by full-card tint (tints destroy text contrast and scream).

## 12. Border / radius / shadow rules

1px `--border`, radius 8px cards / 6px buttons / 4px inputs (keep current — already consistent). No shadows on dark (they read as glow/noise); depth comes from border + surface steps. REAL blocks: 3px solid `--real` left border. MOCK blocks: 1px dashed gray border + `MOCK` badge. PENDING: 3px `--warn` left border + pulse (disabled under reduced motion).

## 13. Component hierarchy

Page → section card → verdict block → evidence rows → proof links. Only one H1 (product + one-line value prop). Card titles are H2/H3 in order. Interactive elements (buttons, inputs) live in workspace cards only; verdict/evidence cards are read-only except copy/retry buttons.

## 14. Button rules

Primary (indigo, one per card max): Register SLA, Request Attestation. Secondary (transparent + border): Retry, Refresh results, View on explorer. Destructive actions: none in MVP (revocation is post-hackathon). Disabled state must explain why via adjacent text or `title` (never silent disable). Minimum target 44×44px (exceeds WCAG 2.2 2.5.8 24px minimum).

## 15. Form rules

Every input has a visible persistent label (never placeholder-only). SLA JSON gets a one-line format hint + inline validation (invalid JSON → red border + "SLO must be JSON with p95_threshold, error_threshold, fill_threshold, match_threshold" + disabled submit). Preset select shows human consequences (`breach — p95 4800, fill 72%: expect BREACH`), not just preset names. Empty-ID submit is blocked with explanation (error prevention).

## 16. Cards

Workspace cards (setup, attestation) contain inputs + primary action + status line. Result cards (verdict, reputation) contain status pill + numbers + evidence + proof links. Explanation cards (presets, why-not-Uptime, real-vs-mock) are collapsible `<details>` after first read — they currently compete with the verdict for attention.

## 17. Tables

Avoid tables in MVP. Bundle-vs-threshold comparisons render as definition rows: `p95 — 4800ms observed / 2500 limit — OVER ✓/✗`. Rule rows that breach get `--bad` marker + reason tag (LATENCY). This survives mobile without restructuring.

## 18. Badges / status indicators

Pill: icon + label, always text (never color-only). `● NO_BREACH` green, `● BREACH` red, `◐ PENDING` amber pulse, `■ INCONCLUSIVE` amber, `■ NO_CONSENSUS` amber outline, `○ MOCK` gray dashed, `✓ VERIFIED` green (explorer-confirmed), `✗ FAILED` red. Icons must differ by shape as well as color ( – ✓/✗/◐/■/○).

## 19. Evidence presentation (borrow from Cairn's Answer Receipt)

Cairn's receipt pattern — structured used/blocked lists + anchor reference under every answer — maps directly: each verdict shows **observed vs limit rows** (p95/error/fill/match with OVER/OK markers), then **evidence hash** (mono, truncated, copy button, full on explorer), then **bundle preview** (collapsible JSON). Order matches the jury's own reasoning (bundle → thresholds → verdict), so "why" reads top-down.

## 20. Verdict presentation

Verdict block order: pill + reason tag → one plain-language sentence ("Fill rate 72% was below the agreed 80% — the service breached the agreement despite responding HTTP 200.") → confidence bar + number → observed-vs-limit rows → evidence hash → explorer link. Confidence is a labeled bar (0–1000 → %), never a bare number.

## 21. Reputation presentation

Score as big number + label (`66 — 2 checks, 1 breach`), plus one-line trend ("down after breach case"), plus history list (per-attestation: verdict pill + date + link). Reputation answers "should I keep using this API?" — not "what is Bayesian smoothing?" (no formulas in UI).

## 22. Loading states

`liveRead()` must render skeleton rows immediately (not blank "No attestation yet" for seconds). Attestation writes show a 4-step tracker: Submitted → Accepted → Finalizing → Finalized ✓ (maps to v0.6 lifecycle; ACCEPTED alone is labeled "not yet final"). Timeouts (>120s) convert to "still finalizing — check explorer link" with the tx link, never a dead spinner.

## 23. Error states

Pattern: what happened (plain) → why it matters (one line) → next action (one button/link) → technical string in `<details>`. Covers: reverted tx (`[EXPECTED] …` decoded), RPC failure, worker failure, wallet rejection/wrong network, malformed SLO JSON. Red left-border + ✗ icon.

## 24. Empty states

"No SLA yet — define your first agreement above" + button scrolling to setup. "No attestations yet — request one" + preset hint. Never an empty card with only a heading.

## 25. Inconclusive states

Amber `■ INCONCLUSIVE — the jury could not judge this evidence (missing metrics). Nothing was decided about service quality. [Retry with fixed bundle]`. Must explicitly state that quality was NOT judged (prevents misreading amber as mild breach).

## 26. No-consensus states

Amber outline `■ NO_CONSENSUS — validators honestly disagreed at the threshold. [Retry] [Adjust SLO]`. Frame as the system working (like Cairn frames blocked-by-policy as the product working), not as failure.

## 27. Responsive rules

Breakpoints: 960 (max width), 720 (verdict split collapses), 640 (single column, definition rows, truncated hashes + copy). Touch targets ≥44px. No hover-dependent information (all tooltips duplicated as visible text or `<details>`). Test widths: 1280 / 768 / 390.

## 28. Accessibility rules (WCAG 2.2 AA)

- Contrast: text ≥4.5:1, UI components/non-text ≥3:1 (fix `--text-2` to `#a8a8a8`).
- Focus: visible `:focus-visible` outline (2px `--accent` offset 2px) on all interactive elements; focus never obscured (2.4.11).
- Semantics: one H1, ordered headings, real `<label>`, `<button>`, list markup; status changes announced via `aria-live="polite"` region (async verdict reads).
- Target size ≥24×24px minimum (2.5.8); we standardize 44px.
- Form errors identified in text + `aria-describedby` (3.3.1); no CAPTCHA/auth barriers (3.3.8 N/A).
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables pulse/transitions.
- Screen readers: verdict pill text is complete without color; hashes have `aria-label="evidence hash"`; confidence has text equivalent.

## 29. Copy / voice rules

User language first, protocol second. Map: attestation → "verification result"; breach → "the service breached the agreement"; no_breach → "the service met the agreement"; inconclusive → "couldn't be judged"; evidence_hash → "evidence fingerprint"; reputation → "reliability record"; finalized → "final and irreversible". Banned in primary UI without explanation: `u256`, `TreeMap`, `run_nondet`, `feeValue`, `FINALIZED` alone, `emit_transfer`. Sentence case, no exclamation marks, no "simply/just", no blame ("you failed" → "the bundle was missing fill rate").

## 30. Animation / motion rules

Only pending pulse (opacity 1→0.55, 1.2s) + 200ms color transitions on state change. Everything disabled under `prefers-reduced-motion`. No scroll animations, no decorative motion (keeps the instrument credible + cheap on mobile).

## 31. REAL vs MOCK visual language (non-negotiable)

| State | Border | Badge | Copy pattern |
|---|---|---|---|
| REAL (explorer-confirmed) | 3px solid green left | `✓ VERIFIED · Studio Next 61997` | tx link + FINALIZED + FINISHED_WITH_RETURN |
| PENDING | 3px amber left + pulse | `◐ PENDING · step 2/4` | step tracker + explorer link to watch |
| MOCK | 1px dashed gray all sides | `○ MOCK — not a real transaction` | what it stands in for + link to real equivalent |
| INCONCLUSIVE | 3px solid amber left | `■ INCONCLUSIVE` | "nothing was decided" + retry |
| FAILED | 3px solid red left | `✗ FAILED` | plain-language cause + next action + details |

A screenshot with color removed must still communicate state (shape + text carry it).

## 32. Mobile behavior

Order preserved (agreement → verdict → evidence → reputation → proof). Evidence rows stack label/value. Hash + tx rows truncate with copy buttons. Sticky mini verdict bar (pill + confidence) appears after scrolling past the verdict card on small screens — cheap, high-value for long evidence. No separate mobile design; same DOM, stacked.

---

## Appendix: what was deliberately NOT specified

Framework migration, multi-page router, chart library, wallet-connect SDK integration, i18n, theming/light mode, design tokens in JSON — all post-hackathon. The static page + this file carry the full bar until then.
