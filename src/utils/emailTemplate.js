// utils/emailTemplates.js

const contactEmailTemplate = (fullName, email, message) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333333;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }
      .container {
        max-width: 650px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        padding: 30px 20px;
        text-align: center;
        position: relative;
      }
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        opacity: 0.3;
      }
      .header-content {
        position: relative;
        z-index: 1;
      }
      .logo {
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        border-radius: 12px;
        margin: 0 auto 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 24px;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        letter-spacing: -0.5px;
      }
      .header p {
        color: rgba(255, 255, 255, 0.9);
        margin: 8px 0 0;
        font-size: 16px;
        font-weight: 300;
      }
      .content {
        padding: 40px 30px;
        background: #ffffff;
      }
      .alert-badge {
        display: inline-block;
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      }
      .field-group {
        margin-bottom: 25px;
        padding: 20px;
        background: #f8f9ff;
        border-radius: 12px;
        border-left: 4px solid #4ecdc4;
      }
      .field-label {
        font-weight: 700;
        color: #2c3e50;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        display: block;
      }
      .field-value {
        font-size: 16px;
        color: #34495e;
        line-height: 1.6;
      }
      .field-value a {
        color: #3498db;
        text-decoration: none;
        font-weight: 600;
      }
      .field-value a:hover {
        text-decoration: underline;
      }
      .message-content {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 20px;
        border-radius: 12px;
        font-style: italic;
        line-height: 1.7;
        position: relative;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .message-content::before {
        content: '"';
        font-size: 60px;
        color: rgba(52, 73, 94, 0.2);
        position: absolute;
        top: -10px;
        left: 15px;
        font-family: Georgia, serif;
      }
      .footer {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
      }
      .footer-title {
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 16px;
      }
      .social-links {
        margin-top: 20px;
      }
      .social-links a {
        display: inline-block;
        margin: 0 10px;
        padding: 10px 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        text-decoration: none;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
      .social-links a:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
      .timestamp {
        font-size: 12px;
        color: #7f8c8d;
        margin-top: 15px;
        font-style: italic;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
          border-radius: 12px;
        }
        .content {
          padding: 25px 20px;
        }
        .header {
          padding: 25px 15px;
        }
        .social-links a {
          display: block;
          margin: 10px 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>New Contact Inquiry</h1>
          <p>Someone reached out through your website</p>
        </div>
      </div>
      <div class="content">
        <div class="alert-badge">🔔 New Message</div>
        
        <div class="field-group">
          <span class="field-label">Full Name</span>
          <div class="field-value">${fullName}</div>
        </div>
        
        <div class="field-group">
          <span class="field-label">Email Address</span>
          <div class="field-value">
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>
        
        <div class="field-group">
          <span class="field-label">Message</span>
          <div class="field-value">
            <div class="message-content">${message}</div>
          </div>
        </div>
        
        <div class="timestamp">
          Received: ${new Date().toLocaleString()}
        </div>
      </div>
      <div class="footer">
        <div class="footer-title">Hifah Technology</div>
        <p style="color: #6c757d; margin: 10px 0;">Innovative Solutions for Tomorrow</p>
       
      </div>
    </div>
  </body>
  </html>
`;

const autoReplyTemplate = (fullName) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Hifah Technology</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333333;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }
      .container {
        max-width: 650px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        padding: 40px 20px;
        text-align: center;
        position: relative;
      }
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
      }
      .header-content {
        position: relative;
        z-index: 1;
      }
      .success-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        border-radius: 50%;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        letter-spacing: -0.5px;
      }
      .header p {
        color: rgba(255, 255, 255, 0.9);
        margin: 10px 0 0;
        font-size: 18px;
        font-weight: 300;
      }
      .content {
        padding: 40px 30px;
        background: #ffffff;
        text-align: center;
      }
      .greeting {
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 20px;
      }
      .message {
        font-size: 16px;
        line-height: 1.8;
        color: #5a6c7d;
        margin-bottom: 30px;
        text-align: left;
      }
      .highlight-box {
        background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 100%);
        padding: 25px;
        border-radius: 12px;
        margin: 30px 0;
        border-left: 4px solid #3498db;
      }
      .highlight-box h3 {
        color: #2c3e50;
        margin: 0 0 15px;
        font-size: 18px;
        font-weight: 600;
      }
      .highlight-box p {
        color: #5a6c7d;
        margin: 0;
        line-height: 1.6;
      }
      .cta-section {
        margin: 40px 0;
        text-align: center;
      }
      .cta-button {
        display: inline-block;
        padding: 16px 32px;
        background: linear-gradient(45deg, #3498db, #2980b9);
        color: #ffffff;
        text-decoration: none;
        border-radius: 30px;
        font-weight: 700;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
        margin: 10px;
      }
      .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 25px rgba(52, 152, 219, 0.4);
      }
      .cta-button.secondary {
        background: linear-gradient(45deg, #95a5a6, #7f8c8d);
        box-shadow: 0 8px 20px rgba(149, 165, 166, 0.3);
      }
      .cta-button.secondary:hover {
        box-shadow: 0 12px 25px rgba(149, 165, 166, 0.4);
      }
      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 40px 0;
      }
      .feature {
        text-align: center;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
      }
      .feature-icon {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .feature h4 {
        color: #2c3e50;
        margin: 10px 0 5px;
        font-weight: 600;
      }
      .feature p {
        color: #6c757d;
        font-size: 14px;
        margin: 0;
      }
      .footer {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        padding: 20px 10px;
        text-align: center;
        color: white;
      }
      .footer-logo {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 15px;
        background: linear-gradient(45deg, #4ecdc4, #44a08d);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .footer p {
        color: rgba(255, 255, 255, 0.8);
        margin: 10px 0;
        font-size: 14px;
      }
      .social-links {
        margin-top: 25px;
      }
      .social-links a {
        display: inline-block;
        margin: 0 8px;
        padding: 10px 18px;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .social-links a:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
      .signature {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-style: italic;
        color: rgba(255, 255, 255, 0.7);
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
          border-radius: 12px;
        }
        .content {
          padding: 25px 20px;
        }
        .header {
          padding: 30px 15px;
        }
        .cta-button {
          display: block;
          margin: 10px 0;
        }
        .features {
          grid-template-columns: 1fr;
        }
        .social-links a {
          display: block;
          margin: 8px 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>Message Received!</h1>
          <p>We'll be in touch soon</p>
        </div>
      </div>
      <div class="content">
        <div class="greeting">Hello ${fullName}! 👋</div>
        
        <div class="message">
          <p>Thank you for reaching out to <strong>Hifah Technology</strong>. We're excited to connect with you and learn more about how we can help bring your vision to life.</p>
          
          <p>Our team has received your message and will review it carefully. You can expect a personalized response from one of our experts within <strong>24-48 hours</strong>.</p>
        </div>

        <div class="highlight-box">
          <h3>🚀 What happens next?</h3>
          <p>Our team will analyze your requirements and prepare a tailored response. We believe in providing solutions that truly make a difference for your business.</p>
        </div>

       

      </div>
      <div class="footer">
        <div class="footer-logo">Hifah Technology</div>
        <p>Transforming Ideas into Digital Reality</p>
        <p>📧 services@hifahtechnologies.com | 📞 +92 328 1232936</p>
        <div class="signature">
          <p>This is an automated response. Please do not reply directly to this email.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

module.exports = { 
  contactEmailTemplate, 
  autoReplyTemplate 
};