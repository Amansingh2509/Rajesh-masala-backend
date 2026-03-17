const nodemailer = require("nodemailer");

const sendEmail = async ({ name, email, phone, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔥 TEST connection
    await transporter.verify();
    console.log("✅ Gmail server ready");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent:", info.response);
  } catch (error) {
    console.error("❌ Email Error FULL:", error);
    throw error;
  }
};

module.exports = sendEmail;
