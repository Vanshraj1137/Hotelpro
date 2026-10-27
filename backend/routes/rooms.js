const router = require('express').Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/rooms?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&type=deluxe
router.get('/', async (req, res, next) => {
  try {
    const { checkIn, checkOut, type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;

    if (checkIn && checkOut) {
      const taken = await Booking.find({
        status: { $in: ['booked', 'checked-in'] },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      }).distinct('room');
      filter._id = { $nin: taken };
    }
    res.json(await Room.find(filter).sort('number'));
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/:id/availability -> list of already-booked date ranges
router.get('/:id/availability', async (req, res, next) => {
  try {
    const booked = await Booking.find({
      room: req.params.id,
      status: { $in: ['booked', 'checked-in'] },
      checkOut: { $gt: new Date() },
    })
      .select('checkIn checkOut -_id')
      .sort('checkIn');
    res.json(booked);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    res.status(201).json(await Room.create(req.body));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
