from fastapi import APIRouter, status
from app.api.auth.register.schemas import UserRegister
from app.api.auth.login.schemas import UserAuth
from app.api.auth.register.services import register_user
from app.api.auth.login.services import login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):
    return register_user(user)

@router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserAuth):
    return login_user(user)
