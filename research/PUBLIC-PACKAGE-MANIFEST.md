# ProveDown Public-Package Manifest (Milestone 2 audit, 2026-09-16)

Non-destructive audit only. No file was deleted, moved, archived, committed, or pushed.
Full 97-file tracked table: `research/RELEASE-INVENTORY.md`. Evidence source of truth: `EVIDENCE.md`.

## INCLUDE — public repository contents

- **Contract/runtime:** `contracts/provedown.py`, `package.json`, `package-lock.json`,
  `scripts/attest-studio-dev.mjs`, `scripts/deploy-with-js.mjs`, `scripts/check-env.mjs`,
  `scripts/check-bundle.sh`, `scripts/run-tests.sh`, `scripts/run-lint.sh`.
- **Frontend:** `frontend/index.html`, `frontend/package.json`, `frontend/scripts/build.mjs`,
  `frontend/scripts/serve.mjs`, `frontend/tests/release.test.mjs`.
- **Worker:** `hosting/bundle-worker/worker.js`, `hosting/bundle-worker/wrangler.toml`,
  `hosting/bundle-worker/package.json`, `hosting/bundle-worker/README.md`.
- **Tests:** `tests/test_provedown.py`.
- **Judge-facing docs:** `README.md`, `DEMO.md`, `DEMO-VIDEO-PLAN.md`, `EVIDENCE.md`,
  `CLAIM-PACKET.md`, `SUBMISSION-CHECKLIST.md`, `LAUNCH-READINESS.md`, `CORE_NOW.md`,
  `AGENTS.md`, `memory.md`, `CHANGELOG.md`, `SOURCES.md`.
- **Product/research archive:** all numbered research dirs (`00-`–`07-`), `research/*.md`
  (including `RELEASE-INVENTORY.md`, `CODEX_FULL_AUDIT.md`, `current-hackathon-rules.md`,
  `current-genlayer-environment.md`, `github-patterns-audit.md`), plus product docs
  (`PRODUCT-*.md`, `DECISION-LOG.md`, `ROADMAP*.md`, `FEE-ECONOMICS.md`, etc.).

## EXCLUDE — never stage (gitignored, stay local)

- `.env.local` (holds `GENLAYER_PRIVATE_KEY`, `BASE_SEPOLIA_PRIVATE_KEY`, `OPENROUTER_API_KEY`).
- `node_modules/`, `frontend/dist/`, `__pycache__/`, `.pytest_cache/`,
  `keystores/`, `*.key`, `*.pem`, `.genlayer/`, `.wrangler/`, `.env.*.local`.

## GENERATED — reproducible, not authoritative

- `frontend/dist/index.html` (byte-for-byte build of `frontend/index.html`; contains only
  public tx hashes + current contract address — verified 2026-09-16).
- `__pycache__/`, `.pytest_cache/`.

## SENSITIVE — masked handling only

- `.env.local` and any key/keystore path. Verified ignored (`.gitignore:3`).
  `scripts/check-env.mjs` prints present/masked only. No secret in tracked files,
  untracked candidates, docs, frontend source, or `frontend/dist`.

## HISTORICAL — keep, clearly labeled

- `FINAL-PREFLIGHT-AUDIT.md`, `PRE-HACKATHON-CHECKLIST.md`, `CREDENTIALS-REQUIRED.md`,
  `KEYCHAIN-WLS2.md`, `07-final-thesis/implementation-blockers.md`,
  `01-genlayer-recon/06-consensus-v06-migration.md`, `EVIDENCE.md` compatibility section,
  `LAUNCH-READINESS.md` Bradbury row, dated `memory.md`/`CHANGELOG.md` entries.
- `scripts/deploy-bradbury.sh` (carries a historical banner: do not run for current demo).
- `scripts/deploy-studio.sh`, `scripts/verify-post-deploy.sh`, `scripts/setup-frontend.sh`
  still reference studionet/Bradbury-era flows; not invoked by any current release path.

## ARCHIVE (recommended, approval required — no action taken)

- `scripts/check_all.mjs` — read-only Bradbury attestation/reputation inspection.
- `scripts/check_att.mjs` — read-only Bradbury attestation/reputation inspection.

## UNRESOLVED — needs explicit approval before removal/archival

- `scripts/attest_test.mjs` — RECOMMEND REMOVE (writes to historical Bradbury contract).
- `scripts/simple_test.mjs` — RECOMMEND REMOVE (writes to historical Bradbury contract).
- `scripts/verify-live.mjs` — RECOMMEND REMOVE (superseded by `attest-studio-dev.mjs`).
- `scripts/check_all.mjs`, `scripts/check_att.mjs` — RECOMMEND ARCHIVE (read-only).
- Whether pre-deployment blocker prose (`FINAL-PREFLIGHT-AUDIT.md`,
  `implementation-blockers.md`) stays in the public package or moves to an archive dir.

## Verification (2026-09-16)

- Frontend test 15 passed; frontend build 25 release checks; analog pytest 13 passed;
  `py_compile` passed; `run-lint.sh` exit 1 with only the two documented advisories
  (`contracts/provedown.py:214`, `:311`); `git diff --check` passed.
- All six pinned Explorer links + Worker URL returned HTTP 200.
- Agent Tank mission 83 re-checked: deadline 2026-09-17 15:30 UTC, track
  `Agentic Commerce Infrastructure`, 1 project per builder, public repo required.

(End of file)
