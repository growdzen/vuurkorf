from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload, process, preview, orders

app = FastAPI(
    title="Vuurkorf API",
    description="AI-driven fire pit personalization pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(process.router)
app.include_router(preview.router)
app.include_router(orders.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
