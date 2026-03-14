import os
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager, contextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

DB = "/data/todos.db"
STATIC = "/app/static"


def init_db():
    os.makedirs("/data", exist_ok=True)
    with sqlite3.connect(DB) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                text TEXT NOT NULL,
                done INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL
            )
        """)


@contextmanager
def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


# ── API ──────────────────────────────────────────────────────────────────────


@app.get("/mptodo/api/todos")
def list_todos():
    with get_db() as db:
        rows = db.execute("SELECT * FROM todos ORDER BY created_at").fetchall()
        return [dict(r) for r in rows]


class TodoCreate(BaseModel):
    text: str


@app.post("/mptodo/api/todos")
def create_todo(body: TodoCreate):
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "text required")
    todo_id = str(uuid.uuid4())
    with get_db() as db:
        db.execute(
            "INSERT INTO todos VALUES (?, ?, 0, ?)",
            [todo_id, text, int(time.time() * 1000)],
        )
    return {"id": todo_id}


@app.patch("/mptodo/api/todos/{todo_id}")
def toggle_todo(todo_id: str):
    with get_db() as db:
        row = db.execute("SELECT done FROM todos WHERE id=?", [todo_id]).fetchone()
        if not row:
            raise HTTPException(404)
        db.execute("UPDATE todos SET done=? WHERE id=?", [1 - row["done"], todo_id])
    return {"ok": True}


@app.delete("/mptodo/api/todos/{todo_id}")
def delete_todo(todo_id: str):
    with get_db() as db:
        db.execute("DELETE FROM todos WHERE id=?", [todo_id])
    return {"ok": True}


# ── Static / SPA ─────────────────────────────────────────────────────────────


@app.get("/mptodo")
@app.get("/mptodo/")
async def serve_root():
    return FileResponse(f"{STATIC}/index.html")


@app.get("/mptodo/{path:path}")
async def serve_spa(path: str):
    file_path = os.path.join(STATIC, path)
    if path and os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(f"{STATIC}/index.html")
