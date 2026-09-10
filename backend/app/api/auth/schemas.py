from pydantic import BaseModel

class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str

class RegisterResponse(BaseModel):
    status: str
    message: str
    access_token: str
    token_type: str
