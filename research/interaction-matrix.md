# Interaction Matrix

Date checked: 2026-09-09

| Control | Renders | Handler | Backend connected | Loading/success/error | Guard/mobile status |
|---|---|---|---|---|---|
| Section anchors | Yes | Native anchors | N/A | N/A | Works; responsive CSS |
| Agreement ID | Yes | Input + `validateSetup()` | Used by register/attest | Empty ID error | Guarded; responsive |
| API URL | Yes | No direct handler | Sent on registration; reputation subject is resolved from stored SLA | No URL validation beyond contract | Contract validates HTTPS; selected agreement prevents guessed reputation |
| Bundle preset | Yes | Change listener | Worker URL on preview/registration | Preview hint; Worker error | Usable on mobile |
| SLO JSON | Yes | Input + `validateSetup()` | Sent to `register_sla` | Invalid JSON/fields disable register | Guarded; responsive |
| Preview/register | Yes | Worker fetch; wallet-backed `register_sla` | Connected when wallet exists | Fee/signature/finality phases; broad catch labels failures as evidence errors | Local validation; mobile full width |
| Refresh live results | Yes | `liveRead()` | Studio reads | Skeleton, verified, retry/error | No disabled state; responsive |
| Request new attestation | Yes | Wallet-backed `request_attestation` | Connected when wallet exists | No-wallet notice; fee/signature/finality; readback; failure block | Agreement existence checked; mobile full width |
| Copy evidence hash | Dynamic | Data-attribute click listener | Clipboard only | Copied/copy failed | Escaped; responsive |
| Explorer links | Dynamic | External anchors | Explorer | External navigation | Full tx validation; no link for unknown custom IDs |
| Retry buttons | Dynamic | Re-run preview or `liveRead()` | Repeats relevant call | Pending/error repeated honestly | Responsive |
| INCONCLUSIVE | Dynamic | `verdictHtml()` | Reads stored status | Amber no-decision copy | Covered for IDs 3/6 |
| NO CONSENSUS | Dynamic | `verdictHtml()` | Reads stored status | Amber retry copy | Branch exists; no live fixture |
| Details sections | Yes | Native `<details>` | N/A | Expand/collapse | Accessible target size |

## Core conclusion

The two core write controls are connected in source and fail closed without a wallet. The reputation subject is now bound to the selected on-chain agreement. Remaining interaction risks are wallet-runtime proof, broad error wording, pinned-case receipt lookup, mutable Worker provenance, and custom-case proof-link coverage.
