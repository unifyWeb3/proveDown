# SUBMISSION CHECKLIST — ProveDown

**Track:** Agentic Commerce Infrastructure — SLA and uptime enforcement.
**Thesis:** Neutral functional attestation for machine-to-machine service-quality agreements (functional SLO jury, not uptime ping).

## Product description (for form)

ProveDown is a neutral, economically-secured attestation sidecar for agent pipelines: a pipeline owner registers an API + functional SLO; an independent GenLayer validator jury fetches a stable evidence bundle, judges breach vs SLO with tolerance, and anchors the verdict (breach bool + reason + confidence + evidence SHA-256) plus a Bayesian reputation update on-chain with explorer proof. Demo: healthy API → NO_BREACH; functionally broken API (HTTP 200 but 72% fill vs 80% required) → BREACH; missing evidence → INCONCLUSIVE (never definitive). Differentiation vs live Uptime project: factual reachability (strict consensus, is_up) vs functional obligation fulfillment (LLM jury, tolerance, evidence hash, reputation).

## Links

- Repo: `https://github.com/unifyWeb3/proveDown` (PRIVATE until submission/publication point — do NOT make public early)
- Demo: `frontend/index.html` (static; live reads studio-dev 61997) + `DEMO.md` 60–90s script
- Deployed contract (Studio Next 61997): `0xeE85DFbB4C419dD27D730D105EEeEA213DD7c0FF`
- Explorer: `https://explorer-studio-dev.genlayer.com/address/0xeE85DFbB4C419dD27D730D105EEeEA213DD7c0FF`
- Worker: `https://provedown-bundle.contentbounty.workers.dev/bundle`

## Explorer evidence (all FINALIZED + FINISHED_WITH_RETURN + isSuccessful=true)

- Deploy: `https://explorer-studio-dev.genlayer.com/tx/0x5a34f359d575b4e74742ccc3ec7ea2e1d919911be90c47b9fdb125b53837a782`
- Register healthy: `.../tx/0xfbad72095fa21c3b6438bcb78143121f65c73a36e1add67c1e081a7b543db817`
- Register breach: `.../tx/0x91721ba5a9338ebb7281ebb32f2c049479afc2d1ac85714ca95d39ebaa60a047`
- Register empty: `.../tx/0x15832858c70c49c96da9523e6be5a79eba4f1cf659335cdec5895a90d754e6e1`
- Attest healthy (NO_BREACH 980): `.../tx/0x5b1cb325b5b27d6d0603a6cea6a33c1b4cb173788093bb87036609314d7ac497`
- Attest breach (BREACH 1000 LATENCY): `.../tx/0xe04dae35608f65b703cfcd2f80a197cb402330c5776f5e634e419f9519bc7383`
- Attest empty (INCONCLUSIVE conf 0): `.../tx/0xa218c962dbe7aa23dee7d705e5a7ec8a2dcdf5bdbbc9bdfdfef01dd2a7cdea43`

## Screenshots / demo flow

- `frontend/index.html` renders Cases 1/2/3 + reputation + explorer links (live reads, no build).
- Flow: `DEMO.md` (hook 15s → run 45s → why-GenLayer 15s → beyond 15s).
- Differentiation line: "HTTP 200 does not mean the service fulfilled the agreement."

## Known limitations (honest)

- Bundles synthesized (hash-stable mock Worker); real poller is 90-DAY.
- Bridge to Base mocked (arrow + hash diagram, not Hyperlane tx).
- Studio-dev may reset (re-run `scripts/attest-studio-dev.mjs`); Bradbury `0x72a6...` kept as compatibility evidence only.
- `timestamp` empty on studio-dev (`message_raw["datetime"]` absent; `gl.block.timestamp` fallback added, still empty in these txs — evidence hash + tx time suffice).
- Same testnet key reused for Base (testnet only; rotate before mainnet).
- Validator LLM diversity assumed (studio-dev policy: gpt-5.4/gemini-3-flash/gpt-oss-120b via greybox policy).

## Setup instructions (judge/verify)

```bash
git clone https://github.com/unifyWeb3/proveDown && cd proveDown  # repo is startup/ content at root? No — repo root IS startup/
node scripts/check-env.mjs # 3 ✓ (PRIVATE_KEY present masked, WORKER 200, STUDIO_DEV contract 42-char)
bash scripts/run-tests.sh # 9 passed
/tmp/provedown-rc-venv/bin/genvm-lint lint contracts/provedown.py # 2 reachability advisories (false-positive, proven on-chain; Studio accepts on deploy)
# live reads (no wallet): open frontend/index.html
# live writes: GENLAYER_PRIVATE_KEY=... node scripts/attest-studio-dev.mjs
```

**Note:** Repo root contains research (`00-mission.md`, `01-`–`07-`, `SOURCES.md`) + product (`contracts/provedown.py`, `hosting/bundle-worker/worker.js`, `frontend/index.html`, `scripts/`, `tests/`).

## Final pitch (30s)

APIs lie about quality the way status pages lie about uptime — a 200 with 72% fill still breaches your agent's 80% SLO and costs you $50K while the provider credits $125. Neither your dashboard (biased for you) nor theirs (biased for them) settles it. ProveDown turns GenLayer's jury — independent fetches + diverse LLMs + breach-bool consensus + evidence hash + appeal — into settlement-grade proof: $0.0001 GEN per verification unlocks the $5k dispute. Uptime tells you it responded; ProveDown tells you it fulfilled the agreement.
