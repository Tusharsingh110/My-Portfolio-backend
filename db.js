const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://tusharsingh6t:Tush2201@cluster0.keitzer.mongodb.net/feedbacksdata?retryWrites=true&w=majority";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

    }
};

module.exports = connectToMongo;