import os
from PIL import Image
import numpy as np
from app.models.job import JobStatus
from app.services.store import jobs_store
from app.services import vectorizer, dxf_generator

OUTPUT_DIR = "/tmp/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_background(input_path: str) -> np.ndarray:
    from rembg import remove
    with open(input_path, "rb") as f:
        data = f.read()
    result = remove(data)
    import io
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    return np.array(img)

def to_silhouette(rgba: np.ndarray) -> np.ndarray:
    import cv2
    alpha = rgba[:, :, 3]
    _, mask = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)
    return mask

def run_pipeline(job_id: str):
    entry = jobs_store.get(job_id)
    if not entry:
        return
    job = entry["job"]
    try:
        rgba = remove_background(entry["input_path"])
        mask = to_silhouette(rgba)
        png_path = os.path.join(OUTPUT_DIR, f"{job_id}_silhouet.png")
        Image.fromarray(mask).save(png_path)
        svg_path = vectorizer.png_to_svg(png_path, job_id)
        dxf_path = dxf_generator.svg_to_dxf(svg_path, job_id)
        entry["svg_path"] = svg_path
        entry["dxf_path"] = dxf_path
        job.status = JobStatus.completed
        job.svg_url = f"/preview/{job_id}/svg"
        job.dxf_url = f"/preview/{job_id}/dxf"
    except Exception as e:
        job.status = JobStatus.failed
        job.error = str(e)
