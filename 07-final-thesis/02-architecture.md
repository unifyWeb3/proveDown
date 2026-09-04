# 02 — Architecture

```
Frontend (Next.js 16, React 19, TS strict, Tailwind)  [Jury-like]
   ↕ genlayer-js (simulator|studionet|testnetBradbury, readContract + writeContract → waitForTransactionReceipt)
Probe Poller (Node backend, off-chain, not truth)
   → GenLayer Intelligent Contract (Python gl.Contract, Bradbury 4221)
        Storage: TreeMap[Sla], TreeMap[Attestation], TreeMap[Reputation]
        Nondet: gl.nondet.web.render×3 (mode='text', 3k each 9k total, sanitize, sha256) + gl.nondet.exec_prompt(json breach)
               → gl.vm.run_nondet_unsafe (leader_fn/validator_fn agree breach+reason)
        Deterministic: store attestation, update reputation, emit BridgeSender message
   → GenLayer Chain (zkSync Elastic, 4221 persistent, explorer-bradbury)
   → Hyperlane / LayerZero V2 → Relay → Base Sepolia VerdictRegistry (Solidity)
   → APIs (buyer's: status page + 2 live probe JSON endpoints, public HTTPS)
   → DB (postgres probe cache/histogram, not truth)
   → Pipeline (buyer's agent, error-budget service, billing contract)
```

See final-product.md §13 for full constraints/version.
