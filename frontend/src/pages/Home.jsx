import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import RoomCard from '../components/RoomCard.jsx';
import { HERO_IMAGE } from '../utils/roomImages';
import { todayISO } from '../utils/format';

const features = [
  ['📅', 'Easy Booking', 'Real-time availability and instant reservations.'],
  ['🔐', 'Secure Access', 'JWT authentication with encrypted passwords.'],
  ['💳', 'Payments', 'Track payment status for every booking.'],
  ['⭐', 'Comfort First', 'Clean, modern rooms for every kind of stay.'],
];

export default function Home() {
  const navigate = useNavigate();
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/rooms').then(({ data }) => setFeatured(data.slice(0, 3))).catch(() => {});
  }, []);

  const search = (e) => {
    e.preventDefault();
    const q = new URLSearchParams(Object.fromEntries(Object.entries(dates).filter(([, v]) => v))).toString();
    navigate(`/rooms${q ? `?${q}` : ''}`);
  };

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(8,22,40,.6), rgba(8,22,40,.75)), url(${HERO_IMAGE})` }}>
        <div className="container text-center">
          <p className="eyebrow">Welcome to HotelPro</p>
          <h1>Your perfect stay, <span>just a click away</span></h1>
          <p className="lead">Secure, simple booking for rooms, guests and payments, all in one place.</p>

          <form className="hero-search" onSubmit={search}>
            <div>
              <label>Check-in</label>
              <input type="date" className="form-control" min={todayISO()} value={dates.checkIn}
                onChange={(e) => setDates({ ...dates, checkIn: e.target.value })} />
            </div>
            <div>
              <label>Check-out</label>
              <input type="date" className="form-control" min={dates.checkIn || todayISO()} value={dates.checkOut}
                onChange={(e) => setDates({ ...dates, checkOut: e.target.value })} />
            </div>
            <button className="btn btn-gold">Check availability</button>
          </form>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container py-5">
          <div className="section-head">
            <h2>Featured rooms</h2>
            <Link to="/rooms">View all →</Link>
          </div>
          <div className="row g-4">
            {featured.map((r) => (
              <div className="col-md-6 col-lg-4" key={r._id}><RoomCard room={r} /></div>
            ))}
          </div>
        </section>
      )}

      <section className="features-band">
        <div className="container">
          <div className="section-head center"><h2>Why book with us</h2></div>
          <div className="row g-4">
            {features.map(([icon, title, text]) => (
              <div className="col-md-6 col-lg-3" key={title}>
                <div className="feature-card">
                  <div className="feature-icon">{icon}</div>
                  <h5>{title}</h5>
                  <p className="mb-0">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
