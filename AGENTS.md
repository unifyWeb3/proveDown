# AGENTS.md — ProveDown Operating Rules

**Repo:** `https://github.com/unifyWeb3/proveDown` (private, do not make public until submission)
**Purpose:** Verification/attestation layer for agreements between autonomous systems, wedge = functional SLO attestation (quality bundle). Not uptime monitoring.

## 1. Research / Evidence Before Major Decisions

- No architectural decision without citing source: `SOURCES.md` ID for protocol, Gym benchmark, competitor, or technical validation measurement (p50/p95/variance, hash stable 1/8 vs 5/5, injection 2/2 resisted).
- For every finalist-level decision, record in `memory.md`: what changed, why, evidence (file:line or URL), test result, unresolved risk, next action.
- Re-check benchmark alignment: Gym coverage 93.7% resolvable is not accuracy — coverage ≠ per-SLO backtest. Do not claim Gym proves accuracy.

## 2. No Fabricated Success

- Never write “tx ACCEPTED” without real `genlayer receipt <tx>` or `waitForTransactionReceipt` evidence and explorer link `https://explorer-bradbury.genlayer.com/tx/0x...`.
- `FINAL-PREFLIGHT-AUDIT.md` and `memory.md` record real vs analog: analog `pytest` 5 passed is not on-chain consensus; mark as analog until Bradbury tx exists.
- Mock only explicitly documented boundaries: bridge/relay to Base (mock arrow), `NEXT_PUBLIC_LIVE_JURY=false` prewired SSE — never mock verdict as live (per `FINAL-PREFLIGHT-AUDIT.md` fallback rules).

## 3. No Secret Leakage

- Never print `GENLAYER_PRIVATE_KEY`, `BASE_SEPOLIA_PRIVATE_KEY`, `OPENROUTER_API_KEY`, seed, or `0x...` private value. Use masked validation `scripts/check-env.mjs` → `present/missing` or `***REDACTED***` + redacted `grep ... | sed 's/=.*/=***/'`.
- `NEXT_PUBLIC_*` must be public only (RPC, explorer, `0x...` contract address, bundle Worker URL). Never `NEXT_PUBLIC.*PRIVATE` or `NEXT_PUBLIC.*SECRET`.
- `.env.local`, `keystores/`, `*.key`, `.genlayer/` are gitignored (`.gitignore:1`). Before any `git add`/`commit`, run `git status`, `git diff`, `git check-ignore -v .env.local`, `grep -r "0x398" --exclude=".env.local"` secret scan.

## 4. No Silent Scope Expansion

- MVP boundary is `07-final-thesis/implementation-readiness.md:1` (single SLO type, one jury run `1×web.render bundle + exec_prompt`, one attestation anchored, mock bridge, one reputation). P2 list (continuous poller, Merkle batch, USDC escrow, residential IP, ENS, Gateway, VRF, Playbook guards, procurement 90d) is **do NOT build** until wedge proven.
- Feature synthesis `07-final-thesis/feature-synthesis.md` classifies every addition as Core / Reinforcing / Near-term / Long-term / Irrelevant — every addition must strengthen SAME pipeline-owner workflow (functional SLO breach → neutral attestation → reputation) not kitchen-sink.
- Previous products (Gotham Court betting, Tribunal generic, etc. in `04-competitive-intelligence/04-previous-product-review.md`) are design intelligence, not templates — never copy code/branding/UX.

## 5. Verify Every Meaningful Integration

- Toolchain: `bash scripts/run-lint.sh` (py_compile fallback until `genvm-lint`), `bash scripts/run-tests.sh` (5 passed), `node scripts/check-env.mjs` (2 ✓ 2 ✗ until funded), `bash scripts/check-bundle.sh` (1/8 stable not 5/5), `genlayer account show` (balance >0), `genlayer network list` (bradbury 4221).
- Contract: `python3 -m py_compile contracts/provedown.py` + `pytest` analog + Studio deploy before Bradbury (`scripts/deploy-with-js.mjs` via `genlayer-js` not CLI keystore per `KEYCHAIN-WLS2.md`).
- Worker: `curl $NEXT_PUBLIC_BUNDLE_WORKER_URL?preset=breach | sha256sum` stable across 2 fetches; fallback `httpbin.org/json` 4073fc stable for Studio.
- Frontend: `npm --prefix frontend run build` must pass with `.env.local` 42-char contract hex → `register→attest→pending→explorer→hash→reputation` flow, never stale data as current.
- End-to-end trace: `User → frontend → contract → bundle Worker → web.render → exec_prompt → consensus → stored verdict → evidence_hash → frontend → explorer` must be connected — see `FINAL-PREFLIGHT-AUDIT.md: End-to-End Integrity Trace`. Never demonstrate disconnected components as success.

## 6. Prefer Real E2E Over Mock

- Real attestation (GenLayer jury, evidence_hash `sha256:9566a...`, tx `ACCEPTED`, explorer) > mocked bridge arrow, mocked SSE. Mock only bridge/relay boundary explicitly documented (`implementation-readiness.md:9`).

## 7. Document Meaningful Decisions

- Update `memory.md` only at checkpoints (working contract slice, real deploy, real attestation, frontend E2E, security hardening, demo-ready, submission-ready) — not every edit. Keep `CHANGELOG.md` at same checkpoints with commit hash.
- Each entry: what changed, why, evidence (tx hash / test output / Gym source), test result, unresolved risk, next action.

## 8. Keep Repo Recoverable

- Clean `__pycache__/`, `.pytest_cache/`, `*.pyc`, `.next/`, `dist/`, `.vercel`, `node_modules` via `.gitignore`. Before commit, `git status` clean except intentional, `git diff` inspected, no generated secrets.
- Do not push every tiny change — checkpoint protocol: implement → test → diff → secret scan → update memory.md/CHANGELOG.md → commit → push only when verified and clean.

## 9. Distinguish Real vs Mock Explicitly

- Frontend toggle `NEXT_PUBLIC_LIVE_JURY=true` (live `genlayer-js` writes) vs `false` (mocked SSE) — label mocked verbatim, link to prior real txs for explorer, never mock verdict as live. Bridge/relay mocked arrow labeled mock per `DEMO.md`.

## 10. Use External Products as Quality Benchmark, Not Copy

- Inspect `https://github.com/enoch208/clasp`, `Vestra`, `cairnand` + other protocols for product clarity, workflow, technical proof, attack demos, real network evidence, onboarding, architecture, memorability, defensibility — extract bar, do not copy code/branding/UX/concepts.
- Continuously ask: what capability are we demonstrating? does ProveDown exercise GenLayer capability? can we produce real measurable evidence? does demo prove GenLayer uniquely useful? (Gym alignment).

## 11. Blocker Discipline (per user operating rule)

If unavailable:
- Report Missing / Why needed / Exact manual action / Expected result (masked) / Security note, then continue independent work. Do not wander unrelated repos. Only stop when genuinely blocks progress.
- Keychain `OS keychain not available` is WSL limitation — use `genlayer-js` path per `KEYCHAIN-WLS2.md`, do not search random credential stores.

## 12. No Laziness, No Unnecessary Exploration, No Feature Bloat, No Hidden Blockers

Standard is: prefer evidence, prefer verification, keep private until submission, push only verified checkpoint.
