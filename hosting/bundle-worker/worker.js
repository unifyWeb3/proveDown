/**
 * ProveDown Bundle Worker (MVP mock)
 * Serves stable bundle JSON that GenLayer web.render fetches.
 * Two presets: breach (p95 4800 > 2000+500 tolerance) and no_breach (p95 1600 < 2000).
 * Stable content: no timestamps per fetch would cause hash variance (see technical validation).
 * For hackathon, synthesize; post-hackathon add real poller.
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const sla = url.searchParams.get("sla") || "demo";
    const preset = url.searchParams.get("preset") || "breach"; // breach | no_breach | ambig
    const bundles = {
      breach: { p50: 1561, p95: 4800, error: 0.02, fill: 0.72, match: 0.82, probes: 100, window: "1h", note: "synthesized breach: p95 > 2000+500 fills 72%" },
      no_breach: { p50: 320, p95: 1600, error: 0.004, fill: 0.95, match: 0.92, probes: 100, window: "1h", note: "synthesized no breach" },
      ambig: { p50: 1800, p95: 2100, error: 0.01, fill: 0.81, match: 0.85, probes: 100, window: "1h", note: "near threshold 2100 vs 2000+500 tolerance" },
      empty: { p50: null, p95: null, error: null, fill: null, match: null, probes: 0, window: "1h", note: "empty bundle should be inconclusive" }
    };
    const bundle = bundles[preset] || bundles.breach;
    // include sla id for trace but keep hash stable across fetches (no Date.now)
    const body = JSON.stringify({ sla, ...bundle });
    return new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "X-ProveDown-Bundle": sla,
        "X-ProveDown-Preset": preset
      }
    });
  }
}
