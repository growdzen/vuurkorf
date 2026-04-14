from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.job import Job, JobStatus
from app.services.store import jobs_store
from app.services import image_processor

router = APIRouter()

@router.post("/process/{job_id}", response_model=Job)
async def process_job(job_id: str, background_tasks: BackgroundTasks):
    if job_id not in jobs_store:
        raise HTTPException(404, "Job not found")
    entry = jobs_store[job_id]
    entry["job"].status = JobStatus.processing
    background_tasks.add_task(image_processor.run_pipeline, job_id)
    return entry["job"]
