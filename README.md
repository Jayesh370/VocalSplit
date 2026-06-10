# VocalSplit AI

> Upload a song. Get vocals and instrumentals separately. Powered by Demucs AI.

## Quick Start

```bash
# 1. Python service (terminal 1)
cd python-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000

# 2. Backend (terminal 2)
cd backend
npm install
cp .env.example .env
npm run dev

# 3. Frontend (terminal 3)
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## Project Structure

```
vocalsplit-ai/
├── frontend/               React + TypeScript + Vite + Tailwind CSS
├── backend/                Node.js + Express + TypeScript
├── python-service/         FastAPI + Demucs + FFmpeg
├── ARCHITECTURE.md         System design
├── DEPLOYMENT.md           Step-by-step deployment guide
└── TESTING.md              Testing plan and test cases
```

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| Backend        | Node.js 20, Express, TypeScript   |
| AI Processing  | Python 3.11, Demucs (htdemucs), FastAPI |
| Audio          | FFmpeg                            |
| Frontend Deploy| Vercel                            |
| Backend Deploy | Railway / Render                  |
| Python Deploy  | Railway / Render (Docker)         |

## Key Features

- AI vocal separation via Meta's Demucs model
- Drag-and-drop upload (MP3, WAV, FLAC, M4A, max 100MB)
- In-browser audio preview with play/pause/seek/volume
- Download vocals and instrumental as separate MP3s
- Zero storage — all files deleted after processing
- No account, login, or subscription required
- Dark mode UI, fully responsive

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Testing Guide](./TESTING.md)
