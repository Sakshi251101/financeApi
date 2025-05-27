const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

if (process.env.NODE_ENV === 'production') {
  // Production Gmail transporter
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
} else {
  // Development Mailtrap transporter
  transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
}

// Send email to user after submitting application
exports.sendUserEmail = async (to, allDetails) => {
  const subject = 'Loan Application Submitted';
  const body = `
    <p>Thank you, your application has been submitted successfully.</p>
    <p><strong>Here are your login details:</strong></p>
    <ul>
      <li>Mobile: ${allDetails.userPhone}</li>
      <li>Password: ${allDetails.userPassword}</li>
      <li>Email: ${allDetails.userEmail}</li>
    </ul>
    <p><strong>Our representative will reach out to you shortly:</strong></p>
    <ul>
      <li>Name: ${allDetails.employeeName}</li>
      <li>Email: ${allDetails.employeeEmail}</li>
      <li>Mobile: ${allDetails.employeePhone}</li>
      <li>WhatsApp: ${allDetails.whatsapp}</li>
    </ul>
  `;

  try {
    await transporter.sendMail({
      from: `"Unicom Finance" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: body,
    });
    console.log(`Email sent to user: ${to}`);
  } catch (error) {
    console.error('Error sending email to user:', error);
  }
};

// Send email with attachment
exports.sendProcessMail = async ({ to, subject, body, attachmentPath }) => {
  try {
    await transporter.sendMail({
      from: `"Ujjwal Finserv" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: body,
      attachments: [
        {
          filename: attachmentPath.split('/').pop(),
          path: attachmentPath,
        },
      ],
    });
    console.log(`Process mail sent to ${to}`);
  } catch (err) {
    console.error('Error sending process email:', err);
    throw err;
  }
};
