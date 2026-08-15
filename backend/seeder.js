import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Property from './models/Property.js';
import Inquiry from './models/Inquiry.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    await Admin.deleteMany();
    await Property.deleteMany();
    await Inquiry.deleteMany();

    // Create Super Admin user
    const admin = await Admin.create({
      name: 'Agency Administrator',
      email: 'admin@boutique.com',
      password: 'adminpassword123', // Will be automatically hashed by pre-save hook
      role: 'Super Admin',
    });

    console.log('Admin user created (admin@boutique.com / adminpassword123)');

    // Create Sample Properties
    await Property.create([
      {
        title: 'Modern 3BHK Penthouse in Baneshwor',
        description: 'An executive penthouse suite featuring panoramic Himalayan views, private terrace, Italian marble flooring, and smart home automation.',
        price: 35000000,
        type: 'Buy',
        category: 'Apartment',
        location: 'New Baneshwor, Near Civil Hospital',
        city: 'Kathmandu',
        bedrooms: 3,
        bathrooms: 3,
        area: 2400,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
        status: 'Available',
        isFeatured: true,
      },
      {
        title: 'Colonial Heritage Villa in Sanepa',
        description: 'Sprawling colonial-inspired residential villa surrounded by lush landscaped gardens, high ceilings, wooden parquet, and dedicated security post.',
        price: 85000000,
        type: 'Buy',
        category: 'House',
        location: 'Sanepa Heights, Lalitpur',
        city: 'Lalitpur',
        bedrooms: 5,
        bathrooms: 4,
        area: 4200,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
        status: 'Available',
        isFeatured: true,
      },
      {
        title: 'Furnished Commercial Office Suite',
        description: 'Prime corporate workspace fully furnished with high-speed internet infrastructure, meeting rooms, and underground reserved parking.',
        price: 150000,
        type: 'Rent',
        category: 'Commercial',
        location: 'Durbar Marg',
        city: 'Kathmandu',
        bedrooms: 0,
        bathrooms: 2,
        area: 1800,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'],
        status: 'Available',
        isFeatured: false,
      },
    ]);

    console.log('Sample properties successfully seeded.');
    process.exit();
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();