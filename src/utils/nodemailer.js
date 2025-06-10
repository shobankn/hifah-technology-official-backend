require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP server
            port: 587, // Port for STARTTLS
            secure: false, // true for port 465, false for others
            auth: {
                user: process.env.EMAIL_USER, // Gmail username
                pass: process.env.EMAIL_PASS, // App password
            },
});

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
