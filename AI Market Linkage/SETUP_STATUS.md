# Setup Status

## Current State

The project is ready for local prototype demonstration and defense preparation.

## Verified Backend Checks

- Django system check passes.
- Backend tests pass.
- AI price model loads successfully.
- Tomato classifier model loads successfully.
- Price recommendation supports nearest-market and general-market fallback for unknown towns.

Run:

```bash
cd "AI Market Linkage/backend"
python manage.py check
python manage.py test
```

## Verified Frontend Checks

- Frontend dependencies install through `npm install`.
- Lint passes.
- Production build passes.
- Production dependency audit has no high vulnerabilities when checked with `npm audit --omit=dev --audit-level=high`.

Run:

```bash
cd "AI Market Linkage/frontend"
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

## Local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8000/api/`
- API documentation: `http://127.0.0.1:8000/api/docs/`
- Django admin: `http://127.0.0.1:8000/admin/`

## Current Feature Coverage

- Farmer and buyer registration/login.
- Farmer product listing with image upload.
- Tomato image quality classification.
- AI price recommendation with fallback for unknown locations.
- Buyer listing browsing and inquiries.
- Farmer inquiry viewing.
- Explicit GPS capture with accuracy warning and manual coordinate override.
- Map-based listing discovery using Leaflet and OpenStreetMap.

## Remaining Before Production

- Set `DEBUG=False`.
- Use a strong production `SECRET_KEY`.
- Configure production `ALLOWED_HOSTS`.
- Configure production `CORS_ALLOWED_ORIGINS`.
- Enable HTTPS and secure cookie settings.
- Configure production static/media storage.
- Use a managed database or backed-up PostgreSQL instance.

## Remaining Before Final Defense

- Capture screenshots of the main workflows.
- Prepare a short model-choice explanation for MobileNetV2 and Random Forest.
- State clearly that image classification is tomato-focused in this prototype.
- State clearly that price prediction uses trained market data plus fallback mapping.
