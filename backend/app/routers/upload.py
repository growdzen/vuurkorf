import uuid, os, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.job import Job, JobStatus
from app.services.store import jobs_store

router = APIRouter()
UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 20 * 1024 * 1024

@router.post("/upload", response_model=Job)
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED:
        raise HTTPException(400, "Only JPG, PNG, WEBP allowed")
    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(400, "File too large (max 20MB)")
    job_id = str(uuid.uuid4())
    path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(path, "wb") as f:
        f.write(data)
    job = Job(id=job_id, status=JobStatus.pending, original_filename=file.filename)
    jobs_store[job_id] = {"job": job, "input_path": path}
    return job
