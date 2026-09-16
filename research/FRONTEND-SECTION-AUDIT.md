# ProveDown Frontend Section Audit

Date: 2026-09-13
Scope: `frontend/index.html`, its static build/test helpers, and the local static app shell. The shell now exposes `/`, `/verify`, and `/proof` as route-aware views while preserving the same HTML bundle and query parameters. No contract, ABI, Worker, environment, wallet, or chain state was changed during this audit.

## FRONTEND VERDICT

**PASS WITH DOCUMENTED LIMITATIONS.** The bounded static app shell presents the functional-quality thesis first, keeps the decision path readable, labels real/derived/synthetic/mock data, and fails closed for missing, malformed, stale, or unreadable evidence. `/`, `/verify`, and `/proof` serve the same built artifact with route-aware navigation and query preservation. A fresh Chromium/CDP pass verified the three routes at 390/768/1280, direct deep links, query preservation, back navigation, custom-proof isolation, and a clean console/network surface; this session did not request a wallet prompt or create a transaction.

No P0 frontend defects remain in this pass. The remaining P1/P2 items are listed below and do not change the explicit real/synthetic/mock boundaries.

## FINAL HCI SCORE

Heuristic score: **8.3 / 10**. This is a source-and-render audit, not a claim of a completed screen-reader or wallet test.

| Criterion | Score | Evidence / limitation |
|---|---:|---|
| Clarity | 8 | Thesis and user-language verdict lead the page; protocol detail is secondary. |
| Learnability | 7 | Define -> Observe -> Decide -> Prove -> Act strip and field hints help; no guided tour. |
| Discoverability | 8 | Route navigation, visible live-read/write controls, and explicit boundary notices. |
| Hierarchy | 9 | Live signal and verdict sections dominate; proof details are grouped below. |
| Consistency | 9 | Shared status badges, tracker states, and error pattern. |
| Feedback | 8 | Skeletons, read tracker, preview pending/success/failure, and retry actions. |
| Error handling | 9 | Missing agreement, chain failure, malformed result, unavailable evidence, and mismatch are distinct and fail closed. |
| Trust communication | 9 | REAL/DERIVED/SYNTHETIC/MOCK legend, proof links, hash gate, and no-write disclosure. |
| Accessibility | 8 | Semantic labels, live regions, focus rings, contrast-conscious colors, 44px controls, and a CDP accessibility-tree pass; no human screen-reader session. |
| Responsiveness | 9 | Static shell inspected at 390/768/1280; mobile min-content overflow was fixed. |
| Visual quality | 8 | Restrained instrument-panel treatment with stable typography and status color plus text. |
| Density | 8 | Evidence is adjacent to verdict; explanatory material is collapsed. |
| Cognitive load | 9 | Observed-versus-required rows and plain-language reasons reduce recall burden. |
| Copy quality | 8 | User outcome precedes protocol language; a few protocol terms remain in details. |
| Task efficiency | 8 | Refresh, case sets, preview, copy, retry, and Explorer links are direct; no one-click multi-case action. |

## SECTIONS VERIFIED

### 1. MASTHEAD / THESIS

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Masthead (source lines 214-220) -> orient the user to the functional-quality thesis and current Studio environment -> static copy plus Studio Next chain `61997` disclosure -> always visible; write actions are available only from the Verify view after an explicit click -> none -> metadata wraps; stable 42px desktop heading steps to 36px at <=840px and 30px at <=640px -> **PASS**.

### 2. SECTION NAVIGATION

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Section navigation (222-224) -> move between Overview, Verify, and Proof without a framework router -> client-side route state plus `history.pushState`/`popstate` -> always visible -> native route links with `aria-current` and query-string preservation -> flex-wraps at narrow widths -> **PASS**.

