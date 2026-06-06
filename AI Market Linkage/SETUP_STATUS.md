# Setup Status

## Backend

Status: ready for local development and prototype demonstration.

Verified:
- Django system check passes.
- Database migrations are applied in the local environment.
- Backend tests pass.
- AI price model loads successfully.
- Tomato classifier model loads successfully during API checks.

Useful URLs when the backend server is running:
- API base URL: `http://localhost:8000/api/`
- API documentation: `http://localhost:8000/api/docs/`
- Admin panel: `http://localhost:8000/admin/`

Run locally:

```powershell

.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

## Frontend

Status: ready for local development and prototype demonstration.

Verified:
- Dependencies are installed.
- `npm run lint` passes.
- `npm run build` passes.
- Production dependency audit passes with `npm audit --omit=dev --audit-level=high`.

Run locally:

```powershell

npm install
npm run dev
```

Frontend URL: `http://127.0.0.1:5173`

## Current Feature Coverage

- Farmer and buyer registration/login.
- Farmer product listing with image upload.
- Tomato image quality classification.
- AI price recommendation.
- Buyer listing browsing and inquiries.
- Farmer inquiry viewing.
- Map-based listing discovery using Leaflet and OpenStreetMap.

## Remaining Before Final Submission

- Run a manual browser demonstration and capture screenshots for the report.
- Configure production secrets and HTTPS settings before any real deployment.
- Keep the project report clear that image classification is tomato-focused in this prototype.
