require('dotenv').config();
const Subscriber = require('../models/subscriber');
const { sendEmail, sendAutoReply } = require('../utils/nodemailer');
const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: true, message: 'Email is required' });
    }

    // Check for duplicate
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: true, message: 'You are already subscribed' });
    }

    // Save to DB
    await Subscriber.create({ email });

    // Notify admin
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'New Newsletter Subscriber',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Newsletter Subscriber</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background: linear-gradient(90deg, #1e3a8a, #3b82f6); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: bold;">Hifah Technology</h1>
                      <p style="color: #ffffff; font-size: 16px; margin: 5px 0 0;">New Subscriber Notification</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; color: #333333;">
                      <h2 style="font-size: 20px; color: #1e3a8a; margin: 0 0 20px;">New Newsletter Subscriber</h2>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                        You have a new subscriber to the Hifah Technology newsletter:
                      </p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="10" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <tr>
                          <td style="font-size: 16px; color: #1e3a8a; font-weight: bold;">Email:</td>
                          <td style="font-size: 16px; color: #333333;">${email}</td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; color: #666666; margin: 20px 0 0;">
                        This email was sent from your newsletter subscription system. Please review the subscriber details in your admin panel.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="font-size: 14px; color: #666666; margin: 0;">
                        &copy; 2025 Hifah Technology. All rights reserved.
                      </p>
                      <p style="font-size: 12px; color: #999999; margin: 5px 0 0;">
                        <a href="#" style="color: #3b82f6; text-decoration: none;">Manage Subscriptions</a> | 
                        <a href="#" style="color: #3b82f6; text-decoration: none;">Contact Support</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // Auto-reply to user
    await sendAutoReply({
      to: email,
      subject: 'Thanks for Subscribing!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Hifah Technology Newsletter</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background: linear-gradient(90deg, #1e3a8a, #3b82f6); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold;">Welcome to Hifah Technology!</h1>
                      <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0;">Thank You for Subscribing to Our Newsletter</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; color: #333333;">
                      <h2 style="font-size: 20px; color: #1e3a8a; margin: 0 0 20px;">You're Now Part of Our Community!</h2>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                        Thank you for joining the Hifah Technology newsletter. We're excited to keep you updated with the latest news, blog posts, and insights from our team.
                      </p>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                        Expect to receive:
                      </p>
                      <ul style="font-size: 16px; line-height: 1.5; margin: 0 0 20px; padding-left: 20px;">
                        <li>Exclusive updates on our cutting-edge technology solutions</li>
                        <li>Expert insights and industry trends</li>
                        <li>Special offers and event invitations</li>
                      </ul>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center">
                            <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px; margin: 20px 0;">
                              Explore Our Blog
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="font-size: 14px; color: #666666; margin: 0;">
                        &copy; 2025 Hifah Technology. All rights reserved.
                      </p>
                      <p style="font-size: 12px; color: #999999; margin: 5px 0 0;">
                        <a href="#" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a> | 
                        <a href="#" style="color: #3b82f6; text-decoration: none;">Contact Us</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    res.status(200).json({ success: true, message: 'Subscription successful!' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message || 'Internal server error' });
  }
};

module.exports = {subscribeUser}