### 3. OVERVIEW / DECISION PATH

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Overview (227-253) -> surface the current signal, explain truth labels, and show Define -> Observe -> Decide -> Prove -> Act -> hero result is derived by `setHero()`, while the legend and flow labels are static -> loading, resolved breach/no-breach, inconclusive, no-consensus, unreadable, or no result -> route links to Verify and Proof -> two columns collapse at <=840px; flow strip stays internally scrollable; mobile copy and padding rules apply -> **PASS**. Fresh Chromium captures at 390/768/1280 confirmed the strip remains bounded with no horizontal document overflow.

### 4. DEFINE / SERVICE AGREEMENT

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Define (255-266) -> inspect an agreement, preview deterministic evidence, and optionally register the exact submitted terms -> editable agreement ID, HTTPS URL, Worker preset, SLO JSON, and wallet-backed `register_sla`; validation in `parseSlo()`/`validateSetup()`; preview fetch in `previewEvidence()` -> inline invalid states, pending preview, synthetic success hash, Worker failure with retry, fee-estimating/signature/finality states, finalized receipt fee detail, and registration readback mismatch failure -> input validation, preset change, preview, and explicit Register action; no wallet prompt occurs until the user clicks the write control -> fields are full width and action controls stack at <=640px -> **PASS**.

### 5. VERIFY / ATTESTATION WORKSPACE

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Verify (268-276) -> select and read finalized records from the current network, or request a new attestation explicitly -> Studio Next `61997`, contract disclosure, `liveRead()` calls to `get_sla`, `get_reputation`, and `get_attestation`, plus wallet-backed `request_attestation` -> skeleton, reading/checking/ready/failed tracker, fee estimate, awaiting signature, waiting for finality, finalized readback, wallet rejection, wrong network, no-wallet, failed transaction, missing agreement, chain failure, and no-result states -> case-set select, Refresh, delegated retry, Request new attestation, and native lifecycle details -> controls wrap and stack at <=640px; network line wraps -> **PASS**. Proof links are scoped to known pinned records; the UI does not dynamically establish finality for arbitrary custom IDs (P1).

### 6. DECIDE / VERDICT

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Verdict (278-281; dynamic renderer 430-451) -> present the jury decision before protocol detail and explain why -> on-chain `get_attestation` values plus the bounded `CASE_TX` map (314-322) -> missing/not-found, chain-read-failed, INCONCLUSIVE, NO CONSENSUS, malformed/unreadable, resolved BREACH, and resolved NO_BREACH -> Explorer links, hash copy, and retry controls; no write -> case cards remain single-column; metrics go 4 -> 2 -> 1 columns; hashes wrap or truncate with copy -> **PASS for implemented branches**. No live on-chain NO_CONSENSUS fixture is claimed (P1/P2 evidence gap).

### 7. ACT / REPUTATION

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Reputation (283-286; reads 577-631) -> show a reliability signal tied to the selected agreement rather than an editable URL -> selected on-chain `get_sla` subject, then `get_reputation` -> skeleton, valid score/checks/breaches, missing agreement, distinct chain-read failure, malformed shape, and withheld trend for a small sample -> Refresh and case changes reload it; no writes -> two-column layout and facts collapse appropriately at <=640px -> **PASS**. The card explicitly says timestamp unavailable on Studio Next for this read.

### 8. PROOF / BOUNDARIES

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Proof and boundaries (288-300) -> expose known finalized references, evidence fingerprint, fee limitations, fixture examples, and truth boundaries -> pinned registration/attestation transactions, stored hash, reputation snapshot, Worker URL, and details blocks -> verified-reference/readback badges, unavailable fee fields with no guessed GEN values, synthetic fixture disclosure, and mocked relay disclosure -> external Explorer links, Copy hash, and native details toggles -> proof grid becomes one column; fee rows stack; hashes wrap -> **PASS (scoped to known evidence)**.

### 9. FOOTER

**SECTION -> PURPOSE -> DATA SOURCE -> STATE -> INTERACTIONS -> RESPONSIVE -> PASS/FAIL**

Footer (302) -> repeat the product boundary: functional quality, not uptime; synthetic Worker; mocked settlement -> static copy -> always visible after normal document flow -> none -> normal responsive flow -> **PASS**.

