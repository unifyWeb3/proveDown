# AGENTS.md — ProveDown Operating Rules

**Repo:** `https://github.com/unifyWeb3/proveDown` (private, do not make public until submission)
**Purpose:** Verification/attestation layer for agreements between autonomous systems, wedge = functional SLO attestation (quality bundle). Not uptime monitoring.

## Permanent Operating Constitution

This section is the repository-level handoff contract. It applies to every future agent and session; the detailed rules below provide the implementation-specific checks.

### Project Mission

ProveDown turns a machine-to-machine service-quality agreement into neutral, evidence-bound attestation. The narrow wedge is: functional SLO breach -> independent GenLayer evaluation -> finalized verdict -> evidence fingerprint -> reputation. A reachable HTTP 200 is not proof that a functional obligation was fulfilled.

### Architecture Rules

- Keep the MVP narrow: one functional SLO bundle, one GenLayer jury run, one stored attestation, one reputation record, and an explicitly mocked downstream relay.
- Treat the GenLayer contract as authoritative state. UI labels, confidence bars, observed-vs-limit rows, and reputation copy are derived views and must never override chain reads.
- Keep trust boundaries explicit: the current Worker is synthesized fixture evidence, the Base relay is mocked, and any SSE/demo fallback is mocked. Never present those boundaries as live.
- Do not add pollers, escrow, batching, bridges, ENS, VRF, residential IP, Gateway, procurement automation, or a general observability suite before the wedge is proven and a documented decision authorizes expansion.

### Coding Rules

- Prefer the existing GenLayer v0.6 / `genlayer-js@2.0.0-rc.1` patterns and repository helpers over new abstractions.
- Validate deterministic inputs before nondeterministic execution; reject ambiguous SLOs, malformed evidence, unsafe ranges, conflicting agreement reuse, and non-boolean verdict fields.
- Keep public interfaces explicit and fail closed. Preserve structured statuses such as `resolved`, `inconclusive`, and `no_consensus`.
- Do not copy code, branding, UX, or concepts from competitor or profile repositories. Extract quality patterns only, with a source ID.

### Testing Rules

- Run analog tests, Python compilation, frontend release tests/build, Worker hash checks, and live read/receipt checks at the scope appropriate to the change.
- Analog `pytest` results prove local logic only. They are never evidence of GenLayer consensus, finality, or an accepted transaction.
- A live claim requires a real receipt or `waitForTransactionReceipt`, `isSuccessful`, and a direct explorer link. `ACCEPTED` alone is not final proof.
- Test negative paths first-class: malformed/empty evidence, no consensus, wallet/RPC failure, stale evidence, duplicate/replay attempts, and mocked boundaries.

### Security Rules

- Never print or commit private keys, API keys, seeds, or unmasked secrets. Run the masked environment check and secret scan before any checkpoint commit.
- Treat Worker output and on-chain strings as hostile input: sanitize before judging, hash the sanitized/truncated evidence bytes, keep the normalized metric object used in the prompt explicit, escape HTML attributes, and never interpolate untrusted values into executable JavaScript.
- Do not silently turn malformed judge output, unavailable evidence, stale reads, or failed receipts into `NO_BREACH` or a successful action.
- Public write methods, replay/duplicate behavior, agreement ownership, evidence provenance, and reputation pollution must have a concrete threat assessment before release.

### UX Rules

- Show user language first and protocol terms second. Make pending, finalized, inconclusive, no-consensus, error, and mocked states visually and textually distinct.
- Never display a verdict as live until the transaction is finalized, successful, and the stored attestation has been read back.
- When timestamps are unavailable on Studio, say so. When no wallet is present, say that no transaction was created.
- Keep the functional-quality-vs-reachability distinction visible in the first demo viewport; do not make judges infer it from implementation details.

### Research Rules

- Before a finalist-level architecture or product decision, cite `SOURCES.md` or a primary URL and record the decision in `memory.md` with evidence, tests, unresolved risk, and next action.
- Re-check current official GenLayer and Agent Tank materials for time-sensitive claims. Do not invent judging weights or requirements.
- Treat Gym coverage as resolvability coverage, not accuracy. Do not claim benchmark accuracy without a per-SLO backtest.
- Use the five requested GitHub profiles (`enoch208`, `mystiquemide`, `mrnetwork0001`, `Kingnanaweb3`, and `Ritapossible`) and other external products as quality benchmarks only; record what was learned and what was deliberately not copied.

### Git Rules

- Preserve user changes and keep the repository recoverable. Never reset or revert unrelated work.
- Before a checkpoint: inspect `git status`, review `git diff`, run the secret scan, clean generated artifacts covered by `.gitignore`, update `memory.md` and `CHANGELOG.md`, then commit only verified intentional changes.
- Do not push or make the private repository public unless explicitly authorized and the submission package is ready.

