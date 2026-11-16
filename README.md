# Мини-анкета

Тестовый стенд для обкатки AI-инструментария (домашнее задание курса).
Минимальное full-stack приложение: backend на FastAPI + фронтенд на HTML/JS.

## Структура

```
mini-survey/
├── backend/            # API на FastAPI
│   ├── app/
│   │   ├── main.py         # эндпоинты + раздача фронтенда
│   │   ├── questions.py    # 4 жёстко заданных вопроса
│   │   └── storage.py      # in-memory хранение ответов
│   └── requirements.txt
├── frontend/           # HTML+JS/CSS: форма анкеты
│   ├── index.html
│   ├── app.js
│   └── style.css
├── docs/screenshots/   # скриншоты работы приложения
└── REPORT.md           # отчёт по обкатке инструментария
```

## Запуск

Требуется Python 3.10+.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Открыть в браузере: <http://127.0.0.1:8000>

Backend раздаёт фронтенд с того же порта — отдельный сервер не нужен.

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/questions` | Список из 4 жёстко заданных вопросов |
| POST | `/answers` | Принимает `{"answers": [{"question_id": 1, "value": "..."}]}`, хранит в памяти |
| GET | `/api/answers` | Служебный: все сохранённые ответы (для проверки) |

Пример проверки:

```bash
curl http://127.0.0.1:8000/questions
curl -X POST http://127.0.0.1:8000/answers \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"question_id":1,"value":"Иван"}]}'
```

Хранение — in-memory (список в памяти процесса): при перезапуске сервера ответы стираются.

## Скриншоты

`docs/screenshots/`: форма с вопросами, заполненная форма, экран «Спасибо!».

## Отчёт

REPORT.md — отчёт по обкатке AI-инструментария: setup, альтернативы, полные промпты, неудачные попытки, выводы.
