# HotelPro – MERN Hotel Management System

## Setup
1. Install Node.js (LTS) and MongoDB Community (or use a MongoDB Atlas URI in backend/.env).
2. Backend:   cd backend  && npm install && npm run seed && npm run dev
3. Frontend:  cd frontend && npm install && npm run dev
4. Open http://localhost:5173

Seeded admin login: admin@hotelpro.com / admin123

> Run `npm run seed` again after updating: the seed now includes room photos and 6 rooms.

## Pages
| Route | Page |
|---|---|
| `/` | Home: hero, quick date search, featured rooms |
| `/login`, `/register` | Split-screen auth pages (send you back to the room you were booking) |
| `/rooms` | Availability: pick dates + type, see only free rooms |
| `/book/:id` | Booking: photo gallery, amenities, booked dates, price summary, confirm |
| `/my-bookings` | Your reservations with room photos, pay / cancel |
| `/admin` | Staff/admin dashboard (rooms now accept an image URL) |

## Room images
Rooms have `image` and `images[]` fields. Rooms without an image automatically
get a default photo for their type (see `frontend/src/utils/roomImages.js`).
Seed photos are loaded from Unsplash, so an internet connection is needed to see them.

## New API endpoint
`GET /api/rooms/:id/availability` returns the upcoming booked date ranges for a room.
