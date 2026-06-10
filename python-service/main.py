"""
main.py — VocalSplit AI Python service.

FastAPI application that accepts audio uploads, runs Demucs separation,
and returns paths to the generated stems.
"""

import os
import tempfile
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
import aiofiles

from separator import separate, cleanup_job, get_demucs_model

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

UPLOAD_DIR = os.getenv(
    "UPLOAD_DIR",
    str(Path.cwd() / "uploads")
)
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", "100")) * 1024 * 1024


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Pre-load the Demucs model on startup."""
    logger.info("Pre-loading Demucs model…")
    get_demucs_model()
    logger.info("Model ready.")
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="VocalSplit AI — Python Service",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health():
    return {"status": "ok", "model": os.getenv("DEMUCS_MODEL", "htdemucs")}


@app.post("/separate")
async def separate_audio(
    background_tasks: BackgroundTasks,
    audio: UploadFile = File(...),
    job_id: str = Form(...),
):
    """
    Accepts an audio file upload, runs separation, and returns
    JSON with paths to the separated stems.
    """
    # Validate content type loosely
    allowed_types = {
        "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
        "audio/wave", "audio/flac", "audio/x-flac",
        "audio/x-m4a", "audio/mp4", "audio/m4a",
        "application/octet-stream",  # some clients send this
    }
    if audio.content_type and audio.content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported content type: {audio.content_type}"
        )

    # Determine file extension
    original_ext = Path(audio.filename or "audio.mp3").suffix.lower() or ".mp3"

    # Save uploaded file to disk
    upload_path = os.path.join(UPLOAD_DIR, f"{job_id}{original_ext}")

    async with aiofiles.open(upload_path, "wb") as f:
        total = 0
        while chunk := await audio.read(1024 * 1024):  # 1MB chunks
            total += len(chunk)
            if total > MAX_FILE_SIZE:
                await f.close()
                os.remove(upload_path)
                raise HTTPException(status_code=413, detail="File too large.")
            await f.write(chunk)

    logger.info(f"[{job_id}] Saved upload: {upload_path} ({total / 1024 / 1024:.1f} MB)")

    try:
        result = separate(upload_path, job_id)
    except Exception as exc:
        logger.error(f"[{job_id}] Separation error: {exc}", exc_info=True)
        # Cleanup upload on failure
        if os.path.exists(upload_path):
            os.remove(upload_path)
        raise HTTPException(status_code=500, detail=str(exc))

    # Remove the original upload now that stems exist
    if os.path.exists(upload_path):
        os.remove(upload_path)

    return JSONResponse({
        "success": True,
        "vocals_path": result["vocals_path"],
        "instrumental_path": result["instrumental_path"],
    })


@app.delete("/cleanup/{job_id}")
async def cleanup(job_id: str):
    """Manually clean up output files for a job."""
    cleanup_job(job_id)
    return {"success": True, "message": f"Job {job_id} cleaned up."}
