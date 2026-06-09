import os
from dataclasses import dataclass, field


@dataclass
class Settings:
    host: str = os.environ.get("HOST", "127.0.0.1")
    port: int = int(os.environ.get("PORT", "8766"))
    title: str = "Watermark Remover Backend"
    cors_origins: list[str] = field(default_factory=lambda: ["*"])

    supported_extensions: set[str] = field(default_factory=lambda: {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"})
    default_inpaint_radius: int = 3
    default_inpaint_flags: int = 0  # cv2.INPAINT_NS


settings = Settings()
