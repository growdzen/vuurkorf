'use client'
import { useState, useRef } from 'react'
import { uploadImage, processJob, getPreview, createOrder } from '@/lib/api'

const STEPS = ['Upload foto', 'Verwerken', 'Preview', 'Materiaal', 'Bestellen']

const MATERIALS = [
  {id: 'cortenstaal', label: 'Cortenstaal', price: 89, desc: 'Roestpatina'},
  {id: 'rvs', label: 'RVS', price: 149, desc: 'Weerbestendig'},
  {id: 'zwart_staal', label: 'Zwart staal', price: 69, desc: 'Mat zwart'},
]

const THICKNESSES = ['2mm', '3mm', '4mm', '6mm']

export default function Configurator() {
  const [step, setStep] = useState(0)
  const [jobId, setJobId] = useState<string | null>(null)
  const [svgUrl, setSvgUrl] = useState<string | null>(null)
  const [material, setMaterial] = useState('cortenstaal')
  const [thickness, setThickness] = useState('3mm')
  const [form, setForm] = useState({name: '', email: '', address: ''})
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    try {
      const job = await uploadImage(file)
      setJobId(job.id)
      setStep(1)
      setProcessing(true)
      await processJob(job.id)
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        const preview = await getPreview(job.id)
        if (preview.status === 'completed') {
          clearInterval(poll)
          setSvgUrl(`${process.env.NEXT_PUBLIC_API_URL}/preview/${job.id}/svg`)
          setProcessing(false)
          setStep(2)
        } else if (preview.status === 'failed' || attempts > 30) {
          clearInterval(poll)
          setError(preview.error || 'Verwerking mislukt')
          setProcessing(false)
        }
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload mislukt')
    }
  }

  async function handleOrder() {
    if (!jobId) return
    setError(null)
    try {
      const order = await createOrder({
        job_id: jobId, material, thickness,
        name: form.name, email: form.email, address: form.address,
      })
      setOrderId(order.id)
      setStep(4)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bestelling mislukt')
    }
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`h-2 rounded-full mb-1 ${i <= step ? 'bg-orange-500' : 'bg-gray-700'}`} />
            <span className={`text-xs ${i === step ? 'text-orange-400' : 'text-gray-500'}`}>{s}</span>
          </div>
        ))}
      </div>

      {error && <div className="bg-red-900/40 border border-red-500 rounded-lg p-4 mb-6 text-red-300">{error}</div>}

      {/* Step 0: Upload */}
      {step === 0 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Upload jouw foto</h2>
          <p className="text-gray-400 mb-8">JPG, PNG of WEBP — max 20MB</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-8 py-4 rounded-lg font-semibold text-white"
            style={{backgroundColor: '#E85D04'}}
          >Kies foto</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      )}

      {/* Step 1: Processing */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">AI verwerkt jouw foto...</h2>
          {processing && <div className="animate-pulse text-orange-400 text-lg">Achtergrond verwijderen, vectoriseren, DXF genereren...</div>}
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 2 && svgUrl && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Jouw silhouet</h2>
          <div className="rounded-xl overflow-hidden bg-gray-900 p-4">
            <img src={svgUrl} alt="Silhouet preview" className="w-full" />
          </div>
          <button onClick={() => setStep(3)} className="mt-6 w-full py-3 rounded-lg font-semibold text-white" style={{backgroundColor: '#E85D04'}}>
            Kies materiaal
          </button>
        </div>
      )}

      {/* Step 3: Material */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Kies materiaal & dikte</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMaterial(m.id)}
                className={`p-4 rounded-xl border-2 transition-all ${material === m.id ? 'border-orange-500' : 'border-gray-700'}`}
              >
                <div className="font-bold">{m.label}</div>
                <div className="text-orange-400">€{m.price}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mb-8">
            {THICKNESSES.map((t) => (
              <button
                key={t}
                onClick={() => setThickness(t)}
                className={`flex-1 py-2 rounded-lg border-2 font-mono ${thickness === t ? 'border-orange-500 text-orange-400' : 'border-gray-700 text-gray-400'}`}
              >{t}</button>
            ))}
          </div>
          <button onClick={() => setStep(4)} className="w-full py-3 rounded-lg font-semibold text-white" style={{backgroundColor: '#E85D04'}}>
            Doorgaan naar bestellen
          </button>
        </div>
      )}

      {/* Step 4: Order form */}
      {step === 4 && !orderId && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Jouw gegevens</h2>
          {(['name','email','address'] as const).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm text-gray-400 mb-1 capitalize">{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({...form, [field]: e.target.value})}
                className="w-full rounded-lg px-4 py-3 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          ))}
          <button onClick={handleOrder} className="w-full py-3 rounded-lg font-semibold text-white mt-4" style={{backgroundColor: '#E85D04'}}>
            Bestelling plaatsen
          </button>
        </div>
      )}

      {/* Final: confirmation */}
      {orderId && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{color: '#E85D04'}}>Bedankt!</h2>
          <p className="text-gray-300">Je bestelling <span className="font-mono text-orange-400">{orderId.slice(0,8)}</span> is ontvangen.</p>
          <p className="text-gray-400 mt-2">We nemen contact op via {form.email}</p>
        </div>
      )}
    </main>
  )
}
