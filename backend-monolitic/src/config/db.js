const  mongoose  = require("mongoose");

require("dotenv").config();
 const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI)
        // console.log(mongoose.connected, connection)
        console.log("Mongodb database connected successfully")
    } catch (error) {
        // console.error("========== DATABASE ERROR ==========");
        // console.error(error);          // Full Error
        // console.error(error.message);  // Error Message
        // console.error(error.stack);    // Stack Trace

        console.log(error)
        process.exit(1);
    }
}

module.exports = connectDB;