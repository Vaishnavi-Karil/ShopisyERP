const mongoose = require('mongoose');
const Product = require('../models/Products');
const Category = require('../models/Category');
const User = require('../models/User');
require('dotenv').config();

const rawProducts = [
  {
    name: "Nike Air Max Women",
    price: 3999,
    categoryName: "Footware for Womens",
    image: "nike-air-max.jpg",
    description: "Premium running shoes designed specifically for women, offering superior comfort, cushioning, and style.",
    vendorRole: "manufacturer"
  },
  {
    name: "Puma Running Shoes Men",
    price: 2999,
    categoryName: "Footware for Mens",
    image: "puma-men.jpg",
    description: "High-performance running shoes for men, perfect for daily workouts, running sessions, and casual wear.",
    vendorRole: "manufacturer"
  },
  {
    name: "Kids School Shoes",
    price: 999,
    categoryName: "Footware for Kids",
    image: "kids-shoes.jpg",
    description: "Durable, scuff-resistant, and comfortable school shoes for kids, built to last through the active school day.",
    vendorRole: "manufacturer"
  },
  {
    name: "iPhone 18 Pro",
    price: 149999,
    categoryName: "Electonics",
    image: "iphone.jpg",
    description: "The latest iPhone 18 Pro featuring advanced camera systems, ultra-fast performance chip, and a stunning durable display.",
    vendorRole: "manufacturer"
  },
  {
    name: "Samsung 65 Inch Smart TV",
    price: 79999,
    categoryName: "Electonics",
    image: "tv.jpg",
    description: "Ultra HD 65-inch Smart TV with vibrant crystal display colors and rich sound for the ultimate home theater experience.",
    vendorRole: "manufacturer"
  },
  {
    name: "Bosch Drill Machine",
    price: 4500,
    categoryName: "Hardware",
    image: "drill.jpg",
    description: "Powerful Bosch impact drill machine, ideal for all your home improvement and professional drilling needs on concrete, wood, or metal.",
    vendorRole: "manufacturer"
  },
  {
    name: "Classmate Notebook Pack",
    price: 250,
    categoryName: "Stationary",
    image: "notebook.jpg",
    description: "A pack of high-quality Classmate notebooks with smooth white pages, ideal for school, college, or office work.",
    vendorRole: "wholesaler"
  },
  {
    name: "Lakme Lipstick",
    price: 799,
    categoryName: "Beauty Product for Womens",
    image: "lipstick.jpg",
    description: "Long-lasting Lakme lipstick with rich color payoff, high hydration, and a smooth matte finish.",
    vendorRole: "retailer"
  },
  {
    name: "Beardo Beard Oil",
    price: 499,
    categoryName: "Beauty Producst for Mens",
    image: "beard-oil.jpg",
    description: "Nourishing Beardo beard oil to promote healthy growth, prevent itchiness, and keep your beard soft, smooth, and groomed.",
    vendorRole: "retailer"
  },
  {
    name: "Johnson Baby Powder",
    price: 199,
    categoryName: "Baby Care Products for Boy",
    image: "baby-powder.jpg",
    description: "Gentle and safe Johnson's baby powder designed to absorb excess moisture and keep your baby's skin dry, soft, and smelling fresh.",
    vendorRole: "retailer"
  },
  {
    name: "3M Car Polish",
    price: 899,
    categoryName: "Car Care Product",
    image: "car-polish.jpg",
    description: "Premium 3M car polish that restores paint shine, eliminates light swirls, and protects against weathering and scratches.",
    vendorRole: "wholesaler"
  },
  {
    name: "Wooden Sofa Set",
    price: 25000,
    categoryName: "Furniture",
    image: "sofa.jpg",
    description: "Elegant, solid teakwood sofa set with premium cushions, perfect for adding warmth and premium aesthetic to your living room.",
    vendorRole: "wholesaler"
  },
  {
    name: "Furniture Repair Service",
    price: 499,
    categoryName: "Furniture Repair Service",
    image: "furniture-repair.jpg",
    description: "Professional furniture repair, refurbishing, and restoration service by skilled carpenters delivered at your doorstep.",
    vendorRole: "service provider"
  },
  {
    name: "Kitchen Deep Cleaning",
    price: 999,
    categoryName: "Clean Your Kinchen Service",
    image: "kitchen-cleaning.jpg",
    description: "Thorough kitchen deep cleaning service, sanitizing all countertops, cabinets, appliances, chimney exhaust, and wall tiles.",
    vendorRole: "service provider"
  },
  {
    name: "Bathroom Cleaning",
    price: 799,
    categoryName: "Clean Your Barthroom Service",
    image: "bathroom-cleaning.jpg",
    description: "Professional deep bathroom cleaning service, removing tough hardwater stains, scaling, and sanitizing all fixtures and tiles.",
    vendorRole: "service provider"
  },
  {
    name: "Parcel Delivery (Within City)",
    price: 150,
    categoryName: "Parshal Delivery Service",
    image: "parcel-delivery.jpg",
    description: "Fast and reliable parcel delivery service within the city, ensuring safe transport and delivery of your packages.",
    vendorRole: "service provider"
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://vaishnavikaril:AcwuNuZSCSamRDQM@cluster0.gjogoj9.mongodb.net/eccomerce-db?appName=Cluster0";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Clear existing products
    console.log("Clearing existing Product collection...");
    await Product.deleteMany({});

    // Fetch all categories to map name -> _id
    console.log("Fetching categories for mapping...");
    const categories = await Category.find({});
    const categoryMap = new Map(categories.map(c => [c.name, c._id]));

    // Fetch all vendor users to map businessType -> _id
    console.log("Fetching vendor users for mapping...");
    const vendors = await User.find({ isVendor: true });
    const vendorMap = new Map(vendors.map(v => [v.businessType, v._id]));

    console.log("Seeding products with matching vendor categories...");
    for (const prod of rawProducts) {
      const categoryId = categoryMap.get(prod.categoryName);
      if (!categoryId) {
        throw new Error(`Category "${prod.categoryName}" not found in database for product "${prod.name}"`);
      }

      const venderId = vendorMap.get(prod.vendorRole);
      if (!venderId) {
        throw new Error(`Vendor user with business type "${prod.vendorRole}" not found in database for product "${prod.name}"`);
      }

      const doc = await Product.create({
        name: prod.name,
        price: prod.price,
        categoryId: categoryId,
        description: prod.description,
        image: Buffer.from(prod.image),
        venderId: venderId
      });

      console.log(`Created product: "${doc.name}" | Category: "${prod.categoryName}" | Vendor: "${prod.vendorRole}" (${doc._id})`);
    }

    console.log("Product seeding completed successfully!");

    // Verification
    const count = await Product.countDocuments();
    console.log(`Total products created in remote database: ${count}`);

  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
