# VocalSplit AI — Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
│  React + TypeScript + Vite + Tailwind CSS               │
│  (Deployed: Vercel)                                     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS REST API
┌────────────────────────▼────────────────────────────────┐
│                  NODE.JS BACKEND                        │
│  Express + TypeScript                                   │
│  (Deployed: Railway/Render)                             │
│  - Receives file uploads (multer)                       │
│  - Validates files                                      │
│  - Calls Python service                                 │
│  - Streams results back                                 │
│  - Cleans up temp files                                 │
└────────────────────────┬────────────────────────────────┘
                         │ Internal HTTP
┌────────────────────────▼────────────────────────────────┐
│                  PYTHON AI SERVICE                      │
│  FastAPI + Demucs + FFmpeg                              │
│  (Deployed: Railway/Render)                             │
│  - Receives audio bytes                                 │
│  - Runs Demucs separation                               │
│  - Returns vocals + instrumental                        │
└─────────────────────────────────────────────────────────┘
```

## API Routes

### Node.js Backend (Port 3001)

| Method | Route              | Description                              |
|--------|--------------------|------------------------------------------|
| POST   | /api/upload        | Upload audio file, returns job ID        |
| GET    | /api/status/:jobId | Poll processing status                   |
| GET    | /api/download/:jobId/:track | Download vocals or instrumental |
| DELETE | /api/cleanup/:jobId | Manual cleanup (auto-runs on download)  |
| GET    | /api/health        | Health check                             |

### Python Service (Port 8000)

| Method | Route       | Description                              |
|--------|-------------|------------------------------------------|
| POST   | /separate   | Accepts audio file, returns stems        |
| GET    | /health     | Health check                             |

## Processing Flow

1. User uploads file → Node.js backend
2. Node.js validates (type, size)
3. Node.js assigns jobId (UUID), saves to temp
4. Node.js POSTs file to Python service
5. Python runs Demucs `htdemucs` model
6. Python extracts vocals.wav + no_vocals.wav
7. Python converts to MP3 for efficient delivery
8. Node.js receives results, stores as temp files
9. Node.js returns jobId + status=ready to frontend
10. Frontend polls /api/status/:jobId
11. Frontend renders audio players on ready
12. On download, file is served then scheduled for deletion

## Folder Structure

```
vocalsplit-ai/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Reusable primitives (Button, Spinner, etc.)
│   │   │   ├── layout/     # Header, Footer
│   │   │   ├── upload/     # DropZone, UploadProgress
│   │   │   ├── player/     # AudioPlayer, TrackCard
│   │   │   └── landing/    # Hero, Features, HowItWorks, FAQ
│   │   ├── hooks/          # useAudioPlayer, useUpload, useJobStatus
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # formatters, validators
│   │   └── stores/         # Zustand state
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/         # uploadRoutes, downloadRoutes
│   │   ├── middleware/      # errorHandler, rateLimiter, multerConfig
│   │   ├── services/       # pythonService, jobManager, cleanupService
│   │   ├── types/          # Job, ApiResponse interfaces
│   │   └── utils/          # fileUtils, logger
│   ├── uploads/temp/       # Temp file storage
│   ├── tsconfig.json
│   └── package.json
│
└── python-service/         # FastAPI + Demucs
    ├── main.py             # FastAPI app
    ├── separator.py        # Demucs wrapper
    ├── utils.py            # File helpers
    ├── requirements.txt
    └── Dockerfile
```

## Deployment Strategy

### Frontend → Vercel
- Auto-deploys from Git
- Environment: VITE_API_URL=https://your-backend.railway.app

### Backend → Railway
- Dockerfile or nixpacks auto-detection
- Environment: PYTHON_SERVICE_URL, MAX_FILE_SIZE, ALLOWED_ORIGINS

### Python Service → Railway (separate service)
- Dockerfile with CUDA support optional
- Environment: MODEL_NAME=htdemucs
