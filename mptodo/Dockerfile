FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY app/package.json ./
RUN bun install
COPY app/ .
RUN bun run build

FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir fastapi "uvicorn[standard]"
COPY main.py .
COPY --from=builder /app/dist /app/static
VOLUME /data
EXPOSE 8767
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8767"]
