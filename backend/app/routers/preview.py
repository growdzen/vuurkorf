from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.job import Job
from app.services.store import jobs_store

router = APIRouter()

@router.get("/preview/{job_id}", response_model=Job)
async def get_preview(job_id: str):
    if job_id not in jobs_store:
        raise HTTPException(404, "Job not found")
    return jobs_store[job_id]["job"]

@router.get("/preview/{job_id}/svg")
async def get_svg(job_id: str):
    if job_id not in jobs_store:
        raise HTTPException(404, "Job not found")
    entry = jobs_store[job_id]
    svg_path = entry.get("svg_path")
    if not svg_path:
        raise HTTPException(404, "SVG not ready")
    return FileResponse(svg_path, media_type="image/svg+xml")

@router.get("/preview/{job_id}/dxf")
async def get_dxf(job_id: str):
    if job_id not in jobs_store:
        raise HTTPException(404, "Job not found")
    entry = jobs_store[job_id]
    dxf_path = entry.get("dxf_path")
    if not dxf_path:
        raise HTTPException(404, "DXF not ready")
    return FileResponse(dxf_path, media_type="application/octet-stream")
