const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://vaishnavikaril:AcwuNuZSCSamRDQM@cluster0.gjogoj9.mongodb.net/eccomerce-db?appName=Cluster0";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // 1. Find the two categories
    const babtyCategory = await Category.findOne({ name: "Babty Care Products" });
    const babyCategory = await Category.findOne({ name: "Baby Care Products" });

    if (!babtyCategory) {
      console.log("Category 'Babty Care Products' not found (already updated/deleted).");
      return;
    }

    if (!babyCategory) {
      // If Baby Care Products doesn't exist, we can just rename Babty Care Products to Baby Care Products
      console.log("Category 'Baby Care Products' not found. Renaming 'Babty Care Products'...");
      babtyCategory.name = "Baby Care Products";
      await babtyCategory.save();
      console.log("Renamed successfully.");
    } else {
      // If both exist, merge them:
      // Point all subcategories of "Babty Care Products" to "Baby Care Products"
      console.log(`Merging subcategories from "${babtyCategory.name}" (${babtyCategory._id}) to "${babyCategory.name}" (${babyCategory._id})...`);
      const updateResult = await Category.updateMany(
        { parentCategory: babtyCategory._id },
        { parentCategory: babyCategory._id }
      );
      console.log(`Updated ${updateResult.modifiedCount} subcategories.`);

      // Delete the obsolete "Babty Care Products"
      await Category.deleteOne({ _id: babtyCategory._id });
      console.log(`Deleted obsolete category "${babtyCategory.name}".`);
    }

    console.log("Category update completed successfully.");

  } catch (error) {
    console.error("Error updating category:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
