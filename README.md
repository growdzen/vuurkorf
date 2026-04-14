# Vuurkorf Personalisatie

AI-gedreven webapplicatie waarmee klanten een foto uploaden die automatisch wordt omgezet naar een lasersnijbaar silhouet voor een gepersonaliseerde vuurkorf.

## Architectuur

```
vuurkorf/
├── backend/          # FastAPI + Python AI pipeline
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/  (upload, process, preview, orders)
│   │   ├── services/ (image_processor, vectorizer, dxf_generator, pricing)
│   │   └── models/   (job, order)
│   └── requirements.txt
└── frontend/         # Next.js 14 App Router + TypeScript + Tailwind
    ├── app/
    │   ├── page.tsx
    │   └── configurator/page.tsx
    └── lib/api.ts
```

## Stack
- Backend: FastAPI, rembg, OpenCV, vtracer, ezdxf
- Frontend: Next.js 14, TypeScript, Tailwind CSS

## Prijzen
| Materiaal | Prijs |
|-----------|-------|
| Cortenstaal | €89 |
| RVS | €149 |
| Zwart staal | €69 |
