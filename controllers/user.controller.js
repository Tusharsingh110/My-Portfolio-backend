const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt if you plan to use it
const { validEmail } = require("../validators/validator");
const { generateToken } = require("../utils/auth.utils");

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ statusCode: 400, message: "User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the new user
        await newUser.save();

        res.status(201).json({ statusCode:201 ,message: "User created successfully" });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!validEmail(email)) {
            return res.status(400).json({statusCode:400, message:"Invalid Email format."})
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User does not Exist." });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ statusCode: 400, message: "Invalid email or password." });
        }

        // Generate a JWT token
        const token = generateToken(user)

        res.status(200).json({statusCode:200, usermail: email, message: "Login successful", token });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const {id, isAdmin} = req.user;
        const user = await User.findOne({_id:id});
        if(!user) {
            res.status(404).json({statusCode:404, message:"User not found"});
        } 
        res.status(200).json({statusCode:200, data: {name:user.username, mail:user.email, isAdmin:user.isAdmin}, message:"User details fetched successfully"})
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}
module.exports = {
    login,
    signup,
    getUserDetails
};
