# Cost Calculation Rules

## Deductible Application Logic

The deductible is the amount the patient must pay before insurance begins covering costs. Apply the deductible as follows:

1. Check the remaining deductible amount (individual deductible minus amount already met).
2. If the remaining deductible is $0, skip to coinsurance or copay.
3. If the remaining deductible is greater than $0 and no copay applies, the patient owes the lesser of: the remaining deductible OR the allowed amount for the service.
4. The deductible portion is subtracted from the allowed amount before calculating coinsurance.
5. Preventive care services are exempt from deductible requirements regardless of plan type.

## Copay vs Coinsurance Priority

When both a copay and coinsurance could apply to a service:

1. If the plan specifies a flat copay for the service type (e.g., "$25 PCP copay"), charge the copay. Do not apply coinsurance in addition to the copay unless the plan explicitly states otherwise.
2. If no copay is specified, apply coinsurance to the allowed amount after the deductible portion.
3. Some plans use copay for certain service types (office visits) and coinsurance for others (imaging, surgery). Check the benefit structure for the specific service type.

## Coinsurance Calculation Sequence

1. Start with the allowed amount for the procedure.
2. Subtract any deductible portion the patient owes.
3. Apply the coinsurance percentage to the remaining amount.
4. The patient owes: deductible portion + coinsurance amount.
5. Example: $1,800 MRI, $750 remaining deductible, 30% coinsurance. Patient owes: $750 (deductible) + 30% of ($1,800 - $750) = $750 + $315 = $1,065.

## Out-of-Pocket Maximum Cap

1. The OOP max is the absolute ceiling on patient responsibility for the plan year.
2. After calculating the total patient responsibility (copay + deductible + coinsurance), compare to the remaining OOP max.
3. If the calculated amount exceeds the remaining OOP max, cap the patient's responsibility at the remaining OOP max.
4. Premiums and out-of-network charges may not count toward the OOP max depending on the plan.

## Preventive Care Zero-Cost Rule

Under ACA guidelines, the following are covered at $0 cost-sharing:
- Annual wellness exams (CPT 99381-99397)
- Recommended immunizations
- Screening tests (mammography, colonoscopy at recommended intervals)
- Preventive counseling

This applies regardless of deductible status. The key is the procedure must be coded as preventive. If diagnostic codes are added, those services are subject to normal cost-sharing.

## Visit Limit Warning Thresholds

When a patient has used 80% or more of their annual visit limit for a service type:
- Flag as a warning in the cost estimate
- Include the exact count (e.g., "16 of 20 visits used")
- Note how many visits remain including the current one
- Advise the patient to discuss a treatment plan to prioritize remaining visits
- If more visits are needed, note that a medical necessity review may be required
