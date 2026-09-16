# EVIDENCE BUNDLE — ProveDown Studio Next E2E (2026-09-11)

No secrets. All values verifiable on `https://explorer-studio-dev.genlayer.com` (chain 61997, Consensus v0.6 RC).

**Public frontend (verified 2026-09-16):** `https://provedowngen.vercel.app/` — static `frontend/dist` build of release commit `1e26af6`; routes `/`, `/verify`, `/proof` (+ `?contract=0x278C…7aC1&cases=4,1,2` variants) return HTTP 200 with live Studio reads, unknown paths 404. Headless verification: attestations 1/2/4 hashes, reputation, Explorer links, observed-vs-limit rows, and REAL/SYNTHETIC/MOCK disclosures all render; zero console errors; 390/768/1280 viewports pass.

**Current deployment source of truth:** this file. Older addresses and receipts are retained only in explicitly labeled historical sections.

## Deployment

- Contract: `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`
- Deploy tx: `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb`
- Status: FINALIZED, execution FINISHED_WITH_RETURN, `isSuccessful` true
- Fee quote (standard preset): `feeValue=100000000000010352` (~0.1 GEN deposit)
- Deploy consumed: `executionConsumed=78628000000000` (~7.9e-5 GEN); refunded `99921372000009529` (~0.0999 GEN) at finalization
- Contract code: `contracts/provedown.py` (`# v0.3.1`, `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng`, `gl.contract.Contract`, JSON-string storage, `run_nondet_default`)
- Explorer: `https://explorer-studio-dev.genlayer.com/address/0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`

## Attestations (current hardened contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`)

| Case | Register tx | Attest tx | Verdict | Confidence | Evidence hash | p50/p95 | Reason | Status |
|---|---|---|---|---|---|---|---|---|
| A healthy | `0x253881fbb07c87b15c6964013f3ee10d3035d62b7d93c9e3175c8a4fa7668f1f` | `0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf` | NO_BREACH (false) | 1000 | `64e6c84f01418b8912115d16c9290edb8f8084d38dbadcc261a25bb9e9e688ae` | 320/1600 | OK | resolved |
| B breach | `0xeb749cd4f4df5f987fde0af3b47a28b1236a27dead26b09dcc3b4e0aac2350ee` | `0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505` | BREACH (true) | 1000 | `b4fc2013862e316e8025812a4a471c64650934b37368757f504a819f0d04188c` | 1561/4800 | ERROR_QUALITY | resolved |
| C empty | `0x9880f176a902c0cf94a1580ffd1bd635c29e1d856b058c5183f8cde3dbbfb7da` | `0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a` | INCONCLUSIVE (false) | 0 | (empty — refused) | / | UNAVAILABLE | inconclusive |

All canonical deployment, registration, and attestation writes listed here are FINALIZED + FINISHED_WITH_RETURN + `isSuccessful` true. Attestation fee deposit `100000000000010352` each; attestation consumed `data_fees_consumed=[127878000000000]` (~1.3e-4 GEN) each. Explorer: `https://explorer-studio-dev.genlayer.com/tx/<hash>`.

Reputation on the current hardened deployment after the canonical three-case run: `{"api_url":"https://example.com","breaches":1,"score":60,"total":2}`. The inconclusive case does not change reputation.

## Historical re-verification 2026-09-05 (retained prior-deployment snapshot)

Read-only check: SLAs demo-healthy/breach/empty present, atts 1/2/3 byte-identical to above, chain 61997, SDK `genlayer-js@2.0.0-rc.1`, Worker presets hash-stable (`b4fc2013…`/`64e6c84f…` 2/2).

| Case | Attest tx (FINALIZED + FINISHED_WITH_RETURN + isSuccessful) | Att | Verdict | Conf | Hash | Latency req→FINALIZED |
|---|---|---|---|---|---|---|
| A healthy | `0x68cf3412b4db4f32e1d8d594d1191fb4c6faa7800c9e1ac2ec26947044890a03` | 4 | NO_BREACH | 950 | `64e6c84f…` | 111s |
| B breach | `0x9f311b965d2c436fbb1e6eff7f56dcb56cbc0d90e8b777b280227e4d90c3f4fc` | 5 | BREACH LATENCY | 1000 | `b4fc2013…` | 44s |
| C empty | `0x67a88f200c7264bded15954b2c343f86b30c8007ae3950573e0a09d9ca751cd3` | 6 | inconclusive UNAVAILABLE | 0 | (refused) | 43s |

Reputation after: `{"score":57,"total":4,"breaches":2}` — historical re-verification on the previous deployment. The current frontend points at `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`. Fee estimate unchanged `feeValue=100000000000010352`. Explorer: `https://explorer-studio-dev.genlayer.com/tx/<hash>`.

## Browser wallet E2E 2026-09-11

The injected-wallet browser flow was completed against the current Studio Devnet contract without redeployment:

