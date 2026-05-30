from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any

from app.agents.cost_agent import run_cost_agent

router = APIRouter()


class InterpretRequest(BaseModel):
    patient: dict[str, Any]
    procedure: dict[str, Any]
    eligibility: dict[str, Any]
    benefitCheck: dict[str, Any]
    mode: str = "mock"


@router.post("/api/interpret")
async def interpret(request: InterpretRequest):
    try:
        result = await run_cost_agent(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
