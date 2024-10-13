const OTP = require('../models/otp.model');

const generateOTP = async (userId) => {
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        const expiresInMinutes = 1; // OTP valid for 10 minutes
    
        // Set expiration time
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    
        // Save OTP to database
        const otp = new OTP({
            otp: otpCode,
            expiresAt: expiresAt,
            userId: userId
        });
    
        await otp.save();
        return {valid: true, message: "OTP generated successfully.", otp:otpCode};
        
    } catch (error) {
        return {valid: true, message: "OTP generation failed.", error: error};
    }
};


module.exports = { generateOTP };
