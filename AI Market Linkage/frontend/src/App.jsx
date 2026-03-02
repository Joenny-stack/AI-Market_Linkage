import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/authStore';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowseListingsPage from './pages/BrowseListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import MyListingsPage from './pages/MyListingsPage';
import AddListingPage from './pages/AddListingPage';
import EditListingPage from './pages/EditListingPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import ViewInquiriesPage from './pages/ViewInquiriesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './styles/App.css';

function App() {
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<BrowseListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

            {/* Protected Routes - Farmer */}
            <Route
              path="/farmer/dashboard"
              element={<ProtectedRoute requiredRole="FARMER"><FarmerDashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/farmer/listings"
              element={<ProtectedRoute requiredRole="FARMER"><MyListingsPage /></ProtectedRoute>}
            />
            <Route
              path="/farmer/listings/add"
              element={<ProtectedRoute requiredRole="FARMER"><AddListingPage /></ProtectedRoute>}
            />
            <Route
              path="/farmer/listings/:id/edit"
              element={<ProtectedRoute requiredRole="FARMER"><EditListingPage /></ProtectedRoute>}
            />
            <Route
              path="/farmer/inquiries"
              element={<ProtectedRoute requiredRole="FARMER"><ViewInquiriesPage /></ProtectedRoute>}
            />

            {/* Protected Routes - Buyer */}
            <Route
              path="/buyer/dashboard"
              element={<ProtectedRoute requiredRole="BUYER"><BuyerDashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/buyer/inquiries"
              element={<ProtectedRoute requiredRole="BUYER"><MyInquiriesPage /></ProtectedRoute>}
            />

            {/* Protected Routes - All Users */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><FarmerDashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
