# Implementation Readiness — ProveDown MVP (Task 7)

**Date:** 2026-09-02
**Validation gate:** PASSED with reframing (preserve thesis). See `06-adversarial-analysis/05,06,07,08` + `04-competitive-intelligence/03`.
**Objective per Task 8:** Smallest end-to-end flow proving User/API agreement → evidence collection → GenLayer adjudication → verifiable verdict → settlement/attestation → user-visible result. No speculative infra.

---

## 1. Exact MVP Scope (Narrow Vertical Slice)

**Included (must have for hackathon demo Sep 3-17):**

- **One SLO type:** Functional quality SLO for enrichment API: `P50 ≤500ms, P95 ≤2000ms (tolerance +500ms via jury), error<1%, fill≥80%, match≥85%`. Judged from **bundle** not single probe.
- **One jury run:** `request_attestation(sla_id)` → 1× `web.render(mode='text')` to **bundle endpoint** (pre-computed JSON histogram) + 1× `exec_prompt(json judge)` → consensus on `breach` bool + `reason` (LATENCY|ERROR_QUALITY|UNAVAILABLE|OK) + confidence. Not 3 parallel renders to live APIs (too variable per 05 §2.1).
- **One attestation anchored:** Store `Attestation {sla_id, timestamp, breach, reason, confidence, evidence_hash(sha256 bundle), p50/p95, histogram bucket}` on GenLayer, with explorer link.
- **One bridge proof (mocked):** Emit `BridgeSender` event / `BridgeProof` hash; diagram real Hyperlane to Base Sepolia VerdictRegistry (AgentEscrow pattern [S24]) but mock relay for demo. Explain real path in README.
- **One reputation update:** `TreeMap[api]` confidence-weighted score, readable via `get_reputation(api)`.
- **One frontend flow:** Register SLA form + "Attest now" button + jury deliberation (5 validators) + verdict BREACH/NO_BREACH/UNDETERMINED + evidence hash + explorer link + reputation panel. Toggle mocked vs live.
- **One live sandbox:** Any API URL + SLO → real attestation (proves generic contract like Jury sandbox).

**Explicitly included for validation but minimal:**

- Evidence sanitization: `FORBIDDEN_TOKENS` → `[filtered]` [S15], `<SYSTEM><EVIDENCE>` framing, truncate 3000, sha256, HTTPS only, dedup, max 3 URLs (but MVP uses 1 bundle URL, stays under limit).
- Error handling: `INCONCLUSIVE` retryable (fetch fail → retry not reject, `MAX_EVALUATION_ATTEMPTS=3` pattern [S18]), `UNDETERMINED` first-class (shown as honest split at threshold, not error).

---

## 2. Out-of-Scope (Do NOT Build for Hackathon)

- **No continuous off-chain poller** (roadmap 30d) — bundle is synthesized/mock for MVP (or simple Worker that serves bundle JSON on demand). Continuous 5-min poller is post-hackathon.
- **No hourly Merkle batch bundles** (100 probes → one rootHash) — post-hackathon.
- **No automated billing claim on Base** — billing contract verifies bridge proof, but MVP only shows VerdictRegistry mock; no USDC transfer via `emit_transfer`.
- **No residential IP diversity, no VRF front-running mitigation beyond docs** — validators are default GenLayer set, diversity assumed.
- **No ENS SLO policy hash** (EQLTY pattern) — keep SLO in contract TreeMap, not ENS text record.
- **No Circle Gateway nanopayments / CCTP** — ArcSLA does this but not needed for MVP.
- **No prompt-injection DoS beyond sanitize** — full Incident Playbook 16-contract guard set is post-hackathon.
- **No procurement expansion** — stays in 90d roadmap file, not code.
- **No token, no DAO, no multi-chain system** beyond one GenLayer → mock Base bridge explanation.
- **No precise latency SLA via web.render ms** — use bundle quality wedge (per 05 §5).

Adding these would be "impressive but no startup value" (saturation map §03).

---

## 3. Contract Responsibilities (GenLayer, Python)

**File:** `contracts/provedown.py`  (version pragma `py-genlayer:...`)

**Storage (typed, no `dict`/`list`/`int`):**

```python
TreeMap[str, Sla]  # sla_id → {api_url, status_url, slo_json, owner, created_at}
TreeMap[str, Attestation]  # attestation_id → {sla_id, timestamp, breach, reason, confidence, evidence_hash, p50, p95, histogram, requester}
TreeMap[str, Reputation]  # api_url → {score, total, breaches, last_updated}
u256 next_attestation_id
```

**Methods:**

