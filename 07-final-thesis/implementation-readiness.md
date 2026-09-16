# Implementation Readiness — ProveDown MVP (Task 7, reconciled)

**Date:** 2026-09-09 (reconciled with the live Studio Next deployment)
**Validation gate:** PASSED with reframing (preserve thesis). See `06-adversarial-analysis/05,06,07,08` + `04-competitive-intelligence/03`.
**Objective per Task 8:** Smallest end-to-end flow proving User/API agreement → evidence collection → GenLayer adjudication → verifiable attestation → user-visible result. Downstream settlement remains a labeled mock boundary, not an MVP responsibility.

> **Scope reconciliation.** This began as a pre-build design spec. The shipped implementation is the source of truth for the current slice: static [`frontend/index.html`](../frontend/index.html), Studio Next chain `61997`, contract `0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`, synthesized Worker evidence, breach-only consensus, and no application-level appeal method. Historical references below are retained only where they explain design intent or deferred work.

---

## 1. Exact MVP Scope (Narrow Vertical Slice)

**Included (must have for hackathon demo Sep 3-17):**

- **One SLO type:** Functional quality SLO for enrichment API: `P50 ≤500ms, P95 ≤2000ms (tolerance +500ms via jury), error<1%, fill≥80%, match≥85%`. Judged from **bundle** not single probe.
- **One jury run:** `request_attestation(sla_id)` → 1× `web.render(mode='text')` to a deterministic bundle + 1× `exec_prompt(json judge)` → consensus on the strict `breach` bool. Reason, confidence, metrics, and reasoning are leader-observed fields, not consensus fields.
- **One attestation anchored:** Store the verdict status, observed `p50/p95`, reason/confidence, and evidence hash of the sanitized/truncated bundle on GenLayer, with Explorer readback.
- **One downstream boundary (mocked):** Show the documented Relay → Base path as a UI/architecture boundary only. The current contract emits no `BridgeSender` event or `BridgeProof`, and no Base/Hyperlane transaction is claimed.
- **One reputation update:** `TreeMap[api]` confidence-weighted score, readable via `get_reputation(api)`.
- **One frontend flow:** The static `frontend/index.html` provides register + attest writes, finalized receipt tracking, readback, verdict `BREACH`/`NO_BREACH`/`INCONCLUSIVE`/`NO_CONSENSUS`, evidence hash, Explorer link, and reputation panel. No-wallet and mocked-boundary states are explicit.
- **One live sandbox:** Any API URL + SLO → real attestation (proves generic contract like Jury sandbox).

**Explicitly included for validation but minimal:**

- Evidence sanitization: `FORBIDDEN_TOKENS` → `[filtered]` [S15], `<SYSTEM><EVIDENCE>` framing, truncate 3000, sha256, HTTPS only, dedup, max 3 URLs (but MVP uses 1 bundle URL, stays under limit).
- Error handling: `INCONCLUSIVE` and `NO_CONSENSUS` are first-class retryable outcomes; a caller may submit a new attestation request, but the contract does not silently retry or force a verdict.

---

## 2. Out-of-Scope (Do NOT Build for Hackathon)

- **No continuous off-chain poller** (roadmap 30d) — the live Worker serves deterministic synthesized fixture bundles on demand. A real probe poller is post-hackathon.
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

**Storage (JSON strings in typed `TreeMap`s):**

```python
TreeMap[str, str]  # sla_id → JSON {api_url, bundle_url, slo_json, owner, created_at}
TreeMap[str, str]  # attestation_id → JSON {sla_id, timestamp, breach, reason, confidence, evidence_hash, p50, p95, status}
TreeMap[str, str]  # api_url → JSON {score, total, breaches}
u256 next_attestation_id
```

**Methods:**

- `@gl.public.write def register_sla(self, sla_id:str, api_url:str, bundle_url:str, slo_json:str)` — deterministic HTTPS and numeric-range validation, canonical SLO storage, and conflicting-ID rejection. No nondeterministic work.
- `@gl.public.write def request_attestation(self, sla_id:str)` — **nondet jury**: fetch the Worker bundle with `web.render`, sanitize and validate all five metrics, hash the sanitized/truncated bundle, then run `exec_prompt`. `run_nondet_default` compares the strict `breach` boolean only; reason, confidence, metrics, and reasoning are leader-observed fields. Invalid evidence becomes `inconclusive`; an honest validator split becomes `no_consensus`.
- `@gl.public.view def get_attestation(self, attestation_id:str) -> str` (json)
- `@gl.public.view def get_reputation(self, api_url:str) -> str`
- `@gl.public.view def get_sla(self, sla_id:str) -> str`

