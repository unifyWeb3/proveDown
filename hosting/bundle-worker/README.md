# Bundle Worker — Stable Demo Presets

**Why stable:** Per technical validation (06-adversarial-analysis/05), `httpbin.org/get` 5/5 hash unique vs `httpbin.org/json` 1/8 stable. Jury must fetch **hash-stable bundle JSON**, not dynamic probe. This Worker serves stable bundles (no `Date.now`, no IP).

**Deploy (one manual action before Sep 3):**

```bash
npx wrangler login   # browser OAuth, once
npx wrangler deploy  # from hosting/bundle-worker/, outputs https://provedown-bundle.<you>.workers.dev
```

Set `NEXT_PUBLIC_BUNDLE_WORKER_URL` in `.env.local` to `https://.../bundle` (no preset param — contract appends `?sla=...&preset=...`).

**Browser note:** responses include `Access-Control-Allow-Origin: *` so the frontend can preview bundles and recompute hashes in-browser (GenLayer validators fetch server-side and are unaffected). Bodies are byte-identical to before — jury evidence hashes unchanged.

**Presets:**

| preset | p50 | p95 | error | fill | match | expected jury | use |
|---|---|---|---|---|---|---|---|
| `breach` | 1561 | 4800 | 0.02 | 0.72 | 0.82 | **BREACH** (LATENCY+ERROR_QUALITY) | one healthy case *fails* — demo breach |
| `no_breach` | 320 | 1600 | 0.004 | 0.95 | 0.92 | **NO_BREACH** (OK) | one healthy case *passes* |
| `ambig` | 1800 | 2100 | 0.01 | 0.81 | 0.85 | BREACH (borderline, conf 800, reason may drift) | ambiguous/inconclusive demo if practical |
| `empty` | — | — | — | — | — | **INCONCLUSIVE** (empty bundle) | shows INCONCLUSIVE retry path, not BREACH |

**Local dev:**

```bash
npx wrangler dev --port 8787
curl http://localhost:8787/bundle?sla=demo&preset=breach
curl http://localhost:8787/bundle?sla=demo&preset=no_breach
```

**For GenLayer jury:** Contract does `gl.nondet.web.render(bundle_url, mode='text')` where `bundle_url = NEXT_PUBLIC_BUNDLE_WORKER_URL + "?sla=" + sla_id + "&preset=" + preset`. Validators each fetch independently — stable hash ensures agreement on breach bool (1/8 not 5/5). Length 116 chars (<3000 truncate, <16k ContentBounty limit) — never INCONCLUSIVE due to oversize.

**Fallback if not deployed:** Use `https://httpbin.org/json` as temporary stable endpoint for Studio test only (hash 4073fc02eac8 stable). But Worker presets are authoritative for demo.
