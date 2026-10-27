import { AUTH_IMAGE } from '../utils/roomImages';

// Split-screen layout shared by the Login and Register pages.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-side" style={{ backgroundImage: `linear-gradient(rgba(8,22,40,.55), rgba(8,22,40,.75)), url(${AUTH_IMAGE})` }}>
        <div className="auth-side-text">
          <h2>Where every stay feels like home.</h2>
          <p>Sign in to book rooms, manage your reservations and pay securely.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <h1 className="auth-title">{title}</h1>
          <p className="text-muted mb-4">{subtitle}</p>
          {children}
          <div className="mt-4 text-center">{footer}</div>
        </div>
      </div>
    </div>
  );
}
