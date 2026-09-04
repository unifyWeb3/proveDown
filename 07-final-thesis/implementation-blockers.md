# Implementation Blockers — P0/P1/P2 (2026-09-03)

**Source:** `FINAL-PREFLIGHT-AUDIT.md` FAIL/WARN/BLOCKED + `PRE-HACKATHON-CHECKLIST.md` + `KEYCHAIN-WLS2.md` + Gym alignment

---

## P0 — Blocks demo/build (must fix today)

| ID | Problem | File | Fix | Dependency | Verification |
|---|---|---|---|---|---|
| **P0-1** | `frontend/` empty, no `package.json`, no user flow `register→attest→pending→explorer→hash→reputation` | `frontend/` (empty) vs `implementation-readiness.md:5` | Run `bash scripts/setup-frontend.sh` → creates from jury 1.1.8 `next 16.2.6`, `npm install`, `next build` requires `.env.local` set first | Node 22 present, `.env.local` filled (except Worker URL + contract 0x... placeholder) | `ls frontend/package.json` exists + `npm --prefix frontend run build` exit 0 (warn if `.env.local` placeholder) |
| **P0-2** | Bundle Worker not deployed: `NEXT_PUBLIC_BUNDLE_WORKER_URL=https://provedown-bundle.your-subdomain...` placeholder → jury `fetch failed` → `INCONCLUSIVE` not BREACH/NO_BREACH | `hosting/bundle-worker/worker.js` 116-char presets, `.env.local:32` | `npx wrangler login` (OAuth) → `cd hosting/bundle-worker && npx wrangler deploy` → copy `https://provedown-bundle.../bundle` → set `NEXT_PUBLIC_BUNDLE_WORKER_URL` + `BUNDLE_WORKER_URL` in `.env.local` → `bash scripts/check-bundle.sh` must show `breach 9566a8b5` stable 1/8 vs no_breach `9cd4199c` | `wrangler` via `npx` (not installed globally, npx 10.9.8 works), account `provedown-deployer` not needed for Worker | `curl "$NEXT_PUBLIC_BUNDLE_WORKER_URL?preset=breach" | sha256sum` stable across 2 fetches + `bash scripts/check-bundle.sh` 2/2 stable |
| **P0-3** | Contract not deployed: `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=0x...` invalid (not 42-char hex) → frontend live reads invalid → revert | `contracts/provedown.py:1` 362 lines vs `.env.local:8` | Deploy via `genlayer-js` WSL-safe path (not CLI `deploy` which needs keychain): `export GENLAYER_PRIVATE_KEY=$(grep ... .env.local...); node scripts/deploy-with-js.mjs` (created per `KEYCHAIN-WLS2.md`) → copy `0x...` → set in `.env.local` | **B1 funded account** `0x3211...` 0 GEN currently → must faucet first | `node scripts/check-env.mjs` shows ✓ contract 42-char hex + `bash scripts/verify-post-deploy.sh 0x...` → `register_sla demo-breach` tx ACCEPTED + explorer link |
| **P0-4** | Deployer 0 GEN on studionet (`genlayer account show` 0 GEN, locked) → `deploy` fails `insufficient funds` even via JS | `~/.genlayer/keystores/provedown-deployer.json` vs faucet | Manual: paste `0x3211d1419709682b81c53CC51cb63622E25488d3` into `https://testnet-faucet.genlayer.foundation` (Bradbury) → balance >0. For studionet, Studio UI may auto-faucet or use `testnetBradbury` network directly with JS client `testnetBradbury` chain 4221 | `.env.local` GENLAYER_PRIVATE_KEY present (masked) | `genlayer account show` after faucet: `balance: '... GEN' >0` (studionet) or `testnetBradbury` via `genlayer network set testnetBradbury` then `account show` |
| **P0-5** | `genlayer deploy` CLI blocked by WSL keychain (`OS keychain is not available`, `Enter password` prompts) → cannot deploy via CLI non-interactively | `scripts/deploy-bradbury.sh` uses CLI `deploy` | Use `scripts/deploy-with-js.mjs` which reads `process.env.GENLAYER_PRIVATE_KEY` directly via `createAccount(privateKey)` like `genlayer-jury/deploy_dispute_court_v2.ts:21` — no keystore, no prompt | `GENLAYER_PRIVATE_KEY` env present | `node scripts/deploy-with-js.mjs` completes without password prompt, prints `Contract address: 0x...` |

---

## P1 — Important (should fix before demo, not blocking build start)

