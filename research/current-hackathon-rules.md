# Current Agent Tank Rules Audit

Date checked: 2026-09-09

## Authoritative source

- Portal mission API: https://portal-admin.genlayer.foundation/api/v1/missions/83/
- Public portal route: https://portal.genlayer.foundation/agent-tank/hackathon
- Current frontend bundle reviewed: https://portal.genlayer.foundation/assets/index-D6Tz_d7r.js

## Verified rules and implications

| Rule | Evidence | Implication for ProveDown | Confidence |
|---|---|---|---|
| Mission is `Agent Tank: Hackathon` | Mission 83 API response | The repository should name Agent Tank, not the older Bradbury event, in submission materials. | High |
| Build window is 2026-09-03 15:30 UTC through 2026-09-17 15:30 UTC | Mission 83 `start_date` and `end_date` | The pasted brief's September 3-17 window is accurate, with exact UTC times now verified. | High |
| Relevant track exists: `Agentic Commerce Infrastructure` | Mission 83 tag group and portal JavaScript | ProveDown fits the track, but must explain the service-quality enforcement workflow rather than generic arbitration. | High |
| Track idea includes `SLA and uptime enforcement` | Portal bundle contains the track brief and idea text: API escrow released against signed logs or decentralized monitoring. | The product should show an enforcement consequence or explicitly state why this MVP stops at attestation plus a mock relay. | High |
| Project category requires a complete app/platform where GenLayer is central | Mission 83 `contribution_type_details.description` | A contract-only demo or static screenshot is insufficient. | High |
| Quality bar: real trust problem, live/authoritative data, complete source/docs | Portal bundle project rubric | Synthesized Worker evidence must be disclosed as a demo boundary; a real customer or authoritative data path is needed for a stronger submission. | High |
| Quality bar: frontend genuinely calls the contract and handles the full transaction lifecycle | Portal bundle project rubric | Source contains real register/attest writes, fee estimation, finality polling, `isSuccessful`, and readback; injected-wallet runtime proof is still pending. | High |
| Quality bar: meaningful difference from boilerplate and credible continued use | Portal bundle project rubric | The Uptime delta and current adjacent projects must be explicit in the demo and submission. | High |
| One project per builder; public GitHub repository plus full application | Portal bundle text and mission limits (`max_submissions_per_user: 1`) | Submission package needs a public repository at submission time, despite the repo's private operating rule before submission. | High |
| Accepted projects are published to Project Explorer | Portal bundle submit form copy | Broken links, stale addresses, or secret leakage are submission blockers. | High |
| Panel reviews builds and community can rate/comment; winners share 5% of GenLayer Points | Portal bundle hackathon rules copy | Demo quality and explainability matter in addition to code correctness. | High |
| Current feed has adjacent live concepts | Mission 83 API reported 48 submissions on 2026-09-09; the entries endpoint returned 47 records at the same check | ProveDown is not alone: the current feed includes `AgentSLA`, `AgentzProof`, `x402Proof`, `ModelSeal`, `Agent Escrow Court`, `FirstFault`, `AgentPact`, `ProofGuard Change`, `recourse`, and other adjacent proof/escrow/policy projects. The API total and entries-page length differ by one, so both are recorded rather than collapsed. | High |

## Not verified

- No current public page exposed a separate numeric judging-weight table. Do not claim percentages for innovation, UX, or technical execution.
- No current page verified a requirement for Bradbury specifically. Studio/Bradbury network labels on individual projects are not a universal rule.
- No current page verified that mocked cross-chain settlement is acceptable for this project. Treat it as a disclosed limitation, not compliance evidence.

## Submission consequence

Current verdict: **READY FOR SUBMISSION PACKAGING**, not submission-ready. The contract, browser wallet lifecycle, frontend polish, and local stale-claim/release scan are backed by finalized Studio evidence. The Worker is explicitly synthesized and the relay is mocked; the assembled public-package checkpoint, final link/secret scan, and time-sensitive submission-count check remain before publication.
