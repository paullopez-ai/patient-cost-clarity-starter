import type { EligibilityResponse, BenefitCheckResponse } from './optum.types'
import type { SyntheticPatient } from './patient.types'

export interface CostBreakdownItem {
  label: string
  amount: string
  amountNumeric: number
  explanation: string
  visualColor: string
}

export interface PatientOwes {
  estimatedTotal: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  confidenceReason: string
  breakdown: CostBreakdownItem[]
  plainEnglishSummary: string
}

export interface ClaudeCostAnnotation {
  patientOwes: PatientOwes
  coverageConfirmation: string
  costBreakdownExplanation: string
  deductibleStatus: string
  visitLimitStatus: string
  authorizationRequired: boolean
  authorizationNote: string
  actionItems: string[]
  patientFriendlyScript: string
  riskFlag: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'
  sandboxNote: string
}

export interface TimingData {
  eligibilityMs: number
  benefitCheckMs: number
  costEstimateMs: number
  totalMs: number
}

export interface CostEstimateResult {
  eligibility: EligibilityResponse
  benefitCheck: BenefitCheckResponse
  costEstimate: ClaudeCostAnnotation
  patient: SyntheticPatient
  timing: TimingData
  mode: 'mock' | 'sandbox' | 'production'
}

export type AppState =
  | { status: 'idle' }
  | { status: 'loading'; step: string }
  | { status: 'success'; result: CostEstimateResult }
  | { status: 'error'; error: string }

export type ActiveTab = 'overview' | 'eligibility' | 'benefits' | 'cost' | 'script'
