const { sendProcessMail } = require('../utils/mailer');
const { generateHTMLPDF } = require('../utils/htmlPdfGenerator');
const UserDocument = require('../model/UserDocument');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

exports.sendEmail = async (req, res) => {
  const {
    userId,
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
  } = req.body;

  try {
    const [document, created] = await UserDocument.findOrCreate({
      where: { user_id: userId, document_type: type },
      defaults: {
        user_id: userId,
        document_type: type,
        document_charge: feeAmount,
      },
    });
    if (!created) {
      await document.update({
        document_charge: feeAmount,
      });
    }

    const filename = `${type}_${Date.now()}.pdf`;
    const filenameOne = `${type}_One_${Date.now()}.pdf`;
    // const pdfPathOne = await generateHTMLPDF(
    //   {
    //     email,
    //     name,
    //     applicationNo,
    //     amount,
    //     interestRate,
    //     tenure,
    //     emi,
    //     type,
    //     feeAmount,
    //     employeePhone,
    //     isPaid,
    //   },
    //   filenameOne
    // );
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
    const templatePath = path.join(__dirname, '../templates/emailTemplate.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);
    // // Read and compile templates
    const htmlBody = template({
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
    });

    await sendProcessMail({
      to: email,
      subject: isPaid
        ? `Payment Confirmation for ${type} – Ujjwal Finserv`
        : `${type} Letter from Ujjwal Finserv`,
      body: htmlBody,
      attachmentPath: pdfPath,
      //attachmentPath: [pdfPathOne, pdfPathTwo], // Array of files
    });

    res.status(200).json({ message: `${type} email sent successfully.` });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};
exports.paidMail = async (req, res) => {
  const {
    userId,
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
    // isPaid,
    transactionNo,
    paymentType,
  } = req.body;

  try {
    const document = await UserDocument.findOne({
      where: {
        user_id: userId,
        document_type: type,
      },
    });
    if (document) {
      await document.update({
        transaction_id: transactionNo,
        transaction_type: paymentType,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Document not found for this user and type',
      });
    }

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

    const templatePath = path.join(__dirname, '../templates/emailTemplate.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);

    const htmlBody = template({
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
    });

    await sendProcessMail({
      to: email,
      subject: isPaid
        ? `Payment Confirmation for ${type} – Ujjwal Finserv`
        : `${type} Letter from Ujjwal Finserv`,
      body: htmlBody,
      attachmentPath: pdfPath,
    });

    res.status(200).json({ message: `${type} email sent successfully.` });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};
