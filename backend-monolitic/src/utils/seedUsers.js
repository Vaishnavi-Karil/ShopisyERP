const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const usersData = [
  {
    name: "Preeti",
    email: "preeti@gmail.com",
    plainPassword: "preeti@123",
    role: "customer",
    isVendor: false
  },
  {
    name: "Vaishnavi",
    email: "vaishnavi@gmail.com",
    plainPassword: "vaishnavi@123",
    role: "admin",
    isVendor: false
  },
  {
    name: "Koushal", // Manufacturer
    email: "koushal@gmail.com",
    plainPassword: "koushal@123",
    role: "vendor",
    isVendor: true,
    businessType: "manufacturer"
  },
  {
    name: "Amit", // Wholesaler
    email: "amit@gmail.com",
    plainPassword: "amit@123",
    role: "vendor",
    isVendor: true,
    businessType: "wholesaler"
  },
  {
    name: "Rohan", // Retailer
    email: "rohan@gmail.com",
    plainPassword: "rohan@123",
    role: "vendor",
    isVendor: true,
    businessType: "retailer"
  },
  {
    name: "Siddharth", // Service Provider
    email: "siddharth@gmail.com",
    plainPassword: "siddharth@123",
    role: "vendor",
    isVendor: true,
    businessType: "service provider"
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://vaishnavikaril:AcwuNuZSCSamRDQM@cluster0.gjogoj9.mongodb.net/eccomerce-db?appName=Cluster0";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Clear existing users
    console.log("Clearing existing User collection...");
    await User.deleteMany({});

    console.log("Seeding different users as per the schema...");
    for (const u of usersData) {
      const hashedPassword = await bcrypt.hash(u.plainPassword, 10);
      
      const doc = await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        isVendor: u.isVendor,
        businessType: u.businessType || undefined
      });

      console.log(`Created user: "${doc.name}" | Role: "${doc.role}" | Business Type: "${doc.businessType || 'N/A'}" (${doc._id})`);
    }

    console.log("User seeding completed successfully!");

    // Verification
    const count = await User.countDocuments();
    console.log(`Total users created: ${count}`);

  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
