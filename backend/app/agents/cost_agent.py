import json
from typing import Any

import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from semantic_kernel.connectors.ai.prompt_execution_settings import PromptExecutionSettings

from app.config import get_settings
from app.telemetry import PluginTimer
from app.agents.plugins.eligibility_plugin import EligibilityPlugin
from app.agents.plugins.benefit_plugin import BenefitPlugin
from app.agents.plugins.cost_plugin import CostPlugin
from app.agents.plugins.script_plugin import ScriptPlugin
from app.agents.plugins.risk_plugin import RiskPlugin
from app.rag.search_client import get_search_client


def _build_kernel():
    settings = get_settings()
    kernel = sk.Kernel()

    kernel.add_service(
        AzureChatCompletion(
            deployment_name=settings.AZURE_OPENAI_DEPLOYMENT,
            endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_key=settings.AZURE_OPENAI_API_KEY,
            service_id="gpt54",
        )
    )

    search_client = get_search_client()

    kernel.add_plugin(EligibilityPlugin(), plugin_name="eligibility")
    kernel.add_plugin(BenefitPlugin(), plugin_name="benefit")
    kernel.add_plugin(CostPlugin(search_client=search_client), plugin_name="cost")
    kernel.add_plugin(ScriptPlugin(), plugin_name="script")
    kernel.add_plugin(RiskPlugin(), plugin_name="risk")

    return kernel


async def _invoke_plugin(kernel: sk.Kernel, plugin: str, function: str, **kwargs) -> str:
    """Invoke an SK plugin function and get the prompt, then call GPT-5.4 with it."""
    # Get the prompt from the plugin
    plugin_fn = kernel.get_function(plugin, function)
    prompt_result = await plugin_fn.invoke(kernel, **kwargs)
    prompt = str(prompt_result)

    # Call GPT-5.4 with the prompt
    service = kernel.get_service("gpt54")
    settings = PromptExecutionSettings(
        service_id="gpt54",
        max_tokens=4096,
        temperature=0,
    )

    chat_result = await service.get_chat_message_contents(
        chat_history=[
            {"role": "system", "content": "You are a healthcare cost clarity assistant. Analyze benefit data precisely and return structured responses."},
            {"role": "user", "content": prompt},
        ],
        settings=settings,
    )

    return str(chat_result[0]) if chat_result else ""


async def run_cost_agent(request) -> dict[str, Any]:
    """Run the five-plugin Semantic Kernel pipeline and return a ClaudeCostAnnotation-compatible JSON."""
    kernel = _build_kernel()

    # Step 1: Interpret eligibility
    with PluginTimer("eligibility", "interpret_eligibility") as timer:
        eligibility_summary = await _invoke_plugin(
            kernel,
            "eligibility",
            "interpret_eligibility",
            eligibility_response=json.dumps(request.eligibility),
        )
    timer.track()

    # Step 2: Structure benefit data
    with PluginTimer("benefit", "structure_benefit_data") as timer:
        benefit_summary = await _invoke_plugin(
            kernel,
            "benefit",
            "structure_benefit_data",
            eligibility_response=json.dumps(request.eligibility),
            benefit_check=json.dumps(request.benefitCheck),
        )
    timer.track()

    # Step 3: Calculate cost estimate with RAG
    with PluginTimer("cost", "calculate_cost_estimate") as timer:
        cost_result_raw = await _invoke_plugin(
            kernel,
            "cost",
            "calculate_cost_estimate",
            benefit_summary=benefit_summary,
            patient_context=json.dumps(request.patient),
            procedure=json.dumps(request.procedure),
        )
    # Get retrieved titles from cost plugin for telemetry
    cost_plugin = kernel.get_plugin("cost")
    retrieved_titles = getattr(cost_plugin, "_last_retrieved_titles", [])
    timer.track(retrieved_documents=", ".join(retrieved_titles) if retrieved_titles else "none")

    # Step 4: Generate patient script
    patient_name = request.patient.get("firstName", "the patient")
    with PluginTimer("script", "generate_patient_script") as timer:
        patient_script = await _invoke_plugin(
            kernel,
            "script",
            "generate_patient_script",
            cost_summary=cost_result_raw,
            patient_name=patient_name,
        )
    timer.track()

    # Step 5: Assess risk and generate action items
    with PluginTimer("risk", "assess_risk_flags") as timer:
        risk_result_raw = await _invoke_plugin(
            kernel,
            "risk",
            "assess_risk_flags",
            cost_summary=cost_result_raw,
            benefit_summary=benefit_summary,
        )
    timer.track()

    # Assemble final ClaudeCostAnnotation-compatible response
    return _assemble_annotation(cost_result_raw, patient_script, risk_result_raw)


def _parse_json_safe(text: str) -> dict:
    """Parse JSON from LLM output, handling common formatting issues."""
    cleaned = text.strip()
    # Strip markdown code fences if present
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {}


def _assemble_annotation(
    cost_result_raw: str,
    patient_script: str,
    risk_result_raw: str,
) -> dict[str, Any]:
    """Combine outputs from all plugins into a ClaudeCostAnnotation-compatible dict."""
    cost = _parse_json_safe(cost_result_raw)
    risk = _parse_json_safe(risk_result_raw)

    # Build breakdown items
    breakdown = []
    for item in cost.get("breakdown", []):
        breakdown.append({
            "label": item.get("label", ""),
            "amount": item.get("amount", "$0.00"),
            "amountNumeric": item.get("amountNumeric", 0),
            "explanation": item.get("explanation", ""),
            "visualColor": item.get("visualColor", "var(--chart-1)"),
        })

    return {
        "patientOwes": {
            "estimatedTotal": cost.get("estimatedTotal", "$0.00"),
            "confidence": cost.get("confidence", "LOW"),
            "confidenceReason": cost.get("confidenceReason", "Unable to determine confidence."),
            "breakdown": breakdown,
            "plainEnglishSummary": cost.get("plainEnglishSummary", "Unable to determine cost from available data."),
        },
        "coverageConfirmation": risk.get("coverageConfirmation", "Coverage details processed by Azure SK pipeline."),
        "costBreakdownExplanation": cost.get("costBreakdownExplanation", ""),
        "deductibleStatus": risk.get("deductibleStatus", "Deductible information not available."),
        "visitLimitStatus": risk.get("visitLimitStatus", "No visit limit information available."),
        "authorizationRequired": risk.get("authorizationRequired", False),
        "authorizationNote": risk.get("authorizationNote", ""),
        "actionItems": risk.get("actionItems", []),
        "patientFriendlyScript": patient_script.strip(),
        "riskFlag": risk.get("riskFlag", "NONE"),
        "sandboxNote": risk.get("sandboxNote", "Results generated by Azure Semantic Kernel pipeline with GPT-5.4."),
    }
