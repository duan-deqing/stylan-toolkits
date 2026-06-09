import os
import threading
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from processor import batch_process

app = FastAPI(title="Watermark Remover Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Rect(BaseModel):
    x: int
    y: int
    w: int
    h: int

class InpaintRequest(BaseModel):
    input_dir: str
    output_dir: str
    rects: list[Rect]

progress = {
    "current": 0,
    "total": 0,
    "status": "idle",
    "message": "",
}

progress_lock = threading.Lock()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/progress")
def get_progress():
    with progress_lock:
        return progress


@app.post("/inpaint")
def inpaint(req: InpaintRequest):
    if not req.input_dir:
        raise HTTPException(400, "No input directory provided")
    if not req.output_dir:
        raise HTTPException(400, "No output directory provided")
    if not req.rects:
        raise HTTPException(400, "No rectangles provided")

    ext_set = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}
    input_path = Path(req.input_dir)
    if not input_path.is_dir():
        raise HTTPException(400, "Input directory does not exist")

    image_paths = [
        str(p) for p in input_path.iterdir()
        if p.is_file() and p.suffix.lower() in ext_set
    ]

    if not image_paths:
        raise HTTPException(400, "No image files found in input directory")

    total = len(image_paths)
    with progress_lock:
        progress.update(current=0, total=total, status="processing", message="")

    def run():
        processed = 0
        rect_tuples = [(r.x, r.y, r.w, r.h) for r in req.rects]
        for i, img_path in enumerate(image_paths):
            try:
                batch_process([img_path], req.output_dir, rect_tuples)
                processed += 1
            except Exception as e:
                print(f"Error: {e}")
            with progress_lock:
                progress["current"] = i + 1
        with progress_lock:
            progress.update(
                current=processed,
                total=total,
                status="done",
                message=f"done",
            )

    thread = threading.Thread(target=run, daemon=True)
    thread.start()

    return {"message": "Processing started", "total": total, "files_found": len(image_paths)}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8766))
    uvicorn.run(app, host="127.0.0.1", port=port)
