from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.routes.interpret import router as interpret_router

app = FastAPI(title="Patient Cost Clarity — Azure SK Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interpret_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "cost-agent"}
