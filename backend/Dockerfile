# ============================================================
# SmartBreadboard 3D
# Production FastAPI + YOLO + OpenCV + PyTorch Backend
# ============================================================

FROM python:3.11-slim

# ------------------------------------------------------------
# System dependencies required by OpenCV / YOLO
# ------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# Application working directory
# ------------------------------------------------------------
WORKDIR /app

# ------------------------------------------------------------
# Python dependencies
# ------------------------------------------------------------
COPY backend/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade pip

# Install CPU-only PyTorch
RUN pip install --no-cache-dir \
    torch \
    torchvision \
    --index-url https://download.pytorch.org/whl/cpu

# Install remaining backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------------------------------------
# Copy backend source code
# ------------------------------------------------------------
COPY backend/ .

# ------------------------------------------------------------
# Runtime environment
# ------------------------------------------------------------
ENV PYTHONUNBUFFERED=1
ENV ALLOWED_ORIGINS="*"

# Render supplies PORT at runtime.
# 10000 is the fallback for local/container testing.
ENV PORT=10000

# ------------------------------------------------------------
# Container port
# ------------------------------------------------------------
EXPOSE 10000

# ------------------------------------------------------------
# Docker health check
# ------------------------------------------------------------
HEALTHCHECK \
    --interval=30s \
    --timeout=10s \
    --start-period=60s \
    --retries=3 \
    CMD curl -f http://localhost:${PORT:-10000}/api/circuit/health || exit 1

# ------------------------------------------------------------
# Start FastAPI
# ------------------------------------------------------------
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]