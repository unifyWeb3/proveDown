# 02 — GenLayer Necessity Tests

**Four questions per §14: Remove, Replace, Unique primitive, Economically important enough?**

## 1. Procurement/AP (#3)

### Remove GenLayer → Can product still exist?
Yes as internal AI + backend. AP tool fetches supplier URL, LLM judges legitimacy, stores in DB, clerk approves. *What disappears:* Neutral, bonded, appealable attestation. Without GenLayer, judge is *central operator* — who vouches when $500K invoice is flagged legitimate but later proves cloned supplier? Operator can be bribed (approve fake supplier to collude with fraudster), or accused of bribery when flagging honest supplier. No slashing, no independent validators, no VRF anti-Sybil. Trust gap remains for high-value disputes where AP team needs *third-party proof* to justify blocking payment vs angry supplier / internal pressure.

### Replace with Base/Ethereum + AI API + Chainlink/standard oracle
- **Base/Ethereum** can escrow + deterministic 3-way match, but cannot judge subjective "is price/tax correct / supplier legitimate vs cloned site?" — out-of-scope.
- **Chainlink** is for objective data (price feeds, Data Feeds) not subjective supplier legitimacy judgment requiring LLM + external web graph. Could call Chainlink Functions for API fetch, but still need LLM jury and consensus.
- **Centralized LLM API** (OpenAI/Claude) can judge single invoice, but single model = single point of failure + bribery + no economic security; no independent recomputation; error rate ~ distribution shift; no appeal doubling validators.
- **Why GenLayer still better:** Multiple independent validators using diverse LLMs (Heurist/Comput3/Chutes etc.) + independent `web.render` fetches + `run_nondet_unsafe` agreement on `VERIFIED/FLAGGED` only on decision field + appeal bond + slash for false approval. Primitive is *economically secured subjective adjudication with external data* — not just "call LLM". This is load-bearing when disputed invoice > bond cost + reputation at stake.

### Unique primitive
`gl.nondet.web.render` (fraudulent supplier site mirrored? domain age? mismatch) + `gl.nondet.exec_prompt` (judge legitimacy vs PO + invoice + supplier evidence bundle, output `{"verdict": VERIFIED|FLAGGED, "confidence": 0-1000, "reason_category": DUPLICATE|PRICE|TAX|SUPPLIER_FAKE}`) + `gl.vm.run_nondet_unsafe` (validators independently judge same bundle, agree on verdict+reason_category only, ignore reasoning text) + `emit_transfer` or attestation for ERP block + appeal window. Deterministic post-consensus: store attestation hash, update supplier reputation map. Equivalent to ContentBounty two-stage but for invoice truth.

**GenLayer code sketch:**
```python
def leader_fn():
    html = gl.nondet.web.render(supplier_url, mode='text')
    obs = gl.nondet.exec_prompt(extract_prompt(html), response_format='json')
    verdict = gl.nondet.exec_prompt(judge_prompt(invoice, po, obs), response_format='json')
    return verdict  # {"verdict":"FLAGGED","reason":"SUPPLIER_FAKE","confidence":920}

def validator_fn(leader_result):
    if not isinstance(leader_result, gl.vm.Return): return False
    my = leader_fn()  # independent fetch+jury
    return leader_result.calldata["verdict"]==my["verdict"] and leader_result.calldata["reason"]==my["reason"]

result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
```

### Economically important enough?
**Yes IF:** Average invoice $10k+, exception rate 14% [S30], leakage 0.35% [S30] → for $1B spend = $3.5M leakage. Cost to serve: LLM 2 calls (~$0.01) + WebDriver (~$0.001) + GenLayer gas (e.g., 0.1 GEN ≈ $0.001-0.01) + appeal gas optional ~ total <$0.05 per invoice vs manual $9.40 [S30] and vs leakage $35 per $10k invoice (0.35%). Gross margin huge. Willingness: CFO already pays recovery audit 15-25% of found leakage → can charge 10-20% of prevented leakage or $0.10-0.50 per invoice (10× cheaper than manual, value justified by slashing-secured attestation). Bond/slash makes bribery cost >$42k stake fiction. **Startup viable only if scoped to invoices where disputed amount >> gas+appeal** — which is most non-trivial invoices.

### Verdict: **PASS** — GenLayer load-bearing for neutral high-value invoice truth with external supplier evidence.

---

## 2. API SLA (#8)

### Remove GenLayer → Can product still exist?
Yes as probe service + backend + AI API: global probes ping API, store latency histograms in DB, LLM judges "is this breach vs SLO?" and dashboard shows breach. *What disappears:* Attested, neutral, economically secured proof that buyer can cite for billing dispute/insurance. With centralized service, provider says "your dashboard is biased, you're the customer, you want credits — we don't trust your measurement." No independent validators, no stake, no appeal. When $50K pipeline damage claimed vs provider's $125 credit [S37], dispute needs neutral third party, not buyer's own tool.

### Replace with Base/Ethereum + AI API + oracle
- **Base/Ethereum** can store SLA hash, but can't fetch live API status page + probe endpoints + judge data quality (match/fill/error) — needs external web + LLM.
- **Chainlink** could oracle uptime (pre-2024 they did proof-of-reserve) but for subjective "does 15s latency count as downtime for agent pipeline that needs <2s?" — needs LLM judging *functional integrity* not just 200/500.
- **Central AI API** = buyer's tool biased. Same bribery issue: buyer could cherry-pick slow probes to fabricate breach; provider could cherry-pick fast probes. No VRF, no slashing for false attestation.
- **Why GenLayer still better:** Independent validator set (diverse LLM providers, greybox opacity not knowing which model judges) + independent `web.render` fetches of status page + live probe endpoints (Text mode for JSON, HTML for status) + `exec_prompt` judging content quality (e.g., enrichment fill rate) + consensus on `BREACH/NO_BREACH` + evidence bundle hash + attestation anchored on GenLayer that buyer can bridge to Base for automated credit (AgentEscrow BridgeSender pattern). Appeal allows provider to contest with bond if attestation false.

