// Логика «Мини-анкеты»:
// 1) загружаем вопросы из GET /questions;
// 2) рендерим форму;
// 3) отправляем ответы в POST /answers;
// 4) показываем «Спасибо!».

const API_BASE = ""; // backend и фронтенд на одном порту — путь относительный

const surveyView = document.getElementById("survey-view");
const thanksView = document.getElementById("thanks-view");
const form = document.getElementById("survey-form");
const questionsBox = document.getElementById("questions");
const loadingBox = document.getElementById("loading");
const errorBox = document.getElementById("error");

// ---------- Загрузка вопросов ----------

async function loadQuestions() {
  try {
    const res = await fetch(`${API_BASE}/questions`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const questions = await res.json();
    renderQuestions(questions);
  } catch (err) {
    loadingBox.textContent = "Не удалось загрузить вопросы. Проверьте, что backend запущен.";
    console.error("Ошибка загрузки вопросов:", err);
  }
}

function renderQuestions(questions) {
  questionsBox.innerHTML = "";
  for (const q of questions) {
    const item = document.createElement("div");
    item.className = "question";

    const label = document.createElement("label");
    label.htmlFor = `q-${q.id}`;
    label.textContent = q.text;

    const input = document.createElement("textarea");
    input.id = `q-${q.id}`;
    input.name = `q-${q.id}`;
    input.dataset.questionId = q.id;
    input.required = true;
    if (q.type === "text") {
      input.rows = 1;
      input.classList.add("single-line");
    } else {
      input.rows = 4;
    }
    input.placeholder = "Ваш ответ";

    item.append(label, input);
    questionsBox.appendChild(item);
  }

  loadingBox.hidden = true;
  form.hidden = false;
}

// ---------- Отправка ответов ----------

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  const inputs = questionsBox.querySelectorAll("textarea[data-question-id]");
  const answers = Array.from(inputs).map((el) => ({
    question_id: Number(el.dataset.questionId),
    value: el.value.trim(),
  }));

  // Простая проверка на клиенте: все поля должны быть заполнены
  const empty = answers.find((a) => !a.value);
  if (empty) {
    showError("Пожалуйста, заполните все вопросы.");
    return;
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail ? JSON.stringify(body.detail) : `HTTP ${res.status}`);
    }
    showThanks();
  } catch (err) {
    showError("Не удалось отправить ответы. Попробуйте ещё раз.");
    console.error("Ошибка отправки ответов:", err);
  } finally {
    submitBtn.disabled = false;
  }
});

// ---------- Экраны и утилиты ----------

function showThanks() {
  surveyView.hidden = true;
  thanksView.hidden = false;
}

document.getElementById("again-btn").addEventListener("click", () => {
  form.reset();
  thanksView.hidden = true;
  surveyView.hidden = false;
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function hideError() {
  errorBox.hidden = true;
}

// Старт
loadQuestions();
