from pathlib import Path

import cv2
import numpy as np

from app.config import settings


def remove_watermarks(
    img_path: str,
    output_path: str,
    rects: list[tuple[int, int, int, int]],
    inpaint_radius: int | None = None,
    flags: int | None = None,
) -> None:
    img = cv2.imread(str(img_path))
    if img is None:
        raise ValueError(f"Cannot read image: {img_path}")

    inpaint_radius = inpaint_radius or settings.default_inpaint_radius
    flags = flags if flags is not None else settings.default_inpaint_flags

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    for x, y, w, h in rects:
        mask[y : y + h, x : x + w] = 255

    result = cv2.inpaint(img, mask, inpaint_radius, flags)
    cv2.imwrite(str(output_path), result)


def collect_images(input_dir: str) -> list[str]:
    path = Path(input_dir)
    return [
        str(p) for p in path.iterdir()
        if p.is_file() and p.suffix.lower() in settings.supported_extensions
    ]


def batch_process(
    image_paths: list[str],
    output_dir: str,
    rects: list[tuple[int, int, int, int]],
    on_progress: callable = None,
) -> int:
    out_path = Path(output_dir)
    processed = 0
    for i, img_path in enumerate(image_paths):
        try:
            dest = out_path / Path(img_path).name
            remove_watermarks(img_path, str(dest), rects)
            processed += 1
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
        if on_progress:
            on_progress(i + 1, processed)
    return processed
