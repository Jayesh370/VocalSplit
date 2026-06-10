"""
separator.py — Demucs audio separation wrapper.

Runs the htdemucs model to separate vocals from instrumentals,
then converts the output stems to MP3 using ffmpeg.
"""

import os
import subprocess
import tempfile
import shutil
import logging
from pathlib import Path

import torch
import os

FFMPEG_DIR = r"D:\game file\ffmpeg-2026-06-08-git-6028720d70-essentials_build\ffmpeg-2026-06-08-git-6028720d70-essentials_build\bin"

os.environ["PATH"] = FFMPEG_DIR + os.pathsep + os.environ["PATH"]
from demucs.pretrained import get_model
from demucs.apply import apply_model
from demucs.audio import AudioFile, save_audio

logger = logging.getLogger(__name__)

# Model name — htdemucs gives the best quality/speed balance
MODEL_NAME = os.getenv("DEMUCS_MODEL", "htdemucs")
OUTPUT_DIR = os.getenv(
    "OUTPUT_DIR",
    str(Path.cwd() / "output")
)

# Load model once at startup and keep in memory
_model = None


def get_demucs_model():
    global _model
    if _model is None:
        logger.info(f"Loading Demucs model: {MODEL_NAME}")
        _model = get_model(MODEL_NAME)
        _model.eval()
        if torch.cuda.is_available():
            _model.cuda()
            logger.info("Using CUDA for inference")
        else:
            logger.info("Using CPU for inference")
    return _model


def separate(input_path: str, job_id: str) -> dict:
    """
    Separate vocals and instrumental from input_path.

    Returns:
        {
          "vocals_path": "/tmp/.../vocals.mp3",
          "instrumental_path": "/tmp/.../instrumental.mp3"
        }
    Raises:
        Exception on any failure.
    """
    job_output_dir = Path(OUTPUT_DIR) / job_id
    job_output_dir.mkdir(parents=True, exist_ok=True)

    logger.info(f"[{job_id}] Starting separation: {input_path}")

    model = get_demucs_model()
    device = "cuda" if torch.cuda.is_available() else "cpu"

    # Load audio via Demucs AudioFile helper
    wav = AudioFile(input_path).read(
        streams=0,
        samplerate=model.samplerate,
        channels=model.audio_channels,
    )

    # Add batch dimension: [1, channels, samples]
    wav = wav.unsqueeze(0).to(device)

    # Run model
    with torch.no_grad():
        sources = apply_model(
            model,
            wav,
            device=device,
            shifts=1,
            split=True,
            overlap=0.25,
            progress=False,
        )[0]

        print("Sources:", model.sources)
        print("Sources shape:", sources.shape)
 
        

    # sources shape: [num_sources, channels, samples]
    # htdemucs source order: drums, bass, other, vocals
    source_names = model.sources  # e.g. ['drums', 'bass', 'other', 'vocals']

    vocals_idx = source_names.index("vocals")
    vocals_wav = sources[vocals_idx].cpu()

    # Instrumental = all sources except vocals summed
    instrumental_wav = sum(
        sources[i].cpu()
        for i in range(len(source_names))
        if i != vocals_idx
    )
    print("Vocals max:", vocals_wav.abs().max().item())
    print("Instrumental max:", instrumental_wav.abs().max().item())

    # Save as WAV first, then convert to MP3
    vocals_wav_path = str(job_output_dir / "vocals.wav")
    instrumental_wav_path = str(job_output_dir / "instrumental.wav")

    save_audio(vocals_wav, vocals_wav_path, samplerate=model.samplerate)
    save_audio(instrumental_wav, instrumental_wav_path, samplerate=model.samplerate)

    logger.info(f"[{job_id}] WAV stems saved, converting to MP3")

    vocals_mp3 = str(job_output_dir / "vocals.mp3")
    instrumental_mp3 = str(job_output_dir / "instrumental.mp3")

    _wav_to_mp3(vocals_wav_path, vocals_mp3)
    _wav_to_mp3(instrumental_wav_path, instrumental_mp3)

    # Remove intermediate WAVs
    os.remove(vocals_wav_path)
    os.remove(instrumental_wav_path)

    logger.info(f"[{job_id}] Separation complete")

    return {
        "vocals_path": vocals_mp3,
        "instrumental_path": instrumental_mp3,
    }


def _wav_to_mp3(wav_path: str, mp3_path: str, bitrate: str = "320k") -> None:
    """Convert WAV to MP3 using ffmpeg subprocess."""
    result = subprocess.run(
        [
            "ffmpeg",
            "-y",              # overwrite output
            "-i", wav_path,
            "-codec:a", "libmp3lame",
            "-b:a", bitrate,
            "-ar", "44100",    # normalize sample rate
            mp3_path,
        ],
        capture_output=True,
        text=True,
        timeout=120,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg conversion failed: {result.stderr}")


def cleanup_job(job_id: str) -> None:
    """Remove output files for a finished job."""
    job_dir = Path(OUTPUT_DIR) / job_id
    if job_dir.exists():
        shutil.rmtree(job_dir)
        logger.info(f"[{job_id}] Output files cleaned up")
