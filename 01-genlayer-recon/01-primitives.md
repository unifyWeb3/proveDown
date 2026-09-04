# 01 — GenLayer Primitives

**Sources:** S02, S05, S06, S07, S11, S15, S16, S17, S18 (High confidence: docs + code)

## GenVM
- Modified **wasmtime** + `genvm-sdk-wasi` + Python runner + WebDriver (WebDriver container `yeagerai/genlayer-genvm-webdriver:0.0.11`, shm 2gb) + LLM router. Two layers: **GenLayer RPC** (`gen_*` Intelligent Contracts) + **GenLayer Chain** (zkSync Elastic Chain L2, `eth_*/zks_*`). `genvm-manager` controls concurrency (`permits`, `sync_permits:64`). [S02, S11]
- Contracts: Python `gl.Contract` with typed persistent storage: `TreeMap[K,V]`, `DynArray[T]`, `u256`/`i32`, `Address`, `str`, `bool`, `bigint`. Custom `@allow_storage` dataclasses. First line pragma `py-genlayer:1jb...`. Methods `@gl.public.view` / `@gl.public.write` / `@gl.public.write.payable`. `gl.message.sender_address`, `gl.message.chain_id`, `gl.message_raw['datetime']` authoritative timestamp. [S02, S07]

## Intelligent Contract Execution
- **Split:** All `gl.nondet.*` **must** be inside nondet block (`gl.eq_principle.*` or `gl.vm.run_nondet_unsafe`). Storage writes, cross-contract calls, emits **must** be outside (after consensus). Linter `genvm-lint check` enforces. Sub-VMs sandbox nondet; storage handles not serializable → use `gl.storage.copy_to_memory()` inside. [S07]
- **Flow:** `pending (per-account queue) → proposing (leader+validators weighted random) → committing (votes+cost) → revealing → accepted → [Finality Window + appeals] → finalized` or `undetermined`/`canceled`. Validated via `waitForTransactionReceipt`. [S08, S04]

## gl.nondet.web.render
- `render(url, mode='text'|'html'|'screenshot')`, also `web.get`/`web.request`. WebDriver fetch, **independent per validator** — must tolerate variance (cache, timestamps). Leader+validators each fetch. Never compare raw bytes; hash/extract stable fields. [S05, S15]
- Observed: `dispute_court_v2.py:297` fetches per URL, sanitizes, truncates 3k per source, 9k total, `sha256` stored, failed fetch → empty + note, all fail → `UNDETERMINED` [S15]. ContentBounty: `render(..., mode='text')` → normalize (CRLF→LF, outer whitespace) → require 1-16k chars → `sha256`, host allowlist, digest commit, mismatch → `INCONCLUSIVE/DIGEST_MISMATCH`. [S18]

## gl.nondet.exec_prompt
- `exec_prompt(prompt, response_format='json'|'text', images=[≤2]) → dict|str`. Validator needs at least one backend with `supports_json`/`supports_image` for request type. Inside nondet only. [S06]
- **Prompting:** Always JSON + schema + validate + defensive parse (ContentBounty `_parse_json_object` hunting `{` to `}`, Jury regex fallback). Extra: stabilize keys `sort_keys=True`, ground facts via sandbox `eval`, frame evidence as `<EVIDENCE>` DATA with `<SYSTEM>` wrapper, greybox sanitize `FORBIDDEN_TOKENS` → `[filtered]`. [S06, S15, S18]
- Providers: OpenAI, Anthropic, Heurist, Comput3, io.net, Chutes, Morpheus, Ollama, OpenRouter, Gemini; tiers frontier (GPT-5/Claude Sonnet/Gemini 3 Flash) vs OSS (DeepSeek/Qwen). [S09]

## gl.vm.run_nondet_unsafe vs strict_eq
- **run_nondet_unsafe(leader_fn, validator_fn)-> Result**: You handle errors; validator receives `Return|UserError|VMError`. Return `bool` agreement. Recommended for custom. If majority accept → leader calldata; else `UNDETERMINED` (state unchanged, not error). [S03, S07, S15]
- **strict_eq(fn)**: Exact string equality (canonicalized `sort_keys=True`) — only for deterministic/stable (e.g., single-word `UPHELD/DISMISSED`). Fails for LLM/random. [S03, S17]
- **Local patterns (all run_nondet_unsafe):** Jury generic → compare only `verdict`; FlightDelay → strict word; V2 → strict exact verdict, comparative `prompt_comparative` verdict+remedy, non-comparative verdict+remedy_follows. [S15, S16, S17]
- **Error classes:** `[EXPECTED]` business (must match), `[EXTERNAL]` 4xx, `[TRANSIENT]` 5xx/timeout (both transient=agree), `[LLM_ERROR]` → disagree → rotate leader. [S07, S18]

## Developer Workflow
`genlayer init` → `genvm-lint` → direct mode `pytest` (mock_web/mock_llm) → Studio `genlayer up` (localhost:4000/8080) or `glsim` (1s) → integration `gltest --network localnet` → deploy `genlayer deploy` → frontend `genlayer-js` → explorer `explorer-bradbury.genlayer.com`. Testnets Bradbury/Asimov (4221 persistent, faucet). [S10, S13, S14]