| ID | Problem | File | Fix | Dependency | Verification |
|---|---|---|---|---|---|
| **P1-1** | Frontend not handling `INCONCLUSIVE`/`no_consensus`/`UserError` — would show success or blank | `contracts/provedown.py:182-193,258-276` returns `inconclusive`/`no_consensus` but frontend not built | After `setup-frontend.sh`, implement `try/catch` on `writeContract` → toast `UserError("[EXPECTED] ...")`, verdict card amber for `inconclusive` ("Worker unavailable") and `no_consensus` ("honest split, retry") | Frontend exists | Manual: trigger `empty` preset → expect amber not green; register with `http://` not `https://` → expect UserError toast |
| **P1-2** | Malformed bundle JSON → `json.loads` catch → `p50=""` → LLM may hallucinate p95 even though bundle malformed → potentially false BREACH (demo failure WARN) | `contracts/provedown.py:199-205` parse `maybe` not dict → `p50=""` but still calls `exec_prompt` with malformed clean | Add before `exec_prompt`: `if not isinstance(maybe, dict) or "p95" not in maybe: return inconclusive` — cheap guard | Contract redeploy | `preset=empty` already inconclusive; add test `malformed` preset returns inconclusive not resolved |
| **P1-3** | 403 HTML body via `web.render` not detected — `web.render` may return HTML 403 page 200-ish body, not exception, so fetch appears success but bundle is HTML not JSON → same malformed path above | `contracts/provedown.py:168` catches exception only, not 4xx body | Post-hackathon use `web.get` with `status_code` check per docs `features/web-access` (Gym alternative reroute). For MVP Worker always 200, so P1 not P0. | Worker we control → 200 always, so defer | Document limitation in `05-benchmark-alignment` already |
| **P1-4** | Same private key for both chains (0x398... identical) + `*:Zone.Identifier` leak already ignored | `.env.local:6,19` + `.gitignore` | Rotate Base key via `cast wallet new` (if `cast` available) or keep for testnet but add comment `# testnet only, rotate before mainnet` | `cast` or manual | `grep 0x398 startup --exclude=.env.local` 0 after rotate |
| **P1-5** | `frontend/` not yet git-tracked, `.gitignore` not enforced via `git check-ignore` until `git init` | `.gitignore:1` lists `.env*` but `git status` fatal not repo | `git init` in `startup/` → `git add .gitignore .env.example` first, never `add .env.local` | None | `git check-ignore -v .env.local` → `.gitignore:1:.env.local` |
| **P1-6** | `genvm-lint` missing, fallback to `py_compile` only syntax not 20+ rules (TreeMap primitive, `self` capture etc.) | `scripts/run-lint.sh` | `pip install genlayer` or `cargo install genvm-lint` if available, else Studio lints server-side on deploy | Python pip | Studio deploy error will surface lint, not blocker for analog |
| **P1-7** | `appeal_attestation` missing vs readiness spec | `contracts/provedown.py` no appeal method | Either implement fixed bond `0.1 GEN` simple re-jury or update `implementation-readiness.md:3` to state mocked post-hackathon (do not demo nonexistent bond) | Contract redeploy if implemented | `grep appeal_attestation contracts/provedown.py` present or docs updated |

---

## P2 — Post-hackathon (do NOT spend build time)

- Continuous off-chain poller (5 min), hourly Merkle batch 100→one rootHash, USDC escrow `emit_transfer`, residential IP diversity / ZK random challenge (Pulse), TEE Intel TDX + zkVM (Verifiable-SLAs), ENS SLO policy hash, Circle Gateway nanopayments / CCTP, VRF front-running mitigation, Incident Playbook 16 guards, procurement/RFP verification expansion (90d), carbon/health, Betty parimutuel, stigmergy — all in `feature-synthesis.md:Long-term` + `implementation-readiness.md:2`.

---

## Verification Order Today (Sep 3)

```bash
# P0 unblock chain (15 min manual + 30 min verify)
node scripts/check-env.mjs  # expect ✗ until Worker+contract set — baseline
genlayer account show  # check 0x3211... balance 0? → faucet
cd hosting/bundle-worker && npx wrangler deploy  # → set NEXT_PUBLIC_BUNDLE_WORKER_URL
bash scripts/check-bundle.sh  # 1/8 stable
export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY startup/.env.local | cut -d= '=' -f2 | tr -d '\r\n ')
node startup/scripts/deploy-with-js.mjs  # → 0x... ACCEPTED → set NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS
bash scripts/verify-post-deploy.sh 0x...  # register 2 SLAs + attest breach/no_breach → explorer tx
bash scripts/setup-frontend.sh  # npm install + next build (requires .env.local 42-char)
npm --prefix startup/frontend run dev # manual: register→attest→pending→explorer→hash→reputation (healthy/breach/ambig)
```