- Registration tx: `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a` — [Explorer](https://explorer-studio-dev.genlayer.com/tx/0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a), `FINALIZED`, `FINISHED_WITH_RETURN`, `isSuccessful=true`, `register_sla` for `browser-smoke-20260909-01`.
- Registration receipt fees: deposit `613834800010352`, consumed `78632250000000`, refund `535202550009529` (raw receipt units; no fiat conversion).
- `get_sla("browser-smoke-20260909-01")` readback matched the submitted owner, `https://example.com`, bundle URL, and canonical SLO JSON `{"error_threshold":0.01,"fill_threshold":0.8,"match_threshold":0.85,"p95_threshold":2000}`.
- Attestation tx: `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110` — [Explorer](https://explorer-studio-dev.genlayer.com/tx/0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110), `FINALIZED`, `FINISHED_WITH_RETURN`, `isSuccessful=true`, `request_attestation` for the browser SLA.
- Attestation receipt fees: deposit `624289200010352`, consumed `80206250000000`, refund `544082950009529` (raw receipt units; no fiat conversion).
- Attestation `4` read back as `resolved`, `NO_BREACH` (`breach=false`), reason `OK`, confidence `1000`, p50/p95 `320/1600`, evidence hash `e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3`.
- `get_reputation("https://example.com")` read back as `{"score":66,"total":3,"breaches":1}` after the new resolved check.
- A fresh read of the exact synthetic Worker URL produced the same SHA-256 `e33f68976f1f4b467211f73e6ac5293db8933ec573de4b6fb023cc1bfe1ea0b3`.

This proves the wallet-backed Studio browser lifecycle for the current narrow slice. Worker evidence remains synthetic fixture content and the Base relay remains mocked.

## Worker

- URL: `https://provedown-bundle.contentbounty.workers.dev/bundle`
- Presets (all HTTP 200): `no_breach` (132 chars), `breach` (155 chars), `ambig` (152 chars), `empty` (144 chars), unknown → breach fallback
- Hash stability: `b4fc2013862e316e...` twice identical; no timestamp/randomness; no secrets in bodies
- Config: `hosting/bundle-worker/wrangler.toml` (`main="worker.js"`, no `[assets]`; deploy with `--cwd`, not from repo root)

## Versions (exact, locked)

- `genlayer-js@2.0.0-rc.1` (`startup/node_modules`, `package.json` save-exact)
- `genlayer@0.39.2` CLI (only `account list`; deploys via JS per `KEYCHAIN-WLS2.md`; `0.40.0-rc.3` install timed out on slow network — JS path covers deploy/write/estimate/receipt/appeal-charge surface used)
- `genlayer-py==0.19.0rc2`, `genlayer-test==0.30.0rc2`, `genvm-linter==0.11.1rc2` (`--no-deps` venv `/tmp/provedown-rc-venv`; plus `numpy==1.26.4`, `click==8.5.0`)
- Studio-dev: chain 61997, RPC `https://studio-dev.genlayer.com/api`, consensus `0xb727...`, fee policy `genPerTimeUnit=1, storageUnitPrice=250000000, receiptGasPrice=250000000`
- Node v22.22.3, Python 3.12.3

## Tests & lint

- `python3 -m pytest tests/test_provedown.py -q`: **13 passed** (sanitize, hash-stable, SLO parse, breach logic, breach-only consensus, empty/malformed/range-invalid evidence, strict SLO validation, strict judge parsing, valid-reach-jury, inconclusive agreement)
- `python3 -m py_compile contracts/provedown.py`: OK
- `genvm-lint lint contracts/provedown.py` (0.11.1rc2): reports 2 reachability advisories (`gl.nondet.* not reachable from equivalence block` for the nested callback passed to `run_nondet_default`). This is a documented analyzer limitation for the deployed structure: Studio accepted the source and finalized attestations exercised both `web.render` and `exec_prompt`. The lint command remains non-clean.

## Compatibility evidence (Bradbury, old stack — not primary)

- Contract `0x72a67E0cF59bCb526AEF0D81391e399C56703590` (deploy `0x89f1...`), healthy `0x0947...` + att `0xed5a...` (NO_BREACH), explorer-bradbury links in `memory.md:Checkpoint 4`

## Known limitations

- Bundles synthesized (hash-stable mock Worker); real poller 90-DAY
- Bridge to Base mocked (labeled arrow, not Hyperlane tx)
- `timestamp` empty on studio-dev (`message_raw["datetime"]` absent; `gl.block.timestamp` fallback added but still empty in these txs — tx time + evidence hash suffice)
- Studio-dev may reset (re-run `scripts/attest-studio-dev.mjs`)
- Testnet key reused for Base (testnet only)
- `genlayer@0.40.0-rc.3` global install timed out (100kB/s network); JS v2 RC covers all used surfaces; CLI 0.39.2 retained for non-fee reads only
