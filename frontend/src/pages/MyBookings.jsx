import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { getRoomImage, onImgError } from '../utils/roomImages';
import { fmtDate, money } from '../utils/format';

const statusColor = { booked: 'primary', 'checked-in': 'success', 'checked-out': 'secondary', cancelled: 'danger' };
const payColor = { pending: 'warning', paid: 'success', refunded: 'info' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/bookings/mine');
      setBookings(data);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, action, body = {}) => {
    try {
      await api.put(`/bookings/${id}/${action}`, body);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <>
      <section className="page-banner small">
        <div className="container"><h1>My bookings</h1></div>
      </section>
      <div className="container py-5">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="spinner-border text-secondary" />}

        <div className="d-flex flex-column gap-3">
          {bookings.map((b) => (
            <div className="booking-row" key={b._id}>
              <img src={getRoomImage(b.room)} alt="" onError={onImgError} />
              <div className="booking-info">
                <h5 className="mb-1">Room {b.room?.number} <small className="text-muted text-capitalize">({b.room?.type})</small></h5>
                <div className="text-muted small">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.guests} guest{b.guests > 1 ? 's' : ''}</div>
                <div className="mt-2 d-flex flex-wrap gap-2">
                  <span className={`badge bg-${statusColor[b.status]}`}>{b.status}</span>
                  <span className={`badge bg-${payColor[b.payment.status] || 'secondary'}`}>payment: {b.payment.status}</span>
                </div>
              </div>
              <div className="booking-actions">
                <div className="booking-total">{money(b.totalPrice)}</div>
                <div className="d-flex gap-2 justify-content-end flex-wrap">
                  {b.status !== 'cancelled' && b.payment.status === 'pending' && (
                    <button className="btn btn-sm btn-success" onClick={() => act(b._id, 'pay', { method: 'card' })}>Pay now</button>
                  )}
                  {b.status === 'booked' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => act(b._id, 'cancel')}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && bookings.length === 0 && (
          <div className="empty-state">
            <div className="fs-1">🧳</div>
            <h5>No bookings yet</h5>
            <Link to="/rooms" className="btn btn-gold mt-2">Find a room</Link>
          </div>
        )}
      </div>
    </>
  );
}
