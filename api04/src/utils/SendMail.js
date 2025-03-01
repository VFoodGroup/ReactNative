const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testnixomg123@gmail.com",
    pass: "ltexccimxocdqeiv",
  },
});

function sendMail(mailOptions, callback) {
  transporter.sendMail(mailOptions, callback);
}

module.exports = sendMail;