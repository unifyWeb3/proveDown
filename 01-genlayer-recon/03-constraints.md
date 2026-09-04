# 03 — Constraints, Failure Modes, Trust Assumptions

**Sources:** S03, S06, S07, S15, S18 (High for failures/trust; Medium for latency/costs)

## Current Limitations
- Python only; storage `TreeMap`/`DynArray`/`u256`/`i32`/`Address` only (`dict`/`list`/`int` forbidden); `dict` keys `str` only (JSON); generics need `gl.storage.inmem_allocate` + `copy_to_memory`; custom `@allow_storage`+`@dataclass`; no debugger (prints/traces only); no nested nondet; mock required in direct mode; consensus not instant (min on testnet); rate-limited hosted studio vs local; model coverage 4 combos; WebDriver `shm 2gb`; no legal enforceability automatically; version pragma hash pinned. [S07, S10]

## Failure Modes

| Failure | Handling | Local mitigation |
|---|---|---|
| LLM hallucination/nondet | Tolerance/compare, `UNDETERMINED` if split | Compare only `verdict` field [S16] |
| Malformed JSON | Defensive parse, fallback UNDETERMINED | Regex + `json.loads` hunting `{`→`}` [S15, S18] |
| Prompt injection | Greybox sanitize + DATA framing | `FORBIDDEN_TOKENS`→`[filtered]`, `<SYSTEM><EVIDENCE>` [S15] |
| Web variance (timestamps/cache) | Independent fetch, compare derived status | Hash truncated 3k, store hash not raw [S15] |
| Web fail/empty/too large | Transient vs external classification | `try/except` → note, empty→no source→UNDETERMINED, >16k→INCONCLUSIVE [S15, S18] |
| API unstable fields | Stable fields only | Truncate+hash [S15] |
| Genuine split (subjective) | `UNDETERMINED` first-class, retried/appealed | `status=no_consensus` UI presents as working [S15] |
| Transient 5xx/timeout | Both transient=agree | `[TRANSIENT]` prefix compare [S18] |
| Business logic `[EXPECTED]` | Must match exactly | Validate HTTPS, dedup, limits → UserError [S15] |
| Liveness miss Window | Slashing | N/A |
| Serialization | `@allow_storage` + `check_pickling` | Use primitives + JSON strings [S15] |
| Storage write inside nondet | VM error, linter catches | Avoid `self` capture [S15] |

## Trust Assumptions
- **Honest majority per tx committee** (selected subset) — >50% honest needed; majority colluding can force verdict. [S04]
- **LLM providers not colluding** → diversity (random selection + customizable templates reduces correlation, not cryptographic). [S04]
- **Web not eclipse-attacked** → no TLS attestation mentioned; WebDriver assumed faithful. [S05]
- **Economic rationality:** 42k stake + slashing deters liveness; appeal bond deters frivolous. [S09]
- **Rollup L2 DA** (zkSync), owner cold key, Python runtime hash pinned. [S02]

## Security Insight for Startup Design
- Must design *equivalence that tolerates variance* but *rejects gaming*: compare decision fields with tolerance (e.g., price ±2%, score ±1 with gate `score==0` → reject), not raw text. [S03]
- Must handle `UNDETERMINED` as product feature (retry, escalate, refund, human fallback), not error.
- Must never trust leader output schema-only; validator must re-derive or judge against source+criteria. [S03]
- Latency/cost mean GenLayer not for sub-second UI; good for settlement/escrow/attestation where correctness > speed.
