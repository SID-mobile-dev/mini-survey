# In-memory хранение ответов: обычный список в памяти процесса.
# По ТЗ достаточно slice/array/map — при перезапуске сервера данные пропадают.

_answers: list[dict] = []


def save_answers(payload: dict) -> dict:
    """Сохранить один набор ответов (результат одной отправки формы).

    Ожидаемый формат payload:
        {"answers": [{"question_id": 1, "value": "Иван"}, ...]}
    """
    record = {
        "id": len(_answers) + 1,
        "answers": payload["answers"],
    }
    _answers.append(record)
    return record


def get_all_answers() -> list[dict]:
    """Вернуть все сохранённые ответы (для проверки и отладки)."""
    return _answers


def clear() -> None:
    """Очистить хранилище (удобно для тестов)."""
    _answers.clear()
