# AI Market Linkage Backend

Django REST API for the AI-powered agricultural marketplace.

## Setup

### Prerequisites
- Python 3.10+
- PostgreSQL
- pip/venv

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database and settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **Schema**: http://localhost:8000/api/schema/

## Project Structure

```
backend/
├── config/           # Django settings & URLs
├── users/            # Custom user model
├── farmers/          # Farmer profiles
├── listings/         # Product listings
├── inquiries/        # Buyer inquiries
├── core/             # Common utilities
└── manage.py         # Django management script
```

## Key Features

- **Authentication**: JWT with SimpleJWT
- **Custom User Model**: UUID primary key, role-based access
- **Farmer Profiles**: Location and crop information
- **Listings**: Detailed product information with images
- **Inquiries**: Buyer to farmer communication
- **Permissions**: Role-based access control
- **Filtering**: Advanced search and filtering
- **Image Uploads**: Media file management

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token

### Listings
- `GET /api/listings/` - List all listings (with filters)
- `POST /api/listings/` - Create new listing (farmers)
- `GET /api/listings/{id}/` - Get listing details
- `PUT /api/listings/{id}/` - Update listing
- `DELETE /api/listings/{id}/` - Delete listing
- `GET /api/listings/my_listings/` - Get farmer's listings

### Inquiries
- `GET /api/inquiries/` - List inquiries
- `POST /api/inquiries/` - Create inquiry
- `GET /api/inquiries/buyer/` - Get buyer's inquiries
- `GET /api/inquiries/farmer/` - Get farmer's inquiries

### Farmers
- `GET /api/farmers/me/` - Get farmer profile
- `PUT /api/farmers/me/` - Update farmer profile

## Admin Panel

Access Django admin at `http://localhost:8000/admin/`

## Technologies

- Django 4.2
- Django REST Framework
- SimpleJWT
- PostgreSQL
- Pillow (Image processing)
- Django Filters
- CORS Headers




cd "AI Market Linkage"
pip install tensorflow numpy matplotlib scikit-learn pillow
python ai_model/train_model.py



pip install seaborn