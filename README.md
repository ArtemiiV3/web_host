# Бэкенд видеохостинга

Это бэкенд на основе Django для сервиса видеохостинга. Он предоставляет API для регистрации пользователей, аутентификации, загрузки видео и управления видео. Аутентификация реализована с использованием JWT (JSON Web Tokens) через `rest_framework_simplejwt`.

## Требования

- Python 3.8+
- PostgreSQL
- Git

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/yourusername/video-hosting-backend.git
cd video-hosting-backend
```

### 2. Создание и активация виртуальной среды
```bash
python -m venv venv
venv\Scripts\activate  # Для Windows
source venv/bin/activate  # Для Linux/Mac
```

### 3. Установка зависимостей
```bash
pip install -r requirements.txt
```
Необходимые пакеты (добавьте в `requirements.txt`, если их там нет):
```
django==4.2
djangorestframework==3.14
djangorestframework-simplejwt==5.3
psycopg2-binary==2.9
pillow==10.0
```

### 4. Настройка PostgreSQL
1. Установите PostgreSQL и создайте базу данных:
   ```bash
   psql -U postgres
   ```
   ```sql
   CREATE DATABASE video_hosting_db;
   ```
2. Обновите `settings.py` с вашими данными базы:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'video_hosting_db',
           'USER': 'postgres',
           'PASSWORD': 'ваш_пароль',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

### 5. Применение миграций
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Создание суперпользователя (опционально)
```bash
python manage.py createsuperuser
```

### 7. Запуск сервера
```bash
python manage.py runserver
```
Сервер будет доступен по адресу `http://127.0.0.1:8000/`.

---

## API-эндпоинты

Ниже описаны доступные API-эндпоинты, их методы, необходимые данные и примеры ответов.

### 1. Регистрация пользователя
- **Эндпоинт**: `POST /api/register/`
- **Описание**: Регистрирует нового пользователя и возвращает JWT-токены.
- **Тело запроса**:
  ```json
  {
      "username": "строка",
      "email": "строка",
      "password": "строка"
  }
  ```
- **Пример запроса**:
  ```bash
  curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "test123"}'
  ```
- **Успешный ответ (201 Created)**:
  ```json
  {
      "message": "Пользователь успешно создан",
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```
- **Ошибка (400 Bad Request)**:
  ```json
  {
      "error": "Имя пользователя уже существует"
  }
  ```

### 2. Получение JWT-токена
- **Эндпоинт**: `POST /api/token/`
- **Описание**: Аутентифицирует пользователя и возвращает JWT-токены.
- **Тело запроса**:
  ```json
  {
      "username": "строка",
      "password": "строка"
  }
  ```
- **Пример запроса**:
  ```bash
  curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123"}'
  ```
- **Успешный ответ (200 OK)**:
  ```json
  {
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```
- **Ошибка (401 Unauthorized)**:
  ```json
  {
      "detail": "Активный аккаунт с указанными данными не найден"
  }
  ```

### 3. Обновление JWT-токена
- **Эндпоинт**: `POST /api/token/refresh/`
- **Описание**: Обновляет истёкший `access`-токен с помощью `refresh`-токена.
- **Тело запроса**:
  ```json
  {
      "refresh": "строка"
  }
  ```
- **Пример запроса**:
  ```bash
  curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."}'
  ```
- **Успешный ответ (200 OK)**:
  ```json
  {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```
- **Ошибка (401 Unauthorized)**:
  ```json
  {
      "detail": "Токен недействителен или истёк",
      "code": "token_not_valid"
  }
  ```

### 4. Загрузка видео
- **Эндпоинт**: `POST /api/video/upload/`
- **Описание**: Загружает видеофайл (требуется аутентификация).
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Тело запроса**: `multipart/form-data`
  - `title`: строка (обязательно)
  - `video_file`: файл (обязательно)
- **Пример запроса**:
  ```bash
  curl -X POST http://127.0.0.1:8000/api/video/upload/ \
  -H "Authorization: Bearer <access_token>" \
  -F "title=Тестовое видео" \
  -F "video_file=@/путь/к/видео.mp4"
  ```
- **Успешный ответ (201 Created)**:
  ```json
  {
      "message": "Видео успешно загружено",
      "video_id": 1
  }
  ```
- **Ошибка (400 Bad Request)**:
  ```json
  {
      "title": ["Это поле обязательно."],
      "video_file": ["Это поле обязательно."]
  }
  ```
- **Ошибка (401 Unauthorized)**:
  ```json
  {
      "detail": "Указанный токен недействителен",
      "code": "token_not_valid",
      "messages": [{"token_class": "AccessToken", "token_type": "access", "message": "Токен истёк"}]
  }
  ```

### 5. Список всех видео
- **Эндпоинт**: `GET /api/videos/`
- **Описание**: Возвращает список всех видео (общий доступ).
- **Пример запроса**:
  ```bash
  curl -X GET http://127.0.0.1:8000/api/videos/
  ```
- **Успешный ответ (200 OK)**:
  ```json
  [
      {
          "id": 1,
          "title": "Тестовое видео",
          "user": "testuser"
      }
  ]
  ```
- **Пустой ответ (200 OK)**:
  ```json
  []
  ```

### 6. Список видео пользователя
- **Эндпоинт**: `GET /api/user/videos/`
- **Описание**: Возвращает список видео, загруженных аутентифицированным пользователем.
- **Заголовки**: `Authorization: Bearer <access_token>`
- **Пример запроса**:
  ```bash
  curl -X GET http://127.0.0.1:8000/api/user/videos/ \
  -H "Authorization: Bearer <access_token>"
  ```
- **Успешный ответ (200 OK)**:
  ```json
  [
      {
          "id": 1,
          "title": "Тестовое видео"
      }
  ]
  ```
- **Пустой ответ (200 OK)**:
  ```json
  []
  ```
- **Ошибка (401 Unauthorized)**:
  ```json
  {
      "detail": "Учетные данные для аутентификации не предоставлены."
  }
  ```

### 7. Потоковое воспроизведение видео
- **Эндпоинт**: `GET /api/video/stream/<video_id>/`
- **Описание**: Возвращает URL видеофайла для потокового воспроизведения (общий доступ).
- **Пример запроса**:
  ```bash
  curl -X GET http://127.0.0.1:8000/api/video/stream/1/
  ```
- **Успешный ответ (200 OK)**:
  ```json
  {
      "video_url": "/media/videos/video.mp4"
  }
  ```
- **Ошибка (404 Not Found)**:
  ```json
  {
      "error": "Видео не найдено"
  }
  ```

---

## Примечания
- **Аутентификация**: Эндпоинты с `IsAuthenticated` требуют действительный `access`-токен в заголовке `Authorization`.
- **Медиафайлы**: Убедитесь, что `MEDIA_URL` и `MEDIA_ROOT` настроены в `settings.py` для хранения видео:
  ```python
  MEDIA_URL = '/media/'
  MEDIA_ROOT = BASE_DIR / 'media'
  ```
  Добавьте в `urls.py`:
  ```python
  from django.conf import settings
  from django.conf.urls.static import static

  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
  ```
- **Срок действия токенов**: По умолчанию `access`-токены действуют 5 минут, `refresh`-токены — 1 день. Настройте в `settings.py` через `SIMPLE_JWT`, если нужно.

---
```