## INTERACTIONS VERIFIED

- Route links are present for Overview, Verify, and Proof and preserve the current query string. A live static-server regression covers direct deep links and the unknown-route 404.
- Agreement ID, API URL, and SLO JSON use inline validation, `aria-invalid`, and disabled Preview when invalid.
- Fixture preset changes update a synthetic source notice; Preview performs a Worker read only and displays a synthetic hash or a retryable failure.
- Case-set selection supports the required `cases=4,1,2` query route and triggers a fresh read; Refresh and delegated retry use the same read path. The route test confirms `/verify` and `/proof` serve the same query-bearing artifact.
- Register agreement and Request new attestation are explicit wallet-backed controls. Static checks cover `writeContract`, wallet request, injected provider, finalized receipt checks, inline `onclick` absence, and public private-key variable absence. The custom-contract path is asserted to hide pinned proof and receipt values rather than reuse them.
- Dynamic verdict branches expose bounded Explorer links, copy-hash controls, evidence mismatch withholding, and retry actions through data attributes.
- Native `<details>` sections provide protocol, lifecycle, fixture, and boundary disclosure without competing with the primary verdict.

Source-level release tests, the current dynamic Chromium smoke with the remote SDK, and a CDP accessibility-tree inspection cover the read path. The current source also contains the wallet write lifecycle and fail-closed readbacks; no wallet prompt or transaction was attempted in this pass. The browser pass found no console errors or failed requests.

## REAL VS SYNTHETIC VS MOCKED

| Label | Current meaning | UI treatment |
|---|---|---|
| REAL | Studio Next contract reads, stored finalized records, evidence hash readback, reputation readback, and the supplied full Explorer references | `REAL` / verified badges and network disclosure |
| DERIVED | Confidence bars, observed-versus-required comparisons, case names, and plain-language summaries | Separate legend entry; never authoritative over chain fields |
| SYNTHETIC | Deterministic Bundle Worker fixture payloads used for preview and evidence comparison | Dashed/mock badge and explicit fixture copy |
| MOCK | Downstream Base/Hyperlane relay, future automation, and any SSE fallback outside the current Studio path | Explicit mocked-out copy; wallet-backed Studio writes are not mocked |

## RESPONSIVE RESULTS

The current built artifact was served from the local static server and inspected in Chromium at the requested viewport widths. The pass opened `/`, `/verify`, and `/proof`, preserved `contract=0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1&cases=4,1,2`, exercised browser navigation/back behavior, verified live evidence rows for cases 4, 1, and 2 after exact Worker hash matching, and checked custom-contract proof isolation. No console errors or request failures were observed.

| Viewport | Result |
|---|---|
| 390px | PASS. Thesis, nav, overview title, signal card, and truth card stay within the viewport; no horizontal document overflow. |
| 768px | PASS. Overview stacks cleanly, the five-step strip remains bounded/scrollable, and labels/fields do not overlap. |
| 1280px | PASS. Two-column overview, readable 1120px content measure, stable hierarchy, and first Define section are visible without overlap. |

Current inspection captures were written to `/tmp/provedown-cdp-overview-390.png`, `/tmp/provedown-cdp-overview-768.png`, `/tmp/provedown-cdp-overview-1280.png`, `/tmp/provedown-cdp-verify-390.png`, `/tmp/provedown-cdp-verify-768.png`, `/tmp/provedown-cdp-verify-1280.png`, `/tmp/provedown-cdp-proof-390.png`, `/tmp/provedown-cdp-proof-768.png`, and `/tmp/provedown-cdp-proof-1280.png`. They are temporary inspection artifacts, not release files.

## ACCESSIBILITY RESULTS

