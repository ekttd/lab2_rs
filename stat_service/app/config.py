import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8000))
PLAYER_SERVICE_URL = "http://127.0.0.1:8001"