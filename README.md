# GenLayer Startup Discovery — Research System

**Mission:** Discover one real startup solving a painful, underserved problem where GenLayer gives a genuinely important technical advantage. Hackathon (Sep 3–17, 2026) is forcing function; startup comes first.

**Read order:**
1. `00-mission.md` — constraints, non-goals, methodology
2. `01-genlayer-recon/` — protocol primitives, consensus, constraints, workflow (verified facts)
3. `03-hackathon-intelligence/` — what has been built, saturation map
4. `02-market-research/` — 12 deep problems with evidence
5. `05-opportunity-map/` — scoring framework + funnel 12→8→4→2
6. `04-competitive-intelligence/` — direct/indirect/emerging + final reality check (S50-56)
7. `06-adversarial-analysis/` — kill tests, GenLayer necessity, security, economics, **validation gate (05-08)**
8. `07-final-thesis/final-product.md` — 25-section founder/investor/technical thesis
9. `07-final-thesis/implementation-readiness.md` — MVP boundary for build
10. `contracts/provedown.py` — narrow slice MVP contract (GenLayer)
11. `hosting/bundle-worker/worker.js` — mock bundle Worker (hash-stable)
12. `tests/test_provedown.py` — analog direct-mode tests (5 pass)

**Evidence discipline:** Every claim cites `SOURCES.md` ID. Labels: `verified fact` / `strong inference` / `weak signal` / `speculation`. Prior local projects (`genlayer-jury`, `contentbounty`) treated as *technical lessons only* — not market proof.

**Timeline:** Compressed sprint — thesis before Sep 3, validation gate Sep 2, MVP build Sep 3-17. No product code until thesis defensible.

**Validation gate Sep 2 result:** PASSED with reframing — ProveDown is *functional SLO attestation* (quality fill/match + bundle latency with tolerance) sidecar on top of Datadog/Pingoru not replacement, targeting on-chain native (x402/Arc) first, using off-chain bundle poller to avoid web.render latency variance. See `06-adversarial-analysis/05-08` + `implementation-readiness.md`.

**Status:** Research + validation complete. MVP narrow slice scaffolding in `contracts/`, `hosting/`, `tests/` — ready for `genvm-lint` → Studio/Bradbury deploy. See `07-final-thesis/implementation-readiness.md` for exact scope.

**Quick verify:**
```bash
python3 tests/test_provedown.py  # 5 passed
# next: genvm-lint check contracts/provedown.py --json (if genvm installed)
# next: deploy via Studio https://studio.genlayer.com or genlayer deploy --network testnetBradbury
```
