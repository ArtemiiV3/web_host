# Видеохостинг

Это веб-платформа для потокового видео, где пользователи могут регистрироваться, входить в систему, загружать и просматривать видео. Проект использует Django для бэкенда и React (с TypeScript) для фронтенда.

## Требования

Перед началом убедись, что у тебя установлены следующие инструменты:

- **Python** (версия 3.9 или выше) - [Скачать Python](https://www.python.org/downloads/)
- **Node.js** (версия 16 или выше) и **npm** - [Скачать Node.js](https://nodejs.org/)
- **PostgreSQL** - [Скачать PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Скачать Git](https://git-scm.com/downloads/)

Проверь установку:
- `python --version`
- `node --version`
- `npm --version`
- `psql --version`
- `git --version`

## Структура проекта

```
video-hosting/
├── backend/    # Бэкенд на Django
└── frontend/   # Фронтенд на React
```

## Инструкция по установке

Следуй этим шагам, чтобы клонировать, настроить и запустить проект.

### 1. Клонируй репозиторий

Склонируй проект на свой компьютер:

```bash
git clone <ссылка_на_репозиторий>
cd video-hosting
```

Замени `<ссылка_на_репозиторий>` на URL твоего репозитория.

### 2. Настройка бэкенда (Django)

#### 2.1. Перейди в папку бэкенда
```bash
cd backend
```

#### 2.2. Создай и активируй виртуальное окружение
```bash
python -m venv venv
source venv/bin/activate  # Для Windows: venv\Scripts\activate
```

После активации ты увидишь `(venv)` в терминале.

#### 2.3. Установи зависимости для бэкенда
Установи необходимые Python-пакеты:
```bash
pip install django djangorestframework django-cors-headers psycopg2-binary python-jose[cryptography]
```

#### 2.4. Настрой базу данных PostgreSQL
1. Создай базу данных в PostgreSQL:
   ```bash
   psql -U postgres
   ```
   В командной строке PostgreSQL выполни:
   ```sql
   CREATE DATABASE video_hosting_db;
   \q
   ```
2. Обнови настройки базы данных в файле `backend/video_hosting/settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'video_hosting_db',
           'USER': 'postgres',  # Замени на твое имя пользователя PostgreSQL
           'PASSWORD': 'твой_пароль',  # Замени на твой пароль PostgreSQL
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

#### 2.5. Примени миграции
Выполни команды для настройки базы данных:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.6. Запусти сервер бэкенда
Запусти сервер разработки Django:
```bash
python manage.py runserver
```
Бэкенд будет доступен по адресу `http://localhost:8000`.

### 3. Настройка фронтенда (React)

#### 3.1. Перейди в папку фронтенда
```bash
cd ../frontend
```

#### 3.2. Установи зависимости для фронтенда
Установи необходимые пакеты для React:
```bash
npm install
```

#### 3.3. Запусти фронтенд
Запусти сервер разработки React:
```bash
npm start
```
Фронтенд будет доступен по адресу `http://localhost:3000`.

### 4. Проверка работы

- Бэкенд: открой `http://localhost:8000` — ты должен увидеть страницу Django (по умолчанию это может быть страница API или админка, если настроена).
- Фронтенд: открой `http://localhost:3000` — ты увидишь главную страницу видеохостинга с маршрутами (например, `/`, `/login`, `/register`, `/upload`).

### 5. Дополнительно

Если у тебя возникнут проблемы с подключением к базе данных:
- Убедись, что PostgreSQL запущен.
- Проверь имя пользователя и пароль в `settings.py`.
- Если не знаешь логин для PostgreSQL, попробуй `postgres` (по умолчанию). Для проверки:
  ```bash
  psql -U postgres
  ```
  Если не работает, уточни у владельца проекта или проверь настройки PostgreSQL.

## Команды для разработки

- Запуск бэкенда:
  ```bash
  cd backend
  source venv/bin/activate  # Для Windows: venv\Scripts\activate
  python manage.py runserver
  ```
- Запуск фронтенда:
  ```bash
  cd frontend
  npm start
  ```

## Возможные проблемы

- **Ошибка CORS:** Если фронтенд не может подключиться к бэкенду, убедись, что в `backend/video_hosting/settings.py` настроен `CORS_ALLOWED_ORIGINS`:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:3000",
  ]
  ```
- **Ошибка базы данных:** Убедись, что PostgreSQL запущен и настройки в `settings.py` верные.
- **Зависимости не установлены:** Убедись, что ты установил все зависимости для бэкенда и фронтенда.

Если возникнут вопросы, пиши владельцу проекта!