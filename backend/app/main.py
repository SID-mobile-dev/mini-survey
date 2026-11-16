# FastAPI-приложение «Мини-анкета».
# Эндпоинты по ТЗ: GET /questions, POST /answers (хранение в памяти).
# Плюс раздача фронтенда (frontend/) со статики, чтобы приложение
# запускалось одной командой и открывалось по одному адресу.

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app.questions import get_questions
from app.storage import save_answers, get_all_answers

app = FastAPI(title="Мини-анкета", version="1.0.0")

# CORS: фронтенд и backend на одном порту, но разрешаем всё,
# чтобы можно было открывать index.html и отдельно (file://, другой порт).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Answer(BaseModel):
    question_id: int = Field(..., description="ID вопроса из списка")
    value: str = Field(..., min_length=1, description="Текст ответа")


class AnswerSubmission(BaseModel):
    answers: list[Answer] = Field(..., min_length=1)


@app.get("/questions")
def list_questions() -> list[dict]:
    """Список из 3–5 жёстко заданных вопросов."""
    return get_questions()


@app.post("/answers")
def submit_answers(payload: AnswerSubmission) -> dict:
    """Принять ответы и сохранить их в память."""
    known_ids = {q["id"] for q in get_questions()}
    for answer in payload.answers:
        if answer.question_id not in known_ids:
            raise HTTPException(
                status_code=422,
                detail=f"Неизвестный вопрос: id={answer.question_id}",
            )
    record = save_answers(payload.model_dump())
    return {"status": "ok", "saved": record["id"]}


@app.get("/api/answers")
def list_answers() -> list[dict]:
    """Служебный эндпоинт: что накопилось в памяти (для проверки сценария)."""
    return get_all_answers()


# Раздача фронтенда. Mount ставим последним, чтобы /questions и /answers
# не перехватывались статикой. html=True отдаёт index.html на "/".
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
