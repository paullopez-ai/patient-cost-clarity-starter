# Patient Cost Clarity Starter

A working Next.js starter that demonstrates how to use the Optum Real Pre-Service Eligibility API (GraphQL) with Claude AI to give patients a plain-English answer to the question every patient asks before a medical visit: "What is this actually going to cost me?"

This project is a practical reference implementation. Clone it, add your API credentials, and you have a running patient cost clarity interface that surfaces real coverage and benefit data in a format patients and billing staff can understand and act on.

## What This Demonstrates

- **Optum Real API integration** — Calling the Pre-Service Eligibility API (GraphQL) to retrieve coverage status, plan levels, deductibles, copays, coinsurance, and service-level benefit details in a single query
- **Benefit derivation** — Extracting structured benefit data (deductible accumulators, OOP maximums, copay/coinsurance amounts) from the GraphQL eligibility response without a separate benefit check API call
- **OAuth 2.0 credential management** — Client credentials flow with token caching and automatic refresh
- **Claude AI cost interpretation** — Passing eligibility and benefit data to Claude and receiving a structured plain-English cost estimate with action items, risk flags, and a patient-friendly script
- **Seven patient cost scenarios** — Routine low-cost visit, specialist with partial deductible, high-cost imaging, preventive care ($0), ER high exposure, behavioral health carve-out, and physical therapy visit limits
- **Runtime mode toggle** — Switch between mock and sandbox modes during a live demo without redeploying
- **Session-based authentication** — HMAC-SHA256 session tokens with scrypt password hashing, enforced in sandbox/production modes
- **Production-ready patterns** — Graceful Claude fallback, typed state machine, server-side credential handling, sandbox-aware UI labeling

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, React 19)
- [TypeScript](https://www.typescriptlang.org) 5
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) components (base-vega style)
- [Hugeicons](https://hugeicons.com) for iconography
- [Framer Motion](https://www.framer.com/motion) for animations
- [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- [Bun](https://bun.sh) package manager

## Quick Start (Mock Mode)

No API keys, no credentials, no login required:

```bash
git clone https://github.com/paullopez-ai/patient-cost-clarity-starter.git
cd patient-cost-clarity-starter
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000). All seven patient scenarios render with realistic data from local fixtures.

## App Modes

| Mode | `NEXT_PUBLIC_APP_ENV` | Login Required | Data Source |
|------|----------------------|---------------|-------------|
| **Mock** | `mock` (default) | No | Local fixture data. No API keys needed. Full demo experience. |
| **Sandbox** | `sandbox` | Yes | Real Optum sandbox API + Anthropic API. Requires credentials. |
| **Production** | `production` | Yes | Production Optum API with real member data. |

### Runtime Mode Toggle

You can switch between Mock and Sandbox modes at runtime using the toggle button in the app header — no redeployment or server restart needed. The `NEXT_PUBLIC_APP_ENV` env var sets the default, but the toggle overrides it for the current session.

When you toggle from Mock to Sandbox, the next API call will hit the real Optum sandbox and Anthropic APIs. Toggle back to Mock and it instantly returns to fixture data.

---

## Connecting to the Optum Sandbox

### Step 1: Register for an Optum Developer Account

1. Go to the [Optum Developer Portal](https://marketplace.optum.com) and create a free developer account
2. Once registered, navigate to **API Products** and find the **Real Pre-Service Eligibility and Benefits** API
3. Subscribe to the sandbox tier — this gives you access to the sandbox endpoint with synthetic test data
4. Create a new application in your developer dashboard — Optum will generate a **Client ID** and **Client Secret**

### Step 2: Locate Your Credentials

After creating your application, you'll find these values in your Optum developer dashboard:

| Credential | Where to Find It | Example Value |
|-----------|-------------------|---------------|
| **Client ID** | App details page → Client ID | `cd2288fc-43ab-4ce7-a240-81557b4a2e5e` |
| **Client Secret** | App details page → Client Secret | `IrHGtBefWFC1kPA7iYYvtkgXV8zTc1B3` |
| **Auth URL** | Documentation → Token endpoint | `https://idx.linkhealth.com/auth/realms/developer-platform/protocol/openid-connect/token` |
| **Eligibility URL** | Documentation → GraphQL endpoint | `https://sandbox-apigw.optum.com/oihub/eligibility/v1/pre-service/member` |

### Step 3: Get an Anthropic API Key

1. Create an account at [console.anthropic.com](https://console.anthropic.com)
2. Navigate to **API Keys** and generate a new key
3. The app uses `claude-sonnet-4-6` for cost interpretation

### Step 4: Configure Environment

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```bash
# Switch to sandbox mode
NEXT_PUBLIC_APP_ENV=sandbox

# Optum sandbox credentials
OPTUM_CLIENT_ID=your_client_id
OPTUM_CLIENT_SECRET=your_client_secret
OPTUM_AUTH_URL=https://idx.linkhealth.com/auth/realms/developer-platform/protocol/openid-connect/token
OPTUM_ELIGIBILITY_URL=https://sandbox-apigw.optum.com/oihub/eligibility/v1/pre-service/member
OPTUM_PROVIDER_TAX_ID=your_provider_tax_id

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Authentication (see next section)
AUTH_USERNAME=demo
AUTH_PASSWORD_HASH=...
AUTH_SECRET=...
```

### Step 5: Set Up Authentication

Sandbox and production modes require login to protect your API credentials. Generate your auth credentials:

```bash
node scripts/generate-password-hash.mjs
```

The script prompts you for a password and outputs:

```
AUTH_PASSWORD_HASH=<salt_hex>.<hash_hex>
AUTH_SECRET=<64-char hex string>
```

Add these to `.env.local` along with your chosen username:

```bash
AUTH_USERNAME=your_username
AUTH_PASSWORD_HASH=<paste from script>
AUTH_SECRET=<paste from script>
```

Restart the dev server, then log in at `/login`.

### What the Sandbox Validates

The Optum sandbox is designed to validate your **API integration**, not to return realistic benefit data:

- OAuth 2.0 client credentials authentication flow
- GraphQL query structure and variable formatting
- Required headers (`providerTaxId`, `environment`, `x-optum-consumer-correlation-id`)
- Response parsing and error handling

To see realistic cost estimates with full benefit data, use **mock mode**. The mock fixtures demonstrate what production output looks like with complete data flowing through the pipeline.

---

## Authentication

Authentication is enforced only in sandbox and production modes. Mock mode has no login — developers just run `bun dev` and go.

### How It Works

- **Session tokens** — HMAC-SHA256 signed via Web Crypto API (Edge-safe, no Node.js-only dependencies)
- **Password storage** — scrypt hash (N=16384, r=8, p=1) with random 16-byte salt
- **Timing-safe comparison** — Both username and password checked with constant-time comparison to prevent enumeration
- **Session cookies** — httpOnly, sameSite=lax, 24-hour expiry
- **Middleware** — Redirects unauthenticated requests to `/login?from=...`, returns to original page after login

### Creating Your Own Password

To replace or update credentials:

```bash
node scripts/generate-password-hash.mjs
```

Paste the output into `.env.local` and restart the dev server.

---

## Architecture

### Three-Step Pipeline

The single API route `POST /api/optum/cost-estimate` orchestrates the entire pipeline:

```
Browser (page.tsx)
  |
  +-- POST /api/optum/cost-estimate { patientId, mode }
       |
       +-- [Mock] --> Local fixtures (280ms + 420ms + 1400ms simulated delay)
       |
       +-- [Live] --> Optum OAuth2 (Bearer token, cached 1hr)
                       |
                       +-> Optum GraphQL API (CheckEligibility query)
                       |     +-> EligibilityResponse
                       |
                       +-> deriveBenefitCheck() (local extraction, no API call)
                       |     +-> BenefitCheckResponse
                       |
                       +-> Anthropic API (Claude cost interpretation)
                             +-> ClaudeCostAnnotation
       |
       +-- Response: success | ineligible | fallback | error
```

The `mode` field in the request body controls which data source is used, enabling the runtime toggle. If no mode is provided, the server falls back to `NEXT_PUBLIC_APP_ENV`.

The Claude call is optional. If it fails or times out (45s), the app displays the raw eligibility and benefit data with a fallback notice. The benefit check is derived from the eligibility response — there is no separate benefit check API call.

### Sandbox Dev Console

When running in sandbox mode, each API call builds a diagnostic narrative with timestamped log entries. The `SandboxDevConsole` component displays these logs — OAuth timing, eligibility response status, benefit data sparsity warnings, and Claude interpretation results. This is invaluable for debugging API integration issues.

---

## The Patient Scenarios

The app ships with seven synthetic patients, each covering a distinct real-world cost scenario:

| Patient | Scenario | What It Tests |
|---------|----------|---------------|
| Maria Gonzalez | Routine Visit — Low Cost | Deductible met, low $25 copay for PCP visit |
| James Washington | Specialist — Mid Range | Partial deductible ($800/$2,000) + 20% coinsurance |
| Aisha Rahman | Imaging — High Cost | Large deductible remaining ($1,800/$3,000), expensive MRI |
| Robert Chen | Preventive — Zero Cost | ACA-mandated wellness exam, $0 regardless of deductible |
| Destiny Williams | Emergency — High Exposure | ER copay + deductible + coinsurance on student plan |
| Thomas O'Brien | Behavioral Health — Carve-Out | BH carve-out with flat $40 copay, no coinsurance |
| David Washington | Physical Therapy — Visit Limit | $35 copay, 16/20 annual visits used, limit warning |

All patients use Optum sandbox payer ID `87726` and are pre-configured with sandbox-compatible member IDs and field values.

---

## Project Structure

```
app/
  page.tsx                              — Main UI (patient selector, results, mode toggle)
  login/page.tsx                        — Login page (username/password form)
  api/optum/cost-estimate/route.ts      — API route orchestrating the 3-step pipeline
  api/auth/login/route.ts               — POST: validates credentials, sets session cookie
  api/auth/logout/route.ts              — POST: clears session cookie, redirects to /login
  globals.css                           — Tailwind v4 theme tokens (oklch color space)
components/
  ui/                                   — shadcn/ui primitives (Button, Card, Input, etc.)
  mode-toggle.tsx                       — Mock/Sandbox runtime toggle button
  mock-mode-banner.tsx                  — Orange banner shown in mock mode
  sandbox-mode-banner.tsx               — Purple banner shown in sandbox mode
  sandbox-dev-console.tsx               — Collapsible API diagnostics console
  sandbox-disclosure.tsx                — Footer with mode-aware disclosure text
  patient-selector.tsx                  — Combobox for selecting a patient
  procedure-selector.tsx                — Dropdown for selecting procedure/CPT code
  patient-card.tsx                      — Card displaying selected patient + procedure
  cost-estimate-button.tsx              — "Calculate Cost" CTA button
  loading-sequence.tsx                  — Animated 3-step loading indicator
  result-panel.tsx                      — Tabbed results (Cost Estimate, Benefits, Raw)
  cost-estimate-tab.tsx                 — Claude's cost estimate + breakdown
  cost-hero.tsx                         — Large estimated cost display
  cost-breakdown-bar.tsx                — Visual bar chart of cost components
  cost-breakdown-table.tsx              — Detailed breakdown table
  benefit-detail-tab.tsx                — Plan info, deductible, copay, coinsurance
  raw-response-tab.tsx                  — Raw JSON response viewer
  deductible-status-card.tsx            — Deductible met/remaining indicator
  visit-limit-warning.tsx               — Warning when visit limits are approaching
  authorization-flag.tsx                — Prior authorization required flag
  patient-script-panel.tsx              — Patient-facing script for front desk staff
  action-items-checklist.tsx            — Actionable next steps checklist
  timing-badges.tsx                     — API call timing display
  fallback-state.tsx                    — Shown when Claude annotation fails
  ineligible-state.tsx                  — Shown when patient is not eligible
  theme-provider.tsx                    — next-themes wrapper
  theme-toggle.tsx                      — Dark/light mode toggle
lib/
  config.ts                             — App mode detection + AppMode type
  session.ts                            — HMAC-SHA256 session tokens (Web Crypto API)
  auth.ts                               — requireAuth() / getOptionalAuth() helpers
  optum-auth.ts                         — OAuth 2.0 token management with caching
  optum-eligibility.ts                  — GraphQL eligibility query + mock fallback
  optum-benefit-check.ts                — Benefit derivation from eligibility data
  claude-benefit-interpreter.ts         — Claude API cost interpretation + mock fallback
  patients.ts                           — 7 synthetic patient definitions
  utils.ts                              — cn() helper (clsx + tailwind-merge)
  mock/
    eligibility-fixtures.ts             — Mock eligibility API responses
    benefit-check-fixtures.ts           — Mock benefit check responses
    claude-fixtures.ts                  — Mock Claude cost annotations
types/
  optum.types.ts                        — Optum GraphQL response types
  patient.types.ts                      — Patient, procedure, and scenario types
  claude.types.ts                       — Cost annotation and result types
  sandbox.types.ts                      — Sandbox narrative/logging types
middleware.ts                           — Auth guard (skipped in mock mode)
scripts/
  generate-password-hash.mjs           — One-time script to generate auth credentials
```

---

## Optum Sandbox Limitations

When running against the Optum sandbox (`NEXT_PUBLIC_APP_ENV=sandbox`), be aware of these **expected behaviors** — they are not bugs:

### Expired Test Coverage

Sandbox member IDs (990122445, 990133556, etc.) return `policyStatus: "PastPolicy"` with coverage dates in 2020. No currently-active test members exist in the sandbox. The app bypasses the eligibility gate in sandbox mode so the full pipeline can still be demonstrated.

### Masked PII

Optum's sandbox intentionally masks personally identifiable information. Member names, addresses, and other PII fields are returned as masked/redacted values.

### Sparse Benefit Data

The sandbox returns the eligibility response structure but with minimal benefit detail — plan levels, copay lists, coinsurance amounts, and service-level data are often empty or null. This means:

- Cost estimates in sandbox mode default to `$0.00` with low confidence
- Claude correctly reports "unable to determine cost from available data" rather than inventing numbers
- The `SandboxDevConsole` logs warnings about sparse data fields

### "No Response Received" Errors

Unrecognized member IDs return a GraphQL error with code `NUHC_ELIG_NO_RESP`. The app handles this gracefully with an error message.

---

## Claude AI Integration

### How It Works

The `claude-benefit-interpreter.ts` module sends a structured prompt to Claude containing:

1. Patient demographics and scenario context
2. The full eligibility response from Optum
3. The derived benefit check data
4. Estimated allowed amounts per CPT code

Claude returns a `ClaudeCostAnnotation` JSON object with:

- **Estimated total** with confidence level (HIGH/MEDIUM/LOW)
- **Cost breakdown** — 2-4 line items (copay, deductible portion, coinsurance, etc.)
- **Plain-English summary** for billing staff
- **Patient-friendly script** — 2-4 sentences staff can read to the patient verbatim
- **Action items** — Practical next steps (verify deductible, get prior auth, etc.)
- **Risk flags** — HIGH (>$2,000 deductible remaining), MEDIUM (>20% coinsurance), LOW, NONE

### Cost Calculation Rules

The system prompt enforces strict rules:

- Never invent dollar amounts — calculate only from provided data
- Apply copay if specified for the service type and network
- Apply coinsurance to the estimated allowed amount after the deductible portion
- Cap patient responsibility at the remaining out-of-pocket maximum
- Flag visit limits when 80%+ of annual visits are used
- Return $0 for preventive care covered at 100%

### Estimated Allowed Amounts

Used for coinsurance calculations when actual allowed amounts aren't in the benefit data:

| CPT Code | Procedure | Estimated Amount |
|----------|-----------|-----------------|
| 99213 | Office visit (established patient) | $185 |
| 99243 | Specialist consultation | $325 |
| 73721 | MRI knee | $1,800 |
| 99395 | Annual physical (preventive) | $250 |
| 99284 | ER visit level 4 | $2,450 |
| 90834 | Therapy session (45 min) | $150 |
| 97110 | Physical therapy | $120 |

### Fallback Behavior

If the Claude API call fails, times out (45s), or returns malformed JSON, the app displays the raw eligibility and benefit data with a fallback notice. The user still gets useful information — just without the AI interpretation layer.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_ENV` | No | `mock` (default), `sandbox`, or `production` |
| `OPTUM_CLIENT_ID` | Sandbox/production | OAuth client ID from Optum Developer Portal |
| `OPTUM_CLIENT_SECRET` | Sandbox/production | OAuth client secret |
| `OPTUM_AUTH_URL` | Sandbox/production | OAuth token endpoint |
| `OPTUM_ELIGIBILITY_URL` | Sandbox/production | GraphQL eligibility endpoint |
| `OPTUM_PROVIDER_TAX_ID` | Optional | Provider tax ID sent in request headers |
| `ANTHROPIC_API_KEY` | Sandbox/production | API key from console.anthropic.com |
| `AUTH_USERNAME` | Sandbox/production | Login username |
| `AUTH_PASSWORD_HASH` | Sandbox/production | scrypt hash generated by `scripts/generate-password-hash.mjs` |
| `AUTH_SECRET` | Sandbox/production | 64-char hex string for HMAC session signing |

---

## Extending This Starter

**Add more patients or scenarios** — Add objects matching the `SyntheticPatient` interface in `lib/patients.ts` with corresponding fixtures in `lib/mock/`.

**Add CPT/HCPCS code selection** — The procedure selector is already wired up. Add new procedure contexts to patients or create a standalone procedure database.

**Swap Claude for another model** — The interpreter in `lib/claude-benefit-interpreter.ts` is a standard fetch call to the Anthropic API. Replace it with any model that returns JSON matching the `ClaudeCostAnnotation` interface.

**Add a real user database** — The current auth system uses a single username/password from env vars. For multi-user support, replace the login route with a database-backed user store while keeping the same session token mechanism.

**Deploy to Vercel** — Set environment variables in the Vercel dashboard, push to GitHub, and deploy. The middleware, auth routes, and API routes all work on Vercel's Edge and Node.js runtimes.

## License

MIT

---

Built by [Paul Lopez](https://paullopez.ai) as a reference implementation for healthcare developers working with the Optum Real Pre-Service Eligibility API.
