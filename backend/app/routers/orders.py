import uuid
from fastapi import APIRouter, HTTPException
from app.models.order import Order, OrderCreate
from app.services.store import jobs_store, orders_store
from app.services.pricing import calculate_price

router = APIRouter()

@router.post("/orders", response_model=Order)
async def create_order(order_in: OrderCreate):
    if order_in.job_id not in jobs_store:
        raise HTTPException(404, "Job not found")
    price = calculate_price(order_in.material, order_in.thickness)
    order = Order(**order_in.model_dump(), id=str(uuid.uuid4()), price=price)
    orders_store[order.id] = order
    return order

@router.get("/orders")
async def list_orders():
    return list(orders_store.values())
