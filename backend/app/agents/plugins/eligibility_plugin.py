import json
from semantic_kernel.functions import kernel_function


class EligibilityPlugin:
    """Semantic Kernel plugin: interpret eligibility status from Optum response."""

    @kernel_function(
        name="interpret_eligibility",
        description="Interpret coverage status, active/inactive policy, network status, and plan type from an Optum eligibility response.",
    )
    async def interpret_eligibility(self, eligibility_response: str) -> str:
        # This function is invoked by the SK kernel with GPT-5.4 as the backing model.
        # The kernel wraps this call with the system prompt and sends to Azure OpenAI.
        # The return value here is the prompt template — the kernel handles LLM invocation.
        return f"""Analyze this eligibility response and provide a structured summary covering:
1. Coverage status (active/inactive/expired)
2. Policy type and plan name
3. Network status (in-network/out-of-network)
4. Key coverage dates
5. Any coverage limitations or exclusions

Return a concise plain-English summary suitable for downstream cost calculation.

Eligibility Response:
{eligibility_response}"""
