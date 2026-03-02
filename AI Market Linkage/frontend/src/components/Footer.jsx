import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AI Market Linkage</h3>
          <p>Connecting smallholder farmers with buyers for fair trade.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/listings">Browse Listings</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@aimarketlinkage.com</p>
          <p>Phone: +1-234-567-8900</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 AI Market Linkage. All rights reserved.</p>
      </div>
    </footer>
  );
}