- `@gl.public.write def register_sla(self, sla_id:str, api_url:str, status_url:str, slo_json:str)` — deterministic validation: HTTPS only, dedup URLs, max 3, slo_json parse + required fields (p50,p95,error,fill,match), emit `SlaRegistered`. No nondet.
- `@gl.public.write def request_attestation(self, sla_id:str)` — **nondet jury**: `leader_fn` fetches bundle URL via `gl.nondet.web.render(bundle_url, mode='text')` (bundle from our Worker), sanitizes, `gl.nondet.exec_prompt(judge_prompt(bundle, slo), response_format='json')` → dict, `validator_fn` independent same → `gl.vm.run_nondet_unsafe` agree on `breach` bool only (reason for UI, not consensus). Outside: store attestation, update reputation (confidence-weighted), emit `BridgeProof` or `AttestationCreated` with `gl.message_raw['datetime']`. Handle `UNDETERMINED` (store with breach=None).
- `@gl.public.write def appeal_attestation(self, attestation_id:str)` — check bond (for MVP simple fixed bond, e.g., 0.1 GEN), new jury doubling? For MVP, single re-jury with same logic (full doubling is post-hackathon).
- `@gl.public.view def get_attestation(self, attestation_id:str) -> str` (json)
- `@gl.public.view def get_reputation(self, api_url:str) -> str`
- `@gl.public.view def get_sla(self, sla_id:str) -> str`

**Deterministic post-consensus per 01-primitives:** no storage writes inside nondet, `self` not captured inside `leader_fn` (use plain locals), linter clean.

**Lessons reused:** V2 evidence-first [S15] (plain locals, sanitize, truncate, hash), ContentBounty two-stage pattern [S18] (observations not needed for MVP — single judge prompt suffices), FlightDelay strict not used (need tolerant, so `run_nondet_unsafe` not `strict_eq`).

---

## 4. Backend Responsibilities (Node, Not Truth)

**Not a custodial judge** — only helper for poller + cache + relay mock.

- **Bundle Worker** (`hosting/bundle-worker/` — Cloudflare Worker or simple Fastify): endpoint `GET /bundle?sla_id=...` returns synthesized bundle JSON `{"p50":1561,"p95":2100,"error":0.02,"fill":0.82,"probes":[...]}` for MVP (later real poller). This is what `web.render` fetches — stable JSON, hash-stable like `httpbin.org/json` (1/8) not dynamic `/get` (5/5 variance) per 05 §2.1. Bundle includes `X-ProveDown-Timestamp`.
- **Relay Mock** (`scripts/relay/`): listens for `AttestationCreated` event via `genlayer-js` `watchContractEvent`, computes `bridgeProof = keccak(attestation_id + evidence_hash)`, stores in `BaseVeridctRegistry` mock (in-memory or simple Base Sepolia contract if time). For hackathon, just show `bridgeProof` hash + "would be Relay→Base" diagram.
- **No probe poller for MVP** — bundle is mocked on demand, not continuous. Post-hackathon add poller every 5min to 3 endpoints.

**GenLayer is source of truth** — backend never decides breach.

---

## 5. Frontend Responsibilities (Next.js 16, React 19, TS strict, Tailwind — like Jury)

**Reuses Jury patterns [S15-16]:**

- **Register form:** `sla_id` (auto `sla-` + 6 hex), `api_url`, `status_url`, `slo_json` (default P50 500 P95 2000 error 1 fill 80 match 85), `genlayer-js` `writeContract` → explorer link.
- **Attest panel:** `request_attestation(sla_id)` button → `writeContract` → `waitForTransactionReceipt` polling (show `pending → proposing → committing → revealing → accepted` per 01-consensus), then 5-validator deliberation UI (stream reasoning via polling `get_attestation` or SSE mock like Jury `/api/jury`).
- **Verdict card:** BREACH (red, reason LATENCY/ERROR_QUALITY) / NO_BREACH (green) / UNDETERMINED (amber, "honest split at threshold") + confidence 0-1000 + evidence hash + p50/p95 + histogram + explorer `https://explorer-bradbury.genlayer.com/tx/0x...` link + contract address link (like Jury submission writeup).
- **Reputation panel:** `get_reputation(api_url)` polling, score 0-100, history chart.
- **Sandbox:** any API URL + SLO → real attestation via same contract (proves generic, not preset demo only).
- **Toggle:** `NEXT_PUBLIC_LIVE_JURY` pattern — mocked (prewritten SSE) for snappy first impression vs live on-chain (real `writeContract`).
- **Verifiability layer:** Every attestation links to explorer, like Jury's "every claim checkable via tx hash" that fixed v1 rejection [S19].

---

## 6. Agent Responsibilities

**No autonomous agent for MVP** — human clicks "Attest now". Post-hackathon, agent can auto-call `request_attestation` when poller detects anomaly (MCP tool `attest_sla`).

---

## 7. GenLayer Responsibilities

