from semantic_kernel.functions import kernel_function


class BenefitPlugin:
    """Semantic Kernel plugin: structure benefit data for cost calculation."""

    @kernel_function(
        name="structure_benefit_data",
        description="Structure benefit fields (deductible, OOP max, copay, coinsurance, visit limits) from eligibility and benefit check data into a clean summary for cost calculation.",
    )
    async def structure_benefit_data(
        self, eligibility_response: str, benefit_check: str
    ) -> str:
        return f"""Analyze the eligibility response and benefit check data below. Extract and structure the following fields into a clear summary:

1. Deductible: individual amount, amount met, amount remaining
2. Out-of-pocket maximum: individual amount, amount met, amount remaining
3. Copay amounts by service type (PCP, specialist, ER, urgent care, behavioral health, PT)
4. Coinsurance rates (in-network and out-of-network if available)
5. Visit limits (annual limits, visits used, visits remaining)
6. Any service-specific benefit details relevant to cost calculation

If a field is empty, null, or not present in the data, note it as "not available" rather than guessing.

Eligibility Response:
{eligibility_response}

Benefit Check:
{benefit_check}"""
