const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Job {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  original_filename: string
  svg_url?: string
  dxf_url?: string
  error?: string
}

export interface Order {
  id: string
  job_id: string
  material: string
  thickness: string
  name: string
  email: string
  address: string
  price: number
  status: string
}

export async function uploadImage(file: File): Promise<Job> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function processJob(jobId: string): Promise<Job> {
  const res = await fetch(`${BASE}/process/${jobId}`, { method: 'POST' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getPreview(jobId: string): Promise<Job> {
  const res = await fetch(`${BASE}/preview/${jobId}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createOrder(data: {
  job_id: string
  material: string
  thickness: string
  name: string
  email: string
  address: string
}): Promise<Order> {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
