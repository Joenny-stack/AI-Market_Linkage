# AI Powered Market Linkage Platform - Phase 1

Complete skeleton for an agricultural marketplace connecting farmers and buyers.

## Project Directory Structure

```
AI Market Linkage/
├── backend/              # Django REST API
│   ├── config/          # Project settings
│   ├── users/           # Custom user model & auth
│   ├── farmers/         # Farmer profiles
│   ├── listings/        # Product listings
│   ├── inquiries/       # Buyer inquiries
│   ├── core/            # Utilities
│   ├── manage.py
│   └── requirements.txt
├── frontend/            # React SPA
│   ├── src/
│   │   ├── api/         # API client & endpoints
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   ├── styles/      # CSS files
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment and install dependencies:
```bash
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run migrations and start server:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend running at: `http://localhost:8000`
Admin at: `http://localhost:8000/admin/`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend running at: `http://localhost:3000`

## Key Features

### ✅ Phase 1 MVP

- [x] User authentication (Farmer/Buyer/Admin roles)
- [x] Farmer registration and profiles
- [x] Buyer registration
- [x] Product listing creation by farmers
- [x] Multi-image upload support
- [x] Advanced listing search and filtering
- [x] Location-based discovery
- [x] Buyer inquiry system
- [x] Role-based access control
- [x] Admin moderation capability
- [x] JWT authentication
- [x] Responsive UI

### 🚀 Phase 2 (Reserved)

- [ ] AI-powered price recommendations
- [ ] Quality grade predictions
- [ ] Confidence scoring
- [ ] Map-based visualization
- [ ] Chat/messaging system
- [ ] Payment integration
- [ ] Ratings and reviews

## Technology Stack

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework
- **Authentication**: SimpleJWT
- **Database**: PostgreSQL
- **Storage**: Local/Cloud media storage

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: CSS3
- **HTTP Client**: Axios
- **Build Tool**: Vite

## API Examples

### Register User
```bash
POST /api/auth/register/
{
  "email": "farmer@example.com",
  "full_name": "John Farmer",
  "phone_number": "+1234567890",
  "role": "FARMER",
  "password": "securepass123",
  "password2": "securepass123"
}
```

### Login
```bash
POST /api/auth/login/
{
  "email": "farmer@example.com",
  "password": "securepass123"
}
```

### Create Listing
```bash
POST /api/listings/
{
  "crop_name": "Tomatoes",
  "category": "Vegetables",
  "description": "Fresh ripe tomatoes...",
  "quantity_available": 100,
  "unit": "kg",
  "price_per_unit": 5.50,
  "currency": "USD",
  "harvest_date": "2026-03-15",
  "province": "Mashonaland",
  "district": "Harare",
  "gps_latitude": -17.8252,
  "gps_longitude": 31.0335,
  "status": "AVAILABLE"
}
```

## Authentication Flow

1. User registers via `/api/auth/register/`
2. User logs in via `/api/auth/login/` - receives `access_token` and `refresh_token`
3. Access token stored in localStorage
4. All API requests include: `Authorization: Bearer {access_token}`
5. Token refreshed via `/api/auth/refresh/` when expired

## Permissions

- **FARMER**: Can create/edit/delete own listings, view inquiries, update profile
- **BUYER**: Can view all listings, send inquiries, view own inquiries
- **ADMIN**: Can moderate all content, delete any listing, manage users

## Environment Variables

See `.env.example` in backend directory for required variables.

## Documentation

- Backend API docs: http://localhost:8000/api/docs/
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`

## Next Steps

1. Complete the skeleton setup
2. Configure database and environment variables
3. Run backend migrations
4. Test API endpoints with Postman/curl
5. Test frontend with sample data
6. Implement additional features from Phase 2

## Support

For issues or questions, refer to:
- Django Documentation: https://docs.djangoproject.com/
- React Documentation: https://react.dev/
- DRF Documentation: https://www.django-rest-framework.org/
- Zustand Documentation: https://github.com/pmndrs/zustand

---

**Project Version**: 0.1.0 (Phase 1 Skeleton)
**Last Updated**: March 2, 2026
