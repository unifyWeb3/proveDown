# SUBMISSION CHECKLIST — ProveDown

**Track:** Agentic Commerce Infrastructure — SLA and uptime enforcement.
**Thesis:** Neutral functional attestation for machine-to-machine service-quality agreements (functional SLO jury, not uptime ping).

## Product description (for form)

ProveDown is a consensus-backed attestation sidecar for agent pipelines: a pipeline owner registers an API + functional SLO; independent GenLayer validators fetch a stable evidence bundle, judge breach vs SLO with tolerance, and anchor the verdict (breach bool + reason + confidence + evidence SHA-256) plus a Bayesian reliability record on-chain with Explorer proof. Demo: healthy API → NO_BREACH; functionally broken API (HTTP 200 but 72% fill vs 80% required) → BREACH; missing evidence → INCONCLUSIVE (never definitive). The Worker is synthesized fixture evidence and the downstream relay is mocked. Differentiation vs live Uptime: factual reachability (`is_up`) vs functional obligation fulfillment (LLM jury, tolerance, evidence hash, reliability record).

## Links

- Repo: `https://github.com/unifyWeb3/proveDown` (PRIVATE until submission/publication point — do NOT make public early)
- Demo: public `https://frontend-k4z1tmaco-oxunify.vercel.app/` (static; live reads studio-dev 61997; verified 2026-09-16) + local `frontend/index.html` + `DEMO.md` 60–90s script
- Deployed hardened contract (Studio Next 61997): `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`
- Explorer: `https://explorer-studio-dev.genlayer.com/address/0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`
- Worker: `https://provedown-bundle.contentbounty.workers.dev/bundle`

## Explorer evidence (all FINALIZED + FINISHED_WITH_RETURN + isSuccessful=true)

- Deploy: `https://explorer-studio-dev.genlayer.com/tx/0x6cdb3d3d7f86a4a449f656ebd6b1e3e2e4ee7ec405afa3d494dc0828b3b36cbb`
- Register healthy: `https://explorer-studio-dev.genlayer.com/tx/0x253881fbb07c87b15c6964013f3ee10d3035d62b7d93c9e3175c8a4fa7668f1f`
- Register breach: `https://explorer-studio-dev.genlayer.com/tx/0xeb749cd4f4df5f987fde0af3b47a28b1236a27dead26b09dcc3b4e0aac2350ee`
- Register empty: `https://explorer-studio-dev.genlayer.com/tx/0x9880f176a902c0cf94a1580ffd1bd635c29e1d856b058c5183f8cde3dbbfb7da`
- Attest healthy (NO_BREACH 1000): `https://explorer-studio-dev.genlayer.com/tx/0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf`
- Attest breach (BREACH 1000 ERROR_QUALITY): `https://explorer-studio-dev.genlayer.com/tx/0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505`
- Attest empty (INCONCLUSIVE conf 0): `https://explorer-studio-dev.genlayer.com/tx/0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a`
- Browser register: `https://explorer-studio-dev.genlayer.com/tx/0x63f386deb52cf7f9caf36c32fe713c10d7132e95b9f737c1da99de4dc599756a`
- Browser attestation 4 (NO_BREACH 1000): `https://explorer-studio-dev.genlayer.com/tx/0xfe160a9481e9476ad7dceacbad5545a829c8abc5bcc462151fd0ec55ee15d110`

## Screenshots / demo flow

- `frontend/index.html` renders Cases 1/2/3 + reputation + explorer links (live reads); `npm --prefix frontend run build` produces the validated static artifact.
- Flow: `DEMO.md` (hook 15s → run 45s → why-GenLayer 15s → beyond 15s).
- Differentiation line: "HTTP 200 does not mean the service fulfilled the agreement."

## Known limitations (honest)

- Bundles synthesized (hash-stable mock Worker); real poller is 90-DAY.
- Bridge to Base mocked (arrow + hash diagram, not Hyperlane tx).
- Studio-dev may reset (re-run `scripts/attest-studio-dev.mjs`); Bradbury `0x72a6...` kept as compatibility evidence only.
- `timestamp` empty on studio-dev (`message_raw["datetime"]` absent; `gl.block.timestamp` fallback added, still empty in these txs — evidence hash + tx time suffice).
- Browser wallet write path is verified by the finalized registration and attestation 4 transactions above, with on-chain SLA, attestation, and reputation readback.
- Validator LLM diversity assumed (studio-dev policy: gpt-5.4/gemini-3-flash/gpt-oss-120b via greybox policy).

## Setup instructions (judge/verify)

```bash
git clone https://github.com/unifyWeb3/proveDown && cd proveDown  # repo is startup/ content at root? No — repo root IS startup/
node scripts/check-env.mjs # masked credentials/connectivity check
bash scripts/run-tests.sh # 13 analog tests passed
PYTHONPATH=/tmp/provedown-linter /tmp/provedown-linter/bin/genvm-lint lint contracts/provedown.py # 2 reachability advisories (false-positive, proven on-chain; Studio accepts on deploy)
# live reads (no wallet): open frontend/index.html
# live writes: GENLAYER_PRIVATE_KEY=... node scripts/attest-studio-dev.mjs
```

**Note:** Repo root contains research (`00-mission.md`, `01-`–`07-`, `SOURCES.md`) + product (`contracts/provedown.py`, `hosting/bundle-worker/worker.js`, `frontend/index.html`, `scripts/`, `tests/`).

## Final pitch (30s)

APIs can return HTTP 200 while failing the functional obligation an agent depends on. ProveDown has independent GenLayer validators fetch a quality bundle, agree on breach vs no-breach, store the evidence fingerprint, and update a reliability record. Uptime tells you an endpoint responded; ProveDown tests whether it fulfilled the agreement. The current Worker is synthesized and the downstream relay is mocked, so this is an attestation MVP, not a production settlement rail.
