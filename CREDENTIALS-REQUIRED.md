# CREDENTIALS REQUIRED — ProveDown MVP

> **Historical / superseded setup notes.** This document describes the earlier Bradbury-first credential path. The current demonstrated target is Studio Next chain 61997; use `EVIDENCE.md`, `scripts/check-env.mjs`, and `research/RELEASE-INVENTORY.md` for current values and release checks. No credential values are contained here.

**Rule:** Never commit secrets. Never print private keys. Use `.env.local` (gitignored). Verify existence without exposing value (`scripts/check-env.mjs` does this).

All credentials below are **required where noted**. Where a value is `Public — no secret`, you still configure the URL.

---

## 1. GenLayer / Bradbury (REQUIRED for deploy + frontend live mode)

| Variable | Where / How to obtain | When needed | Public / Secret | Fallback if missing |
|---|---|---|---|---|
| `GENLAYER_RPC_URL` | Public: `https://rpc-bradbury.genlayer.com` — documented in `01-genlayer-recon/04-developer-workflow.md` chain table. No account. | Always (read + write via `genlayer-js`) | Public | Can run mocked frontend (`NEXT_PUBLIC_LIVE_JURY=false`) but no real attestation |
| `GENLAYER_CHAIN_ID` | `4221` for Bradbury (persistent) — fixed. | Deploy + frontend | Public | — |
| `GENLAYER_EXPLORER_URL` | `https://explorer-bradbury.genlayer.com` | Explorer links | Public | — |
| `GENLAYER_PRIVATE_KEY` | **You must provide.** Generate via `genlayer account create provedown-deployer` or import existing (`genlayer account import`). Fund via **Bradbury faucet** `https://testnet-faucet.genlayer.foundation` (public). Check existing without printing: `grep -q GENLAYER_PRIVATE_KEY /home/unify/genlayer-jury/.env.local && echo YES`. Current check below: see `scripts/check-env.mjs`. **Do not copy private key into git.** | Deploy contract + pay gas for `register_sla` / `request_attestation` | **Secret** | No deploy possible; can only run read-only + mocked. |
| `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS` | **Set after deploy** `0x...` Bradbury address from `genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury`. Explorer link `https://explorer-bradbury.genlayer.com/address/0x...`. | Frontend live reads/writes | Public | Mocked mode uses no contract |
| `GENLAYER_FEE_PRESET` | `standard` (or `low`/`high`) — for `genlayer estimate-fees --fee-preset`. No credential. | Estimate gas | — | — |

**Already available locally (verified 2026-09-02, value not shown):** `GENLAYER_PRIVATE_KEY` exists in `/home/unify/genlayer-jury/.env.local` (checked via `grep` redacted). `GENLAYER_RPC_URL` Bradbury public reachable. Do NOT reuse that private key for production without explicit rotation — it's shared with jury demo; create dedicated `provedown-deployer` via `genlayer account create`.

**Manual action you must take before Sep 3 if not already:**

```bash
genlayer account list
genlayer account show --name provedown-deployer   # check balance
# if missing:
genlayer account create provedown-deployer
genlayer network set testnetBradbury
# fund via https://testnet-faucet.genlayer.foundation  (paste address)
```

---

## 2. Studio / Asimov (Optional — Studio test path)

| Variable | How | Need |
|---|---|---|
| `GENLAYER_STUDIO_RPC` | `https://studio.genlayer.com/api` (hosted IDE, 61999). Access via `https://studio.genlayer.com` no key. | Optional Studio test without local Docker |
| `GENLAYER_STUDIO_CHAIN_ID` | `61999` | — |

No secret. Use Studio if `genlayer up` localnet unavailable (Docker not in WSL2).

---

## 3. Base Sepolia (Optional for hackathon — mocked bridge is sufficient; real bridge is post-hackathon)

