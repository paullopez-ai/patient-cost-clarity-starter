import type { EligibilityResponse, MessageDetail } from '@/types/optum.types'

function emptyMessageDetail(): MessageDetail {
  return {
    isSingleMessageDetail: false,
    isViewDetail: false,
    messages: [],
    subMessages: [],
    limitationInfo: [],
    isMultipleCopaysFound: null,
    isMultipleCoinsuranceFound: null,
  }
}

export const eligibilityFixtures: Record<string, EligibilityResponse> = {
  'patient-001': {
    eligibilityInfo: {
      trnId: null,
      member: {
        memberId: 'AET88234571',
        firstName: 'Maria',
        lastName: 'Santos',
        middleName: null,
        suffix: null,
        dateOfBirth: '1985-03-14',
        gender: 'F',
        relationshipCode: '000',
        dependentSequenceNumber: '00',
        individualRelationship: { code: 'EE', description: 'subscriber' },
        relationshipType: { code: '18', description: 'Self' },
      },
      contact: {
        addresses: [{ type: 'Postal/Mailing', street1: '742 Elm Street', street2: '', city: 'Hartford', state: 'CT', country: 'US', zip: '06103', zip4: '' }],
      },
      insuranceInfo: {
        policyNumber: 'GRP-44821',
        eligibilityStartDate: '2024-01-01',
        eligibilityEndDate: '2026-12-31',
        planStartDate: '2024-01-01',
        planEndDate: '2026-12-31',
        policyStatus: 'Active',
        planTypeDescription: 'POS',
        groupName: 'Hartford Marketing Group',
        address: null,
        stateOfIssueCode: 'CT',
        productType: 'POS',
        productId: '',
        productCode: '',
        payerId: '60054',
        lineOfBusinessCode: 'E&I',
        governmentProgramCode: null,
        coverageType: 'Medical',
        insuranceTypeCode: 'PS',
        insuranceType: 'Aetna Choice POS II',
        paidThroughDate: null,
        consumerName: 'Aetna',
      },
      associatedIds: {
        alternateId: 'AET88234571', medicaidRecipientId: '', exchangeMemberId: '',
        alternateSubscriberId: '', hicNumber: '', mbiNumber: '',
        subscriberMemberFacingIdentifier: '', survivingSpouseId: '',
        subscriberId: 'AET88234571', memberReplacementId: '',
        legacyMemberId: '', healthInsuranceExchangeId: '',
      },
      planLevels: [
        {
          level: 'deductibleInfo',
          family: [{ networkStatus: 'InNetwork', planAmount: '3000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '800.00' }],
          individual: [{ networkStatus: 'InNetwork', planAmount: '1500.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '0.00' }],
        },
        {
          level: 'outOfPocketInfo',
          family: [{ networkStatus: 'InNetwork', planAmount: '8000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '5600.00' }],
          individual: [{ networkStatus: 'InNetwork', planAmount: '4000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '2800.00' }],
        },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: {
      firstName: 'Adaeze', lastName: 'Okafor', middleName: null,
      phoneNumber: '860-555-0142',
      address: { type: 'Postal/Mailing', street1: '742 Elm Street', street2: '', city: 'Hartford', state: 'CT', country: 'US', zip: '06103', zip4: '' },
      affiliateHospitalName: null, providerGroupName: 'Metro Primary Care Associates',
      pcpSpeciality: 'Internal Medicine', pcpStartDate: '2024-01-01', pcpEndDate: null,
      providerNPI: '1234567890', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null,
    },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Internal Medicine' },
    serviceLevels: [{
      vendorServices: null,
      family: [],
      individual: [{
        networkStatus: 'InNetwork',
        services: [{
          service: 'Professional (Physician) Visit — Office',
          serviceCode: '98',
          serviceDate: '',
          status: 'Active',
          planAmount: '',
          remainingAmount: '',
          metYearToDateAmount: '',
          message: {
            coPay: { ...emptyMessageDetail(), messages: ['$25 / Visit'], subMessages: [{ service: 'PCP Office Visit', status: 'Active', copay: '$25', frequency: null, msg: 'In-network PCP office visit copay', startDate: null, endDate: null, minCopay: null, minCopayMsg: null, maxCopay: null, maxCopayMsg: null, isPrimaryIndicator: false, exactCopay: null }] },
            coInsurance: emptyMessageDetail(),
            deductible: { ...emptyMessageDetail(), messages: ['Deductible fully met for plan year 2026'] },
            benefitsAllowed: emptyMessageDetail(),
            benefitsRemaining: emptyMessageDetail(),
            coPayList: [{ placeOfService: 'Office', copay: '$25 / Visit', service: 'PCP Office Visit', startDate: null, endDate: null, messages: [] }],
            coInsuranceList: [],
          },
        }],
      }],
    }],
    additionalInfo: null,
  },

  'patient-002': {
    eligibilityInfo: {
      trnId: null,
      member: {
        memberId: 'BCB56192034', firstName: 'James', lastName: 'Thompson', middleName: null, suffix: null,
        dateOfBirth: '1972-08-22', gender: 'M', relationshipCode: '000', dependentSequenceNumber: '00',
        individualRelationship: { code: 'EE', description: 'subscriber' },
        relationshipType: { code: '18', description: 'Self' },
      },
      contact: { addresses: [{ type: 'Postal/Mailing', street1: '1580 Oak Ridge Drive', street2: '', city: 'Naperville', state: 'IL', country: 'US', zip: '60540', zip4: '' }] },
      insuranceInfo: {
        policyNumber: 'GRP-77503', eligibilityStartDate: '2024-01-01', eligibilityEndDate: '2026-12-31',
        planStartDate: '2024-01-01', planEndDate: '2026-12-31', policyStatus: 'Active',
        planTypeDescription: 'PPO', groupName: 'Naperville Engineering LLC',
        address: null, stateOfIssueCode: 'IL', productType: 'PPO', productId: '', productCode: '',
        payerId: '00621', lineOfBusinessCode: 'E&I', governmentProgramCode: null,
        coverageType: 'Medical', insuranceTypeCode: 'PR', insuranceType: 'Blue Cross Blue Shield PPO',
        paidThroughDate: null, consumerName: 'Blue Cross Blue Shield of Illinois',
      },
      associatedIds: { alternateId: 'BCB56192034', medicaidRecipientId: '', exchangeMemberId: '', alternateSubscriberId: '', hicNumber: '', mbiNumber: '', subscriberMemberFacingIdentifier: '', survivingSpouseId: '', subscriberId: 'BCB56192034', memberReplacementId: '', legacyMemberId: '', healthInsuranceExchangeId: '' },
      planLevels: [
        { level: 'deductibleInfo', family: [{ networkStatus: 'InNetwork', planAmount: '4000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '2800.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '2000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '1200.00' }] },
        { level: 'outOfPocketInfo', family: [{ networkStatus: 'InNetwork', planAmount: '12000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '9000.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '6000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '4500.00' }] },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: { firstName: 'Samuel', lastName: 'Greenfield', middleName: null, phoneNumber: '630-555-0198', address: { type: 'Postal/Mailing', street1: '1580 Oak Ridge Drive', street2: '', city: 'Naperville', state: 'IL', country: 'US', zip: '60540', zip4: '' }, affiliateHospitalName: null, providerGroupName: 'Heartland Cardiology Group', pcpSpeciality: 'Family Medicine', pcpStartDate: '2024-01-01', pcpEndDate: null, providerNPI: '2345678901', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Family Medicine' },
    serviceLevels: [{ vendorServices: null, family: [], individual: [{ networkStatus: 'InNetwork', services: [{ service: 'Professional (Physician) Visit — Office', serviceCode: '98', serviceDate: '', status: 'Active', planAmount: '', remainingAmount: '', metYearToDateAmount: '', message: { coPay: emptyMessageDetail(), coInsurance: { ...emptyMessageDetail(), messages: ['20% coinsurance after deductible for specialist visits'] }, deductible: { ...emptyMessageDetail(), messages: ['$1,200 remaining of $2,000 individual deductible'] }, benefitsAllowed: emptyMessageDetail(), benefitsRemaining: emptyMessageDetail(), coPayList: [], coInsuranceList: [{ placeOfService: 'Office', coinsurancePercent: '20% / Visit', service: 'Specialist Visit', messages: [], startDate: null, endDate: null }] } }] }] }],
    additionalInfo: null,
  },

  'patient-003': {
    eligibilityInfo: {
      trnId: null,
      member: { memberId: 'UHC40283716', firstName: 'Robert', lastName: 'Yamamoto', middleName: null, suffix: null, dateOfBirth: '1968-11-05', gender: 'M', relationshipCode: '000', dependentSequenceNumber: '00', individualRelationship: { code: 'EE', description: 'subscriber' }, relationshipType: { code: '18', description: 'Self' } },
      contact: { addresses: [{ type: 'Postal/Mailing', street1: '925 Cedar Lane', street2: '', city: 'Portland', state: 'OR', country: 'US', zip: '97205', zip4: '' }] },
      insuranceInfo: { policyNumber: 'GRP-91204', eligibilityStartDate: '2024-01-01', eligibilityEndDate: '2026-12-31', planStartDate: '2024-01-01', planEndDate: '2026-12-31', policyStatus: 'Active', planTypeDescription: 'PPO', groupName: 'Portland School District 14', address: null, stateOfIssueCode: 'OR', productType: 'PPO', productId: '', productCode: '', payerId: '87726', lineOfBusinessCode: 'E&I', governmentProgramCode: null, coverageType: 'Medical', insuranceTypeCode: 'PR', insuranceType: 'UnitedHealthcare Gold PPO', paidThroughDate: null, consumerName: 'UnitedHealthcare' },
      associatedIds: { alternateId: 'UHC40283716', medicaidRecipientId: '', exchangeMemberId: '', alternateSubscriberId: '', hicNumber: '', mbiNumber: '', subscriberMemberFacingIdentifier: '', survivingSpouseId: '', subscriberId: 'UHC40283716', memberReplacementId: '', legacyMemberId: '', healthInsuranceExchangeId: '' },
      planLevels: [
        { level: 'deductibleInfo', family: [{ networkStatus: 'InNetwork', planAmount: '6000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '4200.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '3000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '1800.00' }] },
        { level: 'outOfPocketInfo', family: [{ networkStatus: 'InNetwork', planAmount: '15000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '12600.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '7500.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '6300.00' }] },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: { firstName: 'Linda', lastName: 'Reyes', middleName: null, phoneNumber: '503-555-0167', address: { type: 'Postal/Mailing', street1: '925 Cedar Lane', street2: '', city: 'Portland', state: 'OR', country: 'US', zip: '97205', zip4: '' }, affiliateHospitalName: null, providerGroupName: 'Pacific Northwest Imaging Center', pcpSpeciality: 'Internal Medicine', pcpStartDate: '2024-01-01', pcpEndDate: null, providerNPI: '3456789012', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Internal Medicine' },
    serviceLevels: [{ vendorServices: null, family: [], individual: [{ networkStatus: 'InNetwork', services: [{ service: 'MRI/CAT Scan', serviceCode: '61', serviceDate: '', status: 'Active', planAmount: '', remainingAmount: '', metYearToDateAmount: '', message: { coPay: emptyMessageDetail(), coInsurance: { ...emptyMessageDetail(), messages: ['30% coinsurance after deductible for imaging'] }, deductible: { ...emptyMessageDetail(), messages: ['$1,800 remaining of $3,000 individual deductible'], subMessages: [{ service: 'MRI', status: 'Active', copay: null, msg: 'Prior authorization required for MRI', startDate: null, endDate: null, minCopay: null, minCopayMsg: null, maxCopay: null, maxCopayMsg: null, isPrimaryIndicator: false }], limitationInfo: [{ lmtPeriod: 'Per Service', lmtType: 'Prior Authorization', lmtOccurPerPeriod: 'Required', lmtDollarPerPeriod: null, message: 'Prior Authorization Required', messages: null }] }, benefitsAllowed: emptyMessageDetail(), benefitsRemaining: emptyMessageDetail(), coPayList: [], coInsuranceList: [{ placeOfService: 'Outpatient', coinsurancePercent: '30% / Visit', service: 'Imaging', messages: [], startDate: null, endDate: null }] } }] }] }],
    additionalInfo: null,
  },

  'patient-004': {
    eligibilityInfo: {
      trnId: null,
      member: { memberId: 'CIG71529483', firstName: 'Sarah', lastName: 'Chen', middleName: null, suffix: null, dateOfBirth: '1990-06-18', gender: 'F', relationshipCode: '000', dependentSequenceNumber: '00', individualRelationship: { code: 'EE', description: 'subscriber' }, relationshipType: { code: '18', description: 'Self' } },
      contact: { addresses: [{ type: 'Postal/Mailing', street1: '3201 Mission Boulevard', street2: '', city: 'Santa Clara', state: 'CA', country: 'US', zip: '95054', zip4: '' }] },
      insuranceInfo: { policyNumber: 'GRP-33018', eligibilityStartDate: '2024-01-01', eligibilityEndDate: '2026-12-31', planStartDate: '2024-01-01', planEndDate: '2026-12-31', policyStatus: 'Active', planTypeDescription: 'HDHP', groupName: 'TechStream Inc.', address: null, stateOfIssueCode: 'CA', productType: 'HDHP', productId: '', productCode: '', payerId: '62308', lineOfBusinessCode: 'E&I', governmentProgramCode: null, coverageType: 'Medical', insuranceTypeCode: 'QM', insuranceType: 'Cigna HDHP with HSA', paidThroughDate: null, consumerName: 'Cigna Health and Life Insurance' },
      associatedIds: { alternateId: 'CIG71529483', medicaidRecipientId: '', exchangeMemberId: '', alternateSubscriberId: '', hicNumber: '', mbiNumber: '', subscriberMemberFacingIdentifier: '', survivingSpouseId: '', subscriberId: 'CIG71529483', memberReplacementId: '', legacyMemberId: '', healthInsuranceExchangeId: '' },
      planLevels: [
        { level: 'deductibleInfo', family: [{ networkStatus: 'InNetwork', planAmount: '10000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '10000.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '5000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '5000.00' }] },
        { level: 'outOfPocketInfo', family: [{ networkStatus: 'InNetwork', planAmount: '14000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '14000.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '7000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '7000.00' }] },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: { firstName: 'Michael', lastName: 'Petrov', middleName: null, phoneNumber: '408-555-0134', address: { type: 'Postal/Mailing', street1: '3201 Mission Boulevard', street2: '', city: 'Santa Clara', state: 'CA', country: 'US', zip: '95054', zip4: '' }, affiliateHospitalName: null, providerGroupName: 'Silicon Valley Primary Care', pcpSpeciality: 'Family Medicine', pcpStartDate: '2024-01-01', pcpEndDate: null, providerNPI: '4567890123', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Family Medicine' },
    serviceLevels: [{ vendorServices: null, family: [], individual: [{ networkStatus: 'InNetwork', services: [{ service: 'Preventive Care Services', serviceCode: '30', serviceDate: '', status: 'Active', planAmount: '', remainingAmount: '', metYearToDateAmount: '', message: { coPay: { ...emptyMessageDetail(), messages: ['$0 / Visit Preventive care covered at 100%'] }, coInsurance: emptyMessageDetail(), deductible: { ...emptyMessageDetail(), messages: ['Deductible does not apply to preventive care'] }, benefitsAllowed: emptyMessageDetail(), benefitsRemaining: emptyMessageDetail(), coPayList: [], coInsuranceList: [] } }] }] }],
    additionalInfo: { fundingType: 'Self-Funded', fundingArrangementDescription: null, businessSegment: null, sizeDefinitionDescription: null, revenueArrangementDescription: null, hsa: 'YES', cdhp: 'YES', cmsHId: null, cmsContractId: null, benefitPlanId: null, virtualVisit: null, hraBalance: null, hraMessage: null, medicareGuidelines: null, medicareEntitlementReason: null },
  },

  'patient-005': {
    eligibilityInfo: {
      trnId: null,
      member: { memberId: 'UHC82946351', firstName: 'Michael', lastName: 'Davis', middleName: null, suffix: null, dateOfBirth: '1980-01-30', gender: 'M', relationshipCode: '000', dependentSequenceNumber: '00', individualRelationship: { code: 'EE', description: 'subscriber' }, relationshipType: { code: '18', description: 'Self' } },
      contact: { addresses: [{ type: 'Postal/Mailing', street1: '4410 Industrial Parkway', street2: '', city: 'Columbus', state: 'OH', country: 'US', zip: '43215', zip4: '' }] },
      insuranceInfo: { policyNumber: 'GRP-58702', eligibilityStartDate: '2024-01-01', eligibilityEndDate: '2026-12-31', planStartDate: '2024-01-01', planEndDate: '2026-12-31', policyStatus: 'Active', planTypeDescription: 'PPO', groupName: 'Central Ohio Logistics Corp.', address: null, stateOfIssueCode: 'OH', productType: 'PPO', productId: '', productCode: '', payerId: '87726', lineOfBusinessCode: 'E&I', governmentProgramCode: null, coverageType: 'Medical', insuranceTypeCode: 'PR', insuranceType: 'UnitedHealthcare Choice Plus', paidThroughDate: null, consumerName: 'UnitedHealthcare' },
      associatedIds: { alternateId: 'UHC82946351', medicaidRecipientId: '', exchangeMemberId: '', alternateSubscriberId: '', hicNumber: '', mbiNumber: '', subscriberMemberFacingIdentifier: '', survivingSpouseId: '', subscriberId: 'UHC82946351', memberReplacementId: '', legacyMemberId: '', healthInsuranceExchangeId: '' },
      planLevels: [
        { level: 'deductibleInfo', family: [{ networkStatus: 'InNetwork', planAmount: '10000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '9500.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '5000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '4500.00' }] },
        { level: 'outOfPocketInfo', family: [{ networkStatus: 'InNetwork', planAmount: '16000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '15500.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '8000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '7500.00' }] },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: { firstName: 'Angela', lastName: 'Torres', middleName: null, phoneNumber: '614-555-0189', address: { type: 'Postal/Mailing', street1: '4410 Industrial Parkway', street2: '', city: 'Columbus', state: 'OH', country: 'US', zip: '43215', zip4: '' }, affiliateHospitalName: null, providerGroupName: 'Memorial Regional Emergency Department', pcpSpeciality: 'Internal Medicine', pcpStartDate: '2024-01-01', pcpEndDate: null, providerNPI: '5678901234', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Internal Medicine' },
    serviceLevels: [{ vendorServices: null, family: [], individual: [{ networkStatus: 'InNetwork', services: [{ service: 'Emergency Services', serviceCode: '86', serviceDate: '', status: 'Active', planAmount: '', remainingAmount: '', metYearToDateAmount: '', message: { coPay: { ...emptyMessageDetail(), messages: ['$350 / Visit ER copay, then deductible + 30% coinsurance'], subMessages: [{ service: 'Emergency Services', status: 'Active', copay: '$350', frequency: null, msg: 'Copay waived if admitted', startDate: null, endDate: null, minCopay: null, minCopayMsg: null, maxCopay: null, maxCopayMsg: null, isPrimaryIndicator: false, exactCopay: null }] }, coInsurance: { ...emptyMessageDetail(), messages: ['30% coinsurance after deductible for ER services'] }, deductible: { ...emptyMessageDetail(), messages: ['$4,500 remaining of $5,000 individual deductible'] }, benefitsAllowed: emptyMessageDetail(), benefitsRemaining: emptyMessageDetail(), coPayList: [{ placeOfService: 'Emergency Room', copay: '$350 / Visit', service: 'Emergency Services', startDate: null, endDate: null, messages: ['Copay waived if admitted'] }], coInsuranceList: [{ placeOfService: 'Emergency Room', coinsurancePercent: '30% / Visit', service: 'Emergency Services', messages: [], startDate: null, endDate: null }] } }] }] }],
    additionalInfo: null,
  },

  'patient-006': {
    eligibilityInfo: {
      trnId: null,
      member: { memberId: 'ANT63841927', firstName: 'Priya', lastName: 'Patel', middleName: null, suffix: null, dateOfBirth: '1993-09-07', gender: 'F', relationshipCode: '000', dependentSequenceNumber: '00', individualRelationship: { code: 'EE', description: 'subscriber' }, relationshipType: { code: '18', description: 'Self' } },
      contact: { addresses: [{ type: 'Postal/Mailing', street1: '850 Peachtree Street NE', street2: '', city: 'Atlanta', state: 'GA', country: 'US', zip: '30308', zip4: '' }] },
      insuranceInfo: { policyNumber: 'GRP-22109', eligibilityStartDate: '2024-01-01', eligibilityEndDate: '2026-12-31', planStartDate: '2024-01-01', planEndDate: '2026-12-31', policyStatus: 'Active', planTypeDescription: 'PPO', groupName: 'DesignForward Agency', address: null, stateOfIssueCode: 'GA', productType: 'PPO', productId: '', productCode: '', payerId: '14165', lineOfBusinessCode: 'E&I', governmentProgramCode: null, coverageType: 'Medical', insuranceTypeCode: 'PR', insuranceType: 'Anthem Blue Cross Blue Shield', paidThroughDate: null, consumerName: 'Anthem Blue Cross Blue Shield' },
      associatedIds: { alternateId: 'ANT63841927', medicaidRecipientId: '', exchangeMemberId: '', alternateSubscriberId: '', hicNumber: '', mbiNumber: '', subscriberMemberFacingIdentifier: '', survivingSpouseId: '', subscriberId: 'ANT63841927', memberReplacementId: '', legacyMemberId: '', healthInsuranceExchangeId: '' },
      planLevels: [
        { level: 'deductibleInfo', family: [{ networkStatus: 'InNetwork', planAmount: '4000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '800.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '2000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '0.00' }] },
        { level: 'outOfPocketInfo', family: [{ networkStatus: 'InNetwork', planAmount: '10000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '4400.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '5000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '2200.00' }] },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: { firstName: 'Rachel', lastName: 'Kim', middleName: null, phoneNumber: '404-555-0156', address: { type: 'Postal/Mailing', street1: '850 Peachtree Street NE', street2: '', city: 'Atlanta', state: 'GA', country: 'US', zip: '30308', zip4: '' }, affiliateHospitalName: null, providerGroupName: 'Mindful Wellness Center', pcpSpeciality: 'Psychiatry', pcpStartDate: '2024-01-01', pcpEndDate: null, providerNPI: '6789012345', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Psychiatry' },
    serviceLevels: [{ vendorServices: null, family: [], individual: [{ networkStatus: 'InNetwork', services: [{ service: 'Mental Health', serviceCode: 'MH', serviceDate: '', status: 'Active', planAmount: '', remainingAmount: '', metYearToDateAmount: '', message: { coPay: { ...emptyMessageDetail(), messages: ['$40 / Visit Behavioral health copay'], limitationInfo: [{ lmtPeriod: 'Plan Year', lmtType: 'Visit Limit', lmtOccurPerPeriod: '52', lmtDollarPerPeriod: null, message: '52 visits per plan year; 18 used, 34 remaining', messages: null }] }, coInsurance: { ...emptyMessageDetail(), messages: ['No coinsurance for outpatient behavioral health'] }, deductible: { ...emptyMessageDetail(), messages: ['Deductible fully met for plan year 2026'] }, benefitsAllowed: emptyMessageDetail(), benefitsRemaining: emptyMessageDetail(), coPayList: [{ placeOfService: 'Office', copay: '$40 / Visit', service: 'Behavioral Health', startDate: null, endDate: null, messages: [] }], coInsuranceList: [{ placeOfService: 'Office', coinsurancePercent: '0% / Visit', service: 'Behavioral Health', messages: ['No coinsurance — copay only'], startDate: null, endDate: null }] } }] }] }],
    additionalInfo: null,
  },

  'patient-007': {
    eligibilityInfo: {
      trnId: null,
      member: { memberId: 'HUM95073248', firstName: 'David', lastName: 'Kim', middleName: null, suffix: null, dateOfBirth: '1975-04-11', gender: 'M', relationshipCode: '000', dependentSequenceNumber: '00', individualRelationship: { code: 'EE', description: 'subscriber' }, relationshipType: { code: '18', description: 'Self' } },
      contact: { addresses: [{ type: 'Postal/Mailing', street1: '2700 Westheimer Road', street2: '', city: 'Houston', state: 'TX', country: 'US', zip: '77098', zip4: '' }] },
      insuranceInfo: { policyNumber: 'GRP-66401', eligibilityStartDate: '2024-01-01', eligibilityEndDate: '2026-12-31', planStartDate: '2024-01-01', planEndDate: '2026-12-31', policyStatus: 'Active', planTypeDescription: 'HMO', groupName: 'Gulf Coast Accounting Partners', address: null, stateOfIssueCode: 'TX', productType: 'HMO', productId: '', productCode: '', payerId: '61101', lineOfBusinessCode: 'E&I', governmentProgramCode: null, coverageType: 'Medical', insuranceTypeCode: 'HN', insuranceType: 'Humana Gold Plus HMO', paidThroughDate: null, consumerName: 'Humana' },
      associatedIds: { alternateId: 'HUM95073248', medicaidRecipientId: '', exchangeMemberId: '', alternateSubscriberId: '', hicNumber: '', mbiNumber: '', subscriberMemberFacingIdentifier: '', survivingSpouseId: '', subscriberId: 'HUM95073248', memberReplacementId: '', legacyMemberId: '', healthInsuranceExchangeId: '' },
      planLevels: [
        { level: 'deductibleInfo', family: [{ networkStatus: 'InNetwork', planAmount: '3000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '200.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '1500.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '0.00' }] },
        { level: 'outOfPocketInfo', family: [{ networkStatus: 'InNetwork', planAmount: '9000.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '4800.00' }], individual: [{ networkStatus: 'InNetwork', planAmount: '4500.00', planAmountFrequency: '(Calendar Year)', remainingAmount: '2400.00' }] },
      ],
      delegatedInfo: null,
    },
    primaryCarePhysician: { firstName: 'Brian', lastName: 'Whitfield', middleName: null, phoneNumber: '713-555-0178', address: { type: 'Postal/Mailing', street1: '2700 Westheimer Road', street2: '', city: 'Houston', state: 'TX', country: 'US', zip: '77098', zip4: '' }, affiliateHospitalName: null, providerGroupName: 'Summit Physical Therapy & Rehabilitation', pcpSpeciality: 'Orthopedics', pcpStartDate: '2024-01-01', pcpEndDate: null, providerNPI: '7890123456', providerTIN: null, acoNetworkDescription: null, acoNetworkId: null },
    providerNetwork: { status: 'In Network', tier: '1', speciality: 'Orthopedics' },
    serviceLevels: [{ vendorServices: null, family: [], individual: [{ networkStatus: 'InNetwork', services: [{ service: 'Physical Therapy', serviceCode: 'PT', serviceDate: '', status: 'Active', planAmount: '', remainingAmount: '', metYearToDateAmount: '', message: { coPay: { ...emptyMessageDetail(), messages: ['$35 / Visit PT copay'], subMessages: [{ service: 'Physical Therapy', status: 'Active', copay: '$35', frequency: null, msg: '16 of 20 visits used, 4 remaining', startDate: null, endDate: null, minCopay: null, minCopayMsg: null, maxCopay: null, maxCopayMsg: null, isPrimaryIndicator: false, exactCopay: null }], limitationInfo: [{ lmtPeriod: 'Plan Year', lmtType: 'Visit Limit', lmtOccurPerPeriod: '20', lmtDollarPerPeriod: null, message: '20 visits per plan year; 16 used, 4 remaining', messages: null }] }, coInsurance: { ...emptyMessageDetail(), messages: ['No coinsurance for PT — copay only within visit limit'] }, deductible: { ...emptyMessageDetail(), messages: ['Deductible fully met for plan year 2026'] }, benefitsAllowed: emptyMessageDetail(), benefitsRemaining: emptyMessageDetail(), coPayList: [{ placeOfService: 'Office', copay: '$35 / Visit', service: 'Physical Therapy', startDate: null, endDate: null, messages: [] }], coInsuranceList: [{ placeOfService: 'Office', coinsurancePercent: '0% / Visit', service: 'Physical Therapy', messages: ['No coinsurance — copay only within visit limit'], startDate: null, endDate: null }] } }] }] }],
    additionalInfo: null,
  },
}