**Deterministic post-consensus per 01-primitives:** no storage writes inside nondet, `self` not captured inside the judgment closure, and the two current nested-reachability linter advisories are documented in the live audit with deployment evidence.

**Lessons reused:** V2 evidence-first [S15] (plain locals, sanitize, truncate, hash), ContentBounty two-stage pattern [S18] (observations not needed for MVP — single judge prompt suffices), and tolerant breach-only consensus for near-threshold functional quality.

---

## 4. Backend Responsibilities (Node, Not Truth)

**Not a custodial judge** — the backend only serves the deterministic fixture bundle and supports the frontend demo.

- **Bundle Worker** (`hosting/bundle-worker/` — Cloudflare Worker or simple Fastify): endpoint `GET /bundle?sla_id=...` returns synthesized bundle JSON `{"p50":1561,"p95":2100,"error":0.02,"fill":0.82,"probes":[...]}` for MVP (later real poller). This is what `web.render` fetches — stable JSON, hash-stable like `httpbin.org/json` (1/8) not dynamic `/get` (5/5 variance) per 05 §2.1. Bundle includes `X-ProveDown-Timestamp`.
- **Relay boundary (documentation/UI only):** the frontend labels the future Relay → Base path as mocked. There is no event listener, Base registry write, bridge proof, or settlement receipt in the current MVP.
- **No probe poller for MVP** — bundle is mocked on demand, not continuous. Post-hackathon add poller every 5min to 3 endpoints.

**GenLayer is source of truth** — backend never decides breach.

---

## 5. Frontend Responsibilities (static HTML + pinned `genlayer-js`)

**Reuses Jury patterns [S15-16]:**

- **Register form:** `sla_id`, `api_url`, `bundle_url`, and canonical `slo_json`; wallet-backed `genlayer-js` `writeContract` with fee estimation.
- **Attest panel:** `request_attestation(sla_id)` → `writeContract` → `waitForTransactionReceipt({waitUntil: 'finalized'})` → `isSuccessful` → on-chain readback. Pending, no-wallet, and failed-receipt states are distinct.
- **Verdict card:** BREACH / NO_BREACH / INCONCLUSIVE / NO_CONSENSUS with confidence, evidence hash, observed metrics, and Studio Explorer link. Reason is secondary because it is not consensus-critical.
- **Reputation panel:** `get_reputation(api_url)` polling, score 0-100, history chart.
- **Sandbox:** any API URL + SLO → real attestation via same contract (proves generic, not preset demo only).
- **Boundary disclosure:** live Studio reads/writes are real; the Base relay and future probe poller remain visibly mocked. There is no verdict-mocking fallback presented as a live write.
- **Verifiability layer:** Every attestation links to explorer, like Jury's "every claim checkable via tx hash" that fixed v1 rejection [S19].

---

## 6. Agent Responsibilities

**No autonomous agent for MVP** — human clicks "Attest now". Post-hackathon, agent can auto-call `request_attestation` when poller detects anomaly (MCP tool `attest_sla`).

---

## 7. GenLayer Responsibilities

- Consensus on `breach` bool via `run_nondet_default` with the configured validator jury — not a backend verdict.
- `web.render` independent fetches (even though MVP fetches single bundle URL, validators still each fetch independently → hash-stable bundle ensures agreement).
- Evidence hashing + timestamp `gl.message_raw['datetime']` authoritative.
- Attestation storage + reputation TreeMap.
- Explorer proof on Studio Next 61997; Bradbury remains compatibility evidence only.

---

## 8. Base Responsibilities

- **VerdictRegistry (Base Sepolia):** documentation-only future boundary. No Solidity registry, claim method, or settlement transaction is part of the current MVP.
- No USDC escrow for MVP (ArcSLA does per-call escrow but we are sidecar not marketplace — no escrow needed for attestation MVP).

---

## 9. Bridge/Relay Responsibilities

- **For MVP:** Mock — frontend shows a labeled Relay → Base boundary with the AgentEscrow pattern [S24] as a reference. It must not show a fabricated `bridgeProof` or Base transaction.
- **For real (post-hackathon):** Hyperlane or LayerZero V2 (like Internet Court [S20]) — BridgeSender calls `sendMessage(BaseVeridctRegistry, proof)` via Hyperlane mailbox. Relay is startup backend listening to GenLayer event and submitting to Base (gas paid by startup or caller tip).

---

## 10. Required APIs/Endpoints

