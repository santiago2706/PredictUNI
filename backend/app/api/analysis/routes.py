from fastapi import APIRouter, Depends
from app.api.analysis.schemas import SimulacionRequest, AnalysisResponse
from app.api.analysis.get.services import get_analysis_data
from app.api.auth.dependencies import get_current_user_id

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/", response_model=AnalysisResponse)
def get_analysis(user_id: str = Depends(get_current_user_id)):
    return get_analysis_data(user_id)

