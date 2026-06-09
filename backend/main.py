import os
import threading
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from processor import batch_process, remove_watermarks

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
    "processed": 0,
}

progress_lock = threading.Lock()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/progress")
def get_progress():
    with progress_lock:
        return progress


class SingleInpaintRequest(BaseModel):
    input_path: str
    output_path: str
    rects: list[Rect]


@app.post("/inpaint-single")
def inpaint_single(req: SingleInpaintRequest):
    if not req.input_path:
        raise HTTPException(400, "No input path provided")
    if not req.output_path:
        raise HTTPException(400, "No output path provided")
    if not req.rects:
        raise HTTPException(400, "No rectangles provided")

    input_path = Path(req.input_path)
    if not input_path.is_file():
        raise HTTPException(400, "Input file does not exist")

    output_path = Path(req.output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    rect_tuples = [(r.x, r.y, r.w, r.h) for r in req.rects]
    remove_watermarks(req.input_path, req.output_path, rect_tuples)

    return {"message": "Done", "output_path": req.output_path}


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

    output_path = Path(req.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    total = len(image_paths)
    rect_tuples = [(r.x, r.y, r.w, r.h) for r in req.rects]

    with progress_lock:
        progress.update(current=0, total=total, status="processing", message="")

    def on_progress(current: int, processed: int):
        with progress_lock:
            progress["current"] = current
            progress["processed"] = processed

    def run():
        try:
            processed = batch_process(image_paths, req.output_dir, rect_tuples, on_progress)
            with progress_lock:
                progress.update(
                    current=total,
                    total=total,
                    status="done",
                    message=f"Completed: {processed}/{total} processed",
                )
        except Exception as e:
            with progress_lock:
                progress.update(
                    current=0, total=total, status="error", message=str(e)
                )

    thread = threading.Thread(target=run, daemon=True)
    thread.start()

    return {"message": "Processing started", "total": total}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8766))
    uvicorn.run(app, host="127.0.0.1", port=port)
