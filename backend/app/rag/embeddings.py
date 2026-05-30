from openai import AzureOpenAI
from app.config import get_settings


_client = None


def _get_client() -> AzureOpenAI:
    global _client
    if _client is not None:
        return _client

    settings = get_settings()
    _client = AzureOpenAI(
        api_key=settings.AZURE_OPENAI_API_KEY,
        api_version=settings.AZURE_OPENAI_API_VERSION,
        azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
    )
    return _client


async def generate_embedding(text: str) -> list[float]:
    """Generate an embedding vector using Azure OpenAI text-embedding-3-large."""
    settings = get_settings()
    client = _get_client()
    response = client.embeddings.create(
        input=text,
        model=settings.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
    )
    return response.data[0].embedding
