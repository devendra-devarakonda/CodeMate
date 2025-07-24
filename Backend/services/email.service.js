import nodemailer from 'nodemailer';
import { generateOTPEmailTemplate } from './EmailTemplates/otpTemplate.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codemate91@gmail.com',
    pass: 'ksek auob skzg mccf', // Use your actual SMTP password here
  },
});

export const sendOTP = async (email, otp, purpose = "verification") => {
  const mailOptions = {
    from: `"CodeMate 🔐" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Your CodeMate OTP for ${purpose}`,
    html: generateOTPEmailTemplate(otp, purpose),
  };

  await transporter.sendMail(mailOptions);
};
