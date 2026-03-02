# AI Market Linkage Platform - Project Skeleton Complete

## 📋 Overview

A complete, production-ready skeleton for an **AI-powered agricultural marketplace** connecting smallholder farmers with buyers. This Phase 1 implementation includes all core marketplace functionality without AI features (reserved for Phase 2).

---

## 🏗️ Project Structure

```
AI Market Linkage/
│
├── backend/                          # Django REST API
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py              # Django configurations
│   │   ├── urls.py                  # URL routing
│   │   └── wsgi.py                  # WSGI application
│   │
│   ├── users/                       # Authentication & Custom User Model
│   │   ├── models.py                # CustomUser with UUID & roles
│   │   ├── serializers.py           # User serializers
│   │   ├── views.py                 # Auth endpoints
│   │   ├── urls.py                  # Auth routes
│   │   ├── admin.py                 # Django admin
│   │   └── apps.py
│   │
│   ├── farmers/                     # Farmer Profiles
│   │   ├── models.py                # FarmerProfile model
│   │   ├── serializers.py           # Profile serializers
│   │   ├── views.py                 # Profile endpoints
│   │   ├── urls.py                  # Profile routes
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── listings/                    # Product Listings
│   │   ├── models.py                # Listing & ListingImage
│   │   ├── serializers.py           # Listing serializers
│   │   ├── views.py                 # Listing viewsets
│   │   ├── permissions.py           # Custom permissions
│   │   ├── filters.py               # Listing filters
│   │   ├── urls.py                  # Listing routes
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── inquiries/                   # Buyer Inquiries
│   │   ├── models.py                # Inquiry model
│   │   ├── serializers.py           # Inquiry serializers
│   │   ├── views.py                 # Inquiry endpoints
│   │   ├── permissions.py           # Inquiry permissions
│   │   ├── urls.py                  # Inquiry routes
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── core/                        # Utilities & Common Code
│   │   ├── models.py                # Base models
│   │   ├── utils.py                 # Utility functions
│   │   ├── apps.py
│   │   └── __init__.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── gunicorn_config.py
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   └── tests.py
│
├── frontend/                        # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js            # Axios instance with interceptors
│   │   │   └── endpoints.js         # API endpoints
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Footer.jsx           # Footer
│   │   │   ├── ProtectedRoute.jsx   # Route guard
│   │   │   ├── ListingCard.jsx      # Listing card component
│   │   │   └── ListingFilter.jsx    # Filter component
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Home/landing
│   │   │   ├── LoginPage.jsx        # Login
│   │   │   ├── RegisterPage.jsx     # Registration
│   │   │   ├── BrowseListingsPage.jsx
│   │   │   ├── ListingDetailPage.jsx
│   │   │   ├── FarmerDashboardPage.jsx
│   │   │   ├── BuyerDashboardPage.jsx
│   │   │   ├── MyListingsPage.jsx
│   │   │   ├── AddListingPage.jsx
│   │   │   ├── EditListingPage.jsx
│   │   │   ├── MyInquiriesPage.jsx
│   │   │   ├── ViewInquiriesPage.jsx
│   │   │   └── ProfileSettingsPage.jsx
│   │   │
│   │   ├── context/
│   │   │   └── authStore.js         # Zustand auth store
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   └── usePermissions.js    # Permissions hook
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.js        # Form validators
│   │   │   └── constants.js         # App constants
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css            # Global styles
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.css
│   │   │   ├── HomePage.css
│   │   │   ├── LoginPage.css
│   │   │   ├── RegisterPage.css
│   │   │   ├── BrowseListingsPage.css
│   │   │   ├── ListingFilter.css
│   │   │   ├── ListingCard.css
│   │   │   ├── ListingDetailPage.css
│   │   │   ├── DashboardPage.css
│   │   │   ├── MyListingsPage.css
│   │   │   ├── AddListingPage.css
│   │   │   ├── EditListingPage.css
│   │   │   ├── InquiriesPage.css
│   │   │   └── ProfileSettingsPage.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   ├── package.json
│   ├── .gitignore
│   ├── .env.local.example
│   └── README.md
│
├── README.md                        # Main project README
└── DEPLOYMENT.md                    # Deployment guide
```

---

## 🚀 Features

### ✅ Implemented (Phase 1 MVP)

**Authentication & Users**
- User registration (Farmer/Buyer/Admin roles)
- JWT-based authentication
- Token refresh mechanism
- Email-based login

**Farmer Features**
- Create and manage farmer profiles
- Create product listings with:
  - Multiple images
  - Detailed product information
  - GPS coordinates
  - Harvest dates
- View buyer inquiries
- Mark inquiries as responded
- Edit/delete own listings

**Buyer Features**
- Browse all listings
- Advanced search & filtering:
  - By crop name
  - By price range
  - By location (province/district)
  - By status
- View listing details with images
- Send inquiries to farmers
- Track inquiry status
- Save favorite searches (optional)

**Admin Features**
- Moderate all listings
- Delete inappropriate content
- Manage user accounts
- View all inquiries
- Generate reports

**Technical**
- Role-based access control (RBAC)
- Image upload & storage
- Pagination (20 items per page)
- Error handling & validation
- CORS configured
- Responsive UI
- API documentation with Swagger