| Variable | How | Need | Fallback |
|---|---|---|---|
| `BASE_SEPOLIA_RPC_URL` | Public `https://sepolia.base.org` | Only if deploying `BaseVeridctRegistry.sol` real | Mocked Relay→Base diagram is sufficient for hackathon (see `implementation-readiness.md` §9) |
| `BASE_SEPOLIA_PRIVATE_KEY` | Create via `cast wallet new` or MetaMask, fund via `https://www.alchemy.com/faucets/base-sepolia` | Only if real Base deploy | Not required for hackathon demo |
| `NEXT_PUBLIC_BASE_VERDICT_REGISTRY` | `0x...` on Base Sepolia after Foundry `forge create` | Frontend claimCredit mock | Not required |
| `NEXT_PUBLIC_BASE_EXPLORER_URL` | `https://sepolia.basescan.org` | Links | Public |

**No action required before Sep 3** — bridge is mocked per `implementation-readiness.md` §9.

---

## 4. Hyperlane (Optional, post-hackathon)

| Variable | How | Need |
|---|---|---|
| `HYPERLANE_MAILBOX` | Deployed mailbox address — only for real Hyperlane bridge | Not for hackathon (mock) |

---

## 5. Bundle Worker (REQUIRED for jury fetch)

| Variable | How | Need |
|---|---|---|
| `NEXT_PUBLIC_BUNDLE_WORKER_URL` | **You must deploy** `hosting/bundle-worker/worker.js` to Cloudflare Workers (free): `npx wrangler deploy --name provedown-bundle` or `npm --prefix hosting/bundle-worker run deploy` (if wrangler configured). No secret for public GET. For local dev: `npx wrangler dev --port 8787` → `http://localhost:8787/bundle`. Jury does `gl.nondet.web.render(mode='text')` to this URL — must be public HTTPS. | Required for jury to fetch stable bundle JSON. Without it, `request_attestation` hits `INCONCLUSIVE` (fetch fail) per technical validation §2.1. |
| `BUNDLE_WORKER_URL` | Same as above (backend poller if added later) | Same |

**No credential.** Deploy is `wrangler login` (browser OAuth) then `deploy`. Check existence via `scripts/check-env.mjs`.

---

## 6. OpenRouter / LLM provider (OPTIONAL — validators already have LLMs)

| Variable | How | Need |
|---|---|---|
| `OPENROUTER_API_KEY` | Obtain at `https://openrouter.ai/keys` if you want **local mocked jury** (`NEXT_PUBLIC_LIVE_JURY=false`) to use real LLM via `src/lib/useJury` like `genlayer-jury` does. For **live GenLayer mode**, validators run their own LLMs (Heurist/Comput3/Chutes etc.) — frontend does not need this key. | Only for mocked frontend fallback when Bradbury congested. Not needed for live `genlayer-js` path. |

**Already available locally:** `OPENROUTER_API_KEY` exists in `/home/unify/genlayer-jury/.env.local` (verified, not shown). Reuse is allowed for mocked mode.

---

## 7. Frontend (Next.js, like genlayer-jury)

| Variable | How |
|---|---|
| `NEXT_PUBLIC_GENLAYER_NETWORK` | `testnetBradbury` |
| `NEXT_PUBLIC_GENLAYER_EXPLORER_URL` | `https://explorer-bradbury.genlayer.com` |
| `NEXT_PUBLIC_LIVE_JURY` | `false` for mocked, `true` for live `genlayer-js` writes |
| `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS` | as above |
| `NEXT_PUBLIC_BUNDLE_WORKER_URL` | as above |

All public, no secret.

---

## Verification (without exposing secrets)

```bash
node scripts/check-env.mjs
# and
grep -q GENLAYER_PRIVATE_KEY /home/unify/genlayer-jury/.env.local && echo "genlayer key: present (not shown)"
grep -q OPENROUTER_API_KEY /home/unify/genlayer-jury/.env.local && echo "openrouter: present"
genlayer account list
genlayer account show --name provedown-deployer
```

**Before Sep 3 you must provide (manual):** `GENLAYER_PRIVATE_KEY` funded + `NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS` after deploy + `NEXT_PUBLIC_BUNDLE_WORKER_URL` after `wrangler deploy`. Others optional/mock is fine.
