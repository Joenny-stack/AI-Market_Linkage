# Backend README

The backend is a Django REST Framework API for the AI Powered Market Linkage Platform.

## Main Responsibilities

- User registration and JWT authentication.
- Farmer and buyer role management.
- Farmer profile management.
- Product listing CRUD with image upload.
- Buyer inquiry workflow.
- Tomato quality classification API.
- Price recommendation API.
- Coordinate handling and fallback location mapping.
- Swagger/OpenAPI documentation.

## Setup

```bash
cd "AI Market Linkage/backend"
python -m venv venv
```

Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
# source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create environment file:

```bash
cp .env.example .env
```

Update `.env` for your local database and Django settings.

Run migrations and server:

```bash
python manage.py migrate
python manage.py runserver
```

## Environment Variables

Typical variables:

```env
SECRET_KEY=replace-with-a-secure-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=ai_market_linkage
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

Do not commit real production secrets.

## API URLs

- API base: `http://127.0.0.1:8000/api/`
- Swagger UI: `http://127.0.0.1:8000/api/docs/`
- Schema: `http://127.0.0.1:8000/api/schema/`
- Admin: `http://127.0.0.1:8000/admin/`

## Important Endpoints

Authentication:

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/profile/me/`

Listings:

- `GET /api/listings/`
- `POST /api/listings/`
- `GET /api/listings/{id}/`
- `PUT /api/listings/{id}/`
- `DELETE /api/listings/{id}/`
- `GET /api/listings/my_listings/`

Inquiries:

- `POST /api/inquiries/`
- `GET /api/inquiries/buyer/`
- `GET /api/inquiries/farmer/`
- `PATCH /api/inquiries/{id}/mark_responded/`

AI:

- `POST /api/ai/classify-tomato/`
- `POST /api/ai/recommend-price/`

## AI Runtime Files

The runtime model files are stored under:

```text
backend/ai_service/model/tomato_classifier.h5
backend/ai_service/price_model/price_model.pkl
backend/ai_service/price_model/encoders.pkl
```

The training scripts and source artifacts are stored under `../ai_model/`.

## Price Location Fallback

The price model was trained on selected market cities. If the user enters an untrained town, the backend attempts to map it to the nearest trained market city. If no confident mapping exists, it uses a general default market location so the user still receives a recommendation.

## Validation

```bash
python manage.py check
python manage.py test
```

## Production Notes

Before deployment:

- Set `DEBUG=False`.
- Use a strong `SECRET_KEY`.
- Configure `ALLOWED_HOSTS`.
- Configure CORS for the real frontend domain.
- Enable HTTPS and secure cookie settings.
- Configure production static and media file serving.
- Use a backed-up PostgreSQL database.
