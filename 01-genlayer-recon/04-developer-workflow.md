# 04 — Developer Workflow & Tooling

**Sources:** S10, S13, S14, S15, S18 (High)

## Recommended Path
```
skills: marketplace add genlayerlabs/skills → /genlayer-dev
OR manual: clone boilerplate → pip install -r requirements (genlayer-test+genvm-linter) → Node18+Docker26+Python3.12
Write contracts/ (Python gl.Contract, typed storage)
Lint: genvm-lint check contracts/foo.py --json (~250ms, 20+ rules)
Direct: pytest tests/direct/ -v (mock_web/mock_llm regex, direct_vm.snapshot/revert, prank, expect_revert)
Integration: genlayer init --numValidators 5 → genlayer up (Studio :8080, RPC :4000) → gltest tests/integration -v --network localnet (~min/test)
Deploy: genlayer network set {localnet|studionet|testnetBradbury} → genlayer deploy --contract ./contracts/foo.gpy --fee-profile ./fee-profile.json
Frontend: genlayer-js → createClient({chain: simulator|studionet|testnetBradbury}) → readContract/call + writeContract/transact → waitForTransactionReceipt
Explorer: https://explorer-bradbury.genlayer.com/address/0x... + /tx/0x...
```

## Test Layers
1. Pure storage tests
2. Mock nondet with controlled outputs
3. Consensus agreement tests (`run_validator() is False` on dissenting mock)
4. Studio integration last

## Fixtures (direct mode)
- `direct_vm` (sender, mock_web(pattern,{status,body}), mock_llm(pattern,response), clear_mocks(), expect_revert, snapshot/revert, strict_mocks, check_pickling)
- `direct_deploy`, `direct_alice/bob/charlie/owner`

## Networks
| Env | RPC | ChainID | Persistence | LLM | Faucet |
|---|---|---|---|---|---|
| Bradbury prod-like | rpc-bradbury.genlayer.com | 4221 | Persistent | Real | testnet-faucet.genlayer.foundation |
| Asimov infra test | rpc-asimov.genlayer.com | 4221 | Persistent | Real | same |
| Studionet hosted | studio.genlayer.com/api | 61999 | Temporary | Real | built-in |
| Localnet Docker/GLSim | localhost:4000/api | 61127 | Local | Configurable | built-in |

GLSim (`pip install genlayer-test[sim]` → `glsim --port 4000 --validators 5`) runs Python runner natively (~1s, minor incompatibilities) — fast iteration before Studio.

## CLI (S13)
`init`, `up` (with `--ollama`), `stop`, `new`, `config`, `network set/info/list`, `deploy`, `call`, `write`, `estimate-fees`, `schema`, `code`, `receipt`, `appeal`, `appeal-bond`, `trace`, `account`, `staking` (validatorJoin/Deposit/Exit/Claim/Prime, delegator*, epoch-info, validators, quarantined/banned), `localnet validators`.

## Observability
- `print`→stdout, `gl.trace`→genvm_log, `gl.trace_time_micro`+`GENLAYER_ENABLE_PROFILER=true`→gzip profiling
- Studio: logs filterable by level (info/success/error), layer (RPC/GenVM/Consensus), tx hash
- No debugger attach

## Prior Lessons (S15, S18, S19)
- Jury v1 cosmetic dependency rightly rejected → v2 every dispute real on-chain tx; removal test: remove GenLayer → no verdicts.
- Jury V2 stability rule: validators fetch independently, never compare raw bytes; plain locals not `self`; primitives only; reasoning derived deterministically post-consensus to avoid MAJORITY_DISAGREE.
- ContentBounty: 2-stage LLM (observations→criteria), `UNTRUSTED_INPUT_JSON` framed compact, claim-tag `cb-{keccak hex20}` with boundary check, `INCONCLUSIVE` retryable (3 attempts) vs `REJECTED` terminal.
