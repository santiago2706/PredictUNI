from fastapi import APIRouter, Depends, status
from app.api.analysis.schemas import SimulacionRequest, AnalysisResponse
from app.api.analysis.get.services import get_analysis_data
from app.api.analysis.simulate.services import simulate_analysis
from app.api.auth.dependencies import get_current_user_id

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/", response_model=AnalysisResponse)
def get_analysis(user_id: str = Depends(get_current_user_id)):
    return get_analysis_data(user_id)

@router.post("/simulate", status_code=status.HTTP_200_OK, response_model=AnalysisResponse)
def simulate(request: SimulacionRequest, user_id: str = Depends(get_current_user_id)):
    return simulate_analysis(request, user_id)

