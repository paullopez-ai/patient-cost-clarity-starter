import json
from typing import Any

from app.config import get_settings
from app.rag.embeddings import generate_embedding


_search_client = None


def get_search_client():
    """Get or create the Azure AI Search client. Returns None if not configured."""
    global _search_client
    if _search_client is not None:
        return _search_client

    settings = get_settings()
    if not settings.AZURE_SEARCH_ENDPOINT or not settings.AZURE_SEARCH_API_KEY:
        return None

    try:
        from azure.search.documents import SearchClient
        from azure.core.credentials import AzureKeyCredential

        _search_client = SearchClient(
            endpoint=settings.AZURE_SEARCH_ENDPOINT,
            index_name=settings.AZURE_SEARCH_INDEX_NAME,
            credential=AzureKeyCredential(settings.AZURE_SEARCH_API_KEY),
        )
        return _search_client
    except Exception:
        return None


async def retrieve_guidelines(
    search_client, procedure: str, benefit_scenario: str
) -> list[dict[str, Any]]:
    """Retrieve top-3 relevant guidelines from Azure AI Search using hybrid search."""
    if search_client is None:
        return []

    try:
        from azure.search.documents.models import VectorizedQuery

        # Parse procedure code from the procedure JSON
        proc_data = json.loads(procedure) if isinstance(procedure, str) else procedure
        procedure_code = proc_data.get("code", "")
        procedure_desc = proc_data.get("description", "")

        query_text = f"{procedure_code} {procedure_desc} {benefit_scenario[:200]}"
        query_embedding = await generate_embedding(query_text)

        vector_query = VectorizedQuery(
            vector=query_embedding,
            k_nearest_neighbors=3,
            fields="content_vector",
        )

        results = search_client.search(
            search_text=procedure_code,
            vector_queries=[vector_query],
            select=["title", "content", "category"],
            top=3,
        )

        return [
            {
                "title": r["title"],
                "content": r["content"],
                "category": r["category"],
            }
            for r in results
        ]
    except Exception:
        return []
