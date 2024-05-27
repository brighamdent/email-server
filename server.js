const express = require("express");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyparser.json());

app.get("/warmup", (res) => {
  res.send("Server is warming up!");
  console.log("There was activity and I am warming up!");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT,
      subject: "New Message from Contact Form",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to send message. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
