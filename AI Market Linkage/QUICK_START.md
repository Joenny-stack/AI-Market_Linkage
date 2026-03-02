# ⚡ Quick Start Guide

## 🎯 Project Generated Successfully!

Your complete Django REST + React agricultural marketplace skeleton has been generated. Follow this guide to get started in minutes.

---

## 📂 Project Location

```
C:\Users\DELL\Desktop\Deals\Affix\System\AI Market Linkage\
```

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Backend Setup

```powershell
# Navigate to backend
cd "C:\Users\DELL\Desktop\Deals\Affix\System\AI Market Linkage\backend"

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure database (edit .env with your PostgreSQL credentials)
copy .env.example .env

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

✅ Backend running at: **http://localhost:8000**
📚 API Docs at: **http://localhost:8000/api/docs/**
🔐 Admin at: **http://localhost:8000/admin/**

---

### 2️⃣ Frontend Setup

```powershell
# Navigate to frontend
cd "C:\Users\DELL\Desktop\Deals\Affix\System\AI Market Linkage\frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

## 📋 What's Included

### Backend (Django + DRF)
- ✅ Custom User model with roles (Farmer/Buyer/Admin)
- ✅ Farmer profile management
- ✅ Product listing system with image upload
- ✅ Buyer inquiry system
- ✅ JWT authentication
- ✅ Role-based permissions
- ✅ Advanced filtering & search
- ✅ Admin moderation tools

### Frontend (React + Vite)
- ✅ Authentication pages (Login/Register)
- ✅ Farmer dashboard
- ✅ Buyer dashboard
- ✅ Listing browsing with filters
- ✅ Listing detail view
- ✅ Create/edit listing forms
- ✅ Inquiry management
- ✅ User profile settings
- ✅ Responsive design
- ✅ State management with Zustand

---

## 🔑 Key Features

### For Farmers 👨‍🌾
- Create detailed product listings
- Upload multiple images
- Manage inquiries from buyers
- Track listing status
- Update farmer profile

### For Buyers 👨‍💼
- Browse all available listings
- Filter by crop, price, location
- Send inquiries to farmers
- Track inquiry responses
- Manage profile

### For Admins 👨‍💻
- Moderate all listings
- Manage users
- View all inquiries
- Delete inappropriate content
- Access Django admin

---

## 📁 Project Structure

```
AI Market Linkage/
├── backend/              # Django REST API
│   ├── users/           # Authentication
│   ├── farmers/         # Farmer profiles
│   ├── listings/        # Product listings
│   ├── inquiries/       # Buyer inquiries
│   ├── core/            # Utilities
│   └── manage.py
├── frontend/            # React SPA
│   ├── src/
│   │   ├── api/         # API calls
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   └── styles/      # CSS
│   └── index.html
├── README.md
├── PROJECT_OVERVIEW.md
└── DEPLOYMENT.md
```

---

## 🔌 First Test: Register a User

### Via Frontend
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in details (choose Farmer or Buyer)
4. Submit

### Via API (curl)
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "full_name": "John Farmer",
    "phone_number": "+1234567890",
    "role": "FARMER",
    "password": "securepass123",
    "password2": "securepass123"
  }'
```

---

## 🧪 Test Create a Listing

### Via Frontend
1. Login as farmer
2. Go to Dashboard → Add Listing
3. Fill in listing details
4. Upload images
5. Submit

### Via API
```bash
curl -X POST http://localhost:8000/api/listings/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "crop_name=Tomatoes" \
  -F "category=Vegetables" \
  -F "description=Fresh ripe tomatoes" \
  -F "quantity_available=100" \
  -F "unit=kg" \
  -F "price_per_unit=5.50" \
  -F "harvest_date=2026-03-15" \
  -F "province=Mashonaland" \
  -F "district=Harare" \
  -F "gps_latitude=-17.8252" \
  -F "gps_longitude=31.0335" \
  -F "images=@path/to/image.jpg"
```

---

## 📚 Important Files to Know

**Backend**
- `config/settings.py` - Django configuration
- `config/urls.py` - API routes
- `backend/.env.example` - Environment template
- `backend/README.md` - Backend documentation

**Frontend**
- `src/App.jsx` - Main component
- `src/api/endpoints.js` - API calls
- `src/context/authStore.js` - Authentication state
- `frontend/README.md` - Frontend documentation

---

## ⚙️ Environment Setup

### Backend (.env)

Copy `backend/.env.example` to `backend/.env`:

```
SECRET_KEY=change-this-to-random-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=ai_market_linkage
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

Create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8000/api
```

---

## 🐛 Common Issues

### Issue: "Connection refused" on API calls

**Solution**: Make sure backend is running on http://localhost:8000
```bash
cd backend
python manage.py runserver
```

### Issue: "Module not found" in React

**Solution**: Install dependencies
```bash
cd frontend
npm install
```

### Issue: Database connection error

**Solution**: Update `.env` with correct PostgreSQL credentials

### Issue: CORS errors

**Solution**: Check `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`

---

## 📖 Learning Resources

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- React Docs: https://react.dev/
- Zustand: https://github.com/pmndrs/zustand

---

## 🚢 Next Steps

1. **Customize**
   - Update styling to match your branding
   - Add your logo
   - Modify colors in CSS

2. **Add Features**
   - Email notifications
   - Real-time chat (WebSocket)
   - Payment integration
   - Rating system

3. **Deploy**
   - Follow `DEPLOYMENT.md` for production setup
   - Deploy backend to Heroku/AWS/DigitalOcean
   - Deploy frontend to Vercel/Netlify

4. **Phase 2**
   - Implement AI features
   - Add map visualization
   - Advanced analytics

---

## ✅ Checklist

Backend:
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Database configured
- [ ] Migrations run
- [ ] Superuser created
- [ ] Server running

Frontend:
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Dev server running
- [ ] Can access http://localhost:3000

Testing:
- [ ] Can register a user
- [ ] Can login
- [ ] Can create a listing
- [ ] Can browse listings
- [ ] Can send inquiry

---

## 📞 Need Help?

1. Check the `README.md` files in each folder
2. Review `PROJECT_OVERVIEW.md` for full architecture
3. Check `DEPLOYMENT.md` for production setup
4. API documentation at http://localhost:8000/api/docs/

---

## 🎉 You're All Set!

Your AI Market Linkage Platform skeleton is ready to use. Start building!

**Happy Coding! 🚀**
