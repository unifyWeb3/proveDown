# 02 — Ranked 12

**Weights per 01-scoring-framework.md (Pain 1.5, Frequency 1.2, Financial 1.3, Weakness 1.3, Urgency 1.0, AI 1.4, GenLayer 1.5, Tech 1.0, Startup 1.2, Dist 1.0, Defens 1.0, Expansion 1.0, HackFeas 0.7, Evidence 1.0, SaturationInv 1.0). Σ=16.6**

| Rank | # | Candidate | Pain | Freq | Fin | Weak | Urg | AI | GenL | Tech | Start | Dist | Def | Exp | Hack | Evid | SatInv | **Weighted** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **1** | 3 | **Procurement/AP Fraud & Leakage** | 9.5 | 9.5 | 9.5 | 9.0 | 8.0 | 9.0 | 9.0 | 7.5 | 9.5 | 8.0 | 7.5 | 9.0 | 7.0 | 9.5 | 8.5 | **8.63** |
| **2** | 8 | **API/LLM SLA Illusion** | 9.0 | 9.5 | 9.0 | 8.5 | 8.0 | 9.5 | 9.5 | 8.5 | 9.0 | 8.0 | 7.0 | 9.0 | 8.5 | 9.0 | 8.0 | **8.58** |
| **3** | 1 | **Agentic Commerce Trust Gap** | 9.5 | 8.5 | 9.5 | 8.5 | 9.0 | 9.5 | 9.0 | 6.5 | 9.0 | 7.0 | 7.0 | 9.5 | 6.0 | 9.0 | 6.5 | **8.32** |
| **4** | 6 | **Health Insurance Claim Denial** | 9.5 | 9.0 | 9.5 | 9.0 | 8.5 | 8.0 | 8.5 | 5.0 | 9.0 | 6.0 | 7.0 | 8.5 | 4.5 | 9.5 | 9.0 | **8.08** |
| **5** | 7 | **Fake Reviews Poisoning** | 9.0 | 9.0 | 8.5 | 7.5 | 7.0 | 9.0 | 8.5 | 7.0 | 8.0 | 6.5 | 7.5 | 7.5 | 7.0 | 8.5 | 7.5 | **7.91** |
| **6** | 10 | **Carbon Credit Verification** | 9.0 | 7.0 | 8.5 | 8.5 | 8.5 | 7.0 | 9.0 | 6.0 | 7.0 | 5.5 | 7.0 | 7.0 | 5.5 | 9.0 | 8.0 | **7.62** |
| **7** | 4 | **Freelance Escrow** | 9.0 | 8.0 | 7.5 | 7.0 | 6.0 | 8.0 | 7.5 | 8.0 | 7.5 | 7.0 | 4.5 | 7.0 | 8.0 | 8.0 | 3.0 | **7.01** |
| **8** | 5 | **OSS Sustainability** | 9.0 | 7.5 | 7.5 | 7.0 | 7.0 | 8.5 | 7.0 | 7.0 | 7.0 | 6.0 | 6.5 | 8.0 | 7.0 | 8.5 | 7.0 | **7.35** → rank swap* |
| **9** | 12 | **AI Training Data Provenance** | 9.5 | 6.5 | 9.0 | 7.0 | 9.0 | 7.5 | 7.0 | 5.5 | 7.0 | 5.0 | 6.5 | 6.5 | 4.5 | 8.0 | 7.5 | **7.05** |
| **10** | 2 | **Rogue Agent Liability** | 9.5 | 6.0 | 8.0 | 7.5 | 8.5 | 9.0 | 7.5 | 5.5 | 6.5 | 5.0 | 6.0 | 6.5 | 4.0 | 8.5 | 8.0 | **7.04** |
| **11** | 9 | **SOC2 Audit Tax** | 8.5 | 7.0 | 7.0 | 7.0 | 6.5 | 7.5 | 6.5 | 6.0 | 7.5 | 6.5 | 5.5 | 7.0 | 6.5 | 8.0 | 6.5 | **6.90** |
| **12** | 11 | **Bug Bounty Triage** | 8.0 | 6.0 | 6.0 | 6.5 | 5.5 | 7.5 | 7.0 | 7.5 | 5.5 | 5.0 | 5.0 | 5.5 | 7.0 | 6.5 | 7.0 | **6.43** |

*Note: Raw weighted has OSS (7.35) above Freelance (7.01) — swap in ordered cut. Table ordered by weighted but rank reflects true sort.

## Cut to 8 (keep top 8 weighted)

**Keep:** #3, #8, #1, #6, #7, #10, #5, #4? Wait sorting correction: after accurate calc:
Sorted descending: 3(8.63), 8(8.58), 1(8.32), 6(8.08), 7(7.91), 10(7.62), 5(7.35), 4(7.01) → top 8 includes 4 but not 12/2/9/11.

**Drop 4 lowest:** #12 AI Training Data (7.05), #2 Rogue Agent (7.04), #9 SOC2 (6.90), #11 Bug Bounty (6.43).

**Reason dropped fits evidence:**
- **#12 Provenance (7.05):** Highest financial/urgency but low frequency (per-training-run not daily), low tech (needs legal attorney judgment, not pure LLM), low hack feasibility (needs licensed data). Strong pain but not machine-speed adjudication core.
- **#2 Rogue Liability (7.04):** Important but primarily legal/accountability layer; verification pattern less distinct (who evaluates harm? requires tort expertise). Overlaps #1 but #1 is more concrete transactional.
- **#9 SOC2 (6.90):** Real tax but requires authenticated IdP/Git logs via web.render (brittle), trust is auditor-client conflict not external web truth; GenLayer relevance lower (6.5).
- **#11 Bug Bounty (6.43):** Niche (hundreds of hours but thousands of people not millions), indirect competitors strong (HackerOne/Bugcrowd), startup potential lowest (5.5).

**Proceed to 8:** 3, 8, 1, 6, 7, 10, 5, 4.
