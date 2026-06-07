# Quick Start

This guide starts the AI Powered Market Linkage prototype locally.

## Prerequisites

- Python 3.10 or newer.
- Node.js 18 or newer.
- PostgreSQL, unless your local settings are changed to another database.
- Git.

## 1. Clone or Pull the Project

```bash
git pull origin main
cd "AI Market Linkage"
```

If the project folder has a different name on your machine, run the same commands from that folder. Avoid hardcoded machine-specific paths in scripts or docs.

## 2. Backend Setup

```bash
cd backend
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

Create environment settings:

```bash
cp .env.example .env
```

Edit `.env` with your local database and Django settings, then run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend URLs:

- API: `http://127.0.0.1:8000/api/`
- Docs: `http://127.0.0.1:8000/api/docs/`
- Admin: `http://127.0.0.1:8000/admin/`

## 3. Frontend Setup

Open a second terminal:

```bash
cd "AI Market Linkage/frontend"
npm install
npm run dev
```

Frontend URL:

- `http://127.0.0.1:5173`

Optional frontend environment:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Save this as `frontend/.env.local` if your backend URL differs.

## 4. First Manual Demo

1. Register a farmer account.
2. Login as the farmer.
3. Create a listing.
4. Upload a tomato image.
5. Enter crop, quantity, location, province, district, harvest date, and price.
6. Confirm AI quality and recommended price appear.
7. Register/login as a buyer.
8. Browse listings and send an inquiry.
9. Login as the farmer and view the inquiry.
10. Open the map page and confirm listings with coordinates appear.

## 5. Validation Commands

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
```

## Common Issues

`Connection refused`

The backend is not running or the frontend `VITE_API_URL` points to the wrong port.

`Database connection failed`

Check PostgreSQL is running and `.env` has the correct database name, user, password, host, and port.

`AI classifier unavailable`

Confirm the model file exists at `backend/ai_service/model/tomato_classifier.h5`.

`Price recommendation unavailable`

Confirm `backend/ai_service/price_model/price_model.pkl` and `encoders.pkl` exist.

Wrong GPS location

Use the manual latitude/longitude fields. Browser location on desktop can be approximate because it may rely on IP or Wi-Fi rather than true GPS.
