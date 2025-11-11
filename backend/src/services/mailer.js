const nodemailer = require('nodemailer');

let transport;
function createTransport() {
  if (process.env.NODE_ENV === 'development' || process.env.MAILHOG) {
    transport = nodemailer.createTransport({ host: process.env.MAIL_HOST || 'mailhog', port: 1025, secure: false });
  } else {
    // production: use SendGrid or SMTP
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
}

async function sendReminder(to, subject, html) {
  if (!transport) createTransport();
  return transport.sendMail({ from: process.env.FROM_EMAIL || 'no-reply@todoapp.local', to, subject, html });
}

module.exports = { sendReminder };
