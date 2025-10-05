# ---- Build stage ----
FROM python:3.11-slim AS builder
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---- Runtime stage ----
FROM python:3.11-slim
RUN useradd -m -r appuser && mkdir /app && chown appuser /app
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 8000

# Puerto que Railway inyecta (obligatorio)
ENV PORT=8000
CMD ["sh", "-c", "python manage.py collectstatic --noinput && gunicorn kanban.wsgi:application --bind 0.0.0.0:$PORT"]