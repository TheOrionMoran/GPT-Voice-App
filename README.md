# GPT Voice App

Полностековое приложение для общения с ИИ (через OpenRouter/OpenAI) с поддержкой голосового ввода (Web Speech API).

## 🚀 Особенности
- **Интерфейс на Vue 3**: современный UI с использованием Tailwind CSS.
- **Голосовой ввод**: интеграция с Web Speech API для диктовки сообщений.
- **Robust Error Handling**: обработка ошибок на уровне API, сети и доступа к микрофону.

## 🛠 Технологический стек
- **Frontend**: Vue 3 (Composition API), TypeScript, Vite, Tailwind CSS.
- **Backend**: Node.js, Express, TypeScript, OpenAI SDK.
- **API**: OpenRouter (с поддержкой бесплатных моделей).

## 📦 Инициализация и запуск

### 1. Установка зависимостей
Приложение использует `npm workspaces`. Установите все зависимости одной командой из корня проекта:
```bash
npm install
```

### 2. Настройка окружения
Создайте файл `.env` в директории `backend/` и добавьте ваш ключ OpenRouter:
```env
OPENROUTER_API_KEY=your_api_key_here
PORT=3000
```

### 3. Запуск в режиме разработки
Запустите фронтенд и бэкенд одновременно из корня проекта:
```bash
npm run dev
```
- Frontend будет доступен по адресу: `http://localhost:5173`
- Backend запустится на порту `3000` (запросы проксируются через `/api`)

## 📂 Структура проекта
- `/frontend`: Vue 3 приложение.
- `/backend`: Express сервер.
- `/package.json`: Конфигурация воркспейсов и скриптов запуска.
