const express = require('express');
const router = express.Router();
const { sendProcessMail } = require('../utils/mailer');
const { generateHTMLPDF } = require('../utils/htmlPdfGenerator');

router.post('/send-email', async (req, res) => {
  const {
    email,
    name,
    applicationNo,
    amount,
    interestRate,
    tenure,
    emi,
    type,
    feeAmount,
    employeePhone,
    isPaid, // <-- new field from frontend
  } = req.body;

  try {
    const filename = `${type}_${Date.now()}.pdf`;
    const pdfPath = await generateHTMLPDF(
      {
        email,
        name,
        applicationNo,
        amount,
        interestRate,
        tenure,
        emi,
        type,
        feeAmount,
        employeePhone,
        isPaid,
      },
      filename
    );

    const body = isPaid
      ? `Dear ${name},\n
      Greetings from Ujjwal Finserv Private Limited.\n
      Your payment for ${type} has been received successfully.\n
      This is to confirm that we have received Rs ${feeAmount} towards your ${type} fees for loan application ${applicationNo}.\n
      Please find the attached paid ${type} invoice for your reference.\n
      Thank you for choosing Ujjwal Finserv.\n\n
Regards,

Ujjwal Finserv
Loan specialist
+91-${employeePhone}
Email : info@testmail.com
Website : https://papayawhip-woodcock-558791.hostingersite.com/
Office: test address`
      : `Dear ${name},\n
      Greetings from Ujjwal Finserv Private Limited.\n
      Your loan application ${applicationNo} for Personal Loan of Rs ${amount} has been approved by Ujjwal Finserv.\n
      Your interest rate is ${interestRate} per annum and EMI is ${emi} for a tenure of ${tenure} Months.\n
      You can download your ${type} letter which is attached to this email. We request you to kindly pay the ${type} fee of Rs ${feeAmount}.\n
      Thank you for choosing Ujjwal Finserv.\n\n
Regards,

Ujjwal Finserv
Loan specialist
+91-${employeePhone}
Email : info@testmail.com
Website : https://papayawhip-woodcock-558791.hostingersite.com/
Office: test address`;

    await sendProcessMail({
      to: email,
      subject: isPaid
        ? `Payment Confirmation for ${type} – Ujjwal Finserv`
        : `${type} Letter from Ujjwal Finserv`,
      body,
      attachmentPath: pdfPath,
    });

    res.status(200).json({ message: `${type} email sent successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send process mail.' });
  }
});

module.exports = router;
