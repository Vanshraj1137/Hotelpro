import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { getRoomImage, onImgError } from '../utils/roomImages';

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const emptyRoom = { number: '', type: 'single', price: '', capacity: 2, amenities: '', description: '', image: '' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [b, r] = await Promise.all([api.get('/bookings'), api.get('/rooms')]);
      setBookings(b.data);
      setRooms(r.data);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const addRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', {
        ...form,
        price: Number(form.price),
        capacity: Number(form.capacity),
        image: form.image.trim() || undefined,
        amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      });
      setForm(emptyRoom);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const revenue = bookings.filter((b) => b.payment.status === 'paid').reduce((s, b) => s + b.totalPrice, 0);
  const active = bookings.filter((b) => ['booked', 'checked-in'].includes(b.status)).length;

  return (
    <div className="container py-4 py-lg-5">
      <h2 className="section-title mb-4">Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {[['Rooms', rooms.length], ['Active bookings', active], ['Revenue', `₹${revenue}`]].map(([label, value]) => (
          <div className="col-md-4" key={label}>
            <div className="stat-card">
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <ul className="nav nav-tabs admin-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button></li>
        {isAdmin && <li className="nav-item"><button className={`nav-link ${tab === 'rooms' ? 'active' : ''}`} onClick={() => setTab('rooms')}>Rooms</button></li>}
      </ul>

      {tab === 'bookings' && (
        <div className="table-responsive table-card">
          <table className="table table-hover align-middle mb-0">
            <thead><tr><th>Guest</th><th>Room</th><th>Dates</th><th>Status</th><th>Payment</th><th></th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name}<br /><small className="text-muted">{b.user?.email}</small></td>
                  <td>{b.room?.number}</td>
                  <td>{fmt(b.checkIn)} → {fmt(b.checkOut)}</td>
                  <td><span className="badge bg-secondary">{b.status}</span></td>
                  <td><span className={`badge bg-${b.payment.status === 'paid' ? 'success' : 'warning'}`}>{b.payment.status}</span></td>
                  <td className="text-end">
                    {b.status === 'booked' && <button className="btn btn-sm btn-success" onClick={() => setStatus(b._id, 'checked-in')}>Check in</button>}
                    {b.status === 'checked-in' && <button className="btn btn-sm btn-secondary" onClick={() => setStatus(b._id, 'checked-out')}>Check out</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'rooms' && isAdmin && (
        <>
          <form className="row g-2 mb-4" onSubmit={addRoom}>
            <div className="col-md-2"><input className="form-control" placeholder="Room no." required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} /></div>
            <div className="col-md-2">
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>single</option><option>double</option><option>deluxe</option><option>suite</option>
              </select>
            </div>
            <div className="col-md-2"><input className="form-control" type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div className="col-md-2"><input className="form-control" type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Amenities (comma separated)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} /></div>
            <div className="col-md-1"><button className="btn btn-gold w-100">Add</button></div>
            <div className="col-md-4"><input className="form-control" placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
            <div className="col-md-8"><input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </form>
          <div className="table-responsive table-card"><table className="table align-middle mb-0">
            <thead><tr><th>Photo</th><th>No.</th><th>Type</th><th>Price</th><th>Capacity</th><th></th></tr></thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id}>
                  <td><img className="admin-thumb" src={getRoomImage(r)} alt="" onError={onImgError} /></td><td>{r.number}</td><td className="text-capitalize">{r.type}</td><td>₹{r.price}</td><td>{r.capacity}</td>
                  <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => deleteRoom(r._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </>
      )}
    </div>
  );
}
