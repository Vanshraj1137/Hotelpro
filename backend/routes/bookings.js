const router = require('express').Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, staffOnly } = require('../middleware/auth');

// Create booking (with availability check)
router.post('/', protect, async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (!(start < end)) return res.status(400).json({ message: 'Check-out must be after check-in' });

    const room = await Room.findById(roomId);
    if (!room || !room.isActive) return res.status(404).json({ message: 'Room not available' });

    if (guests && Number(guests) > room.capacity)
      return res.status(400).json({ message: `This room fits up to ${room.capacity} guests` });

    const clash = await Booking.findOne({
      room: roomId,
      status: { $in: ['booked', 'checked-in'] },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });
    if (clash) return res.status(409).json({ message: 'Room is already booked for these dates' });

    const nights = Math.ceil((end - start) / 86400000);
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: start,
      checkOut: end,
      guests: Number(guests) || 1,
      totalPrice: nights * room.price,
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// My bookings
router.get('/mine', protect, async (req, res, next) => {
  try {
    res.json(await Booking.find({ user: req.user._id }).populate('room').sort('-createdAt'));
  } catch (err) {
    next(err);
  }
});

// All bookings (staff/admin)
router.get('/', protect, staffOnly, async (req, res, next) => {
  try {
    res.json(await Booking.find().populate('room').populate('user', 'name email phone').sort('-createdAt'));
  } catch (err) {
    next(err);
  }
});

// Pay (simulated gateway - plug Razorpay/Stripe here later)
router.put('/:id/pay', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.user) !== String(req.user._id) && req.user.role === 'guest')
      return res.status(403).json({ message: 'Not allowed' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is cancelled' });

    booking.payment = { method: req.body.method || 'card', status: 'paid', paidAt: new Date() };
    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Check-in / check-out (staff/admin)
router.put('/:id/status', protect, staffOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['checked-in', 'checked-out'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Cancel (owner or staff)
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.user) !== String(req.user._id) && req.user.role === 'guest')
      return res.status(403).json({ message: 'Not allowed' });
    if (booking.status !== 'booked') return res.status(400).json({ message: 'Only upcoming bookings can be cancelled' });

    booking.status = 'cancelled';
    if (booking.payment.status === 'paid') booking.payment.status = 'refunded';
    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
