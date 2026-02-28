// ── GraphQL Eligibility Types (Optum Real Pre-Service Eligibility API) ──
// Field names match the actual Optum GraphQL schema from the dev portal

export interface EligibilityInput {
  memberId: string
  firstName: string
  lastName: string
  groupNumber: string
  dateOfBirth: string
  serviceStartDate: string
  serviceEndDate: string
  payerId: string
  providerNPI: string
  providerFirstName: string
  providerLastName: string
  serviceLevelCodes: string[]
}

export interface GraphQLEligibilityResponse {
  data: {
    checkEligibility: {
      eligibility: EligibilityResponse[]
    }
  }
}

export interface EligibilityResponse {
  eligibilityInfo: EligibilityInfo
  primaryCarePhysician: PrimaryCarePhysician | null
  providerNetwork: ProviderNetwork | null
  serviceLevels: ServiceLevelGroup[]
  additionalInfo: AdditionalInfo | null
}

// ── eligibilityInfo (type: EligibilityBasic) ──

export interface EligibilityInfo {
  trnId: string | null
  member: MemberInfo
  contact: ContactInfo | null
  insuranceInfo: InsuranceInfo
  associatedIds: AssociatedIds | null
  planLevels: PlanLevel[]
  delegatedInfo: DelegatedInfoItem[] | null
}

export interface MemberInfo {
  memberId: string
  firstName: string
  lastName: string
  middleName: string | null
  suffix: string | null
  dateOfBirth: string
  gender: string | null
  relationshipCode: string | null
  dependentSequenceNumber: string | null
  individualRelationship: CodeDescription | null
  relationshipType: CodeDescription | null
}

export interface CodeDescription {
  code: string
  description: string
}

export interface ContactInfo {
  addresses: Address[] | null
}

export interface Address {
  type: string | null
  street1: string | null
  street2: string | null
  city: string | null
  state: string | null
  country: string | null
  zip: string | null
  zip4: string | null
}

export interface InsuranceInfo {
  policyNumber: string | null
  eligibilityStartDate: string | null
  eligibilityEndDate: string | null
  planStartDate: string | null
  planEndDate: string | null
  policyStatus: string
  planTypeDescription: string | null
  groupName: string | null
  address: Address | null
  stateOfIssueCode: string | null
  productType: string | null
  productId: string | null
  productCode: string | null
  payerId: string | null
  lineOfBusinessCode: string | null
  governmentProgramCode: string | null
  coverageType: string | null
  insuranceTypeCode: string | null
  insuranceType: string | null
  paidThroughDate: string | null
  consumerName: string | null
}

export interface AssociatedIds {
  alternateId: string | null
  medicaidRecipientId: string | null
  exchangeMemberId: string | null
  alternateSubscriberId: string | null
  hicNumber: string | null
  mbiNumber: string | null
  subscriberMemberFacingIdentifier: string | null
  survivingSpouseId: string | null
  subscriberId: string | null
  memberReplacementId: string | null
  legacyMemberId: string | null
  healthInsuranceExchangeId: string | null
}

export interface PlanLevel {
  level: string
  family: PlanLevelDetail[]
  individual: PlanLevelDetail[]
}

export interface PlanLevelDetail {
  networkStatus: string
  planAmount: string
  planAmountFrequency: string | null
  remainingAmount: string
}

export interface DelegatedInfoItem {
  entity: string | null
  payerId: string | null
  contact: { phone: string | null; fax: string | null; email: string | null } | null
  addresses: Address[] | null
}

// ── primaryCarePhysician ──

export interface PrimaryCarePhysician {
  lastName: string | null
  firstName: string | null
  middleName: string | null
  phoneNumber: string | null
  address: Address | null
  affiliateHospitalName: string | null
  providerGroupName: string | null
  pcpSpeciality: string | null
  pcpStartDate: string | null
  pcpEndDate: string | null
  providerNPI: string | null
  providerTIN: string | null
  acoNetworkDescription: string | null
  acoNetworkId: string | null
}

// ── providerNetwork ──

export interface ProviderNetwork {
  status: string | null
  tier: string | null
  speciality: string | null
}

// ── serviceLevels ──

export interface ServiceLevelGroup {
  vendorServices: VendorService[] | null
  family: NetworkServiceLevel[]
  individual: NetworkServiceLevel[]
}