### Environment Rules

- Primary demonstrated environment is Studio Next / Studio Devnet chain `61997`; Bradbury compatibility evidence is historical unless a fresh Bradbury receipt is independently verified.
- Pin SDK/tool versions and keep the static frontend import, scripts, package metadata, and documentation coherent.
- The WSL keychain limitation is known. Use the `genlayer-js` deployment/write path; do not search random credential stores or expose credentials while debugging.
- If an endpoint, credential, or tool is unavailable, report what is missing, why it matters, the exact manual action, expected masked result, and security note, then continue independent work.

### Definition of Done

A change is done only when the implementation, tests, runtime evidence, user-facing disclosure, and handoff notes agree. For a live integration this means: current source, successful finalized receipt, explorer link, on-chain readback, matching evidence hash where applicable, updated research/memory checkpoint, and no contradictory stale claim in the submission docs.

### Known Anti-Patterns

- Calling a fixture, analog test, screenshot, pending receipt, or mocked arrow a live success.
- Claiming appeals, settlement, production polling, authoritative customer data, mainnet economics, or startup traction when the repository does not implement and verify them.
- Adding features because they look impressive instead of strengthening the same functional-SLO -> attestation -> reputation workflow.
- Leaving stale addresses, abbreviated explorer links, old SDK versions, or dead frontend controls in a judge-facing path.

### Session Handoff Protocol

At the end of meaningful work, leave the next agent a truthful checkpoint: current objective, files changed, commands/tests run, real transaction hashes and explorer URLs, mocked boundaries, unresolved risks, exact next actions, and whether the repo is safe to commit/push. Read the latest `memory.md`, `CHANGELOG.md`, and `research/` audit before resuming an interrupted backend or frontend session.

## 1. Research / Evidence Before Major Decisions

- No architectural decision without citing source: `SOURCES.md` ID for protocol, Gym benchmark, competitor, or technical validation measurement (p50/p95/variance, hash stable 1/8 vs 5/5, injection 2/2 resisted).
- For every finalist-level decision, record in `memory.md`: what changed, why, evidence (file:line or URL), test result, unresolved risk, next action.
- Re-check benchmark alignment: Gym coverage 93.7% resolvable is not accuracy — coverage ≠ per-SLO backtest. Do not claim Gym proves accuracy.

## 2. No Fabricated Success

- Never write “tx ACCEPTED” without real `genlayer receipt <tx>` or `waitForTransactionReceipt` evidence and a direct explorer link (`https://explorer-studio-dev.genlayer.com/tx/0x...` for the current target; Bradbury links are compatibility evidence).
- `FINAL-PREFLIGHT-AUDIT.md` and `memory.md` record real vs analog: analog `pytest` results are not on-chain consensus; mark them as analog until a current target-network receipt exists. Studio Next receipts are valid live evidence; historical Bradbury receipts are compatibility evidence only.
- Mock only explicitly documented boundaries: bridge/relay to Base (mock arrow), `NEXT_PUBLIC_LIVE_JURY=false` prewired SSE — never mock verdict as live (per `FINAL-PREFLIGHT-AUDIT.md` fallback rules).

## 3. No Secret Leakage

- Never print `GENLAYER_PRIVATE_KEY`, `BASE_SEPOLIA_PRIVATE_KEY`, `OPENROUTER_API_KEY`, seed, or `0x...` private value. Use masked validation `scripts/check-env.mjs` → `present/missing` or `***REDACTED***` + redacted `grep ... | sed 's/=.*/=***/'`.
- `NEXT_PUBLIC_*` must be public only (RPC, explorer, `0x...` contract address, bundle Worker URL). Never `NEXT_PUBLIC.*PRIVATE` or `NEXT_PUBLIC.*SECRET`.
- `.env.local`, `keystores/`, `*.key`, `.genlayer/` are gitignored (`.gitignore:1`). Before any `git add`/`commit`, run `git status`, `git diff`, `git check-ignore -v .env.local`, and a redacted-prefix scan over tracked files (for example `grep -r "0x398" --exclude=".env.local" --exclude="AGENTS.md"`) to confirm no key material is present.

## 4. No Silent Scope Expansion

- MVP boundary is `07-final-thesis/implementation-readiness.md:1` (single SLO type, one jury run `1×web.render bundle + exec_prompt`, one attestation anchored, mock bridge, one reputation). P2 list (continuous poller, Merkle batch, USDC escrow, residential IP, ENS, Gateway, VRF, Playbook guards, procurement 90d) is **do NOT build** until wedge proven.
- Feature synthesis `07-final-thesis/feature-synthesis.md` classifies every addition as Core / Reinforcing / Near-term / Long-term / Irrelevant — every addition must strengthen SAME pipeline-owner workflow (functional SLO breach → neutral attestation → reputation) not kitchen-sink.
- Previous products (Gotham Court betting, Tribunal generic, etc. in `04-competitive-intelligence/04-previous-product-review.md`) are design intelligence, not templates — never copy code/branding/UX.

