import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="brand-text mb-2">🏨 HotelPro</div>
            <p className="mb-0 footer-muted">Comfortable rooms, simple booking and friendly service, all in one place.</p>
          </div>
          <div className="col-6 col-md-3">
            <h6>Explore</h6>
            <ul className="list-unstyled mb-0">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms &amp; availability</Link></li>
              <li><Link to="/my-bookings">My bookings</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6>Contact</h6>
            <ul className="list-unstyled mb-0 footer-muted">
              <li>📍 Indore, Madhya Pradesh</li>
              <li>📞 +91 00000 00000</li>
              <li>✉️ hello@hotelpro.com</li>
            </ul>
          </div>
        </div>
        <hr className="footer-line" />
        <div className="text-center footer-muted small">© {new Date().getFullYear()} HotelPro. All rights reserved.</div>
      </div>
    </footer>
  );
}
