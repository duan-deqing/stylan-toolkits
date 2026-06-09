import cv2
import numpy as np
from pathlib import Path


def remove_watermarks(
    img_path: str,
    output_path: str,
    rects: list[tuple[int, int, int, int]],
    inpaint_radius: int = 3,
    flags: int = cv2.INPAINT_TELEA,
) -> None:
    img = cv2.imread(str(img_path))
    if img is None:
        raise ValueError(f"Cannot read image: {img_path}")

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    for x, y, w, h in rects:
        mask[y : y + h, x : x + w] = 255

    result = cv2.inpaint(img, mask, inpaint_radius, flags)
    cv2.imwrite(str(output_path), result)


def batch_process(
    image_paths: list[str],
    output_dir: str,
    rects: list[tuple[int, int, int, int]],
) -> int:
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    processed = 0
    for img_path in image_paths:
        try:
            dest = out_path / Path(img_path).name
            remove_watermarks(img_path, str(dest), rects)
            processed += 1
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
    return processed