export interface VendorService {
  key: string | null
  vendorName: string | null
  url: string | null
  phone: string | null
  serviceDescription: string | null
  serviceTypeCode: string | null
}

export interface NetworkServiceLevel {
  networkStatus: string
  services: ServiceDetail[]
}

export interface ServiceDetail {
  service: string
  serviceCode: string
  serviceDate: string | null
  status: string | null
  planAmount: string | null
  remainingAmount: string | null
  metYearToDateAmount: string | null
  message: ServiceMessages
}

export interface ServiceMessages {
  coPay: MessageDetail
  coInsurance: MessageDetail
  deductible: MessageDetail
  benefitsAllowed: MessageDetail
  benefitsRemaining: MessageDetail
  coPayList: CoPayListItem[]
  coInsuranceList: CoInsuranceListItem[]
}

export interface MessageDetail {
  isSingleMessageDetail: boolean | null
  isViewDetail: boolean | null
  messages: string[]
  subMessages: SubMessage[]
  limitationInfo: LimitationInfo[]
  isMultipleCopaysFound: boolean | null
  isMultipleCoinsuranceFound: boolean | null
}

export interface SubMessage {
  service: string | null
  status: string | null
  copay: string | null
  frequency?: string | null
  msg: string | null
  startDate: string | null
  endDate: string | null
  minCopay: string | null
  minCopayMsg: string | null
  maxCopay: string | null
  maxCopayMsg: string | null
  isPrimaryIndicator: boolean | null
  exactCopay?: ExactCopay | null
}

export interface ExactCopay {
  coveredStatus: string | null
  copayDetails: { amount: string; serviceSetting: string }[] | null
}

export interface LimitationInfo {
  lmtPeriod: string | null
  lmtType: string | null
  lmtOccurPerPeriod: string | null
  lmtDollarPerPeriod: string | null
  message: string | null
  messages?: string[] | null
}

export interface CoPayListItem {
  placeOfService: string | null
  copay: string
  service: string | null
  startDate: string | null
  endDate: string | null
  messages: string[] | null
}

export interface CoInsuranceListItem {
  placeOfService: string | null
  coinsurancePercent: string
  service: string | null
  messages: string[] | null
  startDate: string | null
  endDate: string | null
}

export interface AdditionalInfo {
  fundingType: string | null
  fundingArrangementDescription: string | null
  businessSegment: string | null
  sizeDefinitionDescription: string | null
  revenueArrangementDescription: string | null
  hsa: string | null
  cdhp: string | null
  cmsHId: string | null
  cmsContractId: string | null
  benefitPlanId: string | null
  virtualVisit: string | null
  hraBalance: string | null
  hraMessage: string | null
  medicareGuidelines: boolean | null
  medicareEntitlementReason: string | null
}

// ── Benefit Check Types (derived from GraphQL eligibility in live mode) ──

export interface BenefitCheckSubscriber {
  memberId: string
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface BenefitCheckPayer {
  payerName: string
  payerIdentifier: string
}

export interface PlanInformation {
  groupNumber: string
  groupDescription: string
  planType: string
  planName: string
}

export interface BenefitLimitation {
  limitationType: string
  limitationValue: string
  limitationUnit: string
  limitationPeriod: string
  used: string
  remaining: string
}

export interface BenefitDetail {
  serviceTypeCode: string
  serviceTypeDescription: string
  inPlanNetwork: string
  coverageLevel: string
  benefitAmount: string
  benefitDescription: string
  limitations: BenefitLimitation[]
}

export interface DeductibleAccumulator {
  total: string
  met: string
  remaining: string
}

export interface DeductibleInfo {
  individual: DeductibleAccumulator
  family: DeductibleAccumulator
}

export interface OutOfPocketMax {
  individual: DeductibleAccumulator
  family: DeductibleAccumulator
}

export interface CopayInfo {
  amount: string
  serviceType: string
  description: string
}

export interface CoinsuranceInfo {
  percentage: string
  serviceType: string
  description: string
}

export interface BenefitCheckResponse {
  controlNumber: string
  payerId: string
  subscriber: BenefitCheckSubscriber
  payer: BenefitCheckPayer
  planInformation: PlanInformation
  benefitDetails: BenefitDetail[]
  deductible: DeductibleInfo
  outOfPocketMax: OutOfPocketMax
  copay: CopayInfo[]
  coinsurance: CoinsuranceInfo[]
}
