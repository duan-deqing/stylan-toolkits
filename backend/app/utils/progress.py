import threading

from app.models.schemas import ProgressResponse


class ProgressTracker:
    def __init__(self):
        self._lock = threading.Lock()
        self._data = ProgressResponse()

    @property
    def current(self) -> int:
        with self._lock:
            return self._data.current

    @current.setter
    def current(self, value: int):
        with self._lock:
            self._data.current = value

    @property
    def total(self) -> int:
        with self._lock:
            return self._data.total

    @total.setter
    def total(self, value: int):
        with self._lock:
            self._data.total = value

    @property
    def status(self) -> str:
        with self._lock:
            return self._data.status

    @status.setter
    def status(self, value: str):
        with self._lock:
            self._data.status = value

    @property
    def message(self) -> str:
        with self._lock:
            return self._data.message

    @message.setter
    def message(self, value: str):
        with self._lock:
            self._data.message = value

    @property
    def processed(self) -> int:
        with self._lock:
            return self._data.processed

    @processed.setter
    def processed(self, value: int):
        with self._lock:
            self._data.processed = value

    def reset(self, *, current: int = 0, total: int = 0, status: str = "idle", message: str = "", processed: int = 0):
        with self._lock:
            self._data = ProgressResponse(
                current=current,
                total=total,
                status=status,
                message=message,
                processed=processed,
            )

    def snapshot(self) -> ProgressResponse:
        with self._lock:
            return self._data.model_copy()