### Unique primitive
`gl.nondet.web.render` ×3 (status page + 2 live probes) each `mode='text'` → latency measured at fetch time + content extracted, `gl.nondet.exec_prompt` judging data quality (`{"match":0.82, "fill":0.91, "error":0.03, "breach": True, "reason":"P95>2s"})` + `run_nondet_unsafe` agreement on breach bool + reason_category (LATENCY/ERROR_QUALITY/UNAVAILABLE) + deterministic attestation (`emit_transfer` not needed for SLA — store breach + evidence hashes, bridge proof). This is SLA-as-oracle with jury.

**Sketch:**
```python
def leader_fn():
    # three independent fetches inside same nondet
    a = gl.nondet.web.render(status_url, mode='text')
    b = gl.nondet.web.render(probe1_url, mode='text')
    c = gl.nondet.web.render(probe2_url, mode='text')
    j = gl.nondet.exec_prompt(sla_judge_prompt(a,b,c, slo), response_format='json')
    return j  # breach + p50/p95 + quality

def validator_fn(leader_result):
    my = leader_fn()  # independent probes
    return (leader_result.calldata["breach"]==my["breach"] and 
            leader_result.calldata["reason"]==my["reason"])

attestation = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
# then BridgeSender → Relay → Base VerdictRegistry for billing contract
```

### Economically important enough?
**Yes IF:** Downtime $300k/hr [S45], composite SLA 99.5% for 5 services [S45], AI agents 10-100× calls make tail latency 15s = pipeline of bad decisions. Cost to serve: 3 web renders + 1 LLM per attestation (~$0.02) vs manual on-call triage + billing dispute. Willingness: buyer suffers $50K damage for $500/mo API [S37 Explorium] — paying $10-50/mo for attested SLA enforcement that unlocks $125→$5000 credit dispute success is ROI 10-100×. Plus reputation scores enable *selection* of better APIs (like RelAI) — premium for reliable APIs. **Model:** Subscription $99-499/mo + per-attestation $0.10 + bridge proof fee. Gross margin >80% if probe volume batched (jury attests bundle of 100 probes per tx, not 1:1).

**Note:** Continuous per-minute attestation is not economic to put every probe on-chain; MVP attests spot checks on demand (when breach suspected) or batched hourly bundles. This respects GenVM cost model (minimize nondet calls, docs S06).

### Verdict: **PASS** — GenLayer load-bearing for neutral, slash-backed SLA breach attestation with external probes + subjective functional judgment, where both sides distrust each other's measurement.

---

## 3 & 4. (Cut candidates for completeness)

### Agentic Commerce (#1)
- **Remove:** Centralized checkout service could judge intent too; but without decentralized, same bribery/censorship vs small merchant when 2-of-2 Internet Court fails.
- **Replace:** Visa/Mastercard already provide trust but *engineer happy path only* — they don't adjudicate "price changed 1% — is this within authority?" Could use Chainlink + AI but still need subjective charter judgment + appeal. Unique primitive is canonical envelope + independent revalidation + charter jury.
- **Economically:** Large market but **not enough differentiation as startup** vs foundation before Sep 3 — cost to win distribution vs Visa is prohibitive. **FAIL on timing even though primitive is real.**

### Fake Reviews (#7)
- **Remove:** Centralized Fakespot does text analysis; remove GenLayer → lose neutral graph + appeal for contested authenticity (seller says "not fake, my customers are real" — who decides?).
- **Replace:** Chainlink not relevant; single LLM = platform could bribe; Graph overlap + burst detection via single API could be gamed. Need jury for "trustworthy vs incentivized" judgment with external reviewer profiles.
- **Economically:** $770B harm [S34] but payer fragmented, willingness low vs free Fakespot, and private groups not fetchable. **Marginal PASS technically but FAIL economically as primary startup (supporting evidence weaker than #3/#8).**

---

## Cross-Test: Ordinary Backend + AI + Oracle Could Do This?

| Candidate | Could ordinary do 80%? | What's missing? | Is missing worth decentralization? |
|---|---|---|---|
| **#3 Procurement** | Yes — internal LLM judge cheap | Neutral bond/slash vs supplier collusion + independent fetches + appeal | **Yes** when $ disputed >$10k (most mid-market invoices) — recovery audit already pays 15-25% fee for *post-hoc* neutral finder; preventative attestation worth 5-10% |
| **#8 API SLA** | Yes — probe + AI dashboard | Neutral attestation both sides trust vs provider's self-report + buyer's biased tool | **Yes** when credit dispute or pipeline error-budget burn — buyer needs third-party proof to move from $125 → $5k credit; $0.02 attestation ROI positive |
| #1 Commerce | Yes — Visa token + central jury | Decentralized not censored by bank | Real but distribution vs incumbents too high cost |
| #7 Reviews | Yes — Fakespot + graph | Attested takedown evidence, appeal | Real but fragmented payer, weaker ROI |

**Survivors:** #3, #8.
