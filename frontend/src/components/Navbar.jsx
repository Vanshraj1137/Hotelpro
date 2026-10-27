import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <nav className="site-nav">
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="brand-text" to="/" onClick={close}>🏨 HotelPro</Link>

        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/rooms" onClick={close}>Rooms</NavLink>
          {user && <NavLink to="/my-bookings" onClick={close}>My Bookings</NavLink>}
          {user && user.role !== 'guest' && (
            <NavLink to="/admin" className="nav-admin" onClick={close}>Dashboard</NavLink>
          )}
          <span className="nav-spacer" />
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn btn-outline-gold btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-gold btn-sm" to="/login" onClick={close}>Login</Link>
              <Link className="btn btn-gold btn-sm" to="/register" onClick={close}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