### 🚀 Reserved for Phase 2 (AI Features)

- AI-powered price recommendations
- Automatic quality grade prediction
- Confidence scoring
- Map-based visualization
- Real-time chat messaging
- Payment integration
- Ratings & reviews system
- Supply chain tracking

---

## 📊 Data Models

### CustomUser
```python
id: UUID
email: String (unique)
full_name: String
phone_number: String
role: FARMER | BUYER | ADMIN
is_active: Boolean
created_at: DateTime
```

### FarmerProfile
```python
user: OneToOne(CustomUser)
farm_name: String
description: Text
primary_crop_types: Text
province: String
district: String
gps_latitude: Float
gps_longitude: Float
profile_image: Image
```

### Listing
```python
id: UUID
farmer: ForeignKey(User)
crop_name: String
category: String
description: Text
quantity_available: Decimal
unit: String
price_per_unit: Decimal
currency: String
harvest_date: Date
province: String
district: String
gps_latitude: Float
gps_longitude: Float
status: AVAILABLE | SOLD | PENDING
created_at: DateTime
[Phase 2] quality_grade: String
[Phase 2] ai_price_recommendation: Decimal
[Phase 2] confidence_score: Float
```

### ListingImage
```python
listing: ForeignKey(Listing)
image: Image
uploaded_at: DateTime
```

### Inquiry
```python
listing: ForeignKey(Listing)
buyer: ForeignKey(User)
message: Text
contact_phone: String
status: NEW | RESPONDED
created_at: DateTime
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token

### Farmer Profile
- `GET /api/farmers/me/` - Get farmer profile
- `PUT /api/farmers/me/` - Update farmer profile

### Listings
- `GET /api/listings/` - List all listings (with filtering)
- `POST /api/listings/` - Create new listing
- `GET /api/listings/{id}/` - Get listing details
- `PUT /api/listings/{id}/` - Update listing
- `DELETE /api/listings/{id}/` - Delete listing
- `GET /api/listings/my_listings/` - Get farmer's listings
- `POST /api/listings/{id}/add_images/` - Add images

### Inquiries
- `GET /api/inquiries/` - List inquiries
- `POST /api/inquiries/` - Create inquiry
- `GET /api/inquiries/buyer/` - Get buyer's inquiries
- `GET /api/inquiries/farmer/` - Get farmer's inquiries
- `PATCH /api/inquiries/{id}/mark_responded/` - Mark as responded

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework 3.14
- **Authentication**: djangorestframework-simplejwt 5.3
- **Database**: PostgreSQL (configured)
- **Image Processing**: Pillow 10.1
- **CORS**: django-cors-headers 4.3
- **Filtering**: django-filter 23.5
- **Server**: Gunicorn 21.2
- **API Docs**: drf-spectacular 0.27

### Frontend
- **Library**: React 18.2
- **Routing**: React Router 6.20
- **HTTP**: Axios 1.6
- **State**: Zustand 4.4
- **Build**: Vite 5.0
- **Maps**: Leaflet 1.9 (configured for Phase 2)
- **Styling**: CSS3

---

## 🔐 Security Features

- UUID primary keys instead of sequential IDs
- JWT authentication with token refresh
- CSRF protection enabled
- CORS configured for frontend
- Password validation
- Role-based access control
- Secure password hashing
- SQL injection prevention (ORM usage)
- Rate limiting ready (can add)
- SSL/HTTPS ready for production

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px (tablet/mobile)
- Touch-friendly buttons and forms
- Flexible grid layouts
- Optimized images
- Fast page loads

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**Backend**: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend**: http://localhost:3000

---

## 📚 Documentation

- **Main README**: [README.md](./README.md)
- **Backend README**: [backend/README.md](./backend/README.md)
- **Frontend README**: [frontend/README.md](./frontend/README.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Docs**: http://localhost:8000/api/docs/ (when running)

---

## 🧪 Testing

Backend tests included in `tests.py`:
```bash
python manage.py test
```

---

## 📝 Next Steps

1. **Complete Setup**
   - [ ] Install all dependencies
   - [ ] Configure PostgreSQL database
   - [ ] Set up environment variables
   - [ ] Run migrations

2. **Testing**
   - [ ] Test user registration
   - [ ] Test listing creation
   - [ ] Test filtering
   - [ ] Test inquiries

3. **Customization**
   - [ ] Add your branding
   - [ ] Configure email notifications
   - [ ] Add additional fields as needed
   - [ ] Customize styling

4. **Deployment**
   - [ ] Choose hosting provider
   - [ ] Configure production settings
   - [ ] Set up database backups
   - [ ] Enable monitoring

5. **Phase 2**
   - [ ] Implement AI features
   - [ ] Add map visualization
   - [ ] Payment integration
   - [ ] Rating system

---

## 📞 Support & Resources

- Django: https://docs.djangoproject.com/
- DRF: https://www.django-rest-framework.org/
- React: https://react.dev/
- Zustand: https://github.com/pmndrs/zustand
- Vite: https://vitejs.dev/

---

## 📄 License

MIT License - Feel free to use for your project

---

**Created**: March 2, 2026
**Version**: 0.1.0 (Phase 1 Skeleton)
**Status**: ✅ Complete and Ready for Development