| Endpoint | Purpose | Mode | Auth | MVP source |
|---|---|---|---|---|
| `GET /bundle?sla_id=...` | Jury fetches bundle JSON (p50/p95/error/fill) | `web.render mode='text'` → sanitize → json parse | None (public) | Worker synthesized (mock `p95:2100 fill:0.82`) — 2 variants: breach vs no-breach presets for demo |
| `https://httpbin.org/json` | Analog probe, not MVP jury fetch — used only for technical validation baseline (hash-stable) | not used in MVP | None | — |
| Validator LLM providers | `exec_prompt` judge (inside GenLayer validators) | JSON-shaped prompt/response | Via validator config, not frontend | No frontend API key; current contract parses and validates the returned JSON |
| Studio Next RPC `https://studio-dev.genlayer.com/api` chain 61997 | `genlayer-js` writes/reads | `gen_*` | Studio GEN | Real |
| Studio Explorer `https://explorer-studio-dev.genlayer.com` | Explorer links | — | — | Real |
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
  - No appeal test: the current contract has no application-level appeal method.

**Integration:**

- `genlayer up` localnet (if Docker available) or **Studio** (studio.genlayer.com) or **GLSim** fallback (`pip install genlayer-test[sim] → glsim`) — 1 integration test: deploy + register + request_attestation with real bundle Worker → wait 30-60s → `receipt status ACCEPTED` + `get_attestation` returns BREACH + confidence 900 + explorer link. If localnet unavailable, use Studio hosted (temporary chain 61999).

**Post-deploy:**

- Historical compatibility command: `genlayer deploy --contract ./contracts/provedown.py --network testnetBradbury --fee-profile ./fee-profile.json` (current Studio deployment uses the WSL-safe `genlayer-js` path).
- Frontend `readContract`/`writeContract` via `genlayer-js` on Studio Next, verify finalized receipt + `isSuccessful` + stored readback + Explorer link.

---

## 12. Demo Flow (5 min, per final-product §20 updated)

1. **Hook (30s):** "Your Datadog is buyer-hired, provider dashboard is vendor — neither trusted when $50K at stake. Pingoru $15 covers status pages $15 but not functional quality; ArcSLA deterministic too but needs LLM for quality (their DisputeModule future)." Show Updog 32 min before AWS + ArcSLA 9 providers + our quality wedge.
2. **Run on GenLayer (90s):** Register an enrichment SLA (P95 2000, fill 80), click Attest now → the Worker serves deterministic JSON → validators fetch and judge it → Studio Next finalizes BREACH/NO_BREACH/INCONCLUSIVE, with evidence hash, observed metrics, readback, and Explorer link.
3. **Why not backend AI? (60s):** Remove GenLayer → no independent validator consensus or finalized attestation; replace it with a single oracle → one operator controls the result.
4. **Relay boundary & reputation (60s):** Show the explicitly mocked downstream arrow and the on-chain reputation update; do not imply a Base transaction.
5. **Live sandbox (30s):** Type any API bundle params (wider tolerance) → real attestation via same contract (proves generic, not preset only).
6. **Beyond (30s):** Roadmap + economics ($0.04 spot, $99/mo sidecar, one $5k recovery covers 10mo, no token, quality wedge → procurement 90d).

Backup: show the pinned Studio Next records if a fresh wallet write is unavailable; label the read-only demo data as finalized prior evidence.

---

## 13. Acceptance Criteria (Narrow Slice Must Pass)

- [ ] `genvm-lint` 0 errors on `contracts/provedown.py`.
- [x] `python3 -m pytest tests/test_provedown.py -q` passes 13 analog tests, including injection resistance, hash stability, malformed evidence, and strict consensus parsing.
- [x] Studio Next integration attestations return NO_BREACH, BREACH, and INCONCLUSIVE with finalized receipts, readback, and Explorer links.
- [x] Static frontend reads the pinned cases and contains wallet-backed register + attest paths; injected-wallet runtime smoke remains an open release gate.
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

**Thesis preserved:** ProveDown is *functional SLO attestation* for agent pipelines (fill/match/error + bundle-quoted latency with tolerance), a sidecar on top of Datadog/Pingoru rather than a replacement. The current wedge ends at a GenLayer attestation and reputation record; any Base settlement path is future work. It is not generic status-page uptime attestation (Pingoru/Updog) or a deterministic deadline marketplace (ArcSLA).

**Current status:** The smallest E2E implementation and injected-wallet browser lifecycle are verified on Studio Next. Local release hardening is complete; remaining gates are the separate frontend visual-polish pass, final scan of the assembled public package, and the already-disclosed evidence-provenance limitations. No speculative infra is authorized.
