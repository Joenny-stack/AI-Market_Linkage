# AI Powered Market Linkage Platform

AI Powered Market Linkage is a prototype web platform that connects smallholder farmers with buyers. Farmers can publish produce listings with images, buyers can browse and send inquiries, and the system adds AI support for tomato quality assessment and crop price recommendation.

The current implementation is a functional prototype for submission and defense. It is not a logistics, payment, or delivery system.

## Current Features

- Farmer and buyer registration/login with JWT authentication.
- Role-based dashboards for farmers and buyers.
- Farmer listing creation, editing, deletion, and image upload.
- Buyer listing browsing, filtering, detail view, and inquiries.
- Farmer inquiry viewing and response-status tracking.
- Tomato image classification into `Damaged`, `Old`, `Ripe`, and `Unripe`.
- Quality-grade mapping: `Grade A`, `Grade B`, `Grade C`, and `Reject`.
- AI price recommendation using crop, location, grade, and quantity.
- Fallback pricing for untrained towns using the nearest trained market city or a general market fallback.
- Location capture with explicit GPS button, visible accuracy estimate, and manual latitude/longitude override.
- Map-based listing discovery using Leaflet and OpenStreetMap.
- API documentation through Swagger/OpenAPI.

## AI Scope

The platform uses two trained models:

- Image model: a MobileNetV2-based CNN trained for tomato quality classification.
- Price model: a scikit-learn `RandomForestRegressor` trained on structured produce-pricing data.

Image recognition is tomato-focused in this prototype. Price recommendation supports the crops and locations represented in the training artifacts, with fallback behavior for unknown towns.

## Project Structure

```text
AI Market Linkage/
  ai_model/
    train_model.py
    model/
      tomato_classifier.h5
      evaluation_metrics.json
    price_model/
      train_price_model.py
      price_model.pkl
      encoders.pkl
      data/prices.csv
  backend/
    manage.py
    requirements.txt
    config/
    users/
    farmers/
    listings/
    inquiries/
    ai_service/
  frontend/
    package.json
    src/
```

## Quick Start

Run the backend:

```bash
cd "AI Market Linkage/backend"
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Run the frontend in a second terminal:

```bash
cd "AI Market Linkage/frontend"
npm install
npm run dev
```

Default local URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8000/api/`
- API docs: `http://127.0.0.1:8000/api/docs/`
- Django admin: `http://127.0.0.1:8000/admin/`

If the frontend needs a custom API URL, create `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Core API Endpoints

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

## Validation

Backend:

```bash
cd "AI Market Linkage/backend"
python manage.py check
python manage.py test
```

Frontend:

```bash
cd "AI Market Linkage/frontend"
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

## Notes for Deployment

Before deploying publicly:

- Set `DEBUG=False`.
- Generate a strong `SECRET_KEY`.
- Configure production database credentials.
- Set production `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.
- Serve media and static files using production storage.
- Enable HTTPS and secure cookie settings.

## Documentation

- [Quick Start](./QUICK_START.md)
- [Project Overview](./PROJECT_OVERVIEW.md)
- [Manual Test Cases](./MANUAL_TEST_CASES.md)
- [Setup Status](./SETUP_STATUS.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