- Consensus on `breach` bool via `run_nondet_unsafe` with diverse LLMs (Heurist/Comput3/Chutes etc.) — not single backend LLM.
- `web.render` independent fetches (even though MVP fetches single bundle URL, validators still each fetch independently → hash-stable bundle ensures agreement).
- Evidence hashing + timestamp `gl.message_raw['datetime']` authoritative.
- Attestation storage + reputation TreeMap + BridgeProof emission.
- Appeal path (new jury) with bond — MVP simple single re-jury.
- Explorer proof (contract address `0x...` persistent on Bradbury 4221, tx hash per attestation).

---

## 8. Base Responsibilities

- **VerdictRegistry (Solidity, Base Sepolia for demo):** `mapping(bytes32 => AttestationProof)` + `function claimCredit(bytes32 attestationId, bytes proof)` placeholder (no USDC transfer for MVP, just event). For hackathon, can deploy or just diagram; minimal mock is `contracts/BaseVerdictRegistry.sol` with Foundry tests if time.
- No USDC escrow for MVP (ArcSLA does per-call escrow but we are sidecar not marketplace — no escrow needed for attestation MVP).

---

## 9. Bridge/Relay Responsibilities

- **For MVP:** Mock — frontend shows `bridgeProof` hash and "Relay → Base VerdictRegistry" arrow with docs link to AgentEscrow BridgeSender→Relay→Base pattern [S24]. Judge can see path even if not live transaction on Base.
- **For real (post-hackathon):** Hyperlane or LayerZero V2 (like Internet Court [S20]) — BridgeSender calls `sendMessage(BaseVeridctRegistry, proof)` via Hyperlane mailbox. Relay is startup backend listening to GenLayer event and submitting to Base (gas paid by startup or caller tip).

---

## 10. Required APIs/Endpoints

