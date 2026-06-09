from pydantic import BaseModel


class Rect(BaseModel):
    x: int
    y: int
    w: int
    h: int


class InpaintRequest(BaseModel):
    input_dir: str
    output_dir: str
    rects: list[Rect]


class SingleInpaintRequest(BaseModel):
    input_path: str
    output_path: str
    rects: list[Rect]


class ProgressResponse(BaseModel):
    current: int = 0
    total: int = 0
    status: str = "idle"
    message: str = ""
    processed: int = 0


class HealthResponse(BaseModel):
    status: str = "ok"


class InpaintResponse(BaseModel):
    message: str
    total: int | None = None
    output_path: str | None = None
