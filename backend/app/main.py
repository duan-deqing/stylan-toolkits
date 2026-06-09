from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.inpaint import router as inpaint_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.title)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(inpaint_router)

    return app


app = create_app()
