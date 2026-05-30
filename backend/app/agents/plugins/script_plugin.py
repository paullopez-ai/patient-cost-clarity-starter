from semantic_kernel.functions import kernel_function


class ScriptPlugin:
    """Semantic Kernel plugin: generate patient-facing script for front desk staff."""

    @kernel_function(
        name="generate_patient_script",
        description="Generate a 2-4 sentence patient-facing script that front desk staff can read verbatim.",
    )
    async def generate_patient_script(
        self, cost_summary: str, patient_name: str
    ) -> str:
        return f"""Generate a patient-facing script for front desk staff to read to the patient before their visit.

Requirements:
- Address the patient by first name
- State the estimated cost clearly
- Mention key cost components (copay, deductible, coinsurance as applicable)
- Keep it to 2-4 sentences
- Use simple, non-medical language at a 6th-grade reading level
- Be reassuring but honest about the estimate
- Mention if there are any important caveats (prior auth needed, visit limits, etc.)

Cost Summary:
{cost_summary}

Patient Name: {patient_name}

Return ONLY the script text — no JSON, no labels, no quotation marks."""
