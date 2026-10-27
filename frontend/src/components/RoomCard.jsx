import { Link } from 'react-router-dom';
import { getRoomImage, onImgError } from '../utils/roomImages';
import { money } from '../utils/format';

export default function RoomCard({ room, dates = {}, showAvailable = false }) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(dates).filter(([, v]) => v))
  ).toString();

  return (
    <div className="room-card card h-100">
      <div className="room-img-wrap">
        <img src={getRoomImage(room)} alt={`Room ${room.number}`} loading="lazy" onError={onImgError} />
        <span className="room-type-badge">{room.type}</span>
        {showAvailable && <span className="room-available-badge">● Available</span>}
        <div className="room-price-tag">
          {money(room.price)} <small>/ night</small>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="room-title">Room {room.number}</h5>
        <p className="text-muted small mb-2">{room.description}</p>
        <p className="small mb-2">👥 Up to {room.capacity} guest{room.capacity > 1 ? 's' : ''}</p>
        <div className="amenity-list mb-3">
          {(room.amenities || []).slice(0, 4).map((a) => (
            <span className="amenity-chip" key={a}>{a}</span>
          ))}
          {(room.amenities || []).length > 4 && (
            <span className="amenity-chip">+{room.amenities.length - 4}</span>
          )}
        </div>
        <Link
          to={`/book/${room._id}${query ? `?${query}` : ''}`}
          className="btn btn-gold mt-auto"
        >
          View &amp; Book
        </Link>
      </div>
    </div>
  );
}
