

const nodemailer = require("nodemailer");

const {
  SMTP_USER,
  SMTP_PASS,
} = require("../config");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

module.exports = { transporter };