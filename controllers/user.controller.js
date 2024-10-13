const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt if you plan to use it
const { validEmail } = require("../validators/validator");
const { generateToken } = require("../utils/auth.utils");
const { generateOTP } = require("./otp.controller");
const { sendOTPMail } = require("../utils/mailer.utils");
const OTP = require("../models/otp.model");

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
        const saveUserResp = await newUser.save();
        console.log("saveUSer", saveUserResp);

        res.status(201).json({ statusCode: 201, message: "User created successfully" });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!validEmail(email)) {
            return res.status(400).json({ statusCode: 400, message: "Invalid e-mail format." })
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User does not exist." });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ statusCode: 400, message: "Invalid email or password." });
        }

        // Generate a JWT token
        const token = generateToken(user)

        res.status(200).json({ statusCode: 200, usermail: email, message: "Login successful", token });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id, isAdmin } = req.user;
        const user = await User.findOne({ _id: id });
        if (!user) {
            res.status(404).json({ statusCode: 404, message: "User not found" });
        }
        res.status(200).json({ statusCode: 200, data: { username: user.username, mail: user.email, isAdmin: user.isAdmin, isVerified: user.isVerified }, message: "User details fetched successfully" })
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

const requestOTP = async (req, res) => {
    try {
        // get and validate input
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "Bad Request! Invalid user details." });
        }

        // verify User
        const user = await User.findOne({ "_id": userId });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "Bad Request! User does not exist." });
        }

        // look for existing OTPs
        const otpExists = await OTP.findOne({ userId: userId });
        if (otpExists) {
            await OTP.deleteOne({ userId: userId });
        }

        // generate otp
        const otpResponse = await generateOTP(userId);
        if (!otpResponse.valid) {
            return res.status(500).json({ statusCode: 500, message: "Server Error! Failed in genereating OTP." });
        }

        // send otp
        const mailObj = {
            recipientMail: user.email,
            recipientName: user.username
        }
        const sendOTPResponse = await sendOTPMail(mailObj, otpResponse.otp);
        if (!sendOTPResponse.valid) {
            return res.status(500).json({ statusCode: 500, message: "Server Error! Failed in sending OTP." });
        }

        res.status(200).json({ statusCode: 200, message: "OTP has been sent to your registerd e-mail." });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

const verifyOTP = async (req, res) => {
    try {
        // Get userID from the request
        const userId = req.user.id;
        const userOTP = req.body.otp;
        console.log(userId, userOTP);

        // Verify user exists
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "Bad Request! User does not exist." });
        }
        console.log(user)
        
        // Verify OTP
        const otpRecord = await OTP.findOne({ userId: userId });
        if (!otpRecord) {
            return res.status(404).json({ statusCode: 404, message: "OTP has expired, please request a new one." });
        }
        console.log(otpRecord)


        // Check if the provided OTP matches
        if (otpRecord.otp != userOTP) {
            return res.status(400).json({ statusCode: 400, message: "Incorrect OTP." });
        }

        // Mark the user as verified
        const isVerified = await User.updateOne({ _id: userId }, { isVerified: true });
        if(!isVerified) {
            return res.status(400).json({ statusCode: 400, message: "User verification failed." });
        }

        // Remove the OTP record after successful verification
        await OTP.deleteOne({ userId: userId });

        // Send success response
        res.status(200).json({ statusCode: 200, message: "Verification successful." });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};


module.exports = {
    login,
    signup,
    getUserDetails,
    requestOTP,
    verifyOTP
};
