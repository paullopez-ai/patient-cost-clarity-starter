import { APP_MODE, type AppMode } from './config'
import type { EligibilityInput, EligibilityResponse, GraphQLEligibilityResponse } from '@/types/optum.types'
import type { SyntheticPatient } from '@/types/patient.types'
import { getOptumBearerToken } from './optum-auth'
import { eligibilityFixtures } from './mock/eligibility-fixtures'

const MOCK_DELAY = 280 // ms

const ELIGIBILITY_QUERY = `
query CheckEligibility($input: EligibilityInput!) {
  checkEligibility(input: $input) {
    eligibility {
      eligibilityInfo {
        trnId
        member {
          memberId
          firstName
          lastName
          middleName
          suffix
          dateOfBirth
          gender
          relationshipCode
          dependentSequenceNumber
          individualRelationship {
            code
            description
          }
          relationshipType {
            code
            description
          }
        }
        contact {
          addresses {
            type
            street1
            street2
            city
            state
            country
            zip
            zip4
          }
        }
        insuranceInfo {
          policyNumber
          eligibilityStartDate
          eligibilityEndDate
          planStartDate
          planEndDate
          policyStatus
          planTypeDescription
          groupName
          address {
            type
            street1
            street2
            city
            state
            country
            zip
            zip4
          }
          stateOfIssueCode
          productType
          productId
          productCode
          payerId
          lineOfBusinessCode
          governmentProgramCode
          coverageType
          insuranceTypeCode
          insuranceType
          paidThroughDate
          consumerName
        }
        associatedIds {
          alternateId
          medicaidRecipientId
          exchangeMemberId
          alternateSubscriberId
          hicNumber
          mbiNumber
          subscriberMemberFacingIdentifier
          survivingSpouseId
          subscriberId
          memberReplacementId
          legacyMemberId
          healthInsuranceExchangeId
        }
        planLevels {
          level
          family {
            networkStatus
            planAmount
            planAmountFrequency
            remainingAmount
          }
          individual {
            networkStatus
            planAmount
            planAmountFrequency
            remainingAmount
          }
        }
        delegatedInfo {
          entity
          payerId
          contact {
            phone
            fax
            email
          }
          addresses {
            type
            street1
            street2
            city
            state
            country
            zip
            zip4
          }
        }
      }
      primaryCarePhysician {
        lastName
        firstName
        middleName
        phoneNumber
        address {
          type
          street1
          street2
          city
          state
          country
          zip
          zip4
        }
        affiliateHospitalName
        providerGroupName
        pcpSpeciality
        pcpStartDate
        pcpEndDate
        providerNPI
        providerTIN
        acoNetworkDescription
        acoNetworkId
      }
      providerNetwork {
        status
        tier
        speciality
      }
      serviceLevels {
        vendorServices {
          key
          vendorName
          url
          phone
          serviceDescription
          serviceTypeCode
        }
        family {
          networkStatus
          services {
            service
            serviceCode
            serviceDate
            status
            planAmount
            remainingAmount
            metYearToDateAmount
            message {
              coPay {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  frequency
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                  exactCopay {
                    coveredStatus
                    copayDetails {
                      amount
                      serviceSetting
                    }
                  }
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              coInsurance {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              deductible {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              benefitsAllowed {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              benefitsRemaining {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              coPayList {
                placeOfService
                copay
                service
                startDate
                endDate
                messages
              }
              coInsuranceList {
                placeOfService
                coinsurancePercent
                service
                messages
                startDate
                endDate
              }
            }
          }
        }
        individual {
          networkStatus
          services {
            service
            serviceCode
            serviceDate
            status
            planAmount
            remainingAmount
            metYearToDateAmount
            message {
              coPay {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  frequency
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                  exactCopay {
                    coveredStatus
                    copayDetails {
                      amount
                      serviceSetting
                    }
                  }
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              coInsurance {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              deductible {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              benefitsAllowed {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              benefitsRemaining {
                isSingleMessageDetail
                isViewDetail
                messages
                subMessages {
                  service
                  status
                  copay
                  msg
                  startDate
                  endDate
                  minCopay
                  minCopayMsg
                  maxCopay
                  maxCopayMsg
                  isPrimaryIndicator
                }
                limitationInfo {
                  lmtPeriod
                  lmtType
                  lmtOccurPerPeriod
                  lmtDollarPerPeriod
                  message
                  messages
                }
                isMultipleCopaysFound
                isMultipleCoinsuranceFound
              }
              coPayList {
                placeOfService
                copay
                service
                startDate
                endDate
                messages
              }
              coInsuranceList {
                placeOfService
                coinsurancePercent
                service
                messages
                startDate
                endDate
              }
            }
          }
        }
      }
      additionalInfo {
        fundingType
        fundingArrangementDescription
        businessSegment
        sizeDefinitionDescription
        revenueArrangementDescription
        hsa
        cdhp
        cmsHId
        cmsContractId
        benefitPlanId
        virtualVisit
        hraBalance
        hraMessage
        medicareGuidelines
        medicareEntitlementReason
      }
    }
  }
}
`

