const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tusharsingh6t@gmail.com',
        pass: process.env.SMTP_PASSWORD
    },
});
// Function to send mail
async function sendMail(mailObj = {}) {
    const recipient = mailObj.recepient ?? process.env.DEFAULT_MAIL;
    const subject = mailObj.subject ?? 'Alert';
    const data = mailObj.data || `
        <p>Thank you for taking the time to fill out our feedback form! We truly appreciate your insights and suggestions.</p>
        <p>Your feedback is invaluable in helping us improve our services and deliver a better experience. We’re committed to listening to our audience and continuously enhancing our offerings.</p>
        <p>If you have any further thoughts or questions, please feel free to reach out. We’d love to hear from you!</p>
    `;

    const mailOptions = {
        from: process.env.DEFAULT_MAIL,
        to: recipient,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Dear ${mailObj.username},</h2>
                ${data}
                <p>Best regards,</p>
                <p>Tushar Singh</p>
                <p>Software Developer | Lumiq</p>
                <p>+91 6388409329</p>
            </div>
        `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { valid: true, message: 'Email sent successfully', response: info.response };
    } catch (error) {
        console.error('Error sending mail:', error);
        throw { valid: false, message: 'Error sending mail', error };
    }
}

async function sendOTPMail(mailObj, otp) {
    const recipient = mailObj.recipientMail ?? process.env.DEFAULT_MAIL;
    const recipientName = mailObj.recipientName
    const subject = 'Your OTP Code for Verification';
    const data = `
        <p>Thanks for joining us. Use the OTP below to verify your identity:</p>
        <div style="margin: 20px 0; padding: 20px; border-radius: 10px; background-color: #f4f4f4; text-align: center;">
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${otp}</p>
        </div>
        <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
        <p>This OTP is valid for the next 10 minutes.</p>
    `;

    const mailOptions = {
        from: process.env.DEFAULT_MAIL,
        to: recipient,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #222; font-weight: bold; text-align: center;">Verification Code</h2>
                <div style="color: #555; font-size: 16px; line-height: 1.6;">
                    <p>Hi ${recipientName},</p>
                    ${data}
                    <p style="font-style: italic;">Best regards,</p>
                    <p style="font-weight: bold;">Tushar Singh</p>
                    <p style="font-size: 14px; color: #777;">Software Developer | Lumiq</p>
                    <p style="font-size: 14px; color: #777;">+91 6388409329</p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully:', info.response);
        return { valid: true, message: 'OTP email sent successfully', response: info.response };
    } catch (error) {
        console.error('Error sending OTP mail:', error);
        return { valid: false, message: 'Error sending OTP mail', error };
    }
}


module.exports = {
    sendMail: sendMail,
    sendOTPMail: sendOTPMail
};
