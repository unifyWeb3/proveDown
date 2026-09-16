# Current GenLayer Environment Audit

Date checked: 2026-09-11

## Official current material

- Docs overview: https://docs.genlayer.com/full-documentation.txt
- SDK API reference: https://sdk.genlayer.com/main/_static/ai/api.txt
- Current GenLayer positioning: GenLayer is an adjudication layer for outcomes derived from natural language, live web data, or other non-deterministic inputs.
- Current architecture: chain orders actions; validators execute GenVM duties; consensus records accepted state.

## Installed and live environment

| Item | Repository claim/config | Live check | Result |
|---|---|---|---|
| Primary network | Studio Next / Studio-dev | `studioDevnet.id` is 61997; RPC returns HTTP 405 to a GET, which is expected for a JSON-RPC endpoint | Verified |
| Contract | `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1` | `get_sla`, `get_attestation`, and `get_reputation` read successfully | Verified |
| Explorer | `https://explorer-studio-dev.genlayer.com` | Pinned transaction URLs are configured in code/docs | Configured; individual receipts verified below |
| SDK used by scripts/static page | `genlayer-js@2.0.0-rc.1` | Root package and live receipt script use 2.0.0-rc.1 | Verified |
| Frontend package dependency | Static frontend imports `genlayer-js@2.0.0-rc.1`; root package pins the same version; frontend package is dependency-free | Build and source are coherent; browser delivery depends on esm.sh | Verified with external-module caveat |
| CLI | `genlayer 0.39.2` retained for compatibility | Windows-backed `genlayer` command is present, but the bounded version probe timed out in this runner | Historical compatibility record; live writes use pinned JS SDK |
| Python | 3.12.3 | `python3 --version` | Verified |
| Linter | `genvm-lint 0.11.1rc2` in `/tmp/provedown-linter` | `scripts/run-lint.sh` selects the installed linter and reports two nested nondeterministic reachability advisories at `contracts/provedown.py:214` and `:311` | Syntax and full lint both exercised; lint is warning-only, not clean |
| Worker | `https://provedown-bundle.contentbounty.workers.dev/bundle` | Live HTTP 200 for breach, no_breach, and empty presets | Verified; synthesized content |
| Fee model | Fee-aware JS scripts use `estimateTransactionFees` and receipt success check | Existing live receipts prove the path works for Studio Next | Verified for pinned writes, not a current mainnet price |
| Transaction finality | Docs describe finality and repository uses `waitUntil: finalized` | Four pinned receipts return `FINALIZED`, `FINISHED_WITH_RETURN`, and `isSuccessful=true` | Verified |
| Appeals | Documentation mentions appeals in protocol research, but contract has no appeal method | `contracts/provedown.py` exposes only `register_sla`, `request_attestation`, and three views | Not implemented |

## Live contract reads

Read-only calls against Studio Next returned:

- SLA `demo-healthy`, `demo-breach`, and `demo-empty`, all with the live Worker URLs.
- Attestation 1: resolved, `breach=false`, confidence 1000, p95 1600, hash `64e6c84f...`.
- Attestation 2: resolved, `breach=true`, reason `ERROR_QUALITY`, confidence 1000, p95 4800, hash `b4fc2013...`.
- Attestation 3: `status=inconclusive`, confidence 0, no evidence hash.
- Canonical attestations 1-3 remain healthy, breach, and inconclusive; browser attestation 4 is resolved NO_BREACH with confidence 1000.
- Reputation after the canonical three-case run was score 60, total 2, breaches 1; after browser attestation 4 the current read is score 66, total 3, breaches 1.

## Receipt checks

Read-only `waitForTransactionReceipt` checks returned `successful=true` for:

- deploy `0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb`
- healthy attestation `0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf`
- breach attestation `0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505`
- empty-evidence attestation `0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a`
- browser registration `0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a`
- browser attestation 4 `0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110`

These are real Studio Next receipts, including the browser-wallet write path. They are not Bradbury receipts and do not prove mainnet or production economics.

## Direct RPC cross-checks (2026-09-09)

- `eth_chainId` returned `0xf22d` (61997) from `https://studio-dev.genlayer.com/api`.
- `gen_getTransactionLifecycle` with `{"txId":"0xf566...ed505"}` returned `storedStatus=Finalized`, `projectedStatus=Finalized`, `decisionActive=false`.
- `eth_getTransactionReceipt` for the same breach attestation returned `status=0x1`.
- `eth_getBalance` for the funded Studio deployer returned a non-zero value; the exact balance is intentionally not included in this artifact.

The lifecycle endpoint requires an object parameter (`txId`), not a positional hash. These checks complement the SDK receipt/readback checks; they do not create a new transaction or prove browser-wallet execution.

## Environment risks

1. The frontend is a static HTML app with a custom release build, not a conventional Next.js application. Present the static app and its live contract interaction plainly against the Project rubric.
2. Browser writes depend on an injected wallet and external esm.sh module delivery; the pinned browser smoke proves the path for that run.
3. `genlayer account show` failed during one CLI check with an RPC fetch error, while JS read calls succeeded. Do not use the CLI failure to invalidate the live JS evidence, but keep the CLI path unverified.
4. The normal lint command reaches `genvm-lint 0.11.1rc2` in this environment. It is not clean: the two nested `gl.nondet.*` reachability advisories remain documented because the same deployed structure has executed successfully on Studio Next.
5. `created_at`/`timestamp` fields read as empty strings in the pinned Studio Next state. Display timestamp unavailable rather than implying event time.
