# 04 — Previous Product Pattern Review (Design Intelligence)

**Date:** 2026-09-03
**Scope:** Strongest previous GenLayer + current ecosystem projects overlapping: agentic commerce, service verification, SLA verification, dispute resolution, agent trust, attestation, multi-party settlement, objective vs subjective verification. Use as design intelligence, not template. Per task 4.

**Method:** For each product: (1) solved, (2) got right, (3) left unsolved, (4) reuse conceptually, (5) would be derivative, (6) combine with ProveDown strengthens?

---

## A. GenLayer Native

### 1. InternetCourt (genlayer-foundation/internetcourt) — Foundation flagship, Base USDC escrow + GenLayer jury + LayerZero, 27 firms
1. Solved: Generic escrow with 2-of-2 mutual agree or 1-of-1 AI jury.
2. Right: Dual-chain (Base escrow USDC, GenLayer jury, LayerZero), 2-of-2 fast path avoids jury when possible.
3. Left unsolved: Jury is generic, not vertical (any dispute) → no quality rubric, no reputation, no bridge proof reuse beyond escrow.
4. Reuse: 2-of-2 mutual agree fast path (we already have no_breach/breach but could add mutual attest cancel), LayerZero pattern for bridge.
5. Derivative if: We rebuilt generic jury with same flow → THX price track, saturated (9 clones Tribunal etc.).
6. Combine? **No** — keep ProveDown vertical (functional SLO quality) not generic. InternetCourt is infrastructure we could call per-dispute if needed (AgentEscrow does), but not core.

### 2. AgentEscrow (dorahacks 42088) — Most sophisticated, multi-milestone + SLA monitoring via prompt_non_comparative + per-dispute Internet Court + BridgeSender→Relay→Base Sepolia VerdictRegistry
1. Solved: Multi-milestone escrow with SLA monitoring (API 200 JSON <800ms 99.5%).
2. Right: SLA monitoring as `prompt_non_comparative`, per-dispute contracts, bridge to Base, 22 endpoints 13 MCP — end-to-end.
3. Left: SLA is per-escrow (tied to payment), not standalone sidecar; still one-shot not continuous reputation; no bundle/quality focus.
4. Reuse: **BridgeSender→Relay→Base pattern** for VerdictRegistry, SLA probe pattern (prompt_non_comparative → we use run_nondet_unsafe breach-only which is similar but simpler), MCP tool shape.
5. Derivative if: Copied multi-milestone escrow — saturated.
6. Combine? **Yes (bridge + SLA probe concept)** — ProveDown reuses bridge pattern but as standalone sidecar not escrow, and reframes SLA from latency-only to quality (fill/match) + tolerance + bundle — strengthens not derivative.

### 3. Gotham Court (PhiBao/gotham-court) — parimutuel betting + AI jury
1. Solved: Dispute + betting (Guilty/Not Guilty/Insufficient → proportional payout).
2. Right: Unique incentive — betting adds liquidity, not just escrow.
3. Left: Gambling surface, regulatory, not SLA verification.
4. Reuse: None for ProveDown — betting not needed.
5. Derivative if: Added betting to SLA — would be gimmick.
6. Combine? **Irrelevant** — do not include.

### 4. Tribunal / ODbeke etc. (9 generic escrow clones)
1. Solved: Nothing beyond tutorial (create_escrow→submit→approve/dispute→arbitrate PAYOUT/REFUND/SPLIT).
2. Right: Tutorial completeness.
3. Left: No differentiation, no bridge, no reputation.
4. Reuse: Method names as anti-pattern (avoid).
5. Derivative if: Any generic escrow — saturated per 03 saturation map.
6. Combine? **No**.

### 5. GenSwarm (stigmergy pheromone, zero-token LLM-chat avoidance)
1. Solved: Agent coordination via pheromone, not jury.
2. Right: Novel coordination primitive.
3. Left: Not verification.
4. Reuse: Concept of zero-token avoidance not needed.
5. Derivative? No overlap.
6. Combine? **Long-term platform primitive** — if ProveDown later coordinates many pipeline agents via stigmergy not jury, but not MVP.

### 6. SponsorGuard (congab91) — 3-tranche + recheck after next_check_at
1. Solved: Temporal recheck (sponsorship compliance).
2. Right: `next_check_at` randomized recheck, not one-shot.
3. Left: Not SLA.
4. Reuse: **Temporal recheck** → ProveDown 30d poller + randomized recheck per 03 saturation white space (already in roadmap 180d).
5. Derivative? No.
6. Combine? **Near-term extension** — randomized recheck after MVP strengthens continuous monitoring without being one-shot.

## B. Current Ecosystem (Web2 + Web3 SLA/attestation)

