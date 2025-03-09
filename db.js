const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const maxRetries = 5;

const connectToMongo = async (attempt = 1) => {
    try {
        console.log("Trying to connect to MongoDB...")
        console.log(process.env.MONGODB_URI); // Add this line
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

        // Retry connection
        if(attempt <= maxRetries) {
            console.log(`Retrying connection. Attempt ${attempt}...`);
            setTimeout(async () => {
                await connectToMongo(attempt + 1);
            }, 10000);
        }        
    }
};



module.exports = connectToMongo;
