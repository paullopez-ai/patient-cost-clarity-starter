export type CostScenario =
  | 'ROUTINE_VISIT_LOW_COST'
  | 'SPECIALIST_MID_RANGE'
  | 'IMAGING_HIGH_COST'
  | 'PREVENTIVE_ZERO_COST'
  | 'EMERGENCY_HIGH_EXPOSURE'
  | 'BEHAVIORAL_HEALTH_CARVEOUT'
  | 'THERAPY_LIMIT_APPROACHING'

export interface ProcedureContext {
  code: string
  description: string
  serviceTypeCode: string
  serviceTypeLabel: string
  typicalDuration: string
}

export interface SyntheticPatient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  memberId: string
  groupNumber: string
  payerId: string
  insurancePlan: string
  primaryCareProvider: string
  scenario: CostScenario
  scenarioLabel: string
  scenarioDescription: string
  procedureContext: ProcedureContext
  subscriberFirstName: string
  subscriberLastName: string
  subscriberDob: string
  npi: string
  mockEligibilityScenario: string
  mockBenefitScenario: string
}
