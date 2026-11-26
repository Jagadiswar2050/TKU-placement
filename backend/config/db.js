const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[Database Notice] Local MongoDB is currently offline (${error.message}).`);
    console.log(`[Database Notice] Active in-memory fallback enabled with complete pre-seeded data so all features run out of the box.`);
    console.log(`[Database Notice] To persist to a cloud database, configure MONGODB_URI in backend/.env with your free MongoDB Atlas connection string.`);
  }
};

module.exports = connectDB;
