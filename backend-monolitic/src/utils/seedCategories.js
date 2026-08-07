const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const rawCategories = [
  { name: "Footware for Womens", parentName: "Footware" },
  { name: "Footware for Mens", parentName: "Footware" },
  { name: "Footware for Kids", parentName: "Footware" },
  { name: "Electonics", parentName: null },
  { name: "Hardware", parentName: null },
  { name: "Stationary", parentName: null },
  { name: "Beauty Product for Womens", parentName: "Beauty Product" },
  { name: "Beauty Producst for Mens", parentName: "Beauty Product" },
  { name: "Beauty Product for Kids", parentName: "Beauty Product" },
  { name: "Baby Care Products for Boy", parentName: "Babty Care Products" },
  { name: "Baby Care Products for Girl", parentName: "Baby Care Products" },
  { name: "Car Care Product", parentName: "Car Care" },
  { name: "Car Care Services", parentName: null }, // Treated as top-level to resolve self-reference
  { name: "Furniture for Rent", parentName: "Furniture Care Services" },
  { name: "Refurnished Furniture for Sale", parentName: "Furniture Care Services" },
  { name: "Furniture", parentName: null },
  { name: "Furniture Build at your Home Service", parentName: "Furniture" },
  { name: "Furniture Repair Service", parentName: "Furniture" },
  { name: "Rent Your Washing Machine", parentName: "Home Care Services" },
  { name: "Refurnished Washing Machine for Sale", parentName: "Home Care Services" },
  { name: "Clean Your Kinchen Service", parentName: "Home Care Services" },
  { name: "Clean Your Barthroom Service", parentName: "Home Care Services" },
  { name: "Baby Your Hale & Room Service", parentName: "Home Care Services" },
  { name: "Clean Your Car Service", parentName: "Car Care Services" },
  { name: "Repair Your Car Service", parentName: "Car Care Services" },
  { name: "Parshal Delivery Service", parentName: "Delivery Services" }
];

// Additional parent categories that need to be created at the top level
const implicitParents = [
  "Footware",
  "Beauty Product",
  "Babty Care Products",
  "Baby Care Products",
  "Car Care",
  "Furniture Care Services",
  "Home Care Services",
  "Delivery Services"
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://vaishnavikaril:AcwuNuZSCSamRDQM@cluster0.gjogoj9.mongodb.net/eccomerce-db?appName=Cluster0";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Clear existing categories
    console.log("Clearing existing Category collection...");
    await Category.deleteMany({});

    const categoryMap = new Map(); // name -> doc

    // 1. Create all top-level parent categories first
    console.log("Seeding top-level parent categories...");
    
    // Explicit top level categories from the list
    const explicitTopLevel = rawCategories.filter(cat => cat.parentName === null);
    
    // Combine explicit and implicit top level categories
    const allTopLevelNames = Array.from(new Set([
      ...explicitTopLevel.map(cat => cat.name),
      ...implicitParents
    ]));

    for (const name of allTopLevelNames) {
      const doc = await Category.create({ name, parentCategory: null });
      categoryMap.set(name, doc);
      console.log(`Created top-level category: "${name}" (${doc._id})`);
    }

    // 2. Create subcategories
    console.log("Seeding subcategories...");
    const subCategoriesToCreate = rawCategories.filter(cat => cat.parentName !== null);

    for (const cat of subCategoriesToCreate) {
      const parentDoc = categoryMap.get(cat.parentName);
      if (!parentDoc) {
        throw new Error(`Parent category "${cat.parentName}" not found in map for category "${cat.name}"`);
      }

      const doc = await Category.create({
        name: cat.name,
        parentCategory: parentDoc._id
      });
      categoryMap.set(cat.name, doc);
      console.log(`Created subcategory: "${cat.name}" under parent: "${cat.parentName}" (${doc._id})`);
    }

    console.log("Seeding completed successfully!");
    
    // Fetch and display tree representation
    console.log("\n--- Verification Tree ---");
    const allDocs = await Category.find({}).populate('parentCategory');
    console.log(`Total categories created: ${allDocs.length}`);
    
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
