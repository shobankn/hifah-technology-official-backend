require('dotenv').config();
const nodemailer = require('nodemailer');

const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

transporter.verify((error, success) => {
  if (error) {
    logger.error('Nodemailer configuration error', { error: error.message, stack: error.stack });
  } else {
    logger.info('Nodemailer configuration verified successfully');
  }
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info('Email sent to admin', { to, subject });
  } catch (error) {
    logger.error('Failed to send admin email', { to, subject, error: error.message, stack: error.stack });
    throw error;
  }
};

const sendAutoReply = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info('Auto-reply email sent', { to, subject });
  } catch (error) {
    logger.error('Failed to send auto-reply email', { to, subject, error: error.message, stack: error.stack });
    throw error;
  }
};

module.exports = { sendEmail, sendAutoReply };
