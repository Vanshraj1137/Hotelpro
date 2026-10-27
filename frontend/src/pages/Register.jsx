import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api';
import AuthLayout from '../components/AuthLayout.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate(from ? from.pathname + (from.search || '') : '/rooms', { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join HotelPro to book rooms in a few clicks."
      footer={<>Already registered? <Link to="/login" state={{ from }}>Login</Link></>}
    >
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="form-label">Full name</label>
        <input className="form-control mb-3" placeholder="Your name" required value={form.name} onChange={set('name')} />
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
        <label className="form-label">Phone</label>
        <input className="form-control mb-3" placeholder="Optional" value={form.phone} onChange={set('phone')} />
        <label className="form-label">Password</label>
        <input className="form-control mb-4" type="password" minLength={6} placeholder="Min 6 characters" required
          value={form.password} onChange={set('password')} />
        <button className="btn btn-gold w-100 py-2" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
      </form>
    </AuthLayout>
  );
}
