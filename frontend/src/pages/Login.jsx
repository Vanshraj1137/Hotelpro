import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api';
import AuthLayout from '../components/AuthLayout.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from; // set by ProtectedRoute / booking page
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (from) navigate(from.pathname + (from.search || ''), { replace: true });
      else navigate(user.role === 'guest' ? '/rooms' : '/admin');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue your booking."
      footer={<>New here? <Link to="/register" state={{ from }}>Create an account</Link></>}
    >
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" placeholder="you@example.com" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="form-label">Password</label>
        <input className="form-control mb-4" type="password" placeholder="••••••••" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-gold w-100 py-2" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
      </form>
    </AuthLayout>
  );
}
