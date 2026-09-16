# DEMO VIDEO PLAN — ProveDown (60–90 seconds)

**Status:** script + shot list only. Nothing has been recorded or uploaded.
**Full demo reference:** `DEMO.md`. **Evidence source of truth:** `EVIDENCE.md`.
**Central story:** HTTP 200 does not equal functional fulfillment.

## Script (75s target)

| Time | Shot | Script / action |
|---|---|---|
| 0–12s | Title card: "Both APIs returned HTTP 200. Uptime says both are UP." + two green 200 badges | "Both APIs returned HTTP 200. Uptime says both are up. But one delivered 72% fill against an agreed 80% — an agent just scored 800 leads on empty data. Who decides, neutrally, at machine speed?" |
| 12–22s | Service agreement panel: API + SLO (P95 ≤ 2000, error < 1%, fill ≥ 80%, match ≥ 85%) | "The pipeline owner registers the API and the functional SLO on-chain — not a ping target, a quality obligation." |
| 22–35s | Case 1 healthy → NO_BREACH (conf 1000, hash `64e6c84f…`), observed-vs-required rows green | "Healthy API: p95 1600 against a 2000 limit, fill 95% against 80%. Jury: no breach." |
| 35–50s | Case 2 breach → BREACH ERROR_QUALITY (conf 1000, hash `b4fc2013…`); fill 72% vs 80% row red, HTTP 200 badge still visible | "Same HTTP 200 — but p95 4800, fill 72%. Functionally broken. Jury: breach." |
| 50–60s | Explorer tx `0xf566…` FINALIZED + FINISHED_WITH_RETURN + `isSuccessful`; evidence hash recompute; reputation 66/3/1 | "Finalized GenLayer proof, evidence fingerprint, updated reliability record — all explorer-verifiable." |
| 60–68s | Case 3 INCONCLUSIVE (conf 0, no hash): "missing evidence never becomes a verdict" | "Bad evidence? The jury refuses to judge — inconclusive, never a forced verdict." |
| 68–75s | Disclosure card + thesis card | "Demo evidence is synthetic; downstream settlement is mocked. ProveDown is the neutral attestation layer a money-moving system checks before acting." |

## Mandatory on-screen disclosures (verbatim)

- "Worker evidence is synthetic fixture data for this demo."
- "Downstream relay / settlement is mocked."
- "No live NO_CONSENSUS proof exists; the state is implemented and analog-tested only."

## Do NOT do

- Do not present the SSE/demo fallback as a live verdict (show prior real txs if Studio is congested).
- Do not claim appeals, bonds/slashing, escrow release, polling, or customer telemetry.
- Do not show secrets, private keys, or the contents of `.env.local`.

## Evidence links to show or pin in description

- Contract: `https://explorer-studio-dev.genlayer.com/address/0x278CbC20EFeA21C9B6603059963FCb6b7d407aC1`
- Breach attestation: `https://explorer-studio-dev.genlayer.com/tx/0xf566a8305212cc52e899ed2a1294eea5d9ed4b89fec3aba5d5e1eb24fb8ed505`
- Healthy attestation: `https://explorer-studio-dev.genlayer.com/tx/0xa5a1aae059d49895719afed202f58804a12b7bcab28d90b3eee63e0942cc0faf`
- Inconclusive: `https://explorer-studio-dev.genlayer.com/tx/0x90b9e1b983b3ebe2490f812b6696317031ce6b4cb65c7c3a7bb75b51a5af6f8a`

(End of file)
