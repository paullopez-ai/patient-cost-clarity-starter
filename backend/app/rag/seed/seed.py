"""
Seed Azure AI Search index with benefit interpretation guidelines.
Runs on backend startup if the index is empty. Idempotent.
"""

import hashlib
import os
import sys
from pathlib import Path

# Add backend root to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from dotenv import load_dotenv
load_dotenv()

from app.config import get_settings


SEED_DIR = Path(__file__).parent
CHUNK_SIZE = 300  # tokens (approximate by words)
CHUNK_OVERLAP = 30  # tokens overlap

DOCUMENTS = [
    {
        "file": "cpt_guidelines.md",
        "category": "cpt_guidelines",
        "procedure_codes": ["99213", "99243", "73721", "99395", "99284", "90834", "97110"],
    },
    {
        "file": "cost_calc_rules.md",
        "category": "cost_calc_rules",
        "procedure_codes": [],
    },
    {
        "file": "coverage_rules.md",
        "category": "coverage_rules",
        "procedure_codes": [],
    },
]


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into chunks of approximately chunk_size words with overlap."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap
    return chunks


def generate_chunk_id(category: str, chunk_index: int) -> str:
    """Generate a deterministic ID for a chunk."""
    raw = f"{category}_{chunk_index}"
    return hashlib.md5(raw.encode()).hexdigest()


async def seed_index():
    """Seed the Azure AI Search index if it is empty."""
    settings = get_settings()

    if not settings.AZURE_SEARCH_ENDPOINT or not settings.AZURE_SEARCH_API_KEY:
        print("Azure AI Search not configured — skipping seed.")
        return

    if not settings.AZURE_OPENAI_ENDPOINT or not settings.AZURE_OPENAI_API_KEY:
        print("Azure OpenAI not configured — skipping seed.")
        return

    from azure.search.documents import SearchClient
    from azure.search.documents.indexes import SearchIndexClient
    from azure.search.documents.indexes.models import (
        SearchIndex,
        SearchField,
        SearchFieldDataType,
        SimpleField,
        SearchableField,
        VectorSearch,
        HnswAlgorithmConfiguration,
        VectorSearchProfile,
        SearchField as VectorField,
    )
    from azure.core.credentials import AzureKeyCredential
    from app.rag.embeddings import generate_embedding

    credential = AzureKeyCredential(settings.AZURE_SEARCH_API_KEY)

    # Create index if it doesn't exist
    index_client = SearchIndexClient(
        endpoint=settings.AZURE_SEARCH_ENDPOINT,
        credential=credential,
    )

    index_name = settings.AZURE_SEARCH_INDEX_NAME

    try:
        index_client.get_index(index_name)
        print(f"Index '{index_name}' already exists.")
    except Exception:
        print(f"Creating index '{index_name}'...")
        index = SearchIndex(
            name=index_name,
            fields=[
                SimpleField(name="id", type=SearchFieldDataType.String, key=True),
                SearchableField(name="content", type=SearchFieldDataType.String),
                SearchField(
                    name="content_vector",
                    type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                    searchable=True,
                    vector_search_dimensions=3072,
                    vector_search_profile_name="default-profile",
                ),
                SimpleField(name="category", type=SearchFieldDataType.String, filterable=True),
                SearchField(
                    name="procedure_codes",
                    type=SearchFieldDataType.Collection(SearchFieldDataType.String),
                    filterable=True,
                ),
                SearchableField(name="title", type=SearchFieldDataType.String),
            ],
            vector_search=VectorSearch(
                algorithms=[HnswAlgorithmConfiguration(name="default-algo")],
                profiles=[VectorSearchProfile(name="default-profile", algorithm_configuration_name="default-algo")],
            ),
        )
        index_client.create_index(index)
        print(f"Index '{index_name}' created.")

    # Check if index already has documents
    search_client = SearchClient(
        endpoint=settings.AZURE_SEARCH_ENDPOINT,
        index_name=index_name,
        credential=credential,
    )

    results = search_client.search(search_text="*", top=1)
    existing = list(results)
    if existing:
        print(f"Index '{index_name}' already has documents — skipping seed.")
        return

    # Chunk and upload documents
    all_docs = []
    for doc_config in DOCUMENTS:
        filepath = SEED_DIR / doc_config["file"]
        if not filepath.exists():
            print(f"Warning: {filepath} not found, skipping.")
            continue

        text = filepath.read_text()
        chunks = chunk_text(text)

        for i, chunk in enumerate(chunks):
            chunk_id = generate_chunk_id(doc_config["category"], i)
            title = f"{doc_config['category']} — chunk {i + 1}/{len(chunks)}"

            print(f"  Generating embedding for {title}...")
            embedding = await generate_embedding(chunk)

            all_docs.append({
                "id": chunk_id,
                "content": chunk,
                "content_vector": embedding,
                "category": doc_config["category"],
                "procedure_codes": doc_config["procedure_codes"],
                "title": title,
            })

    if all_docs:
        print(f"Uploading {len(all_docs)} documents to index '{index_name}'...")
        search_client.upload_documents(documents=all_docs)
        print("Seed complete.")
    else:
        print("No documents to seed.")


if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_index())
