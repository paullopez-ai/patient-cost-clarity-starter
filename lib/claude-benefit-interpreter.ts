import { APP_MODE, type AppMode } from './config'
import type { ClaudeCostAnnotation } from '@/types/claude.types'
import type { EligibilityResponse, BenefitCheckResponse } from '@/types/optum.types'
import type { SyntheticPatient, ProcedureContext } from '@/types/patient.types'
import { claudeFixtures } from './mock/claude-fixtures'

const MOCK_DELAY = 1400 // ms

const SYSTEM_PROMPT = `You are a healthcare cost clarity assistant. Your job is to analyze combined insurance eligibility and benefit data and produce a structured, plain-English patient cost estimate.

Given eligibility and benefit data along with patient and procedure information, return a JSON object matching the ClaudeCostAnnotation interface.

Rules:
1. Never invent dollar amounts. Calculate from the data provided. If data is insufficient, set confidence to LOW and explain why.
2. Copay: If specified for the service type, the patient owes the copay. If deductible is not met and no copay applies, apply coinsurance to the allowed amount.
3. Coinsurance: Apply the percentage to the allowed amount AFTER the deductible portion. If deductible is met, coinsurance applies to the full allowed amount.
4. Deductible: If remaining deductible is greater than $0 and no copay applies, the patient may owe up to the remaining deductible or allowed amount, whichever is less.
5. Out-of-pocket max: Cap patient responsibility at the remaining OOP max if it is lower than the calculated amount.
6. Action items must be practical steps a patient or billing coordinator can take before or at time of service.
7. The patientFriendlyScript should be 2-4 sentences a front desk staff member could read to the patient.
8. Return ONLY valid JSON matching the ClaudeCostAnnotation interface. No markdown, no prose, no backticks.

Keep all string fields concise — under 200 characters each. The breakdown should have 2-4 items max.`

interface ClaudeBenefitInput {
  patient: {
    firstName: string
    lastName: string
    insurancePlan: string
    scenario: string
  }
  procedure: {
    code: string
    description: string
    serviceTypeCode: string
    serviceTypeLabel: string
    estimatedAllowedAmount: string
  }
  eligibilityResponse: EligibilityResponse
  benefitCheckResponse: BenefitCheckResponse
}

// Estimated allowed amounts per procedure type (used for coinsurance calculations)
const ESTIMATED_ALLOWED_AMOUNTS: Record<string, string> = {
  '99213': '$185',    // Office visit
  '99243': '$325',    // Specialist consult
  '73721': '$1,800',  // MRI knee
  '99395': '$250',    // Annual physical (preventive)
  '99284': '$2,450',  // ER visit level 4
  '90834': '$150',    // Therapy session 45min
  '97110': '$120',    // Physical therapy
}

export async function interpretBenefitData(
  patient: SyntheticPatient,
  procedure: ProcedureContext,
  eligibilityResponse: EligibilityResponse,
  benefitCheckResponse: BenefitCheckResponse,
  mode: AppMode = APP_MODE
): Promise<ClaudeCostAnnotation | null> {
  if (mode === 'mock') {
    await new Promise(r => setTimeout(r, MOCK_DELAY))
    const fixture = claudeFixtures[patient.id]
    if (!fixture) throw new Error(`No mock Claude fixture for patient ${patient.id}`)
    return fixture
  }

  // Live mode
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not configured')
    return null // Triggers fallback in route handler
  }

  const input: ClaudeBenefitInput = {
    patient: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      insurancePlan: patient.insurancePlan,
      scenario: patient.scenario,
    },
    procedure: {
      code: procedure.code,
      description: procedure.description,
      serviceTypeCode: procedure.serviceTypeCode,
      serviceTypeLabel: procedure.serviceTypeLabel,
      estimatedAllowedAmount: ESTIMATED_ALLOWED_AMOUNTS[procedure.code] || '$200',
    },
    eligibilityResponse,
    benefitCheckResponse,
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Analyze the following benefit data and produce a ClaudeCostAnnotation JSON object.\n\n${JSON.stringify(input, null, 2)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(45000), // 45s timeout — GraphQL responses are larger
    })

    if (!response.ok) {
      console.error(`Claude API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    const text = data.content?.[0]?.text
    if (!text) {
      console.error('No text content in Claude response')
      return null
    }

    // Parse JSON response — Claude may return partial or slightly malformed structure
    const raw = JSON.parse(text)

    // Ensure all required fields exist with safe defaults
    const annotation: ClaudeCostAnnotation = {
      patientOwes: {
        estimatedTotal: raw.patientOwes?.estimatedTotal ?? '$0.00',
        confidence: raw.patientOwes?.confidence ?? 'LOW',
        confidenceReason: raw.patientOwes?.confidenceReason ?? 'Sandbox data — limited benefit details available',
        breakdown: raw.patientOwes?.breakdown ?? [],
        plainEnglishSummary: raw.patientOwes?.plainEnglishSummary ?? 'Unable to determine cost from available data.',
      },
      coverageConfirmation: raw.coverageConfirmation ?? 'Coverage details limited in sandbox mode.',
      costBreakdownExplanation: raw.costBreakdownExplanation ?? '',
      deductibleStatus: raw.deductibleStatus ?? 'Deductible information not available.',
      visitLimitStatus: raw.visitLimitStatus ?? 'No visit limit information available.',
      authorizationRequired: raw.authorizationRequired ?? false,
      authorizationNote: raw.authorizationNote ?? '',
      actionItems: Array.isArray(raw.actionItems) ? raw.actionItems : [],
      patientFriendlyScript: raw.patientFriendlyScript ?? '',
      riskFlag: raw.riskFlag ?? 'NONE',
      sandboxNote: raw.sandboxNote ?? 'Results based on Optum sandbox data.',
    }
    return annotation
  } catch (error) {
    console.error('Claude interpretation failed:', error)
    return null // Triggers fallback
  }
}
