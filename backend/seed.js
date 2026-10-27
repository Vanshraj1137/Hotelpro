require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Room.deleteMany({})]);

  await User.create({ name: 'Admin', email: 'admin@hotelpro.com', password: 'admin123', role: 'admin' });

  await Room.insertMany([
    {
      number: '101', type: 'single', price: 1500, capacity: 1,
      amenities: ['WiFi', 'AC', 'Work Desk'],
      description: 'Cozy single room, perfect for solo travellers and business stays.',
      image: u('photo-1631049307264-da0ec9d70304'),
      images: [u('photo-1631049307264-da0ec9d70304'), u('photo-1590490360182-c33d57733427'), u('photo-1618773928121-c32242e63f39')],
    },
    {
      number: '102', type: 'double', price: 2500, capacity: 2,
      amenities: ['WiFi', 'AC', 'TV', 'Breakfast'],
      description: 'Comfortable double room with a plush king bed and soft lighting.',
      image: u('photo-1590490360182-c33d57733427'),
      images: [u('photo-1590490360182-c33d57733427'), u('photo-1631049307264-da0ec9d70304'), u('photo-1611892440504-42a792e24d32')],
    },
    {
      number: '103', type: 'double', price: 2800, capacity: 2,
      amenities: ['WiFi', 'AC', 'TV', 'Balcony'],
      description: 'Bright double room with a private balcony and garden view.',
      image: u('photo-1618773928121-c32242e63f39'),
      images: [u('photo-1618773928121-c32242e63f39'), u('photo-1590490360182-c33d57733427'), u('photo-1631049307264-da0ec9d70304')],
    },
    {
      number: '201', type: 'deluxe', price: 4000, capacity: 3,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'City View'],
      description: 'Spacious deluxe room with a sitting area and a stunning city view.',
      image: u('photo-1611892440504-42a792e24d32'),
      images: [u('photo-1611892440504-42a792e24d32'), u('photo-1618773928121-c32242e63f39'), u('photo-1590490360182-c33d57733427')],
    },
    {
      number: '202', type: 'deluxe', price: 4500, capacity: 3,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Bathtub'],
      description: 'Elegant deluxe room with a freestanding bathtub and warm interiors.',
      image: u('photo-1631049307264-da0ec9d70304'),
      images: [u('photo-1631049307264-da0ec9d70304'), u('photo-1611892440504-42a792e24d32'), u('photo-1618773928121-c32242e63f39')],
    },
    {
      number: '301', type: 'suite', price: 7500, capacity: 4,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Living Area'],
      description: 'Luxury suite with a separate living area, jacuzzi and panoramic views.',
      image: u('photo-1582719478250-c89cae4dc85b'),
      images: [u('photo-1582719478250-c89cae4dc85b'), u('photo-1611892440504-42a792e24d32'), u('photo-1618773928121-c32242e63f39')],
    },
  ]);

  console.log('Seeded. Admin login: admin@hotelpro.com / admin123');
  process.exit(0);
})();
