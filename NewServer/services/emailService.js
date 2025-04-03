const nodemailer = require('nodemailer');
const User = require('../models/user');
const Package = require('../models/package'); // Make sure to import Package model

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendWinnerEmail(userId, offer, packageId) {
  try {
    const user = await User.findById(userId);
    const package = await Package.findById(packageId);
    
    if (!user || !package) {
      throw new Error('User or package not found');
    }

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Congratulations! You won a prize',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Congratulations!</h1>
          <p>You've won the <strong>${offer.title}</strong> offer!</p>
          <p>Your coupon can be used to book <strong>${package.name}</strong> for FREE!</p>
          <p>Visit your profile to view and use your winning coupon.</p>
          <a href="https://yourapp.com/profile" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          ">View My Coupons</a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Winner email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending winner email:', error);
    // Consider adding error logging here
  }
}

module.exports = {
  sendWinnerEmail
};