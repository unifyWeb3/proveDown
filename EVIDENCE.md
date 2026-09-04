# EVIDENCE BUNDLE — ProveDown Studio Next E2E (2026-09-04)

No secrets. All values verifiable on `https://explorer-studio-dev.genlayer.com` (chain 61997, Consensus v0.6 RC).

## Deployment

- Contract: `0xeE85DFbB4C419dD27D730D105EEeEA213DD7c0FF`
- Deploy tx: `0x5a34f359d575b4e74742ccc3ec7ea2e1d919911be90c47b9fdb125b53837a782`
- Status: FINALIZED, execution FINISHED_WITH_RETURN, `isSuccessful` true
- Fee quote (standard preset): `feeValue=100000000000010352` (~0.1 GEN deposit)
- Deploy consumed: `executionConsumed=78628000000000` (~7.9e-5 GEN); refunded `99921372000009529` (~0.0999 GEN) at finalization
- Contract code: `contracts/provedown.py` (`# v0.3.0`, `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng`, `gl.contract.Contract`, JSON-string storage, `run_nondet_default`)
- Explorer: `https://explorer-studio-dev.genlayer.com/address/0xeE85DFbB4C419dD27D730D105EEeEA213DD7c0FF`

## Attestations (contract `0xeE85...`)

| Case | Register tx | Attest tx | Verdict | Confidence | Evidence hash | p50/p95 | Reason | Status |
|---|---|---|---|---|---|---|---|---|
| A healthy | `0xfbad72095fa21c3b6438bcb78143121f65c73a36e1add67c1e081a7b543db817` | `0x5b1cb325b5b27d6d0603a6cea6a33c1b4cb173788093bb87036609314d7ac497` | NO_BREACH (false) | 980 | `64e6c84f01418b8912115d16c9290edb8f8084d38dbadcc261a25bb9e9e688ae` | 320/1600 | OK | resolved |
| B breach | `0x91721ba5a9338ebb7281ebb32f2c049479afc2d1ac85714ca95d39ebaa60a047` | `0xe04dae35608f65b703cfcd2f80a197cb402330c5776f5e634e419f9519bc7383` | BREACH (true) | 1000 | `b4fc2013862e316e8025812a4a471c64650934b37368757f504a819f0d04188c` | 1561/4800 | LATENCY | resolved |
| C empty | `0x15832858c70c49c96da9523e6be5a79eba4f1cf659335cdec5895a90d754e6e1` | `0xa218c962dbe7aa23dee7d705e5a7ec8a2dcdf5bdbbc9bdfdfef01dd2a7cdea43` | non-breach (false) | 0 | (empty — refused) | / | UNAVAILABLE | inconclusive |

All 6 writes + 3 attestations: FINALIZED + FINISHED_WITH_RETURN + `isSuccessful` true. Attestation fee deposit `100000000000010352` each; attestation consumed `data_fees_consumed=[127878000000000]` (~1.3e-4 GEN) each. Explorer: `https://explorer-studio-dev.genlayer.com/tx/<hash>`.

Reputation: `{"api_url":"https://example.com","breaches":1,"score":60,"total":2}` (resolved attestations only — inconclusive excluded; Bayesian (1 good +2)/(2 total +3) = 3/5 = 60 ✓).

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

- `python3 -m pytest tests/test_provedown.py -q`: **9 passed** (sanitize, hash-stable, SLO parse, breach logic, breach-only consensus, empty/malformed non-definitive, valid-reach-jury, inconclusive agreement)
- `python3 -m py_compile contracts/provedown.py`: OK
- `genvm-lint lint contracts/provedown.py` (0.11.1rc2): reports 2 reachability advisories (`gl.nondet.* not reachable from equivalence block` for nested-def-passed-as-arg) — **false-positive**: identical structure succeeds on-chain (prediction-market `0x6E68...`, our 6+ attestations with real web.render + exec_prompt consensus). Studio accepts on deploy.

## Compatibility evidence (Bradbury, old stack — not primary)

- Contract `0x72a67E0cF59bCb526AEF0D81391e399C56703590` (deploy `0x89f1...`), healthy `0x0947...` + att `0xed5a...` (NO_BREACH), explorer-bradbury links in `memory.md:Checkpoint 4`

## Known limitations

- Bundles synthesized (hash-stable mock Worker); real poller 90-DAY
- Bridge to Base mocked (labeled arrow, not Hyperlane tx)
- `timestamp` empty on studio-dev (`message_raw["datetime"]` absent; `gl.block.timestamp` fallback added but still empty in these txs — tx time + evidence hash suffice)
- Studio-dev may reset (re-run `scripts/attest-studio-dev.mjs`)
- Testnet key reused for Base (testnet only)
- `genlayer@0.40.0-rc.3` global install timed out (100kB/s network); JS v2 RC covers all used surfaces; CLI 0.39.2 retained for non-fee reads only