function buildEligibilityVariables(patient: SyntheticPatient): { input: EligibilityInput } {
  const today = new Date().toISOString().split('T')[0]
  return {
    input: {
      memberId: patient.memberId,
      firstName: patient.subscriberFirstName,
      lastName: patient.subscriberLastName,
      groupNumber: patient.groupNumber,
      dateOfBirth: patient.subscriberDob.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
      serviceStartDate: today,
      serviceEndDate: today,
      payerId: patient.payerId,
      providerNPI: patient.npi,
      providerFirstName: 'Sample',
      providerLastName: 'Provider',
      serviceLevelCodes: [patient.procedureContext.serviceTypeCode],
    },
  }
}

export async function checkEligibility(patient: SyntheticPatient, mode: AppMode = APP_MODE): Promise<EligibilityResponse> {
  if (mode === 'mock') {
    await new Promise(r => setTimeout(r, MOCK_DELAY))
    const fixture = eligibilityFixtures[patient.id]
    if (!fixture) throw new Error(`No mock eligibility fixture for patient ${patient.id}`)
    return fixture
  }

  const token = await getOptumBearerToken(mode)
  const eligibilityUrl = process.env.OPTUM_ELIGIBILITY_URL
  const providerTaxId = process.env.OPTUM_PROVIDER_TAX_ID

  if (!eligibilityUrl) {
    throw new Error('OPTUM_ELIGIBILITY_URL is not configured')
  }

  const variables = buildEligibilityVariables(patient)

  const response = await fetch(eligibilityUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(providerTaxId ? { providerTaxId } : {}),
      'x-optum-consumer-correlation-id': `eligibility-starter-${Date.now()}`,
      environment: 'sandbox',
    },
    body: JSON.stringify({
      query: ELIGIBILITY_QUERY,
      variables,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Eligibility API error response:', errorBody)
    throw new Error(`Eligibility check failed: ${response.status} ${response.statusText} — ${errorBody}`)
  }

  const graphqlResponse: GraphQLEligibilityResponse = await response.json()

  // GraphQL can return errors alongside data
  if ((graphqlResponse as unknown as { errors?: unknown[] }).errors) {
    console.error('GraphQL errors:', JSON.stringify((graphqlResponse as unknown as { errors: unknown[] }).errors, null, 2))
  }

  const eligibility = graphqlResponse.data?.checkEligibility?.eligibility?.[0]
  if (!eligibility) {
    throw new Error('No eligibility record returned from Optum API')
  }

  return eligibility
}

export function isPatientEligible(response: EligibilityResponse, mode: AppMode = APP_MODE): boolean {
  // In sandbox mode, always treat as eligible so we can demo the full pipeline
  // (Optum sandbox test members have expired "PastPolicy" coverage)
  if (mode === 'sandbox') return true

  const status = response.eligibilityInfo?.insuranceInfo?.policyStatus?.toLowerCase() ?? ''
  // If we can't determine status, treat as ineligible
  if (!status) return false
  return !status.includes('past') && !status.includes('terminated') && !status.includes('inactive')
}
