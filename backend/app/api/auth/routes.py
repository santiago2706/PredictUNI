from fastapi import APIRouter, status
from app.api.auth.register.schemas import UserRegister
from app.api.auth.login.schemas import UserLogin
from app.api.auth.register.services import register_user
from app.api.auth.login.services import login_user
from app.api.auth.refresh.services import refresh_session
from app.api.auth.schemas import LoginResponse, RegisterResponse, RefreshRequest, RefreshResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterResponse)
def register(user: UserRegister):
    return register_user(user)

@router.post("/login", status_code=status.HTTP_200_OK, response_model=LoginResponse)
def login(user: UserLogin):
    return login_user(user)

@router.post("/refresh", status_code=status.HTTP_200_OK, response_model=RefreshResponse)
def refresh(request: RefreshRequest):
    return refresh_session(request.refresh_token)

