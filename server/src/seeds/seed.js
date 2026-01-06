import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Location from '../models/Location.js';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import Receipt from '../models/Receipt.js';

import bcrypt from 'bcryptjs';
import { locations } from './data/locations.js';
import { packages as packagesFactory } from './data/packages.js';

async function run() {
  await connectDB();

  console.log('🧹 Clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Location.deleteMany({}),
    Package.deleteMany({}),
    Booking.deleteMany({}),
    Receipt.deleteMany({})
  ]);

  console.log('👤 Creating users...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@lankatrips.lk',
    passwordHash: await bcrypt.hash('Admin@123', 10),
    role: 'admin'
  });

  const customer = await User.create({
    name: 'Demo User',
    email: 'user@lankatrips.lk',
    passwordHash: await bcrypt.hash('User@123', 10),
    role: 'customer'
  });

  console.log('📍 Inserting locations...');
  const insertedLocations = await Location.insertMany(locations);

  const locationIdsByName = Object.fromEntries(insertedLocations.map(l => [l.name, l._id]));
  const packages = packagesFactory(locationIdsByName);

  console.log('🧳 Inserting packages...');
  await Package.insertMany(packages);

  console.log('✅ Seed complete!');
  console.log('Admin:', admin.email, 'password: Admin@123');
  console.log('Customer:', customer.email, 'password: User@123');

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
