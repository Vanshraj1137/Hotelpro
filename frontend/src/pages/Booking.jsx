import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { getRoomGallery, onImgError } from '../utils/roomImages';
import { fmtDate, money, nightsBetween, todayISO } from '../utils/format';

// Booking page: room details, gallery, booked dates and the reservation form.
export default function Booking() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [room, setRoom] = useState(null);
  const [booked, setBooked] = useState([]);
  const [active, setActive] = useState(0);
  const [dates, setDates] = useState({ checkIn: params.get('checkIn') || '', checkOut: params.get('checkOut') || '' });
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: '', variant: 'danger' });

  useEffect(() => {
    (async () => {
      try {
        const [r, b] = await Promise.all([api.get(`/rooms/${id}`), api.get(`/rooms/${id}/availability`)]);
        setRoom(r.data);
        setBooked(b.data);
      } catch (err) {
        setMsg({ text: errMsg(err), variant: 'danger' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const gallery = useMemo(() => getRoomGallery(room), [room]);
  const nights = nightsBetween(dates.checkIn, dates.checkOut);
  const total = room ? nights * room.price : 0;

  const overlaps = booked.some(
    (b) => dates.checkIn && dates.checkOut && new Date(b.checkIn) < new Date(dates.checkOut) && new Date(b.checkOut) > new Date(dates.checkIn)
  );

  const confirm = async () => {
    if (!user) {
      return navigate('/login', { state: { from: { pathname: location.pathname, search: location.search } } });
    }
    if (!nights) return setMsg({ text: 'Select valid check-in and check-out dates.', variant: 'warning' });
    setBusy(true);
    setMsg({ text: '', variant: 'danger' });
    try {
      await api.post('/bookings', { roomId: id, ...dates, guests: Number(guests) });
      navigate('/my-bookings');
    } catch (err) {
      setMsg({ text: errMsg(err), variant: 'danger' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="container py-5"><div className="spinner-border text-secondary" /></div>;
  if (!room) return (
    <div className="container py-5">
      <div className="alert alert-danger">{msg.text || 'Room not found'}</div>
      <Link to="/rooms" className="btn btn-gold">Back to rooms</Link>
    </div>
  );

  return (
    <div className="container py-4 py-lg-5">
      <Link to="/rooms" className="back-link">← Back to rooms</Link>

      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="gallery-main">
            <img src={gallery[active]} alt={`Room ${room.number}`} onError={onImgError} />
          </div>
          {gallery.length > 1 && (
            <div className="gallery-thumbs">
              {gallery.map((src, i) => (
                <button key={src + i} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>
                  <img src={src} alt="" onError={onImgError} />
                </button>
              ))}
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mt-4">
            <h1 className="room-heading mb-0">Room {room.number}</h1>
            <span className="room-type-pill">{room.type}</span>
          </div>
          <p className="text-muted mt-2">{room.description}</p>
          <p className="mb-3">👥 Up to {room.capacity} guest{room.capacity > 1 ? 's' : ''}</p>

          <h6 className="mt-4">Amenities</h6>
          <div className="amenity-list">
            {(room.amenities || []).map((a) => <span className="amenity-chip" key={a}>{a}</span>)}
          </div>

          <h6 className="mt-4">Already booked dates</h6>
          {booked.length === 0 ? (
            <p className="text-success small mb-0">✓ No upcoming bookings, fully open!</p>
          ) : (
            <ul className="booked-list">
              {booked.map((b, i) => <li key={i}>{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</li>)}
            </ul>
          )}
        </div>

        <div className="col-lg-5">
          <div className="booking-card">
            <div className="booking-price">{money(room.price)} <small>/ night</small></div>

            {msg.text && <div className={`alert alert-${msg.variant} py-2`}>{msg.text}</div>}

            <div className="row g-3 mt-1">
              <div className="col-6">
                <label className="form-label">Check-in</label>
                <input type="date" className="form-control" min={todayISO()} value={dates.checkIn}
                  onChange={(e) => setDates({ ...dates, checkIn: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Check-out</label>
                <input type="date" className="form-control" min={dates.checkIn || todayISO()} value={dates.checkOut}
                  onChange={(e) => setDates({ ...dates, checkOut: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Guests</label>
                <select className="form-select" value={guests} onChange={(e) => setGuests(e.target.value)}>
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {overlaps && (
              <div className="alert alert-warning py-2 mt-3 mb-0">These dates overlap an existing booking. Pick other dates.</div>
            )}

            {nights > 0 && (
              <div className="price-summary">
                <div><span>{money(room.price)} × {nights} night{nights > 1 ? 's' : ''}</span><span>{money(total)}</span></div>
                <div className="total"><span>Total</span><span>{money(total)}</span></div>
              </div>
            )}

            <button className="btn btn-gold w-100 py-2 mt-3" onClick={confirm} disabled={busy || overlaps}>
              {busy ? 'Booking…' : user ? 'Confirm booking' : 'Login to book'}
            </button>
            <p className="text-muted small text-center mt-2 mb-0">You can pay from My Bookings after reserving.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