- `lang="en"`, landmarks, headings, labels, descriptions, and native form controls are present.
- Async verdict, reputation, status, and tracker regions use `aria-live`; busy state is exposed on the verdict/read controls.
- Focus-visible outlines cover buttons, links, inputs, selects, textareas, and summaries.
- Controls and disclosure summaries have stable 44px minimum targets; state uses text plus symbols and color.
- Reduced-motion media rules disable transitions/animations for users who request it.
- Untrusted values are escaped before HTML insertion; hash and transaction strings are bounded/wrapped.
- Current CDP accessibility tree exposed 206 nodes, including banner, navigation, main, headings, labeled controls, named buttons, links, and live regions. The broader control inspection also covered form fields and async status regions.
- **Not run:** a human screen-reader session and a wallet-write accessibility flow. The current page exposes writes, but this audit intentionally stopped before any wallet approval.

## REMAINING P0/P1/P2

### P0

None found in this frontend pass.

### P1

- The current page links to known finalized transaction evidence but does not fetch and display receipt finality dynamically for arbitrary custom case IDs; keep finality language scoped to pinned references.
- No human screen-reader session has been completed; the browser accessibility tree is now verified.
- Worker fixture content is mutable and synthetic; a durable content-addressed snapshot is still absent.
- No live NO_CONSENSUS transaction is available; the branch is implemented and statically tested only.

### P2

- Add a one-click three-case walkthrough after the narrow read flow is stable.
- Consider a sticky mobile verdict summary and richer structured error codes.
- Add historical reputation trend only when the contract supplies enough history; do not infer it from the current small sample.

## REGRESSIONS FOUND/FIXED

- Updated build/test assertions to recognize dynamically generated `data-action` attributes instead of requiring a stale literal.
- Reconciled this audit from the prior read-only single-page wording to the current three-view shell and enabled wallet lifecycle.
- Fixed mobile horizontal overflow caused by the flow strip's min-content contribution to the parent grid (`main`, `.overview-band`, and `.flow-strip` now allow shrinking).
- Distinguished a missing agreement from a failed `get_sla` chain read; failures now render `CHAIN READ FAILED` instead of `NO AGREEMENT`.
- Added the truthful `Timestamp unavailable on Studio Next` disclosure.
- Removed viewport-scaled `clamp()` heading sizing and nonzero letter-spacing declarations from the polished surface.
- Fixed evidence-summary URL parsing to remove the trailing separator before the character count; dynamic smoke previously exposed false fingerprint mismatches for clean stored records.

## TESTS AND ROUTES

- `npm --prefix frontend test` -> PASS (13 release tests, including direct deep-link HTTP smoke and custom-proof isolation assertions).
- `npm --prefix frontend run build` -> 23/23 release checks passed and rebuilt `frontend/dist/index.html`.
- `git diff --check` -> passed.
- `GET /`, `GET /verify?...`, and `GET /proof?...` -> HTTP 200 in the child-server smoke, all serving the same built artifact.
- Unknown path -> HTTP 404, confirming the static server does not silently rewrite arbitrary routes.
- CDP verified direct route rendering, query preservation, active navigation state, browser back behavior, custom proof isolation, and no console/request failures.

## FILES CHANGED

- `frontend/index.html`
- `frontend/scripts/build.mjs`
- `frontend/tests/release.test.mjs`
- `research/FRONTEND-SECTION-AUDIT.md`

Generated `frontend/dist/index.html` is a build artifact and was not treated as source. No staging, commit, push, deletion, move, or revert was performed.

## FILES PROPOSED FOR RELEASE COMMIT

Only the focused frontend files above, subject to the repository's normal secret scan, diff review, and an explicitly authorized checkpoint. Existing unrelated worktree changes remain untouched and are not included in this proposal.

## THINGS NOT TO TOUCH

Do not change the contract or ABI, deployment addresses, Worker semantics or hashes, reputation formula, `.env.local`, legacy Bradbury scripts, chain state, or the explicitly mocked downstream relay while reviewing this frontend pass. Do not approve a wallet transaction during an audit. Do not present the synthetic Worker, static screenshot, analog test, or pinned proof link as a new live transaction.

## EXACT NEXT ACTION

Curate the public submission package, remove or archive stale operational helpers only with approval, and run the final direct-link and masked-secret scan. No blockchain write or wallet prompt is needed for that checkpoint.
