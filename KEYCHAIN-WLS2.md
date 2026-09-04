# KEYCHAIN — WSL2 Handling for GenLayer CLI

**Why keychain fails in WSL:** WSL2 is headless Linux without GNOME Keyring / macOS Keychain / Windows Credential Manager. `genlayer account unlock` requires OS keychain (see preflight `OS keychain is not available`). `genlayer account import` with `--password` works for import, but `genlayer deploy` then prompts `Enter password to decrypt keystore` and fails non-interactively if keychain unavailable. This is WSL environment limitation, not credential error.

**Supported alternative per official pattern:** Use `genlayer-js` direct wallet (as `genlayer-jury/deploy_dispute_court_v2.ts:11,21` does), which reads `GENLAYER_PRIVATE_KEY` env directly via `createAccount(privateKey)` and never touches OS keystore. This is documented reusable path and avoids keychain entirely.

**Why this is safe to automate:** `genlayer-js` reads private key from `process.env.GENLAYER_PRIVATE_KEY` (set via `export GENLAYER_PRIVATE_KEY=$(grep ... .env.local | cut -d= -f2)` or `dotenv`), creates account in-memory, signs deploy tx, never writes to keystore or prompts.

**Exact commands you must manually provide (one-time):**

```bash
# Do NOT print the key. Verify existence only (masked):
grep -q GENLAYER_PRIVATE_KEY startup/.env.local && echo "present (not shown)" || echo "missing"

# Fund the deployer (already imported as provedown-deployer 0x3211d1419709682b81c53CC51cb63622E25488d3)
# Visit https://testnet-faucet.genlayer.foundation and paste 0x3211d1419709682b81c53CC51cb63622E25488d3
genlayer account show  # after faucet, balance should be >0 GEN on studionet/testnetBradbury

# For WSL, deploy via JS not CLI:
export GENLAYER_PRIVATE_KEY=$(grep GENLAYER_PRIVATE_KEY startup/.env.local | cut -d= '=' -f2 | tr -d '\r\n ')
node startup/scripts/deploy-with-js.mjs  # creates contract, prints 0x... address

# Then set in .env.local:
# NEXT_PUBLIC_PROVEDOWN_CONTRACT_ADDRESS=0x...
```

**What agent can safely automate:** Create `scripts/deploy-with-js.mjs` from `genlayer-jury/deploy_dispute_court_v2.ts` template, which reads `process.env.GENLAYER_PRIVATE_KEY` and `readFileSync('contracts/provedown.py')` and calls `client.deployContract`. No secret is printed; only `0x...` address and tx hash are logged.

**What agent will NOT do:** Never `cat .env.local` without redaction, never `echo $GENLAYER_PRIVATE_KEY`, never commit `keystores/provedown-deployer.json` (already gitignored via `.gitignore: keystores/`). `scripts/check-env.mjs` reports `present/missing` only.

**Expected result when fixed:** `node scripts/deploy-with-js.mjs` → `Deploy transaction submitted: 0x...` → `WAITING for ACCEPTED (30-60s)` → `Contract address: 0x...` → set in `.env.local` → `bash scripts/verify-post-deploy.sh 0x...` shows ACCEPTED tx and `get_attestation` BREACH/NO_BREACH.

**Security note:** Do not reuse same private key for Base Sepolia (currently both 0x398... identical in `.env.local` — rotate per `FINAL-PREFLIGHT-AUDIT.md: S1`).

**Do NOT search other repos for credentials:** No other local repository is inspected for private keys. Only documented reusable deploy pattern from `genlayer-jury/deploy_dispute_court_v2.ts` is reused, not credential stores.
