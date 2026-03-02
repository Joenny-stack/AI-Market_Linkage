import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/HomePage.css';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to AI Market Linkage</h1>
          <p>Connecting Smallholder Farmers with Buyers for Fair Agricultural Trade</p>

          <div className="hero-buttons">
            <Link to="/listings" className="btn btn-primary">
              Browse Listings
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/register" className="btn btn-secondary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🌾 Farmer Listings</h3>
            <p>Easily list your agricultural products with images and detailed information</p>
          </div>

          <div className="feature-card">
            <h3>🔍 Browse & Filter</h3>
            <p>Find exactly what you need with advanced filtering and search capabilities</p>
          </div>

          <div className="feature-card">
            <h3>💬 Direct Messaging</h3>
            <p>Send inquiries directly to farmers and manage all your communications</p>
          </div>

          <div className="feature-card">
            <h3>🗺️ Location-Based Discovery</h3>
            <p>Find products based on location and distance from your area</p>
          </div>

          <div className="feature-card">
            <h3>🛡️ Secure Transactions</h3>
            <p>Safe and verified buyer-seller interactions with JWT authentication</p>
          </div>

          <div className="feature-card">
            <h3>📊 Admin Dashboard</h3>
            <p>Comprehensive management and moderation tools for platform administration</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create an account as a farmer or buyer</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>List or Browse</h3>
            <p>Farmers list products, buyers browse and search</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect</h3>
            <p>Send inquiries and communicate directly</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Trade</h3>
            <p>Complete transactions and build relationships</p>
          </div>
        </div>
      </section>

      {isAuthenticated && user?.role === 'FARMER' && (
        <section className="cta-section">
          <h2>Ready to Sell?</h2>
          <Link to="/farmer/listings/add" className="btn btn-lg">
            Create a Listing
          </Link>
        </section>
      )}

      {isAuthenticated && user?.role === 'BUYER' && (
        <section className="cta-section">
          <h2>Start Buying</h2>
          <Link to="/listings" className="btn btn-lg">
            Browse Products
          </Link>
        </section>
      )}
    </div>
  );
}
