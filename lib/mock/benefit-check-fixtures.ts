import type { BenefitCheckResponse } from '@/types/optum.types'

export const benefitCheckFixtures: Record<string, BenefitCheckResponse> = {
  'patient-001': {
    controlNumber: '200000000001',
    payerId: 'AETNA',
    subscriber: {
      memberId: 'AET88234571',
      firstName: 'Maria',
      lastName: 'Santos',
      dateOfBirth: '1985-03-14',
    },
    payer: {
      payerName: 'Aetna',
      payerIdentifier: '60054',
    },
    planInformation: {
      groupNumber: 'GRP-44821',
      groupDescription: 'Hartford Marketing Group',
      planType: 'POS',
      planName: 'Aetna Choice POS II',
    },
    benefitDetails: [
      {
        serviceTypeCode: '98',
        serviceTypeDescription: 'Professional (Physician) Visit — Office',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '25.00',
        benefitDescription: 'In-network PCP office visit copay',
        limitations: [],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Deductible met — no additional deductible applies',
        limitations: [],
      },
      {
        serviceTypeCode: '98',
        serviceTypeDescription: 'Specialist Visit',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '50.00',
        benefitDescription: 'In-network specialist copay',
        limitations: [],
      },
    ],
    deductible: {
      individual: { total: '1500.00', met: '1500.00', remaining: '0.00' },
      family: { total: '3000.00', met: '2200.00', remaining: '800.00' },
    },
    outOfPocketMax: {
      individual: { total: '4000.00', met: '1200.00', remaining: '2800.00' },
      family: { total: '8000.00', met: '2400.00', remaining: '5600.00' },
    },
    copay: [
      { amount: '25.00', serviceType: 'PCP Office Visit', description: 'In-network primary care visit' },
      { amount: '50.00', serviceType: 'Specialist Visit', description: 'In-network specialist visit' },
      { amount: '250.00', serviceType: 'Emergency Room', description: 'ER visit copay, waived if admitted' },
    ],
    coinsurance: [
      { percentage: '20', serviceType: 'After Deductible', description: '20% coinsurance after deductible for most services' },
    ],
  },

  'patient-002': {
    controlNumber: '200000000002',
    payerId: 'BCBS',
    subscriber: {
      memberId: 'BCB56192034',
      firstName: 'James',
      lastName: 'Thompson',
      dateOfBirth: '1972-08-22',
    },
    payer: {
      payerName: 'Blue Cross Blue Shield of Illinois',
      payerIdentifier: '00621',
    },
    planInformation: {
      groupNumber: 'GRP-77503',
      groupDescription: 'Naperville Engineering LLC',
      planType: 'PPO',
      planName: 'Blue Cross Blue Shield PPO',
    },
    benefitDetails: [
      {
        serviceTypeCode: '98',
        serviceTypeDescription: 'Specialist Visit',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Specialist subject to deductible then 20% coinsurance, no copay',
        limitations: [],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '1200.00',
        benefitDescription: 'Remaining individual deductible',
        limitations: [],
      },
      {
        serviceTypeCode: '98',
        serviceTypeDescription: 'Professional (Physician) Visit — Office',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '30.00',
        benefitDescription: 'In-network PCP copay (not applicable to specialist)',
        limitations: [],
      },
    ],
    deductible: {
      individual: { total: '2000.00', met: '800.00', remaining: '1200.00' },
      family: { total: '4000.00', met: '1200.00', remaining: '2800.00' },
    },
    outOfPocketMax: {
      individual: { total: '6000.00', met: '1500.00', remaining: '4500.00' },
      family: { total: '12000.00', met: '3000.00', remaining: '9000.00' },
    },
    copay: [
      { amount: '30.00', serviceType: 'PCP Office Visit', description: 'In-network PCP visit' },
    ],
    coinsurance: [
      { percentage: '20', serviceType: 'After Deductible', description: '20% coinsurance for in-network specialist and most services' },
    ],
  },

  'patient-003': {
    controlNumber: '200000000003',
    payerId: 'UHC',
    subscriber: {
      memberId: 'UHC40283716',
      firstName: 'Robert',
      lastName: 'Yamamoto',
      dateOfBirth: '1968-11-05',
    },
    payer: {
      payerName: 'UnitedHealthcare',
      payerIdentifier: '87726',
    },
    planInformation: {
      groupNumber: 'GRP-91204',
      groupDescription: 'Portland School District 14',
      planType: 'PPO',
      planName: 'UnitedHealthcare Gold PPO',
    },
    benefitDetails: [
      {
        serviceTypeCode: '61',
        serviceTypeDescription: 'MRI/CAT Scan',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Imaging subject to deductible then 30% coinsurance, no copay',
        limitations: [
          {
            limitationType: 'Prior Authorization',
            limitationValue: 'Required',
            limitationUnit: 'N/A',
            limitationPeriod: 'Per Service',
            used: 'N/A',
            remaining: 'N/A',
          },
        ],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '1800.00',
        benefitDescription: 'Remaining individual deductible',
        limitations: [],
      },
      {
        serviceTypeCode: '98',
        serviceTypeDescription: 'Professional (Physician) Visit — Office',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '35.00',
        benefitDescription: 'In-network PCP copay',
        limitations: [],
      },
    ],
    deductible: {
      individual: { total: '3000.00', met: '1200.00', remaining: '1800.00' },
      family: { total: '6000.00', met: '1800.00', remaining: '4200.00' },
    },
    outOfPocketMax: {
      individual: { total: '7500.00', met: '1200.00', remaining: '6300.00' },
      family: { total: '15000.00', met: '2400.00', remaining: '12600.00' },
    },
    copay: [
      { amount: '35.00', serviceType: 'PCP Office Visit', description: 'In-network PCP visit' },
      { amount: '65.00', serviceType: 'Specialist Visit', description: 'In-network specialist visit' },
    ],
    coinsurance: [
      { percentage: '30', serviceType: 'After Deductible', description: '30% coinsurance for imaging and most services after deductible' },
    ],
  },

  'patient-004': {
    controlNumber: '200000000004',
    payerId: 'CIGNA',
    subscriber: {
      memberId: 'CIG71529483',
      firstName: 'Sarah',
      lastName: 'Chen',
      dateOfBirth: '1990-06-18',
    },
    payer: {
      payerName: 'Cigna Health and Life Insurance',
      payerIdentifier: '62308',
    },
    planInformation: {
      groupNumber: 'GRP-33018',
      groupDescription: 'TechStream Inc.',
      planType: 'HDHP',
      planName: 'Cigna HDHP with HSA',
    },
    benefitDetails: [
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Preventive Care Services',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'ACA-mandated preventive services covered at 100%, no deductible',
        limitations: [],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '5000.00',
        benefitDescription: 'Full individual deductible remaining — not applicable to preventive care',
        limitations: [],
      },
      {
        serviceTypeCode: '98',
        serviceTypeDescription: 'Professional (Physician) Visit — Office',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Non-preventive office visits subject to deductible then 20% coinsurance',
        limitations: [],
      },
    ],
    deductible: {
      individual: { total: '5000.00', met: '0.00', remaining: '5000.00' },
      family: { total: '10000.00', met: '0.00', remaining: '10000.00' },
    },
    outOfPocketMax: {
      individual: { total: '7000.00', met: '0.00', remaining: '7000.00' },
      family: { total: '14000.00', met: '0.00', remaining: '14000.00' },
    },
    copay: [],
    coinsurance: [
      { percentage: '20', serviceType: 'After Deductible', description: '20% coinsurance after HDHP deductible for non-preventive services' },
    ],
  },

  'patient-005': {
    controlNumber: '200000000005',
    payerId: 'UHC',
    subscriber: {
      memberId: 'UHC82946351',
      firstName: 'Michael',
      lastName: 'Davis',
      dateOfBirth: '1980-01-30',
    },
    payer: {
      payerName: 'UnitedHealthcare',
      payerIdentifier: '87726',
    },
    planInformation: {
      groupNumber: 'GRP-58702',
      groupDescription: 'Central Ohio Logistics Corp.',
      planType: 'PPO',
      planName: 'UnitedHealthcare Choice Plus',
    },
    benefitDetails: [
      {
        serviceTypeCode: '86',
        serviceTypeDescription: 'Emergency Services',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '350.00',
        benefitDescription: 'ER copay per visit plus deductible and 30% coinsurance',
        limitations: [],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '4500.00',
        benefitDescription: 'Remaining individual deductible',
        limitations: [],
      },
      {
        serviceTypeCode: '86',
        serviceTypeDescription: 'Urgent Care',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '75.00',
        benefitDescription: 'Urgent care copay',
        limitations: [],
      },
    ],
    deductible: {
      individual: { total: '5000.00', met: '500.00', remaining: '4500.00' },
      family: { total: '10000.00', met: '500.00', remaining: '9500.00' },
    },
    outOfPocketMax: {
      individual: { total: '8000.00', met: '500.00', remaining: '7500.00' },
      family: { total: '16000.00', met: '500.00', remaining: '15500.00' },
    },
    copay: [
      { amount: '350.00', serviceType: 'Emergency Room', description: 'ER copay, waived if admitted' },
      { amount: '75.00', serviceType: 'Urgent Care', description: 'Urgent care facility copay' },
      { amount: '40.00', serviceType: 'PCP Office Visit', description: 'In-network PCP visit' },
    ],
    coinsurance: [
      { percentage: '30', serviceType: 'After Deductible', description: '30% coinsurance after deductible for ER and most services' },
    ],
  },

  'patient-006': {
    controlNumber: '200000000006',
    payerId: 'ANTHEM',
    subscriber: {
      memberId: 'ANT63841927',
      firstName: 'Priya',
      lastName: 'Patel',
      dateOfBirth: '1993-09-07',
    },
    payer: {
      payerName: 'Anthem Blue Cross Blue Shield',
      payerIdentifier: '14165',
    },
    planInformation: {
      groupNumber: 'GRP-22109',
      groupDescription: 'DesignForward Agency',
      planType: 'PPO',
      planName: 'Anthem Blue Cross Blue Shield',
    },
    benefitDetails: [
      {
        serviceTypeCode: 'MH',
        serviceTypeDescription: 'Mental Health — Outpatient',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '40.00',
        benefitDescription: 'Behavioral health copay — flat rate, no coinsurance',
        limitations: [
          {
            limitationType: 'Visit Limit',
            limitationValue: '52',
            limitationUnit: 'Visits',
            limitationPeriod: 'Plan Year',
            used: '18',
            remaining: '34',
          },
        ],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Deductible fully met for plan year 2026',
        limitations: [],
      },
      {
        serviceTypeCode: 'MH',
        serviceTypeDescription: 'Mental Health — Inpatient',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Subject to deductible and 20% coinsurance',
        limitations: [],
      },
    ],
    deductible: {
      individual: { total: '2000.00', met: '2000.00', remaining: '0.00' },
      family: { total: '4000.00', met: '3200.00', remaining: '800.00' },
    },
    outOfPocketMax: {
      individual: { total: '5000.00', met: '2800.00', remaining: '2200.00' },
      family: { total: '10000.00', met: '5600.00', remaining: '4400.00' },
    },
    copay: [
      { amount: '40.00', serviceType: 'Behavioral Health — Outpatient', description: 'Therapy/counseling session copay' },
      { amount: '30.00', serviceType: 'PCP Office Visit', description: 'In-network PCP visit' },
    ],
    coinsurance: [
      { percentage: '0', serviceType: 'Behavioral Health — Outpatient', description: 'No coinsurance for outpatient BH — copay only' },
      { percentage: '20', serviceType: 'After Deductible', description: '20% coinsurance for most non-BH services' },
    ],
  },

  'patient-007': {
    controlNumber: '200000000007',
    payerId: 'HUMANA',
    subscriber: {
      memberId: 'HUM95073248',
      firstName: 'David',
      lastName: 'Kim',
      dateOfBirth: '1975-04-11',
    },
    payer: {
      payerName: 'Humana',
      payerIdentifier: '61101',
    },
    planInformation: {
      groupNumber: 'GRP-66401',
      groupDescription: 'Gulf Coast Accounting Partners',
      planType: 'HMO',
      planName: 'Humana Gold Plus HMO',
    },
    benefitDetails: [
      {
        serviceTypeCode: 'PT',
        serviceTypeDescription: 'Physical Therapy',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '35.00',
        benefitDescription: 'PT copay per session, annual visit limit applies',
        limitations: [
          {
            limitationType: 'Visit Limit',
            limitationValue: '20',
            limitationUnit: 'Visits',
            limitationPeriod: 'Plan Year',
            used: '16',
            remaining: '4',
          },
        ],
      },
      {
        serviceTypeCode: '30',
        serviceTypeDescription: 'Health Benefit Plan Coverage',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '0.00',
        benefitDescription: 'Deductible fully met for plan year 2026',
        limitations: [],
      },
      {
        serviceTypeCode: 'PT',
        serviceTypeDescription: 'Occupational Therapy',
        inPlanNetwork: 'Y',
        coverageLevel: 'Individual',
        benefitAmount: '35.00',
        benefitDescription: 'OT copay per session, shares visit pool with PT',
        limitations: [
          {
            limitationType: 'Visit Limit',
            limitationValue: '20',
            limitationUnit: 'Visits',
            limitationPeriod: 'Plan Year',
            used: '16',
            remaining: '4',
          },
        ],
      },
    ],
    deductible: {
      individual: { total: '1500.00', met: '1500.00', remaining: '0.00' },
      family: { total: '3000.00', met: '2800.00', remaining: '200.00' },
    },
    outOfPocketMax: {
      individual: { total: '4500.00', met: '2100.00', remaining: '2400.00' },
      family: { total: '9000.00', met: '4200.00', remaining: '4800.00' },
    },
    copay: [
      { amount: '35.00', serviceType: 'Physical Therapy', description: 'PT/OT session copay' },
      { amount: '20.00', serviceType: 'PCP Office Visit', description: 'In-network PCP visit' },
    ],
    coinsurance: [
      { percentage: '0', serviceType: 'Physical Therapy', description: 'No coinsurance for PT — copay only within visit limit' },
    ],
  },
}
