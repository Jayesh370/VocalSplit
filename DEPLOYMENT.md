# VocalSplit AI — Deployment Guide

## Prerequisites

- Node.js 20+
- Python 3.11+
- FFmpeg installed locally for testing
- Git
- Accounts: Vercel, Railway (or Render)

---

## Local Development

### 1. Clone and install

```bash
git clone <your-repo>
cd vocalsplit-ai
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL can remain empty (Vite proxies /api → localhost:3001)
npm run dev
# → http://localhost:5173
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set PYTHON_SERVICE_URL=http://localhost:8000
npm run dev
# → http://localhost:3001
```

### 4. Python Service

```bash
cd python-service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# First run downloads model weights (~300MB)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# → http://localhost:8000
```

---

## Production Deployment

### Step 1 — Deploy Python Service to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `python-service/` as root directory
3. Railway auto-detects Dockerfile
4. Set environment variables:
   ```
   DEMUCS_MODEL=htdemucs
   PORT=8000
   MAX_FILE_SIZE_MB=100
   ```
5. Note the assigned URL: `https://vocalsplit-python.up.railway.app`

> **Note:** The Dockerfile pre-bakes model weights during build (~300MB image). First deploy takes 5–10 minutes.

---

### Step 2 — Deploy Backend to Railway

1. New Railway project → Deploy from GitHub
2. Select `backend/` as root directory
3. Railway auto-detects Dockerfile
4. Set environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   PYTHON_SERVICE_URL=https://vocalsplit-python.up.railway.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   MAX_FILE_SIZE_MB=100
   LOG_LEVEL=info
   ```
5. Note the assigned URL: `https://vocalsplit-backend.up.railway.app`

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select `frontend/` as root directory
3. Framework: Vite (auto-detected)
4. Set environment variables:
   ```
   VITE_API_URL=https://vocalsplit-backend.up.railway.app
   ```
5. Deploy → note your URL: `https://vocalsplit.vercel.app`

---

### Step 4 — Update CORS

After Vercel deployment, go back to Railway backend service and update:
```
ALLOWED_ORIGINS=https://vocalsplit.vercel.app
```
Redeploy backend.

---

## Alternative: Render Deployment

### Python Service on Render

1. New Web Service → Connect GitHub → select `python-service/`
2. Environment: Docker
3. Instance: At least **Standard** (2GB RAM for model)
4. Environment variables: same as Railway above

### Backend on Render

1. New Web Service → Connect GitHub → select `backend/`
2. Environment: Docker
3. Instance: Starter is fine
4. Environment variables: same as Railway above

---

## Resource Requirements

| Service         | Min RAM | Notes                              |
|-----------------|---------|------------------------------------|
| Python (CPU)    | 2 GB    | 4 GB recommended for faster inference |
| Python (GPU)    | 6 GB    | Much faster, requires CUDA instance |
| Node.js backend | 512 MB  | Lightweight                        |
| Frontend (Vercel) | N/A   | Serverless static                  |

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable        | Example                                      | Required |
|-----------------|----------------------------------------------|----------|
| `VITE_API_URL`  | `https://vocalsplit-backend.up.railway.app`  | Yes (prod) |

### Backend (Railway/Render)

| Variable              | Example                                             | Required |
|-----------------------|-----------------------------------------------------|----------|
| `PORT`                | `3001`                                              | Yes      |
| `NODE_ENV`            | `production`                                        | Yes      |
| `PYTHON_SERVICE_URL`  | `https://vocalsplit-python.up.railway.app`          | Yes      |
| `ALLOWED_ORIGINS`     | `https://vocalsplit.vercel.app`                     | Yes      |
| `MAX_FILE_SIZE_MB`    | `100`                                               | No       |
| `LOG_LEVEL`           | `info`                                              | No       |

### Python Service (Railway/Render)

| Variable           | Example           | Required |
|--------------------|-------------------|----------|
| `PORT`             | `8000`            | Yes      |
| `DEMUCS_MODEL`     | `htdemucs`        | No       |
| `MAX_FILE_SIZE_MB` | `100`             | No       |
| `OUTPUT_DIR`       | `/tmp/vs_output`  | No       |
| `UPLOAD_DIR`       | `/tmp/vs_uploads` | No       |

---

## Health Checks

After deployment, verify:

```bash
# Python service
curl https://vocalsplit-python.up.railway.app/health

# Backend
curl https://vocalsplit-backend.up.railway.app/api/health
```

Both should return `{"success": true, ...}`.
