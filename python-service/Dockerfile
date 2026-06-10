# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Install system dependencies: ffmpeg + build tools
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download Demucs model weights during build (bakes them into image)
RUN python -c "from demucs.pretrained import get_model; get_model('htdemucs')"

COPY . .

# Create temp directories
RUN mkdir -p /tmp/vocalsplit_uploads /tmp/vocalsplit_output

ENV DEMUCS_MODEL=htdemucs
ENV OUTPUT_DIR=/tmp/vocalsplit_output
ENV UPLOAD_DIR=/tmp/vocalsplit_uploads
ENV MAX_FILE_SIZE_MB=100
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