## 5. Verify Every Meaningful Integration

- Toolchain: `bash scripts/run-lint.sh` (two documented nested-reachability advisories), `bash scripts/run-tests.sh` (13 analog tests), `npm --prefix frontend run test && npm --prefix frontend run build` (release checks), `node scripts/check-env.mjs` (masked required values), `bash scripts/check-bundle.sh <live-worker-url>` (stable repeated hashes), and finalized Studio read/receipt checks on chain `61997`.
- Contract: `python3 -m py_compile contracts/provedown.py` + `pytest` analog + Studio deploy before Bradbury (`scripts/deploy-with-js.mjs` via `genlayer-js` not CLI keystore per `KEYCHAIN-WLS2.md`).
- Worker: `curl $NEXT_PUBLIC_BUNDLE_WORKER_URL?preset=breach | sha256sum` stable across 2 fetches; fallback `httpbin.org/json` 4073fc stable for Studio.
- Frontend: `npm --prefix frontend run build` must pass with `.env.local` 42-char contract hex → `register→attest→pending→explorer→hash→reputation` flow, never stale data as current.
- End-to-end trace: `User → frontend → contract → bundle Worker → web.render → exec_prompt → consensus → stored verdict → evidence_hash → frontend → explorer` must be connected — see `FINAL-PREFLIGHT-AUDIT.md: End-to-End Integrity Trace`. Never demonstrate disconnected components as success.

## 6. Prefer Real E2E Over Mock

- Real attestation (GenLayer jury, stored evidence hash, finalized successful receipt, Explorer link, and readback) > mocked bridge arrow or any demo fallback. Mock only the bridge/relay boundary explicitly documented (`implementation-readiness.md:9`); never present a verdict fallback as a live write.

## 7. Document Meaningful Decisions

- Update `memory.md` only at checkpoints (working contract slice, real deploy, real attestation, frontend E2E, security hardening, demo-ready, submission-ready) — not every edit. Keep `CHANGELOG.md` at same checkpoints with commit hash.
- Each entry: what changed, why, evidence (tx hash / test output / Gym source), test result, unresolved risk, next action.

## 8. Keep Repo Recoverable

- Clean `__pycache__/`, `.pytest_cache/`, `*.pyc`, `.next/`, `dist/`, `.vercel`, `node_modules` via `.gitignore`. Before commit, `git status` clean except intentional, `git diff` inspected, no generated secrets.
- Do not push every tiny change — checkpoint protocol: implement → test → diff → secret scan → update memory.md/CHANGELOG.md → commit → push only when verified and clean.

## 9. Distinguish Real vs Mock Explicitly

- If a future frontend fallback uses `NEXT_PUBLIC_LIVE_JURY`, label the mocked path verbatim and link only to prior real transactions. The current static frontend uses live Studio reads/writes plus explicit no-wallet/read-only states. Bridge/relay remains a mocked arrow labeled mock per `DEMO.md`.

## 10. Use External Products as Quality Benchmark, Not Copy

- Inspect `https://github.com/enoch208/clasp`, `Vestra`, `https://github.com/Ritapossible/Recourse`, `Vouch`, `cairnand` + other protocols for product clarity, workflow, technical proof, attack demos, real network evidence, onboarding, architecture, memorability, defensibility — extract bar, do not copy code/branding/UX/concepts.
- Recourse is a benchmark for fail-closed bonded commitments, explicit terminal versus retryable outcomes, source/deployment verification, and documenting which fields consensus actually compares. Vouch is a benchmark for staged evidence checks, three-valued outcomes (`substantiated`, `unsubstantiated`, `contradicted`), bounded caching, and keeping verification in the consequential action path. These patterns inform ProveDown's attestation/reputation wedge; they do not authorize adding bonds, payment settlement, appeals, or counterparty screening to the MVP.
- Continuously ask: what capability are we demonstrating? does ProveDown exercise GenLayer capability? can we produce real measurable evidence? does demo prove GenLayer uniquely useful? (Gym alignment).

## 11. Blocker Discipline (per user operating rule)

If unavailable:
- Report Missing / Why needed / Exact manual action / Expected result (masked) / Security note, then continue independent work. Do not wander unrelated repos. Only stop when genuinely blocks progress.
- Keychain `OS keychain not available` is WSL limitation — use `genlayer-js` path per `KEYCHAIN-WLS2.md`, do not search random credential stores.

## 12. No Laziness, No Unnecessary Exploration, No Feature Bloat, No Hidden Blockers

Standard is: prefer evidence, prefer verification, keep private until submission, push only verified checkpoint.
