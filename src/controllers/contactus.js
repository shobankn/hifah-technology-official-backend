// controllers/contactController.js
const { sendEmail, sendAutoReply } = require('../utils/nodemailer');
const { contactEmailTemplate, autoReplyTemplate } = require('../utils/emailTemplate');
const logger = require('../utils/logger');

const submitContactForm = async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  logger.info('Received contact form submission', {
    fullName,
    email,
    phone,
    messageLength: message?.length,
  });

  if (!fullName || !email || !phone || !message) {
    logger.warn('Missing required fields in contact form submission', {
      fullName,
      email,
      phone,
      message,
    });
    return res.status(400).json({ success: false, error: 'Name,Email,Phone,Message fields are required' });
  }

  try {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format', { email });
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Send email to admin
    await sendEmail({
      to: 'shobankhan5598@gmail.com',
      subject: 'New Contact Form Submission',
      html: contactEmailTemplate(fullName, email, phone, message),
    });

    // Send auto-reply to user
    await sendAutoReply({
      to: email,
      subject: 'Thank You for Your Message',
      html: autoReplyTemplate(fullName),
    });

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      to: 'shobankhan5598@gmail.com'
    });
  } catch (error) {
    logger.error('Error processing form submission', {
      error: error.message,
      stack: error.stack,
      code: error.code || 'UNKNOWN',
      details: error.response || error,
    });
    res.status(500).json({ error: 'Failed to process form submission', details: error.message });
  }
};

module.exports = { submitContactForm };
