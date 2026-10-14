from pydantic import BaseModel

class LoginResponse(BaseModel):
    message: str
    access_token: str
    refresh_token: str
    token_type: str

class RegisterResponse(BaseModel):
    status: str
    message: str
    access_token: str
    refresh_token: str
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
