from fastapi import FastAPI
from .routes import router
from .config import SERVICE_PORT
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Statistics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=SERVICE_PORT, reload=True)
