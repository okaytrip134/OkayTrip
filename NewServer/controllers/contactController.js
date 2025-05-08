const nodemailer = require("nodemailer");

exports.sendUserQuery = async (req, res) => {
  const { query } = req.body;
  const userEmail = req.user.email; // Assuming user's email is available in req.user from authMiddleware

  if (!query || !userEmail) {
    return res.status(400).json({ message: "Query and user email are required." });
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Admin or server email
        pass: process.env.EMAIL_PASSWORD, // App password (generated in Gmail)
      },
    });

    // Mail options with enhanced design
    const mailOptions = {
      from: userEmail, // The user's email as the sender
      to: process.env.ADMIN_EMAIL, // Admin email address
      replyTo: userEmail, // Set reply-to as the user's email
      subject: "New User Query",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #007BFF; margin-bottom: 20px;">New User Query</h2>
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>User Email:</strong> ${userEmail}</p>
          <p style="font-size: 16px; margin-bottom: 20px;"><strong>Query:</strong></p>
          <p style="font-size: 16px; background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee;">
            ${query}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 14px; color: #666;">This email was sent automatically from your website's contact form.</p>
        </div>
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Query sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send query. Please try again later." });
  }
};
