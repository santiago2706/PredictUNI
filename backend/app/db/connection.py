import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_KEY or not SUPABASE_URL:
    raise ValueError("ERROR: Archivo .env no creado, vacio o incorrecto. Comunicarse con Jose Luis")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)