import { APP_MODE, type AppMode } from './config'
import type { BenefitCheckResponse, EligibilityResponse } from '@/types/optum.types'
import type { SyntheticPatient, ProcedureContext } from '@/types/patient.types'
import { benefitCheckFixtures } from './mock/benefit-check-fixtures'

const MOCK_DELAY = 420 // ms

/**
 * In mock mode, returns the fixture data.
 * In live mode, derives a BenefitCheckResponse from the GraphQL eligibility response
 * since the Optum Real API returns all benefit data in the single eligibility call.
 */
export async function checkBenefits(
  patient: SyntheticPatient,
  procedure: ProcedureContext,
  eligibilityResponse?: EligibilityResponse,
  mode: AppMode = APP_MODE
): Promise<BenefitCheckResponse> {
  if (mode === 'mock') {
    await new Promise(r => setTimeout(r, MOCK_DELAY))
    const fixture = benefitCheckFixtures[patient.id]
    if (!fixture) throw new Error(`No mock benefit check fixture for patient ${patient.id}`)
    return fixture
  }

  if (!eligibilityResponse) {
    throw new Error('Eligibility response is required for live benefit check')
  }

  return deriveBenefitCheck(patient, procedure, eligibilityResponse)
}

function deriveBenefitCheck(
  patient: SyntheticPatient,
  _procedure: ProcedureContext,
  elig: EligibilityResponse
): BenefitCheckResponse {
  const info = elig.eligibilityInfo
  const insurance = info?.insuranceInfo
  const planLevels = info?.planLevels ?? []

  // Extract deductible and OOP from planLevels
  const deductibleLevel = planLevels.find(pl => pl.level.toLowerCase().includes('deductible'))
  const oopLevel = planLevels.find(pl =>
    pl.level.toLowerCase().includes('outofpocket') || pl.level.toLowerCase().includes('out of pocket')
  )

  const fallbackLevel = planLevels[0]

  const findInNetwork = (details: { networkStatus: string; planAmount: string; remainingAmount: string }[]) =>
    details.find(d => d.networkStatus.toLowerCase().includes('innetwork') || d.networkStatus.toLowerCase().includes('in network')) ?? details[0]

  const deductIndividual = findInNetwork(deductibleLevel?.individual ?? fallbackLevel?.individual ?? [])
  const deductFamily = findInNetwork(deductibleLevel?.family ?? fallbackLevel?.family ?? [])
  const oopIndividual = findInNetwork(oopLevel?.individual ?? [])
  const oopFamily = findInNetwork(oopLevel?.family ?? [])

  // Extract copay and coinsurance from serviceLevels
  const copays: BenefitCheckResponse['copay'] = []
  const coinsurances: BenefitCheckResponse['coinsurance'] = []
  const benefitDetails: BenefitCheckResponse['benefitDetails'] = []

  for (const slGroup of (elig.serviceLevels ?? [])) {
    for (const nsl of (slGroup.individual ?? [])) {
      for (const svc of (nsl.services ?? [])) {
        const msg = svc.message
        if (!msg) continue

        // Extract copays from coPayList
        for (const cp of (msg.coPayList ?? [])) {
          copays.push({
            amount: cp.copay,
            serviceType: svc.service,
            description: cp.service || svc.service,
          })
        }

        // Extract coinsurance from coInsuranceList
        for (const ci of (msg.coInsuranceList ?? [])) {
          coinsurances.push({
            percentage: ci.coinsurancePercent,
            serviceType: svc.service,
            description: ci.service || svc.service,
          })
        }

        // Build benefit detail
        const description = [
          ...(msg.coPay?.messages ?? []),
          ...(msg.coInsurance?.messages ?? []),
          ...(msg.deductible?.messages ?? []),
        ].filter(Boolean).join('; ') || svc.service

        const copayAmount = msg.coPayList?.[0]?.copay ?? '0.00'

        benefitDetails.push({
          serviceTypeCode: svc.serviceCode,
          serviceTypeDescription: svc.service,
          inPlanNetwork: nsl.networkStatus.toLowerCase().includes('innetwork') ? 'Y' : 'N',
          coverageLevel: 'Individual',
          benefitAmount: copayAmount,
          benefitDescription: description,
          limitations: (msg.coPay?.limitationInfo ?? []).map(li => ({
            limitationType: li.lmtType ?? 'Limitation',
            limitationValue: li.lmtOccurPerPeriod ?? li.message ?? '',
            limitationUnit: 'N/A',
            limitationPeriod: li.lmtPeriod ?? 'N/A',
            used: 'N/A',
            remaining: 'N/A',
          })),
        })
      }
    }
  }

  // Calculate met amounts: met = total - remaining
  const calcMet = (total: string | undefined, remaining: string | undefined) => {
    const t = parseFloat(total ?? '0')
    const r = parseFloat(remaining ?? '0')
    return (t - r).toFixed(2)
  }

  return {
    controlNumber: `BEN-${Date.now()}`,
    payerId: insurance?.payerId ?? patient.payerId,
    subscriber: {
      memberId: info?.member?.memberId ?? patient.memberId,
      firstName: info?.member?.firstName ?? patient.firstName,
      lastName: info?.member?.lastName ?? patient.lastName,
      dateOfBirth: info?.member?.dateOfBirth ?? patient.dateOfBirth,
    },
    payer: {
      payerName: insurance?.insuranceType ?? insurance?.consumerName ?? 'Unknown',
      payerIdentifier: insurance?.payerId ?? '',
    },
    planInformation: {
      groupNumber: insurance?.policyNumber ?? '',
      groupDescription: insurance?.groupName ?? '',
      planType: insurance?.planTypeDescription ?? insurance?.productType ?? '',
      planName: insurance?.insuranceType ?? insurance?.planTypeDescription ?? '',
    },
    benefitDetails,
    deductible: {
      individual: {
        total: deductIndividual?.planAmount ?? '0.00',
        met: calcMet(deductIndividual?.planAmount, deductIndividual?.remainingAmount),
        remaining: deductIndividual?.remainingAmount ?? '0.00',
      },
      family: {
        total: deductFamily?.planAmount ?? '0.00',
        met: calcMet(deductFamily?.planAmount, deductFamily?.remainingAmount),
        remaining: deductFamily?.remainingAmount ?? '0.00',
      },
    },
    outOfPocketMax: {
      individual: {
        total: oopIndividual?.planAmount ?? '0.00',
        met: calcMet(oopIndividual?.planAmount, oopIndividual?.remainingAmount),
        remaining: oopIndividual?.remainingAmount ?? '0.00',
      },
      family: {
        total: oopFamily?.planAmount ?? '0.00',
        met: calcMet(oopFamily?.planAmount, oopFamily?.remainingAmount),
        remaining: oopFamily?.remainingAmount ?? '0.00',
      },
    },
    copay: copays,
    coinsurance: coinsurances,
  }
}
