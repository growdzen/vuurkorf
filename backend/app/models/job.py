from pydantic import BaseModel
from typing import Optional
from enum import Enum

class JobStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"

class Job(BaseModel):
    id: str
    status: JobStatus = JobStatus.pending
    original_filename: str
    svg_url: Optional[str] = None
    dxf_url: Optional[str] = None
    error: Optional[str] = None