### 7. ArcSLA (muazzezwq/arcsla, Arc Testnet, USDC stake, per-call escrow, Bayesian reputation 9 providers live)
1. Solved: Deterministic per-call SLA (deadline) with stake/slash, no arbiter.
2. Right: USDC native gas, sub-second finality, `claimTimeout` permissionless, Byzantine reputation, x402 + CCTP multi-chain — live since Apr 2026, Foundry tests.
3. Left: Deterministic only; `Optional DisputeModule for subjective-quality services` is future, not built — no LLM quality.
4. Reuse: **Bayesian reputation** `(good+2)/(total+3)` — we already reuse for `reputation` TreeMap; **per-call escrow pattern** as reference for bridge.
5. Derivative if: Built deterministic per-call marketplace again — would compete with live Arc.
6. Combine? **Yes (reputation)** — already reused. As extension, ProveDown could be Arc's missing DisputeModule (subjective) — partnership not competition.

### 8. TrustTrace (FsocietyVoid) — 3+ regions 2-of-3 quorum Ed25519 Merkle 10min → IPFS + Ethereum commitRoot
1. Solved: Tamper-proof quorum verification (BFT) not LLM.
2. Right: Quorum + Merkle + IPFS + on-chain anchor — low gas, 10min windows.
3. Left: Objective status only (up/down), no subjective quality, no LLM.
4. Reuse: **Merkle anchor** concept for 30d batch bundles (hosting/bundle-worker roadmap 100→one rootHash) — not for MVP where single attestation anchored.
5. Derivative if: Copied quorum for SLA — would be duplicate of TrustTrace.
6. Combine? **Long-term platform primitive** — batch Merkle for hourly bundles 90d, not MVP.

### 9. Pulse (HorizenLabs, zkVerify) — ZK random nonce challenges + Groth16 SLA proof
1. Solved: ZK-proven random, service signs nonce, Merkle, ZK SLA.
2. Right: Strong randomness, not predictable, 5 layers verifiability.
3. Left: Objective nonce signing, not subjective quality.
4. Reuse: ZK randomness for challenge unpredictability (provider cannot fast-path) — useful post-hackathon if provider detects validator IPs.
5. Derivative? No.
6. Combine? **Long-term** — if provider IP detection becomes real, add ZK random challenge to poller.

### 10. Verifiable-SLAs (ferjcast, TEE Intel TDX + zkVM RISC0/SP1, 1M/hour)
1. Solved: TEE collects telemetry (co-signed JSON, remote attestation MRTD) → Merkle → Evidence Registry EVM + IPFS → zkVM batch/individual proofs, privacy-preserving.
2. Right: Hardware attestation + privacy + constant-time proof, OpenSLO extension.
3. Left: TEE hardware trust, requires enclave per SLA negotiation, deterministic threshold not LLM subjective.
4. Reuse: **Evidence Registry** pattern (on-chain evidence commits) — similar to our `evidence_hash` storage, but TEE not needed for public bundle.
5. Derivative? No.
6. Combine? **Long-term** — if bundle needs private data (authenticated API) then TEE could collect, jury judges quality — hybrid.

### 11. Pingoru (Web2, 6k status pages 5min, $15/mo, 12 months)
1. Solved: Independent third-party evidence from *vendor status page* (start/end/components) for credit claims — 4 facts every form asks.
2. Right: Independent timestamp at *their* infra not vendor's, 12 months history for quarterly SLA.
3. Left: Only vendor-declared incidents (what vendor posted), not buyer-observed P95>2s, not functional quality (fill/match), not latency histogram.
4. Reuse: **Independent timestamp** concept — we do via `gl.message_raw["datetime"]` authoritative, not vendor. **12 months history** → our reputation TreeMap history.
5. Derivative if: Built status-page scraper — would be dupe at $15 vs our $99.
6. Combine? **No** — correctly positioned as sidecar on top of Pingoru/Datadog not replacement (per 07 wedge challenge).

### 12. Datadog Updog.ai + External Provider Status (Bayesian aggregated APM)
1. Solved: Aggregated anonymized APM across thousands customers → Bayesian abnormal error rates, 32 min before AWS status page, 90d history, public Updog.ai free.
2. Right: Global intelligence no single org can see, mapping degradations to your APM services.
3. Left: Centralized (Datadog operator), no LLM quality, no bond/slash, no on-chain proof.
4. Reuse: **Aggregated intelligence** idea → post-hackathon reputation marketplace could aggregate across pipeline customers (like Updog but for fill/match).
5. Derivative? No.
6. Combine? **Near-term** — if we get 10 pipeline customers, aggregate their attestations intoUpdog-like global view, but private per-customer first.

---

## Synthesis for ProveDown

**Reuse conceptually (add):** BridgeSender→Base (AgentEscrow), Bayesian reputation (ArcSLA), temporal recheck `next_check_at` (SponsorGuard) for 180d poller, Merkle batch (TrustTrace) for 90d, independent timestamp (Pingoru).

**Derivative trap (avoid):** Generic escrow (Tribunal 9 clones), deterministic per-call marketplace (ArcSLA live), pure uptime ping (Pingoru $15), betting.

**Strengthens thesis if combined:** Bridge + reputation + temporal recheck + Merkle batch all strengthen core verification/attestation layer around SAME customer/workflow (pipeline owner) without kitchen-sink.
