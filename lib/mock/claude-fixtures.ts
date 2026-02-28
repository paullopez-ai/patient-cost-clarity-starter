import type { ClaudeCostAnnotation } from '@/types/claude.types'

export const claudeFixtures: Record<string, ClaudeCostAnnotation> = {
  'patient-001': {
    patientOwes: {
      estimatedTotal: '$25',
      confidence: 'HIGH',
      confidenceReason:
        'Deductible is fully met and plan applies a fixed copay for in-network PCP visits with no coinsurance.',
      breakdown: [
        {
          label: 'Office Visit Copay',
          amount: '$25.00',
          amountNumeric: 25,
          explanation: 'Fixed copay for an established patient office visit with in-network PCP.',
          visualColor: 'var(--chart-1)',
        },
      ],
      plainEnglishSummary:
        'Your deductible is already met for the year, so this routine visit is just your $25 copay. No surprises expected.',
    },
    coverageConfirmation:
      'Maria Gonzalez has active UHC Gold PPO 2024 coverage. The plan is in-network for this provider.',
    costBreakdownExplanation:
      'Since Maria has met her individual deductible for 2026, the only cost for this CPT 99213 office visit is the plan\'s standard $25 PCP copay. No coinsurance applies to copay-based office visits.',
    deductibleStatus: 'Individual deductible is fully met for plan year 2026. No deductible portion applies to this visit.',
    visitLimitStatus: 'No visit limits apply to routine PCP office visits under this plan.',
    authorizationRequired: false,
    authorizationNote: 'No prior authorization required for in-network PCP office visits.',
    actionItems: [
      'Collect $25 copay at time of service.',
      'Confirm plan does not require a referral for this PCP visit.',
    ],
    patientFriendlyScript:
      'Maria, for today\'s office visit your copay is $25. Your deductible is already met for the year, so there shouldn\'t be any additional charges beyond the copay. Do you have any questions about your cost?',
    riskFlag: 'NONE',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },

  'patient-002': {
    patientOwes: {
      estimatedTotal: '$215',
      confidence: 'MEDIUM',
      confidenceReason:
        'Deductible is partially met. The final amount depends on the allowed amount for the specialist consult, which may vary from the estimate.',
      breakdown: [
        {
          label: 'Remaining Deductible Portion',
          amount: '$150.00',
          amountNumeric: 150,
          explanation:
            'The specialist consultation (CPT 99243) typically bills around $325. Of the $1,200 remaining deductible, approximately $150 applies toward this service.',
          visualColor: 'var(--chart-3)',
        },
        {
          label: 'Coinsurance (20%)',
          amount: '$65.00',
          amountNumeric: 65,
          explanation:
            'After deductible is applied, 20% coinsurance on the remaining allowed amount of approximately $325.',
          visualColor: 'var(--chart-2)',
        },
      ],
      plainEnglishSummary:
        'James still has $1,200 left on his deductible. Part of this specialist visit will count toward that, and he\'ll also owe 20% coinsurance on the rest. Total estimated cost is around $215.',
    },
    coverageConfirmation:
      'James Washington has active UHC Platinum HMO 2024 coverage. The specialist provider is in-network.',
    costBreakdownExplanation:
      'For this specialist consultation (CPT 99243), the typical allowed amount is approximately $325. James has $1,200 remaining on his $2,000 deductible. The first ~$150 applies to deductible, then 20% coinsurance on the remaining ~$175 yields approximately $65.',
    deductibleStatus:
      'Individual deductible: $800 of $2,000 met. $1,200 remaining. This visit will apply approximately $150 toward the deductible.',
    visitLimitStatus: 'No visit limits apply to specialist consultations under this plan.',
    authorizationRequired: false,
    authorizationNote:
      'No prior authorization required for in-network specialist office consultations. Follow-up procedures may require authorization.',
    actionItems: [
      'Collect estimated $215 or set up payment arrangement for post-visit balance.',
      'Inform James that follow-up testing may require separate authorization.',
      'Provide James with a cost estimate for any recommended follow-up procedures.',
    ],
    patientFriendlyScript:
      'James, your specialist consultation today is estimated to cost around $215 out of pocket. That breaks down to about $150 toward your remaining deductible and roughly $65 in coinsurance. Your deductible is about 40% met for the year. Do you have any questions?',
    riskFlag: 'MEDIUM',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },

  'patient-003': {
    patientOwes: {
      estimatedTotal: '$1,050',
      confidence: 'MEDIUM',
      confidenceReason:
        'MRI facility and professional fees can vary significantly. This estimate is based on typical in-network allowed amounts for outpatient knee MRI without contrast.',
      breakdown: [
        {
          label: 'Deductible Portion',
          amount: '$750.00',
          amountNumeric: 750,
          explanation:
            'The knee MRI (CPT 73721) typically has an allowed amount of ~$1,500. Aisha has $1,800 remaining on her deductible, so $750 of the MRI cost applies to deductible.',
          visualColor: 'var(--chart-5)',
        },
        {
          label: 'Coinsurance (30%)',
          amount: '$300.00',
          amountNumeric: 300,
          explanation:
            'After deductible portion, 30% coinsurance applies to the remaining ~$750 of the allowed amount.',
          visualColor: 'var(--chart-4)',
        },
      ],
      plainEnglishSummary:
        'Aisha has a large deductible gap and this MRI is an expensive imaging study. She can expect to pay around $1,050 combining deductible and coinsurance charges.',
    },
    coverageConfirmation:
      'Aisha Rahman has active UHC Bronze HSA 2024 coverage. The imaging facility is in-network.',
    costBreakdownExplanation:
      'For this knee MRI without contrast (CPT 73721), the estimated in-network allowed amount is approximately $1,500. Aisha has $1,800 remaining on her $3,000 deductible. The first $750 applies to deductible, then 30% coinsurance on the remaining $750 yields ~$300.',
    deductibleStatus:
      'Individual deductible: $1,200 of $3,000 met. $1,800 remaining. This MRI will apply approximately $750 toward the deductible.',
    visitLimitStatus: 'No visit limits apply to diagnostic imaging under this plan.',
    authorizationRequired: true,
    authorizationNote:
      'Prior authorization is required for outpatient MRI. Ensure authorization is obtained before the scheduled scan date to avoid claim denial.',
    actionItems: [
      'Verify prior authorization has been obtained before the MRI appointment.',
      'Discuss payment plan options with Aisha given the $1,050 estimated responsibility.',
      'Suggest Aisha check if an outpatient imaging center offers lower facility fees than hospital-based imaging.',
    ],
    patientFriendlyScript:
      'Aisha, your knee MRI is estimated to cost approximately $1,050 out of pocket. That includes about $750 toward your remaining deductible and around $300 in coinsurance. Please make sure your doctor\'s office has obtained prior authorization, as your plan requires it. Let us know if you\'d like to discuss payment options.',
    riskFlag: 'HIGH',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },

  'patient-004': {
    patientOwes: {
      estimatedTotal: '$0',
      confidence: 'HIGH',
      confidenceReason:
        'Annual wellness exams are ACA-mandated preventive services covered at 100% with no cost-sharing, regardless of deductible status.',
      breakdown: [
        {
          label: 'Preventive Care',
          amount: '$0.00',
          amountNumeric: 0,
          explanation:
            'Annual physical exam (CPT 99395) is classified as preventive care and fully covered under ACA guidelines with no copay, deductible, or coinsurance.',
          visualColor: 'var(--chart-1)',
        },
      ],
      plainEnglishSummary:
        'Robert\'s annual physical is preventive care, which is fully covered by his plan at no cost. He owes nothing for this visit.',
    },
    coverageConfirmation:
      'Robert Chen has active UHC Choice Plus PPO 2024 coverage. The provider is in-network.',
    costBreakdownExplanation:
      'The annual physical (CPT 99395) is classified as preventive care under ACA regulations. Even with a high-deductible plan, preventive services are exempt from deductible and cost-sharing requirements. The visit is covered at 100%.',
    deductibleStatus:
      'This preventive visit does not apply to or require the deductible to be met. Preventive services are covered at $0 regardless of deductible status.',
    visitLimitStatus: 'One annual wellness exam covered per plan year. This is Robert\'s first for 2026.',
    authorizationRequired: false,
    authorizationNote: 'No prior authorization required for preventive wellness exams.',
    actionItems: [
      'Ensure visit is coded as preventive (CPT 99395) — if any diagnostic codes are added during the visit, those services may be subject to deductible.',
      'Remind Robert that lab work ordered as part of the preventive exam is also covered at $0, but diagnostic labs would apply to his deductible.',
    ],
    patientFriendlyScript:
      'Robert, great news — your annual physical is fully covered by your plan at no cost to you. There\'s no copay, no deductible, and no coinsurance for preventive visits. Just keep in mind that if any diagnostic follow-up is needed, those additional services may have separate costs.',
    riskFlag: 'NONE',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },

  'patient-005': {
    patientOwes: {
      estimatedTotal: '$1,685',
      confidence: 'MEDIUM',
      confidenceReason:
        'ER costs vary widely based on acuity, tests, and length of stay. This estimate assumes a high-complexity visit (CPT 99284) without admission.',
      breakdown: [
        {
          label: 'ER Copay',
          amount: '$350.00',
          amountNumeric: 350,
          explanation:
            'Flat ER copay charged per visit regardless of deductible status. Waived if admitted to inpatient.',
          visualColor: 'var(--chart-1)',
        },
        {
          label: 'Deductible Portion',
          amount: '$935.00',
          amountNumeric: 935,
          explanation:
            'After the copay, remaining ER charges are applied to the $4,500 remaining deductible. Approximately $935 applies.',
          visualColor: 'var(--chart-4)',
        },
        {
          label: 'Coinsurance (30%)',
          amount: '$400.00',
          amountNumeric: 400,
          explanation:
            'After the deductible portion, 30% coinsurance applies to the remaining charges of approximately $1,335.',
          visualColor: 'var(--chart-5)',
        },
      ],
      plainEnglishSummary:
        'Destiny\'s ER visit carries a $350 copay plus significant deductible and coinsurance charges since her deductible is mostly unmet. The total estimated cost is approximately $1,685.',
    },
    coverageConfirmation:
      'Destiny Williams has active UHC Student Health Plan coverage. Emergency services are covered under emergency provisions.',
    costBreakdownExplanation:
      'For a high-complexity ER visit (CPT 99284), the typical allowed amount is approximately $3,150. Destiny pays a $350 ER copay first. Of the remaining $2,800, approximately $935 applies to her largely unmet deductible ($4,500 remaining). Then 30% coinsurance applies to the remaining ~$1,335, yielding about $400.',
    deductibleStatus:
      'Individual deductible: $500 of $5,000 met. $4,500 remaining. This ER visit will apply approximately $935 toward the deductible.',
    visitLimitStatus: 'No visit limits apply to emergency department services.',
    authorizationRequired: false,
    authorizationNote:
      'Emergency services do not require prior authorization. Follow-up outpatient services or imaging may require authorization.',
    actionItems: [
      'Alert financial counseling about potential high-balance patient — $1,685 estimated responsibility.',
      'Inform Destiny about payment plan availability before discharge.',
      'If Destiny is admitted, the $350 ER copay is waived — update the estimate accordingly.',
    ],
    patientFriendlyScript:
      'Destiny, I want to give you a heads-up about the estimated cost of your ER visit today. Based on your plan, the total is estimated at around $1,685. That includes a $350 ER copay, about $935 toward your deductible, and approximately $400 in coinsurance. We can set up a payment plan if that would help.',
    riskFlag: 'HIGH',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },

  'patient-006': {
    patientOwes: {
      estimatedTotal: '$40',
      confidence: 'HIGH',
      confidenceReason:
        'Behavioral health outpatient visits use a flat copay with no coinsurance under this plan\'s carve-out structure. Deductible is already met.',
      breakdown: [
        {
          label: 'Behavioral Health Copay',
          amount: '$40.00',
          amountNumeric: 40,
          explanation:
            'Flat copay for outpatient behavioral health session (CPT 90834). No coinsurance applies under the BH carve-out benefit.',
          visualColor: 'var(--chart-2)',
        },
      ],
      plainEnglishSummary:
        'Thomas\'s therapy session costs a flat $40 copay. His plan has a behavioral health carve-out with no additional coinsurance for outpatient sessions.',
    },
    coverageConfirmation:
      'Thomas O\'Brien has active UHC Medicare Advantage PPO coverage. The behavioral health provider is in-network.',
    costBreakdownExplanation:
      'Under Thomas\'s plan, outpatient behavioral health services have a separate cost-sharing structure (carve-out). The 45-minute psychotherapy session (CPT 90834) is covered with a $40 copay and 0% coinsurance.',
    deductibleStatus:
      'Individual deductible is fully met. No deductible applies to this visit.',
    visitLimitStatus:
      'Behavioral health visits: 18 of 52 annual sessions used. 34 sessions remaining for plan year 2026.',
    authorizationRequired: false,
    authorizationNote:
      'No prior authorization required for outpatient behavioral health visits within the annual session limit.',
    actionItems: [
      'Collect $40 copay at time of service.',
      'Note that Thomas has 34 remaining BH sessions — no urgency on visit limits.',
    ],
    patientFriendlyScript:
      'Thomas, your therapy session today is $40 — that\'s your standard behavioral health copay. Your deductible is already met for the year, and your plan covers outpatient therapy with just the copay. You still have 34 sessions remaining in your annual benefit. Any questions?',
    riskFlag: 'NONE',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },

  'patient-007': {
    patientOwes: {
      estimatedTotal: '$35',
      confidence: 'HIGH',
      confidenceReason:
        'Deductible is met and PT visits use a flat copay. However, the patient is approaching the annual visit limit, which is a critical alert.',
      breakdown: [
        {
          label: 'Physical Therapy Copay',
          amount: '$35.00',
          amountNumeric: 35,
          explanation:
            'Flat copay for physical therapy session (CPT 97110). No coinsurance applies when deductible is met.',
          visualColor: 'var(--chart-3)',
        },
      ],
      plainEnglishSummary:
        'David\'s PT session is $35 copay. However, he has used 16 of his 20 annual visits — only 4 sessions remain, including this one.',
    },
    coverageConfirmation:
      'David Washington has active UHC Platinum HMO 2024 coverage. The physical therapy provider is in-network.',
    costBreakdownExplanation:
      'David\'s PT session (CPT 97110) is covered with a $35 copay. His deductible is fully met, so no additional deductible applies. No coinsurance is charged for PT visits under this plan — copay only within the visit limit.',
    deductibleStatus:
      'Individual deductible is fully met. No deductible applies to this visit.',
    visitLimitStatus:
      'ALERT: Physical therapy visits — 16 of 20 annual visits used. After today\'s session, only 3 visits will remain for plan year 2026. David should discuss with his therapist whether to space out remaining sessions or request a visit limit extension.',
    authorizationRequired: false,
    authorizationNote:
      'No prior authorization required for PT within the 20-visit annual limit. If additional visits are needed beyond 20, a medical necessity review and authorization will be required.',
    actionItems: [
      'Alert David that he has only 4 PT sessions remaining (3 after today).',
      'Recommend David discuss a treatment plan with his physical therapist to prioritize remaining visits.',
      'If more than 20 sessions are needed, initiate a medical necessity review for a visit limit extension.',
    ],
    patientFriendlyScript:
      'David, your PT session today is $35, which is your standard copay. I do want to flag something important — you\'ve now used 16 of your 20 physical therapy visits for the year. After today, you\'ll have just 3 sessions left. You may want to talk with your therapist about how to make the most of your remaining visits.',
    riskFlag: 'MEDIUM',
    sandboxNote: 'Mock data — in production, verify real-time eligibility and benefit data via Optum API.',
  },
}
