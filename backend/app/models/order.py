from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class Material(str, Enum):
    cortenstaal = "cortenstaal"
    rvs = "rvs"
    zwart_staal = "zwart_staal"

class Thickness(str, Enum):
    t2 = "2mm"
    t3 = "3mm"
    t4 = "4mm"
    t6 = "6mm"

class OrderCreate(BaseModel):
    job_id: str
    material: Material
    thickness: Thickness
    name: str
    email: EmailStr
    address: str

class Order(OrderCreate):
    id: str
    price: float
    status: str = "pending"
