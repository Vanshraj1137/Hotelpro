const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['booked', 'checked-in', 'checked-out', 'cancelled'],
      default: 'booked',
    },
    payment: {
      method: { type: String, enum: ['card', 'upi', 'cash'], default: 'card' },
      status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
      paidAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
