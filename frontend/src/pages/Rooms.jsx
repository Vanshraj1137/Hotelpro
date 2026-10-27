import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import RoomCard from '../components/RoomCard.jsx';
import { todayISO } from '../utils/format';

// Availability page: search by dates + type, results show only free rooms.
export default function Rooms() {
  const [params] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState({ checkIn: params.get('checkIn') || '', checkOut: params.get('checkOut') || '' });
  const [type, setType] = useState(params.get('type') || '');
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [msg, setMsg] = useState({ text: '', variant: 'info' });

  const loadRooms = async () => {
    if (dates.checkIn && dates.checkOut && dates.checkOut <= dates.checkIn) {
      return setMsg({ text: 'Check-out must be after check-in.', variant: 'warning' });
    }
    setLoading(true);
    setMsg({ text: '', variant: 'info' });
    try {
      const query = {};
      if (type) query.type = type;
      const withDates = dates.checkIn && dates.checkOut;
      if (withDates) Object.assign(query, dates);
      const { data } = await api.get('/rooms', { params: query });
      setRooms(data);
      setSearched(Boolean(withDates));
    } catch (err) {
      setMsg({ text: errMsg(err), variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Rooms &amp; Availability</h1>
          <p>Pick your dates to see which rooms are free.</p>
        </div>
      </section>

      <div className="container search-wrap">
        <div className="search-card">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Check-in</label>
              <input type="date" className="form-control" min={todayISO()} value={dates.checkIn}
                onChange={(e) => setDates({ ...dates, checkIn: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Check-out</label>
              <input type="date" className="form-control" min={dates.checkIn || todayISO()} value={dates.checkOut}
                onChange={(e) => setDates({ ...dates, checkOut: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Room type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-gold w-100" onClick={loadRooms}>Check availability</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {msg.text && <div className={`alert alert-${msg.variant}`}>{msg.text}</div>}

        {!loading && (
          <p className="text-muted mb-4">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} {searched ? 'available for your dates' : 'found'}
          </p>
        )}

        {loading ? (
          <div className="row g-4">
            {[1, 2, 3].map((i) => (
              <div className="col-md-6 col-lg-4" key={i}><div className="skeleton-card" /></div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((r) => (
              <div className="col-md-6 col-lg-4" key={r._id}>
                <RoomCard room={r} dates={dates} showAvailable={searched} />
              </div>
            ))}
            {rooms.length === 0 && (
              <div className="empty-state">
                <div className="fs-1">🛏️</div>
                <h5>No rooms available</h5>
                <p className="text-muted mb-0">Try different dates or another room type.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
