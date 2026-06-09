import threading
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.schemas import (
    InpaintRequest,
    InpaintResponse,
    ProgressResponse,
    SingleInpaintRequest,
)
from app.services.processor import batch_process, collect_images, remove_watermarks
from app.utils.progress import ProgressTracker

router = APIRouter()
progress = ProgressTracker()


@router.get("/health", response_model=InpaintResponse)
def health():
    return InpaintResponse(message="ok")


@router.get("/progress", response_model=ProgressResponse)
def get_progress():
    return progress.snapshot()


@router.post("/inpaint-single", response_model=InpaintResponse)
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
    try:
        remove_watermarks(req.input_path, req.output_path, rect_tuples)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Unexpected error processing image: {e}")

    return InpaintResponse(message="Done", output_path=req.output_path)


@router.post("/inpaint", response_model=InpaintResponse)
def inpaint(req: InpaintRequest):
    if not req.input_dir:
        raise HTTPException(400, "No input directory provided")
    if not req.output_dir:
        raise HTTPException(400, "No output directory provided")
    if not req.rects:
        raise HTTPException(400, "No rectangles provided")

    input_path = Path(req.input_dir)
    if not input_path.is_dir():
        raise HTTPException(400, "Input directory does not exist")

    image_paths = collect_images(req.input_dir)
    if not image_paths:
        raise HTTPException(400, "No image files found in input directory")

    output_path = Path(req.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    total = len(image_paths)
    rect_tuples = [(r.x, r.y, r.w, r.h) for r in req.rects]

    progress.reset(current=0, total=total, status="processing")

    def on_progress(current: int, processed: int):
        progress.current = current
        progress.processed = processed

    def run():
        try:
            processed = batch_process(image_paths, req.output_dir, rect_tuples, on_progress)
            progress.reset(
                current=total,
                total=total,
                status="done",
                message=f"Completed: {processed}/{total} processed",
                processed=processed,
            )
        except Exception as e:
            progress.reset(
                current=0, total=total, status="error", message=str(e)
            )

    thread = threading.Thread(target=run, daemon=True)
    thread.start()

    return InpaintResponse(message="Processing started", total=total)
