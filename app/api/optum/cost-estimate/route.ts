import { NextRequest, NextResponse } from 'next/server'
import { APP_MODE, type AppMode } from '@/lib/config'
import { getPatientById } from '@/lib/patients'
import { checkEligibility, isPatientEligible } from '@/lib/optum-eligibility'
import { checkBenefits } from '@/lib/optum-benefit-check'
import { interpretBenefitData } from '@/lib/claude-benefit-interpreter'
import type { CostEstimateResult } from '@/types/claude.types'
import type { SandboxLogEntry, SandboxNarrative } from '@/types/sandbox.types'

const VALID_MODES: AppMode[] = ['mock', 'sandbox', 'production']

function buildSandboxLogger() {
  const start = Date.now()
  const logs: SandboxLogEntry[] = []
  const startedAt = new Date().toISOString()

  function log(step: string, level: SandboxLogEntry['level'], message: string) {
    logs.push({ offsetMs: Date.now() - start, step, level, message })
  }

  function finish(): SandboxNarrative {
    return {
      logs,
      startedAt,
      completedAt: new Date().toISOString(),
      totalMs: Date.now() - start,
    }
  }

  return { log, finish }
}

export async function POST(request: NextRequest) {
  try {
    const { patientId, mode: requestedMode } = await request.json()

    // Use requested mode if valid, otherwise fall back to env default
    const mode: AppMode = VALID_MODES.includes(requestedMode) ? requestedMode : APP_MODE
    const isSandbox = mode === 'sandbox'

    const patient = getPatientById(patientId)
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const procedure = patient.procedureContext
    const sbx = isSandbox ? buildSandboxLogger() : null

    // Step 1: Eligibility check with timing
    sbx?.log('auth', 'info', 'Requesting OAuth token from Optum sandbox token endpoint')
    const eligibilityStart = Date.now()
    const eligibilityResponse = await checkEligibility(patient, mode)
    const eligibilityMs = Date.now() - eligibilityStart
    sbx?.log('auth', 'success', `OAuth token acquired (${eligibilityMs}ms)`)
    sbx?.log('eligibility', 'info', `Querying eligibility for member ${patient.memberId}`)
    const policyStatus = eligibilityResponse.eligibilityInfo?.insuranceInfo?.policyStatus ?? 'unknown'
    sbx?.log('eligibility', 'success', `Eligibility response received — policyStatus: ${policyStatus}`)

    if (isSandbox && policyStatus.toLowerCase() !== 'active') {
      sbx?.log('eligibility', 'warn', 'Sandbox returns expired/inactive coverage dates (expected PastPolicy behavior)')
    }

    // Check if patient is eligible — if not, short-circuit
    if (!isPatientEligible(eligibilityResponse, mode)) {
      sbx?.log('eligibility', 'explain', 'Patient ineligible — pipeline short-circuited before benefit check')
      return NextResponse.json({
        status: 'ineligible',
        eligibility: eligibilityResponse,
        patient,
        timing: { eligibilityMs, benefitCheckMs: 0, costEstimateMs: 0, totalMs: eligibilityMs },
        ...(sbx && { sandboxNarrative: sbx.finish() }),
      })
    }

    // Step 2: Benefit check with timing
    sbx?.log('benefits', 'info', 'Deriving benefit data from eligibility response')
    const benefitStart = Date.now()
    const benefitCheckResponse = await checkBenefits(patient, procedure, eligibilityResponse, mode)
    const benefitCheckMs = Date.now() - benefitStart
    sbx?.log('benefits', 'success', `Benefit check completed (${benefitCheckMs}ms)`)

    if (isSandbox) {
      sbx?.log('benefits', 'warn', 'Sandbox benefit fields may be sparse — copay/coinsurance data often empty')
    }

    // Step 3: Claude annotation with timing and fallback
    let costEstimate = null
    let costEstimateMs = 0
    try {
      sbx?.log('claude', 'info', 'Sending benefit data to Claude for cost interpretation')
      const claudeStart = Date.now()
      costEstimate = await interpretBenefitData(patient, procedure, eligibilityResponse, benefitCheckResponse, mode)
      costEstimateMs = Date.now() - claudeStart
      sbx?.log('claude', 'success', `Claude interpretation completed (${costEstimateMs}ms)`)
      if (isSandbox) {
        sbx?.log('claude', 'warn', 'Estimate confidence is low due to sparse sandbox benefit data')
      }
    } catch (e) {
      console.error('Claude annotation failed:', e)
      sbx?.log('claude', 'error', `Claude annotation failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }

    const totalMs = eligibilityMs + benefitCheckMs + costEstimateMs

    if (!costEstimate) {
      sbx?.log('pipeline', 'explain', 'Claude failed — returning raw eligibility + benefit data as fallback')
      return NextResponse.json({
        status: 'fallback',
        eligibility: eligibilityResponse,
        benefitCheck: benefitCheckResponse,
        patient,
        timing: { eligibilityMs, benefitCheckMs, costEstimateMs: 0, totalMs },
        ...(sbx && { sandboxNarrative: sbx.finish() }),
      })
    }

    sbx?.log('pipeline', 'success', `Full pipeline completed in ${totalMs}ms`)

    const result: CostEstimateResult = {
      eligibility: eligibilityResponse,
      benefitCheck: benefitCheckResponse,
      costEstimate,
      patient,
      timing: { eligibilityMs, benefitCheckMs, costEstimateMs, totalMs },
      mode,
    }

    return NextResponse.json({
      status: 'success',
      ...result,
      ...(sbx && { sandboxNarrative: sbx.finish() }),
    })
  } catch (error) {
    console.error('Cost estimate error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