| Endpoint | Purpose | Mode | Auth | MVP source |
|---|---|---|---|---|
| `GET /bundle?sla_id=...` | Jury fetches bundle JSON (p50/p95/error/fill) | `web.render mode='text'` → sanitize → json parse | None (public) | Worker synthesized (mock `p95:2100 fill:0.82`) — 2 variants: breach vs no-breach presets for demo |
| `https://httpbin.org/json` | Analog probe, not MVP jury fetch — used only for technical validation baseline (hash-stable) | not used in MVP | None | — |
| OpenRouter `openai/gpt-4o-mini` | `exec_prompt` judge (via validator's LLM provider in GenLayer) | `response_format: json` | Via validator config, not frontend | Validators use Heurist/Comput3/Chutes etc.; not frontend key |
| Bradbury RPC `https://rpc-bradbury.genlayer.com` chain 4221 | `genlayer-js` writes/reads | `gen_*` | Testnet faucet GEN | Real |
| Explorer `https://explorer-bradbury.genlayer.com` | Explorer links | — | — | Real |
| Base Sepolia RPC (if VerdictRegistry deployed) | `claimCredit` mock | `eth_*` | Faucet USDC not needed for MVP | Optional |

**No authenticated private API** — per 05 §2.3, private portals blocked by anti-bot and need auth (no secrets in web.render). Use public bundle only.

---

## 11. Test Plan

**Before contract deploy:**

- `genvm-lint check contracts/provedown.py --json` (~250ms, 20+ rules) — catch forbidden imports, storage types, nondet outside block.
- **Direct mode** (`pytest tests/direct/` — mock_web/mock_llm):
  - `test_register_sla` — HTTPS validation, dedup, SLO parse, reject empty.
  - `test_breach` — mock bundle `p95=9356 fill=0.82` → expect BREACH LATENCY.
  - `test_no_breach` — `p95=1650 fill=0.90` → NO_BREACH.
  - `test_ambiguous` — `p95=2100` within tolerance → BREACH but confidence 800, validators agree on breach not reason.
  - `test_injection` — bundle contains `ignore previous instructions` → sanitize → still BREACH, not NO_BREACH (2/2 stable per 05 §3).
  - `test_empty` — bundle empty → INCONCLUSIVE not BREACH.
  - `test_consensus_disagree` — mock validator returns opposite breach → assert `run_validator() is False` → UNDETERMINED.
  - `test_appeal` — appeal bond flow.

**Integration:**

- `genlayer up` localnet (if Docker available) or **Studio** (studio.genlayer.com) or **GLSim** fallback (`pip install genlayer-test[sim] → glsim`) — 1 integration test: deploy + register + request_attestation with real bundle Worker → wait 30-60s → `receipt status ACCEPTED` + `get_attestation` returns BREACH + confidence 900 + explorer link. If localnet unavailable, use Studio hosted (temporary chain 61999).

**Post-deploy:**

- `genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury --fee-profile ./fee-profile.json` (via `estimate-fees`).
- Frontend `readContract`/`writeContract` via `genlayer-js` on Bradbury, verify explorer `tx/0x...` shows `commit→reveal→accepted`, appeal with bond.

---

## 12. Demo Flow (5 min, per final-product §20 updated)

1. **Hook (30s):** "Your Datadog is buyer-hired, provider dashboard is vendor — neither trusted when $50K at stake. Pingoru $15 covers status pages $15 but not functional quality; ArcSLA deterministic too but needs LLM for quality (their DisputeModule future)." Show Updog 32 min before AWS + ArcSLA 9 providers + our quality wedge.
2. **Run on GenLayer (90s):** Register SLA (preset: enrichment API, P95 2000, fill 80), click Attest now → Bundle Worker serves JSON (p95 2100 fill 82) → 5 validators fetch bundle independently + judge breach, consensus BREACH LATENCY confidence 900, evidence hash + p50/p95 display, click View on GenLayer Explorer → real Bradbury tx.
3. **Why not backend AI? (60s):** Remove GenLayer → no evidence hash, provider says biased; replace Chainlink → single oracle bribed; show jury diverse LLMs vs single API, appeal doubles validators, bridge proof hash audit.
4. **Bridge & reputation (60s):** Show bridge proof mock + reputation graph update (score 92 → 88 after breach), composite SLA (5 APIs at 99.9→99.5) diagram.
5. **Live sandbox (30s):** Type any API bundle params (wider tolerance) → real attestation via same contract (proves generic, not preset only).
6. **Beyond (30s):** Roadmap + economics ($0.04 spot, $99/mo sidecar, one $5k recovery covers 10mo, no token, quality wedge → procurement 90d).

Backup mocked mode if Bradbury congested (like Jury Retry-After + timeout fallback).

---

## 13. Acceptance Criteria (Narrow Slice Must Pass)

- [ ] `genvm-lint` 0 errors on `contracts/provedown.py`.
- [ ] `pytest tests/direct/` 8 tests pass (incl. injection resist 2/2, hash-stable bundle 1/1 like httpbin/json not 5/5 dynamic, `UNDETERMINED` first-class).
- [ ] One Studio/Bradbury integration attestation returns BREACH with tx hash and explorer link, verifiable via `genlayer receipt <txId>` shows `ACCEPTED` then `FINALIZED` window.
- [ ] Frontend can register + attest + show verdict + explorer link + reputation for two presets (breach vs no-breach) without editing contract.
- [ ] Removal test: remove GenLayer → frontend has no verdicts (not cosmetic, per Jury v1 lesson [S19]).
- [ ] Demo completes in 5 min even with mocked mode fallback.
- [ ] No speculative infra added: no continuous poller, no batch Merkle, no USDC escrow, no DAO, no multi-chain beyond mocked bridge diagram.

---

## 14. Known Risks (from 06)

| Risk | Likelihood | Impact | MVP mitigation |
|---|---|---|---|
| `web.render` anti-bot wall blocks bundle fetch | Medium | Medium | Bundle is our Worker (we control, not OpenAI status page), allowlist not needed; real status pages deferred |
| Provider fast-path serving to WebDriver IPs | Low for bundle (our Worker not adversarial) | Medium | Not relevant for MVP (our Worker serves all validators same); post-hackathon need diverse probe IPs + surprise |
| Prompt injection in bundle (we synthesize, so low) | Low | High | Still sanitize FORBIDDEN_TOKENS + DATA framing; tested 2/2 resist [05 §3] |
| Reason field noisy but breach stable (2/2) | Medium | Medium | Consensus on `breach` bool only, reason for UI not consensus (validated in 05 §3 ambiguous) |
| Bribery if disputed amount >>42k stake | Low for hackathon ($5k credit) | High for $1M | Not in MVP scope — note scaled bond for >$100k in thesis §24 #5 |
| Buyer says Datadog/Pingoru enough (Q4) | Medium | High (kill) | Reframe SLO quality + error-budget not just uptime; interviews already planned 06 §A1 |
| Latency variance > tolerance (05 §2.2) | High (stdev 1-2.7s) | Medium | Use bundle quality not wall-clock ms (per 05 §5 mitigation); tolerance 500ms |

---

## 15. Decision: Validation Gate PASSED with Reframing

**Thesis preserved:** ProveDown is *functional SLO attestation* for agent pipelines (fill/match/error + bundle-quoted latency with tolerance), sidecar on top of Datadog/Pingoru not replacement, targeting on-chain native (x402/Arc) first where bridge to Base is live settlement. Not generic status page uptime attestation (would be dupe of Pingoru $15 [S50] + Updog free [S51]) and not deterministic deadline marketplace (ArcSLA live [S54]).

**Next:** Proceed to smallest E2E implementation per Task 8 — `contracts/provedown.py` + `frontend/` register→attest→explorer + `hosting/bundle-worker/` mock. No speculative infra.
