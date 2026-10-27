import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Rooms from './pages/Rooms.jsx';
import Booking from './pages/Booking.jsx';
import Footer from './components/Footer.jsx';
import MyBookings from './pages/MyBookings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute staff><AdminDashboard /></ProtectedRoute>} />
      </Routes>
      </main>
      <Footer />
    </div>
  );
}
