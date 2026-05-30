from semantic_kernel.functions import kernel_function
from app.rag.search_client import retrieve_guidelines


class CostPlugin:
    """Semantic Kernel plugin: calculate cost estimate using RAG retrieval."""

    def __init__(self, search_client=None):
        self._search_client = search_client

    @kernel_function(
        name="calculate_cost_estimate",
        description="Calculate the patient's estimated cost using benefit data, procedure context, and RAG-retrieved guidelines from Azure AI Search.",
    )
    async def calculate_cost_estimate(
        self, benefit_summary: str, patient_context: str, procedure: str
    ) -> str:
        # Retrieve relevant guidelines from Azure AI Search
        rag_context = ""
        retrieved_titles = []
        try:
            results = await retrieve_guidelines(
                self._search_client, procedure, benefit_summary
            )
            if results:
                rag_context = "\n\n".join(
                    [f"### {r['title']}\n{r['content']}" for r in results]
                )
                retrieved_titles = [r["title"] for r in results]
        except Exception:
            rag_context = "No RAG guidelines available — using general knowledge."

        rag_section = f"""

Retrieved Guidelines (from Azure AI Search):
{rag_context}
""" if rag_context else ""

        # Store retrieved titles for telemetry
        self._last_retrieved_titles = retrieved_titles

        return f"""Calculate the patient's estimated out-of-pocket cost for this procedure. Follow these rules strictly:

COST CALCULATION RULES:
1. Never invent dollar amounts — calculate only from provided data.
2. If a copay is specified for the service type, the patient owes the copay.
3. If deductible is not met and no copay applies, apply coinsurance to the allowed amount.
4. Coinsurance: apply the percentage to the allowed amount AFTER the deductible portion.
5. If deductible is met, coinsurance applies to the full allowed amount.
6. Deductible: if remaining deductible > $0 and no copay applies, patient may owe up to remaining deductible or allowed amount, whichever is less.
7. Out-of-pocket max: cap patient responsibility at remaining OOP max if lower than calculated amount.
8. Preventive care (ACA-mandated wellness exams): $0 cost regardless of deductible.
9. Flag visit limits when 80%+ of annual visits are used.
{rag_section}
Benefit Summary:
{benefit_summary}

Patient Context:
{patient_context}

Procedure:
{procedure}

Return your response as a JSON object with these fields:
- estimatedTotal: string like "$25" or "$1,050"
- confidence: "HIGH" | "MEDIUM" | "LOW"
- confidenceReason: string explaining the confidence level
- breakdown: array of objects with label, amount, amountNumeric, explanation, visualColor
- plainEnglishSummary: 1-2 sentence summary for billing staff
- costBreakdownExplanation: detailed explanation of the calculation

Use visualColor values: "var(--chart-1)" through "var(--chart-5)"
Return ONLY valid JSON. No markdown, no prose, no backticks."""
