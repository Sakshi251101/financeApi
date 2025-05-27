const nodemailer = require('nodemailer');

// Common transporter using Mailtrap
// const transporter = nodemailer.createTransport({
//   host: 'sandbox.smtp.mailtrap.io',
//   port: 587,
//   auth: {
//     user: '78798a7a0a9e38',
//     pass: '0c3678ae66657a'
//   }
// });
// vivek

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'f2b1f4898f753d',
    pass: '0b72e249e13c0c',
  },
});

// exports.sendEmployeeEmail = async (to, userDetails) => {
//   const subject = 'New Lead Assigned';
//   const body = `
//     You have received a new user application:\n
//     Name: ${userDetails.userName}
//     Email: ${userDetails.userEmail}
//     Mobile: ${userDetails.userPhone}
//     WhatsApp: ${userDetails.whatsapp}
//     Loan Purpose: ${userDetails.loanPurpose}
//     Loan Amount: ₹${userDetails.loanAmount}
//   `;

//   try {
//     await transporter.sendMail({
//       from: '"Your Company" <no-reply@yourcompany.com>',
//       to,
//       subject,
//       text: body
//     });
//     console.log(`Email sent to employee: ${to}`);
//   } catch (error) {
//     console.error('Error sending email to employee:', error);
//   }
// };

exports.sendUserEmail = async (to, allDetails) => {
  const subject = 'Loan Application Submitted';
  const body = `
    Thank you, your application has been submitted successfully.\n
    Here are your login details.\n
    Mobile: ${allDetails.userPhone}
    Password: ${allDetails.userPassword}
    Email: ${allDetails.userEmail}
    Our representative will reach out to you shortly:\n
    Name: ${allDetails.employeeName}
    Email: ${allDetails.employeeEmail}
    Mobile: ${allDetails.employeePhone}
    WhatsApp: ${allDetails.whatsapp}
  `;

  try {
    await transporter.sendMail({
      from: '"Unicom Finance" <no-reply@unicomfinance.com>',
      to,
      subject,
      text: body,
    });
    console.log(`Email sent to user: ${to}`);
  } catch (error) {
    console.error('Error sending email to user:', error);
  }
};

exports.sendProcessMail = async ({ to, subject, body, attachmentPath }) => {
  try {
    await transporter.sendMail({
      from: '"Ujjwal Finserv" <no-reply@ujjwalfinserv.com>',
      to,
      subject,
      text: body,
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
